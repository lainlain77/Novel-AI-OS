import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type {
  AtomicChange,
  ChangeProposal,
  ContextPacket,
  StoryRecordInput,
  StoredRecord,
  TaskContract,
} from "./types.ts";

type Row = Record<string, string | number | null>;

export class StaleProposalError extends Error {}
export class InvalidProposalError extends Error {}

export class NovelStore {
  readonly db: DatabaseSync;

  constructor(path = ":memory:") {
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
    this.migrate();
  }

  close(): void {
    this.db.close();
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        name TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS branches (
        id TEXT NOT NULL,
        story_id TEXT NOT NULL REFERENCES stories(id),
        name TEXT NOT NULL,
        current_revision INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (story_id, id)
      );
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        story_id TEXT NOT NULL,
        branch_id TEXT NOT NULL,
        kind TEXT NOT NULL,
        role TEXT NOT NULL,
        visibility TEXT NOT NULL,
        sensitivity TEXT NOT NULL DEFAULT 'normal',
        knower_id TEXT,
        narrative_from INTEGER,
        narrative_to INTEGER,
        content TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        provenance_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'accepted',
        created_revision INTEGER NOT NULL,
        superseded_revision INTEGER,
        derived INTEGER NOT NULL DEFAULT 0,
        stale INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (story_id, branch_id) REFERENCES branches(story_id, id)
      );
      CREATE INDEX IF NOT EXISTS records_scope_revision
        ON records(story_id, branch_id, created_revision, superseded_revision);
      CREATE INDEX IF NOT EXISTS records_policy
        ON records(story_id, branch_id, visibility, sensitivity, knower_id);
      CREATE VIRTUAL TABLE IF NOT EXISTS record_search USING fts5(
        record_id UNINDEXED,
        story_id UNINDEXED,
        branch_id UNINDEXED,
        content,
        tokenize='unicode61'
      );
      CREATE TABLE IF NOT EXISTS proposals (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        story_id TEXT NOT NULL,
        branch_id TEXT NOT NULL,
        base_revision INTEGER NOT NULL,
        context_manifest_hash TEXT NOT NULL,
        changes_json TEXT NOT NULL,
        evidence_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ready',
        applied_revision INTEGER,
        FOREIGN KEY (story_id, branch_id) REFERENCES branches(story_id, id)
      );
      CREATE TABLE IF NOT EXISTS dependency_edges (
        derived_record_id TEXT NOT NULL REFERENCES records(id),
        source_record_id TEXT NOT NULL REFERENCES records(id),
        source_revision INTEGER NOT NULL,
        PRIMARY KEY (derived_record_id, source_record_id)
      );
    `);
  }

  createStory(input: {
    projectId: string;
    storyId: string;
    storyName: string;
    branchId: string;
    branchName?: string;
  }): void {
    this.db.prepare("INSERT INTO stories(id, project_id, name) VALUES (?, ?, ?)")
      .run(input.storyId, input.projectId, input.storyName);
    this.db.prepare("INSERT INTO branches(id, story_id, name) VALUES (?, ?, ?)")
      .run(input.branchId, input.storyId, input.branchName ?? "main");
  }

  createBranch(storyId: string, branchId: string, branchName: string): void {
    this.db.prepare("INSERT INTO branches(id, story_id, name) VALUES (?, ?, ?)")
      .run(branchId, storyId, branchName);
  }

  getRevision(storyId: string, branchId: string): number {
    const row = this.db.prepare(
      "SELECT current_revision FROM branches WHERE story_id = ? AND id = ?",
    ).get(storyId, branchId) as Row | undefined;
    if (!row) throw new Error(`Unknown story/branch: ${storyId}/${branchId}`);
    return Number(row.current_revision);
  }

  seedAcceptedRecord(input: StoryRecordInput): void {
    const revision = this.getRevision(input.storyId, input.branchId);
    this.insertRecord(input, revision);
  }

  addDependency(derivedRecordId: string, sourceRecordId: string): void {
    const source = this.getRecord(sourceRecordId);
    const derived = this.getRecord(derivedRecordId);
    if (!source || !derived || !derived.derived) {
      throw new Error("Dependency requires an existing source and derived record");
    }
    if (source.storyId !== derived.storyId || source.branchId !== derived.branchId) {
      throw new Error("Cross-story or cross-branch dependency is forbidden");
    }
    this.db.prepare(
      "INSERT INTO dependency_edges(derived_record_id, source_record_id, source_revision) VALUES (?, ?, ?)",
    ).run(derivedRecordId, sourceRecordId, source.createdRevision);
  }

  private insertRecord(input: StoryRecordInput, revision: number): void {
    this.db.prepare(`
      INSERT INTO records(
        id, project_id, story_id, branch_id, kind, role, visibility, sensitivity,
        knower_id, narrative_from, narrative_to, content, payload_json,
        provenance_json, created_revision, derived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      input.id,
      input.projectId,
      input.storyId,
      input.branchId,
      input.kind,
      input.role,
      input.visibility,
      input.sensitivity ?? "normal",
      input.knowerId ?? null,
      input.narrativeFrom ?? null,
      input.narrativeTo ?? null,
      input.content,
      JSON.stringify(input.payload ?? {}),
      JSON.stringify(input.provenance),
      revision,
      input.derived ? 1 : 0,
    );
    this.db.prepare(
      "INSERT INTO record_search(record_id, story_id, branch_id, content) VALUES (?, ?, ?, ?)",
    ).run(input.id, input.storyId, input.branchId, input.content);
  }

  getRecord(id: string): StoredRecord | undefined {
    const row = this.db.prepare("SELECT * FROM records WHERE id = ?").get(id) as Row | undefined;
    return row ? this.toRecord(row) : undefined;
  }

  private toRecord(row: Row): StoredRecord {
    return {
      id: String(row.id),
      projectId: String(row.project_id),
      storyId: String(row.story_id),
      branchId: String(row.branch_id),
      kind: String(row.kind) as StoredRecord["kind"],
      role: String(row.role) as StoredRecord["role"],
      visibility: String(row.visibility) as StoredRecord["visibility"],
      sensitivity: String(row.sensitivity) as StoredRecord["sensitivity"],
      knowerId: row.knower_id == null ? undefined : String(row.knower_id),
      narrativeFrom: row.narrative_from == null ? undefined : Number(row.narrative_from),
      narrativeTo: row.narrative_to == null ? undefined : Number(row.narrative_to),
      content: String(row.content),
      payload: JSON.parse(String(row.payload_json)),
      provenance: JSON.parse(String(row.provenance_json)),
      status: "accepted",
      createdRevision: Number(row.created_revision),
      supersededRevision: row.superseded_revision == null ? undefined : Number(row.superseded_revision),
      derived: Boolean(row.derived),
      stale: Boolean(row.stale),
    };
  }

  private eligibleRecords(task: TaskContract): StoredRecord[] {
    if (task.baseRevision > this.getRevision(task.storyId, task.branchId)) {
      throw new Error("Task baseRevision is ahead of Canon");
    }
    const rows = this.db.prepare(`
      SELECT * FROM records
      WHERE story_id = ? AND branch_id = ? AND status = 'accepted'
        AND created_revision <= ?
        AND (superseded_revision IS NULL OR superseded_revision > ?)
        AND (derived = 0 OR stale = 0)
        AND (narrative_from IS NULL OR narrative_from <= ?)
        AND (narrative_to IS NULL OR narrative_to >= ?)
      ORDER BY created_revision DESC, id ASC
    `).all(
      task.storyId,
      task.branchId,
      task.baseRevision,
      task.baseRevision,
      task.narrativeCursor,
      task.narrativeCursor,
    ) as Row[];

    return rows.map((row) => this.toRecord(row)).filter((record) => {
      if (record.sensitivity === "author_secret") {
        return task.audience === "author" && task.includeAuthorSecrets === true;
      }
      if (task.audience === "author") {
        if (record.visibility === "character" && task.povEntityId) {
          return record.knowerId === task.povEntityId;
        }
        return true;
      }
      if (task.audience === "character") {
        return record.visibility === "public" ||
          (record.visibility === "character" && record.knowerId === task.povEntityId);
      }
      return record.visibility === "public" || record.visibility === "reader";
    });
  }

  compileContext(task: TaskContract): ContextPacket {
    if (task.audience === "character" && !task.povEntityId) {
      throw new Error("Character context requires povEntityId");
    }
    const eligible = this.eligibleRecords(task);
    const eligibleIds = new Set(eligible.map((record) => record.id));
    const rankedIds = this.searchIds(task, eligibleIds);
    const rank = new Map(rankedIds.map((id, index) => [id, index]));
    const ordered = eligible
      .filter((record) => record.role === "constraint" || rank.has(record.id))
      .sort((a, b) => {
        if (a.role === "constraint" && b.role !== "constraint") return -1;
        if (b.role === "constraint" && a.role !== "constraint") return 1;
        return (rank.get(a.id) ?? 9999) - (rank.get(b.id) ?? 9999);
      });

    const sections: ContextPacket["sections"] = [];
    const omissions: ContextPacket["omissions"] = [];
    let actualTokens = 0;
    for (const record of ordered) {
      const tokens = estimateTokens(record.content);
      if (actualTokens + tokens > task.tokenBudget) {
        omissions.push({ recordId: record.id, reason: "token_budget" });
        continue;
      }
      sections.push({
        recordId: record.id,
        role: record.role,
        content: record.content,
        sourceRevision: record.createdRevision,
        sensitivity: record.sensitivity,
        provenance: record.provenance,
        selectedBecause: record.role === "constraint" ? "required_constraint" : "fts5_relevance",
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
      policyFingerprint,
      recordIds: sections.map((section) => section.recordId),
    });
    return {
      task,
      manifestId,
      policyFingerprint,
      baseRevision: task.baseRevision,
      sections,
      omissions,
      conflicts: [],
      tokenBudget: task.tokenBudget,
      actualTokens,
    };
  }

  private searchIds(task: TaskContract, eligibleIds: Set<string>): string[] {
    if (!task.query.trim()) return [...eligibleIds];
    const tokens = task.query.match(/[\p{L}\p{N}_]+/gu) ?? [];
    if (tokens.length === 0) return [];
    const ftsQuery = tokens.map((token) => `"${token.replaceAll('"', '""')}"`).join(" OR ");
    const rows = this.db.prepare(`
      SELECT record_id, bm25(record_search) AS score
      FROM record_search
      WHERE record_search MATCH ? AND story_id = ? AND branch_id = ?
      ORDER BY score ASC
      LIMIT 64
    `).all(ftsQuery, task.storyId, task.branchId) as Row[];
    return rows.map((row) => String(row.record_id)).filter((id) => eligibleIds.has(id));
  }

  saveProposal(proposal: ChangeProposal): void {
    if (proposal.baseRevision !== this.getRevision(proposal.storyId, proposal.branchId)) {
      throw new StaleProposalError("Proposal was created against a stale Canon revision");
    }
    for (const change of proposal.changes) this.assertChangeScope(proposal, change);
    this.db.prepare(`
      INSERT INTO proposals(
        id, task_id, story_id, branch_id, base_revision, context_manifest_hash,
        changes_json, evidence_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      proposal.proposalId,
      proposal.taskId,
      proposal.storyId,
      proposal.branchId,
      proposal.baseRevision,
      proposal.contextManifestHash,
      JSON.stringify(proposal.changes),
      JSON.stringify(proposal.evidence),
    );
  }

  private assertChangeScope(proposal: ChangeProposal, change: AtomicChange): void {
    if (change.operation === "create" || change.operation === "replace") {
      if (change.after.storyId !== proposal.storyId || change.after.branchId !== proposal.branchId) {
        throw new InvalidProposalError("Proposal change crosses story or branch scope");
      }
    }
  }

  applyProposal(proposalId: string): { status: "applied"; revision: number } {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const proposalRow = this.db.prepare("SELECT * FROM proposals WHERE id = ?").get(proposalId) as Row | undefined;
      if (!proposalRow || proposalRow.status !== "ready") {
        throw new InvalidProposalError("Proposal does not exist or is not ready");
      }
      const storyId = String(proposalRow.story_id);
      const branchId = String(proposalRow.branch_id);
      const baseRevision = Number(proposalRow.base_revision);
      const currentRevision = this.getRevision(storyId, branchId);
      if (currentRevision !== baseRevision) {
        this.db.prepare("UPDATE proposals SET status = 'stale' WHERE id = ?").run(proposalId);
        this.db.exec("COMMIT");
        throw new StaleProposalError(`Expected revision ${baseRevision}, found ${currentRevision}`);
      }
      const changes = JSON.parse(String(proposalRow.changes_json)) as AtomicChange[];
      this.prevalidateChanges(storyId, branchId, changes);
      const revision = currentRevision + 1;
      const changedIds: string[] = [];
      for (const change of changes) {
        if (change.operation === "create") {
          this.insertRecord(change.after, revision);
          changedIds.push(change.after.id);
        } else if (change.operation === "replace") {
          this.db.prepare("UPDATE records SET superseded_revision = ? WHERE id = ?")
            .run(revision, change.targetId);
          this.insertRecord(change.after, revision);
          changedIds.push(change.targetId, change.after.id);
        } else {
          this.db.prepare("UPDATE records SET superseded_revision = ? WHERE id = ?")
            .run(revision, change.targetId);
          changedIds.push(change.targetId);
        }
      }
      this.invalidateDerived(changedIds);
      this.db.prepare(
        "UPDATE branches SET current_revision = ? WHERE story_id = ? AND id = ?",
      ).run(revision, storyId, branchId);
      this.db.prepare(
        "UPDATE proposals SET status = 'applied', applied_revision = ? WHERE id = ?",
      ).run(revision, proposalId);
      this.db.exec("COMMIT");
      return { status: "applied", revision };
    } catch (error) {
      if (this.db.isTransaction) this.db.exec("ROLLBACK");
      throw error;
    }
  }

  private prevalidateChanges(storyId: string, branchId: string, changes: AtomicChange[]): void {
    const newIds = new Set<string>();
    for (const change of changes) {
      if (change.operation === "create" || change.operation === "replace") {
        if (newIds.has(change.after.id) || this.getRecord(change.after.id)) {
          throw new InvalidProposalError(`Duplicate record id: ${change.after.id}`);
        }
        newIds.add(change.after.id);
        if (change.after.storyId !== storyId || change.after.branchId !== branchId) {
          throw new InvalidProposalError("Change scope does not match proposal scope");
        }
      }
      if (change.operation !== "create") {
        const target = this.getRecord(change.targetId);
        if (!target || target.storyId !== storyId || target.branchId !== branchId || target.supersededRevision) {
          throw new InvalidProposalError(`Active target not found: ${change.targetId}`);
        }
      }
    }
  }

  private invalidateDerived(changedIds: string[]): void {
    if (changedIds.length === 0) return;
    const placeholders = changedIds.map(() => "?").join(",");
    this.db.prepare(`
      WITH RECURSIVE affected(id) AS (
        SELECT derived_record_id FROM dependency_edges WHERE source_record_id IN (${placeholders})
        UNION
        SELECT dependency_edges.derived_record_id
        FROM dependency_edges JOIN affected ON dependency_edges.source_record_id = affected.id
      )
      UPDATE records SET stale = 1 WHERE id IN (SELECT id FROM affected)
    `).run(...changedIds);
  }

  proposalStatus(proposalId: string): string | undefined {
    const row = this.db.prepare("SELECT status FROM proposals WHERE id = ?").get(proposalId) as Row | undefined;
    return row ? String(row.status) : undefined;
  }
}

export function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function estimateTokens(content: string): number {
  return Math.max(1, Math.ceil([...content].length / 2.5));
}
