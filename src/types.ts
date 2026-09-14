export type RecordKind =
  | "Entity"
  | "Rule"
  | "State"
  | "Relation"
  | "Event"
  | "Knowledge"
  | "Derivation"
  | "Provenance"
  | "PlanNode"
  | "NarrativeThread"
  | "AuthorIntent"
  | "Summary";

export type ContextRole =
  | "constraint"
  | "canon"
  | "belief"
  | "plan"
  | "manuscript"
  | "summary"
  | "style"
  | "instruction";

export type Visibility = "author" | "character" | "reader" | "public";
export type Sensitivity = "normal" | "author_secret";
export type Audience = "author" | "character" | "reader";

export interface ProvenanceRef {
  sourceType: "author" | "manuscript" | "import" | "ai_inference" | "system";
  sourceRef: string;
  anchor?: string;
  actor?: string;
  method?: string;
  confidence?: number;
}

export interface StoryRecordInput {
  id: string;
  projectId: string;
  storyId: string;
  branchId: string;
  kind: RecordKind;
  role: ContextRole;
  visibility: Visibility;
  sensitivity?: Sensitivity;
  knowerId?: string;
  narrativeFrom?: number;
  narrativeTo?: number;
  content: string;
  payload?: Record<string, unknown>;
  provenance: ProvenanceRef[];
  derived?: boolean;
}

export interface StoredRecord extends StoryRecordInput {
  sensitivity: Sensitivity;
  status: "accepted";
  createdRevision: number;
  supersededRevision?: number;
  stale: boolean;
}

export interface TaskContract {
  taskId: string;
  storyId: string;
  branchId: string;
  baseRevision: number;
  audience: Audience;
  narrativeCursor: number;
  query: string;
  tokenBudget: number;
  povEntityId?: string;
  includeAuthorSecrets?: boolean;
}

export interface ContextSection {
  recordId: string;
  role: ContextRole;
  content: string;
  sourceRevision: number;
  sensitivity: Sensitivity;
  provenance: ProvenanceRef[];
  selectedBecause: string;
}

export interface ContextPacket {
  task: TaskContract;
  manifestId: string;
  policyFingerprint: string;
  baseRevision: number;
  sections: ContextSection[];
  omissions: Array<{ recordId: string; reason: string }>;
  conflicts: Array<{ recordIds: string[]; reason: string }>;
  tokenBudget: number;
  actualTokens: number;
}

export type AtomicChange =
  | { operation: "create"; after: StoryRecordInput }
  | { operation: "replace"; targetId: string; after: StoryRecordInput }
  | { operation: "supersede" | "retract"; targetId: string };

export interface ChangeProposal {
  proposalId: string;
  taskId: string;
  storyId: string;
  branchId: string;
  baseRevision: number;
  contextManifestHash: string;
  changes: AtomicChange[];
  evidence: ProvenanceRef[];
}
