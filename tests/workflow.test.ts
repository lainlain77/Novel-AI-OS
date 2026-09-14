import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import { buildT003Fixture } from "../src/fixture.ts";
import { FakeModelAdapter } from "../src/model.ts";
import { createWorkbenchServer } from "../src/server.ts";
import type { TaskContract } from "../src/types.ts";
import { AuthorWorkflowService } from "../src/workflow.ts";

function setup() {
  const store = buildT003Fixture();
  return { store, service: new AuthorWorkflowService(store, new FakeModelAdapter()) };
}

function task(): TaskContract {
  return {
    taskId: "workflow-test",
    storyId: "story-loop",
    branchId: "main",
    baseRevision: 0,
    audience: "character",
    povEntityId: "gu-chen",
    narrativeCursor: 12,
    query: "KEY",
    tokenBudget: 600,
  };
}

test("fake model draft sees only the policy-gated packet and cannot change Canon", async () => {
  const { store, service } = setup();
  const run = await service.generate({ task: task(), instruction: "续写", outputKind: "draft" });
  assert.equal(run.output.kind, "draft");
  if (run.output.kind === "draft") {
    assert.match(run.output.text, /KEY_BELIEF/);
    assert.doesNotMatch(run.output.text, /KEY_SECRET|KEY_TRUTH|KEY_KNOWLEDGE/);
  }
  assert.equal(store.getRevision("story-loop", "main"), 0);
  store.close();
});

test("model suggestion becomes Canon only after prepare, save, and explicit apply", async () => {
  const { store, service } = setup();
  const run = await service.generate({ task: task(), instruction: "顾沉决定检查后门", outputKind: "proposal" });
  const proposal = service.prepareProposal(run);
  assert.equal(store.getRevision("story-loop", "main"), 0);
  service.saveProposal(proposal);
  assert.equal(store.getRevision("story-loop", "main"), 0);
  assert.equal(store.proposalStatus(proposal.proposalId), "ready");
  assert.deepEqual(service.applyProposal(proposal.proposalId), { status: "applied", revision: 1 });
  assert.equal(store.getRevision("story-loop", "main"), 1);
  store.close();
});

test("author can reject a prepared proposal without changing Canon", async () => {
  const { store, service } = setup();
  const run = await service.generate({ task: task(), instruction: "错误建议", outputKind: "proposal" });
  const proposal = service.prepareProposal(run);
  service.saveProposal(proposal);
  service.rejectProposal(proposal.proposalId);
  assert.equal(store.proposalStatus(proposal.proposalId), "rejected");
  assert.equal(store.getRevision("story-loop", "main"), 0);
  store.close();
});

test("workbench serves UI and policy-inspected API without external services", async () => {
  const { store, service } = setup();
  const server = createWorkbenchServer(service).listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  const page = await fetch(base).then((response) => response.text());
  assert.match(page, /Novel-AI-OS 作者工作台/);
  const response = await fetch(`${base}/api/compile`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ task: task() }),
  });
  const packet = await response.json() as { sections: Array<{ content: string }> };
  const content = packet.sections.map((section) => section.content).join("\n");
  assert.match(content, /KEY_BELIEF/);
  assert.doesNotMatch(content, /KEY_SECRET/);
  server.close();
  await once(server, "close");
  store.close();
});
