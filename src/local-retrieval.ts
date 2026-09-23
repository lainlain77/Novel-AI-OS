import type { NovelStore } from "./store.ts";
import {
  EmbeddingRetriever,
  HybridContextEngine,
  HybridRetriever,
  SqliteFtsRetriever,
  type EmbeddingProvider,
} from "./retrieval.ts";
import {
  loadLocalTransformersEmbeddingProvider,
  type LocalEmbeddingOptions,
  type LocalTransformersEmbeddingProvider,
} from "./local-embedding.ts";

export function buildHybridRetriever(
  store: NovelStore,
  provider: EmbeddingProvider,
  limit = 64,
): HybridRetriever {
  return new HybridRetriever([
    new SqliteFtsRetriever(store),
    new EmbeddingRetriever(store, provider, limit),
  ]);
}

export async function createLocalHybridContextEngine(
  store: NovelStore,
  options: LocalEmbeddingOptions,
  limit = 64,
): Promise<{
  engine: HybridContextEngine;
  provider: LocalTransformersEmbeddingProvider;
}> {
  const provider = await loadLocalTransformersEmbeddingProvider(options);
  return {
    engine: new HybridContextEngine(store, buildHybridRetriever(store, provider, limit)),
    provider,
  };
}

