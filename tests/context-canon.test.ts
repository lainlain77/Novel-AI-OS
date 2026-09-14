import assert from "node:assert/strict";
import test from "node:test";
import { buildT003Fixture } from "../src/fixture.ts";
import { InvalidProposalError, StaleProposalError, hash } from "../src/store.ts";
import type { ChangeProposal, StoryRecordInput, TaskContract } from "../src/types.ts";

const source = [{ sourceType: "author" as const, sourceRef: "test" }];

function task(overrides: Partial<TaskContract> = {}): TaskContract {
  return {
    taskId: "task-1",
    storyId: "story-loop",
    branchId: "main",
    baseRevision: 0,
    audience: "author",
    narrativeCursor: 12,
    query: "KEY",
    tokenBudget: 2000,
    ...overrides,
  };
}

function contents(packet: ReturnType<ReturnType<typeof buildT003Fixture>["compileContext"]>): string {
  return packet.sections.map((section) => section.content).join("\n");
}

function proposal(
  proposalId: string,
  changes: ChangeProposal["changes"],
  baseRevision = 0,
): ChangeProposal {
  return {
    proposalId,
    taskId: `task-${proposalId}`,
    storyId: "story-loop",
    branchId: "main",
    baseRevision,
    contextManifestHash: hash({ proposalId, baseRevision }),
    changes,
    evidence: source,
  };
}

function newRecord(id: string, content: string): StoryRecordInput {
  return {
    id,
    projectId: "project-1",
    storyId: "story-loop",
    branchId: "main",
    kind: "State",
    role: "canon",
    visibility: "author",
    content,
    provenance: source,
  };
}

test("hard scope gate prevents same-name records from another story", () => {
  const store = buildT003Fixture();
  const output = contents(store.compileContext(task()));
  assert.doesNotMatch(output, /KEY_SPACE/);
  assert.match(output, /KEY_TRUTH/);
  store.close();
});

test("hard scope gate prevents facts from another branch", () => {
  const store = buildT003Fixture();
  const output = contents(store.compileContext(task()));
  assert.doesNotMatch(output, /KEY_ALTERNATE/);
  store.close();
});

test("POV context gets its own mistaken belief but no other mind, truth, or author secret", () => {
  const store = buildT003Fixture();
  const output = contents(store.compileContext(task({ audience: "character", povEntityId: "gu-chen" })));
  assert.match(output, /KEY_BELIEF/);
  assert.match(output, /LOOP_RULE/);
  assert.doesNotMatch(output, /KEY_KNOWLEDGE|KEY_TRUTH|KEY_SECRET|KEY_SPACE/);
  store.close();
});

test("reader context obeys narrative cutoff and does not expose future or author-only facts", () => {
  const store = buildT003Fixture();
  const output = contents(store.compileContext(task({ audience: "reader", narrativeCursor: 12 })));
  assert.match(output, /KEY_CLUE/);
  assert.doesNotMatch(output, /KEY_FUTURE|KEY_SECRET|KEY_TRUTH|KEY_BELIEF/);
  store.close();
});

test("author secrets require an explicit task grant", () => {
  const store = buildT003Fixture();
  assert.doesNotMatch(contents(store.compileContext(task())), /KEY_SECRET/);
  assert.match(contents(store.compileContext(task({ includeAuthorSecrets: true }))), /KEY_SECRET/);
  store.close();
});

test("a saved proposal cannot change Canon until explicitly applied", () => {
  const store = buildT003Fixture();
  store.saveProposal(proposal("pending", [{ operation: "create", after: newRecord("pending-fact", "PENDING_FACT") }]));
  assert.equal(store.getRevision("story-loop", "main"), 0);
  assert.equal(store.getRecord("pending-fact"), undefined);
  assert.equal(store.proposalStatus("pending"), "ready");
  store.close();
});

test("applying a proposal is atomic and invalidates dependent summaries", () => {
  const store = buildT003Fixture();
  store.saveProposal(proposal("replace-belief", [{
    operation: "replace",
    targetId: "gu-belief",
    after: {
      ...newRecord("gu-belief-v2", "KEY_BELIEF_RESOLVED：顾沉确认林晚没有背叛。"),
      kind: "Knowledge",
      role: "belief",
      visibility: "character",
      knowerId: "gu-chen",
      narrativeFrom: 13,
    },
  }]));
  assert.deepEqual(store.applyProposal("replace-belief"), { status: "applied", revision: 1 });
  assert.equal(store.getRecord("old-summary")?.stale, true);
  assert.equal(store.getRecord("gu-belief")?.supersededRevision, 1);
  assert.equal(store.getRecord("gu-belief-v2")?.createdRevision, 1);
  store.close();
});

test("stale approval is rejected without overwriting the newer revision", () => {
  const store = buildT003Fixture();
  store.saveProposal(proposal("old", [{ operation: "create", after: newRecord("old-fact", "OLD_FACT") }]));
  store.saveProposal(proposal("new", [{ operation: "create", after: newRecord("new-fact", "NEW_FACT") }]));
  store.applyProposal("new");
  assert.throws(() => store.applyProposal("old"), StaleProposalError);
  assert.equal(store.proposalStatus("old"), "stale");
  assert.equal(store.getRecord("old-fact"), undefined);
  assert.equal(store.getRevision("story-loop", "main"), 1);
  store.close();
});

test("invalid multi-change proposal rolls back every change", () => {
  const store = buildT003Fixture();
  store.saveProposal(proposal("bad", [
    { operation: "create", after: newRecord("must-rollback", "ROLLBACK_ME") },
    { operation: "supersede", targetId: "missing-target" },
  ]));
  assert.throws(() => store.applyProposal("bad"), InvalidProposalError);
  assert.equal(store.getRecord("must-rollback"), undefined);
  assert.equal(store.getRevision("story-loop", "main"), 0);
  assert.equal(store.proposalStatus("bad"), "ready");
  store.close();
});

test("budgeting records omissions and keeps required constraints first", () => {
  const store = buildT003Fixture();
  const packet = store.compileContext(task({ tokenBudget: 30 }));
  assert.equal(packet.sections[0]?.role, "constraint");
  assert.ok(packet.omissions.length > 0);
  assert.ok(packet.actualTokens <= packet.tokenBudget);
  assert.equal(packet.manifestId.length, 64);
  assert.equal(packet.policyFingerprint.length, 64);
  store.close();
});
