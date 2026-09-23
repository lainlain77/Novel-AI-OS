import type { ModelAdapter } from "./model.ts";
import { createLocalHybridContextEngine } from "./local-retrieval.ts";
import type { LocalEmbeddingOptions, LocalTransformersEmbeddingProvider } from "./local-embedding.ts";
import type { NovelStore } from "./store.ts";
import { AuthorWorkflowService } from "./workflow.ts";

export async function createLocalAuthorWorkflowService(
  store: NovelStore,
  model: ModelAdapter,
  options: LocalEmbeddingOptions,
  limit = 64,
): Promise<{ service: AuthorWorkflowService; provider: LocalTransformersEmbeddingProvider }> {
  const { engine, provider } = await createLocalHybridContextEngine(store, options, limit);
  return { service: new AuthorWorkflowService(store, model, engine), provider };
}

