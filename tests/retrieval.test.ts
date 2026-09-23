import assert from "node:assert/strict";
import test from "node:test";
import { buildT003Fixture } from "../src/fixture.ts";
import {
  EmbeddingRetriever,
  FixtureConceptEmbeddingProvider,
  HybridContextEngine,
  HybridRetriever,
  SqliteFtsRetriever,
  type EmbeddingProvider,
} from "../src/retrieval.ts";
import type { TaskContract } from "../src/types.ts";

function task(query: string, extra: Partial<TaskContract> = {}): TaskContract {
  return {
    taskId: `retrieval-${query}`,
    storyId: "story-loop",
    branchId: "main",
    baseRevision: 0,
    audience: "author",
    narrativeCursor: 12,
    query,
    tokenBudget: 1000,
    ...extra,
  };
}

test("semantic retriever receives only records allowed by the hard policy gate", async () => {
  const store = buildT003Fixture();
  const seen: string[] = [];
  const provider: EmbeddingProvider = {
    id: "spy-v1",
    dimensions: 1,
    async embed(texts) {
      seen.push(...texts);
      return texts.map(() => [1]);
    },
  };
  const engine = new HybridContextEngine(store, new EmbeddingRetriever(store, provider));
  const packet = await engine.compile(task("钥匙", { audience: "character", povEntityId: "gu-chen" }));
  const corpusSeen = seen.slice(0, -1).join("\n");
  assert.match(corpusSeen, /KEY_BELIEF|LOOP_RULE/);
  assert.doesNotMatch(corpusSeen, /KEY_SECRET|KEY_TRUTH|KEY_KNOWLEDGE|KEY_SPACE|KEY_ALTERNATE|KEY_FUTURE/);
  assert.doesNotMatch(packet.sections.map((section) => section.content).join("\n"), /KEY_SECRET|KEY_TRUTH/);
  store.close();
});

test("hybrid retrieval recovers a no-overlap synonym and explains its channel", async () => {
  const store = buildT003Fixture();
  const provider = new FixtureConceptEmbeddingProvider([["没有背叛", "保持忠诚"], ["林晚"]]);
  const hybrid = new HybridRetriever([new SqliteFtsRetriever(store), new EmbeddingRetriever(store, provider)]);
  const packet = await new HybridContextEngine(store, hybrid).compile(task("林晚保持忠诚"));
  const truth = packet.sections.find((section) => section.recordId === "world-truth");
  assert.ok(truth);
  assert.equal(truth.selectedBecause, "hybrid_retrieval");
  assert.ok(truth.retrieval?.channels.some((channel) => channel.modelId === provider.id));
  assert.equal(truth.retrieval?.channels[0]?.contentHash.length, 64);
  store.close();
});

test("embedding cache is keyed by content hash and provider version", async () => {
  const store = buildT003Fixture();
  const allowed = store.listEligibleRecords(task("忠诚"));
  const v1 = new EmbeddingRetriever(store, new FixtureConceptEmbeddingProvider([["忠诚", "没有背叛"]], "v1"));
  await v1.ensureIndexed(allowed);
  const v1Count = store.embeddingCacheCount(v1.provider.id);
  await v1.ensureIndexed(allowed);
  assert.equal(store.embeddingCacheCount(v1.provider.id), v1Count);
  const v2 = new EmbeddingRetriever(store, new FixtureConceptEmbeddingProvider([["忠诚", "没有背叛"]], "v2"));
  await v2.ensureIndexed(allowed);
  assert.equal(store.embeddingCacheCount(), v1Count * 2);
  store.close();
});

test("hybrid retrieval keeps lexical fallback when embedding fails", async () => {
  const store = buildT003Fixture();
  const failing: EmbeddingProvider = {
    id: "always-fails",
    dimensions: 1,
    async embed() { throw new Error("offline"); },
  };
  const hybrid = new HybridRetriever([new SqliteFtsRetriever(store), new EmbeddingRetriever(store, failing)]);
  const packet = await new HybridContextEngine(store, hybrid).compile(task("KEY_BELIEF", { audience: "character", povEntityId: "gu-chen" }));
  assert.ok(packet.sections.some((section) => section.recordId === "gu-belief"));
  store.close();
});

test("embedding retriever uses a provider-specific query encoder when available", async () => {
  const store = buildT003Fixture();
  let queryCalls = 0;
  const provider: EmbeddingProvider = {
    id: "query-aware-v1",
    dimensions: 1,
    async embed(texts) {
      return texts.map(() => [1]);
    },
    async embedQuery(text) {
      queryCalls++;
      assert.equal(text, "忠诚");
      return [1];
    },
  };
  const engine = new HybridContextEngine(store, new EmbeddingRetriever(store, provider));
  await engine.compile(task("忠诚"));
  assert.equal(queryCalls, 1);
  store.close();
});

