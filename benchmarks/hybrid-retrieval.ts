import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { cpus, tmpdir, totalmem } from "node:os";
import { dirname, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { NovelStore } from "../src/store.ts";
import {
  EmbeddingRetriever,
  FixtureConceptEmbeddingProvider,
  HybridContextEngine,
  HybridRetriever,
  SqliteFtsRetriever,
} from "../src/retrieval.ts";
import type { ContextPacket, StoryRecordInput, TaskContract } from "../src/types.ts";

const SEED = "novel-ai-os-t006-v1";
const CASES = 30;
const CHUNKS = 2_100;
const tempRoot = mkdtempSync(join(tmpdir(), "novel-ai-os-t006-"));
const dbPath = join(tempRoot, "hybrid.sqlite");
const outputIndex = process.argv.indexOf("--output");
const outputPath = outputIndex >= 0 ? resolve(process.argv[outputIndex + 1]) : undefined;
const source = [{ sourceType: "system" as const, sourceRef: `benchmark:${SEED}` }];
const groups = Array.from({ length: CASES }, (_, index) => [`DOC_ALIAS_${index}`, `QUERY_ALIAS_${index}`]);

function filler(index: number): string {
  const text = `第${index}场，顾沉沿旅店回廊核对钟声与门牌。林晚记下窗外雨势，两人只按本轮已知线索行动。`;
  return (text + "墙纸的裂纹像河流，灯光在午夜前后改变颜色，旧钥匙发出轻响。").repeat(9).slice(0, 510);
}

function record(id: string, content: string, extra: Partial<StoryRecordInput> = {}): StoryRecordInput {
  return {
    id,
    projectId: "hybrid-project",
    storyId: "hybrid-story",
    branchId: "main",
    kind: "Event",
    role: "manuscript",
    visibility: "public",
    content,
    provenance: source,
    ...extra,
  };
}

function task(query: string, extra: Partial<TaskContract> = {}): TaskContract {
  return {
    taskId: `hybrid-${query}`,
    storyId: "hybrid-story",
    branchId: "main",
    baseRevision: 0,
    audience: "author",
    narrativeCursor: CHUNKS + 100,
    query,
    tokenBudget: 1_200,
    ...extra,
  };
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ?? 0;
}

function rank(packet: ContextPacket, recordId: string): number | undefined {
  const index = packet.sections.findIndex((section) => section.recordId === recordId);
  return index < 0 ? undefined : index + 1;
}

function summary(values: number[]) {
  return {
    p50Ms: Number(percentile(values, 0.5).toFixed(3)),
    p95Ms: Number(percentile(values, 0.95).toFixed(3)),
    maxMs: Number(Math.max(...values).toFixed(3)),
  };
}

const store = new NovelStore(dbPath);
store.createStory({ projectId: "hybrid-project", storyId: "hybrid-story", storyName: "混合检索百万字", branchId: "main" });
store.createBranch("hybrid-story", "alternate", "污染分支");
store.createStory({ projectId: "hybrid-project", storyId: "poison-story", storyName: "污染作品", branchId: "main" });

const records: StoryRecordInput[] = [];
for (let index = 0; index < CHUNKS; index++) {
  const marker = index < CASES ? ` EXACT_${index} DOC_ALIAS_${index}：第${index}件语义目标位于北侧房间。` : "";
  records.push(record(`chunk-${index}`, filler(index) + marker, { narrativeFrom: index }));
}
for (let index = 0; index < CASES; index++) {
  records.push({ ...record(`poison-${index}`, `QUERY_ALIAS_${index} POISON_${index}`), storyId: "poison-story" });
  records.push({ ...record(`alternate-${index}`, `QUERY_ALIAS_${index} ALTERNATE_${index}`), branchId: "alternate" });
}
records.push(record("secret-all", groups.flat().join(" ") + " SECRET_ALL", {
  kind: "AuthorIntent", role: "canon", visibility: "author", sensitivity: "author_secret",
}));
records.push(record("future-all", groups.flat().join(" ") + " FUTURE_ALL", {
  kind: "Knowledge", role: "manuscript", visibility: "reader", narrativeFrom: CHUNKS + 500,
}));

const buildStart = performance.now();
store.seedAcceptedRecords(records);
const lexicalBuildMs = performance.now() - buildStart;
const bytesBeforeEmbedding = statSync(dbPath).size;

const provider = new FixtureConceptEmbeddingProvider(groups, "t006-v1");
const embedding = new EmbeddingRetriever(store, provider, 16);
const allowed = store.listEligibleRecords(task("warmup"));
const embeddingBuildStart = performance.now();
await embedding.ensureIndexed(allowed);
const embeddingBuildMs = performance.now() - embeddingBuildStart;
const fts = new SqliteFtsRetriever(store);
const embeddingEngine = new HybridContextEngine(store, embedding);
const hybridEngine = new HybridContextEngine(store, new HybridRetriever([fts, embedding]));

const timings = { ftsSemantic: [] as number[], embeddingSemantic: [] as number[], hybridSemantic: [] as number[], ftsExact: [] as number[], hybridExact: [] as number[] };
const ranks = { ftsSemantic: [] as number[], embeddingSemantic: [] as number[], hybridSemantic: [] as number[], ftsExact: [] as number[], hybridExact: [] as number[] };
let leaks = 0;
let provenanceErrors = 0;
let explanationErrors = 0;

async function measure(
  bucket: keyof typeof timings,
  compile: () => ContextPacket | Promise<ContextPacket>,
  recordId: string,
) {
  const started = performance.now();
  const packet = await compile();
  timings[bucket].push(performance.now() - started);
  const position = rank(packet, recordId);
  if (position) ranks[bucket].push(position);
  const content = packet.sections.map((section) => section.content).join("\n");
  if (/POISON_|ALTERNATE_|SECRET_ALL|FUTURE_ALL/.test(content)) leaks++;
  for (const section of packet.sections) {
    if (!section.provenance.some((item) => item.sourceRef === `benchmark:${SEED}`)) provenanceErrors++;
    if (section.selectedBecause === "hybrid_retrieval" && !section.retrieval?.channels.length) explanationErrors++;
  }
}

for (let index = 0; index < CASES; index++) {
  const target = `chunk-${index}`;
  const semanticTask = task(`QUERY_ALIAS_${index}`);
  const exactTask = task(`EXACT_${index}`);
  await measure("ftsSemantic", () => store.compileContext(semanticTask), target);
  await measure("embeddingSemantic", () => embeddingEngine.compile(semanticTask), target);
  await measure("hybridSemantic", () => hybridEngine.compile(semanticTask), target);
  await measure("ftsExact", () => store.compileContext(exactTask), target);
  await measure("hybridExact", () => hybridEngine.compile(exactTask), target);
}

function metrics(key: keyof typeof timings) {
  const positions = ranks[key];
  return {
    recallAt16: positions.length / CASES,
    mrr: Number((positions.reduce((sum, value) => sum + 1 / value, 0) / CASES).toFixed(4)),
    ...summary(timings[key]),
  };
}

const cacheEntries = store.embeddingCacheCount(provider.id);
store.close();
const result = {
  schema: "novel-ai-os-hybrid-retrieval-benchmark-v1",
  seed: SEED,
  measuredAt: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    cpu: cpus()[0]?.model.trim() ?? "unknown",
    logicalCpus: cpus().length,
    memoryGiB: Number((totalmem() / 2 ** 30).toFixed(1)),
  },
  fixture: {
    records: records.length,
    mainStoryCharacters: records.filter((item) => item.storyId === "hybrid-story" && item.branchId === "main").reduce((sum, item) => sum + [...item.content].length, 0),
    semanticCases: CASES,
    provider: { id: provider.id, dimensions: provider.dimensions, fixtureOnly: true },
  },
  build: {
    lexicalMs: Number(lexicalBuildMs.toFixed(3)),
    embeddingMs: Number(embeddingBuildMs.toFixed(3)),
    cacheEntries,
    databaseBytesBeforeEmbedding: bytesBeforeEmbedding,
    databaseBytesAfterEmbedding: statSync(dbPath).size,
  },
  results: {
    ftsSemantic: metrics("ftsSemantic"),
    embeddingSemantic: metrics("embeddingSemantic"),
    hybridSemantic: metrics("hybridSemantic"),
    ftsExact: metrics("ftsExact"),
    hybridExact: metrics("hybridExact"),
  },
  safety: { leaks, provenanceErrors, explanationErrors },
  limitations: [
    "The embedding provider is a deterministic fixture concept mapper, not a production semantic model.",
    "The benchmark validates interfaces, policy order, cache versioning, fusion, and regression math only.",
  ],
};

const serialized = JSON.stringify(result, null, 2) + "\n";
if (outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialized, "utf8");
}
console.log(serialized);
const resolvedTemp = resolve(tempRoot);
if (!resolvedTemp.startsWith(resolve(tmpdir()))) throw new Error("Refusing to clean a path outside the temp directory");
rmSync(resolvedTemp, { recursive: true, force: true });

const passed = result.fixture.mainStoryCharacters >= 1_000_000 &&
  result.results.ftsSemantic.recallAt16 === 0 &&
  result.results.embeddingSemantic.recallAt16 === 1 &&
  result.results.hybridSemantic.recallAt16 === 1 &&
  result.results.ftsExact.recallAt16 === 1 &&
  result.results.hybridExact.recallAt16 === 1 &&
  leaks === 0 && provenanceErrors === 0 && explanationErrors === 0;
if (!passed) process.exitCode = 1;
