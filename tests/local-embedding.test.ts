import assert from "node:assert/strict";
import test from "node:test";
import {
  BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION,
  LocalTransformersEmbeddingProvider,
} from "../src/local-embedding.ts";

test("local embedding provider batches inputs and requests normalized CLS pooling", async () => {
  const calls: Array<{ texts: string[]; options: unknown }> = [];
  const extractor = async (texts: string[], options: unknown) => {
    calls.push({ texts, options });
    return { tolist: () => texts.map((text) => [text.length, 1]) };
  };
  const provider = new LocalTransformersEmbeddingProvider({
    modelPath: "unused-in-injected-test",
    modelId: "test-model",
    revision: "fixed-revision",
    weightsSha256: "a".repeat(64),
    dimensions: 2,
    batchSize: 2,
  }, extractor);
  const vectors = await provider.embed(["一", "二二", "三三三"]);
  assert.deepEqual(vectors, [[1, 1], [2, 1], [3, 1]]);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0]?.options, { pooling: "cls", normalize: true });
  assert.match(provider.id, /test-model@fixed-revision/);
});

test("local embedding provider rejects a wrong vector dimension", async () => {
  const provider = new LocalTransformersEmbeddingProvider({
    modelPath: "unused-in-injected-test",
    modelId: "test-model",
    revision: "fixed-revision",
    weightsSha256: "b".repeat(64),
    dimensions: 2,
  }, async (texts) => ({ tolist: () => texts.map(() => [1]) }));
  await assert.rejects(() => provider.embed(["text"]), /invalid dimensions/);
});

test("local embedding provider applies the retrieval instruction only to queries", async () => {
  const seen: string[] = [];
  const provider = new LocalTransformersEmbeddingProvider({
    modelPath: "unused-in-injected-test",
    modelId: "test-model",
    revision: "fixed-revision",
    weightsSha256: "c".repeat(64),
    dimensions: 2,
    queryInstruction: BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION,
  }, async (texts) => {
    seen.push(...texts);
    return { tolist: () => texts.map(() => [1, 0]) };
  });
  await provider.embed(["普通文档"]);
  await provider.embedQuery("查找雨夜");
  assert.deepEqual(seen, [
    "普通文档",
    BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION + "查找雨夜",
  ]);
  assert.match(provider.id, /query-[0-9a-f]{12}$/);
});

