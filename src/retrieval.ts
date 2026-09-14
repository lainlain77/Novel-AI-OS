import type { ContextPacket, StoredRecord, TaskContract } from "./types.ts";
import { hash, NovelStore } from "./store.ts";

export interface RetrievalChannel {
  retrieverId: string;
  rank: number;
  score: number;
  modelId?: string;
  contentHash: string;
}

export interface RetrievalCandidate {
  recordId: string;
  score: number;
  channels: RetrievalChannel[];
}

export interface RetrievalInput {
  task: TaskContract;
  records: StoredRecord[];
}

export interface RetrieverAdapter {
  readonly id: string;
  retrieve(input: RetrievalInput): Promise<RetrievalCandidate[]>;
}

export interface EmbeddingProvider {
  readonly id: string;
  readonly dimensions: number;
  embed(texts: string[]): Promise<number[][]>;
}

export class SqliteFtsRetriever implements RetrieverAdapter {
  readonly id = "sqlite-fts5-v1";
  private readonly store: NovelStore;

  constructor(store: NovelStore) {
    this.store = store;
  }

  async retrieve(input: RetrievalInput): Promise<RetrievalCandidate[]> {
    const allowed = new Set(input.records.map((record) => record.id));
    return this.store.searchLexicalIds(input.task, allowed).map((recordId, index) => {
      const record = input.records.find((item) => item.id === recordId)!;
      return {
        recordId,
        score: 1 / (index + 1),
        channels: [{
          retrieverId: this.id,
          rank: index + 1,
          score: 1 / (index + 1),
          contentHash: hash(record.content),
        }],
      };
    });
  }
}

export class EmbeddingRetriever implements RetrieverAdapter {
  readonly id: string;
  readonly provider: EmbeddingProvider;
  private readonly memory = new Map<string, number[]>();
  private readonly contentHashes = new Map<string, { content: string; hash: string }>();
  private readonly store: NovelStore;
  private readonly limit: number;

  constructor(
    store: NovelStore,
    provider: EmbeddingProvider,
    limit = 64,
  ) {
    this.store = store;
    this.provider = provider;
    this.limit = limit;
    this.id = `embedding:${provider.id}`;
  }

  async ensureIndexed(records: StoredRecord[]): Promise<void> {
    const missing: StoredRecord[] = [];
    for (const record of records) {
      const contentHash = this.contentHash(record);
      const key = `${this.provider.id}\u0000${record.id}\u0000${contentHash}`;
      if (this.memory.has(key)) continue;
      const cached = this.store.getCachedEmbedding(record.id, this.provider.id, contentHash);
      if (cached) this.memory.set(key, cached);
      else missing.push(record);
    }
    if (missing.length === 0) return;
    const vectors = await this.provider.embed(missing.map((record) => record.content));
    if (vectors.length !== missing.length || vectors.some((vector) => vector.length !== this.provider.dimensions)) {
      throw new Error(`Embedding provider ${this.provider.id} returned invalid dimensions`);
    }
    const entries = missing.map((record, index) => {
      const contentHash = this.contentHash(record);
      const vector = vectors[index];
      this.memory.set(`${this.provider.id}\u0000${record.id}\u0000${contentHash}`, vector);
      return {
        recordId: record.id,
        modelId: this.provider.id,
        contentHash,
        dimensions: this.provider.dimensions,
        vector,
        sourceRevision: record.createdRevision,
      };
    });
    this.store.putCachedEmbeddings(entries);
  }

  async retrieve(input: RetrievalInput): Promise<RetrievalCandidate[]> {
    await this.ensureIndexed(input.records);
    const [queryVector] = await this.provider.embed([input.task.query]);
    return input.records.map((record) => {
      const contentHash = this.contentHash(record);
      const vector = this.memory.get(`${this.provider.id}\u0000${record.id}\u0000${contentHash}`)!;
      return { record, contentHash, score: cosine(queryVector, vector) };
    }).filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.record.id.localeCompare(b.record.id))
      .slice(0, this.limit)
      .map((item, index) => ({
        recordId: item.record.id,
        score: item.score,
        channels: [{
          retrieverId: this.id,
          modelId: this.provider.id,
          rank: index + 1,
          score: item.score,
          contentHash: item.contentHash,
        }],
      }));
  }

  private contentHash(record: StoredRecord): string {
    const cached = this.contentHashes.get(record.id);
    if (cached?.content === record.content) return cached.hash;
    const value = hash(record.content);
    this.contentHashes.set(record.id, { content: record.content, hash: value });
    return value;
  }
}

export class HybridRetriever implements RetrieverAdapter {
  readonly id: string;
  private readonly retrievers: RetrieverAdapter[];
  private readonly rrfK: number;

  constructor(
    retrievers: RetrieverAdapter[],
    rrfK = 60,
  ) {
    this.retrievers = retrievers;
    this.rrfK = rrfK;
    this.id = `hybrid:${retrievers.map((retriever) => retriever.id).join("+")}`;
  }

  async retrieve(input: RetrievalInput): Promise<RetrievalCandidate[]> {
    const results = await Promise.allSettled(this.retrievers.map((retriever) => retriever.retrieve(input)));
    const successful = results.filter((result): result is PromiseFulfilledResult<RetrievalCandidate[]> => result.status === "fulfilled");
    if (successful.length === 0) throw new Error("Every retrieval channel failed");
    const fused = new Map<string, RetrievalCandidate>();
    for (const result of successful) {
      for (let index = 0; index < result.value.length; index++) {
        const candidate = result.value[index];
        const contribution = 1 / (this.rrfK + index + 1);
        const current = fused.get(candidate.recordId) ?? { recordId: candidate.recordId, score: 0, channels: [] };
        current.score += contribution;
        current.channels.push(...candidate.channels);
        fused.set(candidate.recordId, current);
      }
    }
    return [...fused.values()].sort((a, b) => b.score - a.score || a.recordId.localeCompare(b.recordId));
  }
}

export class HybridContextEngine {
  readonly retriever: RetrieverAdapter;
  private readonly store: NovelStore;

  constructor(
    store: NovelStore,
    retriever: RetrieverAdapter,
  ) {
    this.store = store;
    this.retriever = retriever;
  }

  async compile(task: TaskContract): Promise<ContextPacket> {
    if (task.audience === "character" && !task.povEntityId) throw new Error("Character context requires povEntityId");
    const allowed = this.store.listEligibleRecords(task);
    const byId = new Map(allowed.map((record) => [record.id, record]));
    const candidates = await this.retriever.retrieve({ task, records: allowed });
    const ordered: Array<{ record: StoredRecord; candidate?: RetrievalCandidate }> = [];
    for (const record of allowed.filter((item) => item.role === "constraint")) ordered.push({ record });
    for (const candidate of candidates) {
      const record = byId.get(candidate.recordId);
      if (record && record.role !== "constraint") ordered.push({ record, candidate });
    }
    const seen = new Set<string>();
    const sections: ContextPacket["sections"] = [];
    const omissions: ContextPacket["omissions"] = [];
    let actualTokens = 0;
    for (const item of ordered) {
      if (seen.has(item.record.id)) continue;
      seen.add(item.record.id);
      const tokens = Math.max(1, Math.ceil([...item.record.content].length / 2.5));
      if (actualTokens + tokens > task.tokenBudget) {
        omissions.push({ recordId: item.record.id, reason: "token_budget" });
        continue;
      }
      sections.push({
        recordId: item.record.id,
        role: item.record.role,
        content: item.record.content,
        sourceRevision: item.record.createdRevision,
        sensitivity: item.record.sensitivity,
        provenance: item.record.provenance,
        selectedBecause: item.candidate ? "hybrid_retrieval" : "required_constraint",
        retrieval: item.candidate ? {
          fusedScore: item.candidate.score,
          channels: item.candidate.channels,
        } : undefined,
      });
      actualTokens += tokens;
    }
    const policyFingerprint = hash({
      audience: task.audience,
      povEntityId: task.povEntityId ?? null,
      narrativeCursor: task.narrativeCursor,
      includeAuthorSecrets: task.includeAuthorSecrets === true,
    });
    const manifestId = hash({
      storyId: task.storyId,
      branchId: task.branchId,
      baseRevision: task.baseRevision,
      retrieverId: this.retriever.id,
      policyFingerprint,
      recordIds: sections.map((section) => section.recordId),
    });
    return { task, manifestId, policyFingerprint, baseRevision: task.baseRevision, sections, omissions, conflicts: [], tokenBudget: task.tokenBudget, actualTokens };
  }
}

export class FixtureConceptEmbeddingProvider implements EmbeddingProvider {
  readonly id: string;
  readonly dimensions: number;
  readonly groups: string[][];

  constructor(
    groups: string[][],
    version = "v1",
  ) {
    this.groups = groups;
    this.dimensions = groups.length;
    this.id = `fixture-concepts-${version}-${hash(groups).slice(0, 10)}`;
  }

  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => {
      const normalized = text.toLocaleLowerCase();
      return this.groups.map((group) => group.some((term) => normalized.includes(term.toLocaleLowerCase())) ? 1 : 0);
    });
  }
}

function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error("Cannot compare embeddings with different dimensions");
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < a.length; index++) {
    dot += a[index] * b[index];
    normA += a[index] ** 2;
    normB += b[index] ** 2;
  }
  return normA && normB ? dot / Math.sqrt(normA * normB) : 0;
}
