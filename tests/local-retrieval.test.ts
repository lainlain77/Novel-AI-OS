import assert from "node:assert/strict";
import test from "node:test";
import { buildT003Fixture } from "../src/fixture.ts";
import { buildHybridRetriever } from "../src/local-retrieval.ts";
import { FixtureConceptEmbeddingProvider } from "../src/retrieval.ts";

test("local retrieval entry composes lexical fallback and embedding provider", async () => {
  const store = buildT003Fixture();
  const provider = new FixtureConceptEmbeddingProvider([["KEY_BELIEF", "忠诚"]]);
  const retriever = buildHybridRetriever(store, provider, 8);
  const candidates = await retriever.retrieve({
    task: {
      taskId: "local-retrieval-test",
      storyId: "story-loop",
      branchId: "main",
      baseRevision: 0,
      audience: "author",
      narrativeCursor: 12,
      query: "KEY_BELIEF",
      tokenBudget: 1000,
    },
    records: store.listEligibleRecords({
      taskId: "local-retrieval-test",
      storyId: "story-loop",
      branchId: "main",
      baseRevision: 0,
      audience: "author",
      narrativeCursor: 12,
      query: "KEY_BELIEF",
      tokenBudget: 1000,
    }),
  });
  assert.ok(candidates.length > 0);
  assert.ok(candidates.some((candidate) => candidate.channels.some((channel) => channel.retrieverId === "sqlite-fts5-v1")));
  assert.ok(candidates.some((candidate) => candidate.channels.some((channel) => channel.modelId === provider.id)));
  store.close();
});

