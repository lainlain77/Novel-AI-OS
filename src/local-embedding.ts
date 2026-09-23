import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { EmbeddingProvider } from "./retrieval.ts";

interface TensorLike {
  tolist(): number[][];
}

interface FeatureExtractor {
  (texts: string[], options: { pooling: "cls"; normalize: true }): Promise<TensorLike>;
  dispose?(): Promise<void> | void;
}

export interface LocalEmbeddingOptions {
  modelPath: string;
  modelId: string;
  revision: string;
  weightsSha256: string;
  dimensions: number;
  batchSize?: number;
  dtype?: "q8" | "fp16" | "fp32";
}

export class LocalTransformersEmbeddingProvider implements EmbeddingProvider {
  readonly id: string;
  readonly dimensions: number;
  private readonly extractor: FeatureExtractor;
  private readonly batchSize: number;

  constructor(options: LocalEmbeddingOptions, extractor: FeatureExtractor) {
    this.dimensions = options.dimensions;
    this.batchSize = options.batchSize ?? 8;
    this.extractor = extractor;
    this.id = [
      "local-transformers",
      `${options.modelId}@${options.revision}`,
      options.dtype ?? "q8",
      options.weightsSha256.slice(0, 16),
      "cls-normalized",
    ].join(":");
  }

  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    const vectors: number[][] = [];
    for (let index = 0; index < texts.length; index += this.batchSize) {
      const batch = texts.slice(index, index + this.batchSize);
      const output = await this.extractor(batch, { pooling: "cls", normalize: true });
      const rows = output.tolist();
      if (rows.length !== batch.length || rows.some((row) => row.length !== this.dimensions)) {
        throw new Error(`Local embedding model returned invalid dimensions; expected ${this.dimensions}`);
      }
      vectors.push(...rows);
    }
    return vectors;
  }

  async close(): Promise<void> {
    await this.extractor.dispose?.();
  }
}

export async function loadLocalTransformersEmbeddingProvider(
  options: LocalEmbeddingOptions,
): Promise<LocalTransformersEmbeddingProvider> {
  const modelPath = path.resolve(options.modelPath);
  const weightsPath = path.join(modelPath, "onnx", "model_quantized.onnx");
  const actualHash = createHash("sha256").update(await readFile(weightsPath)).digest("hex");
  if (actualHash !== options.weightsSha256.toLowerCase()) {
    throw new Error(`Local embedding weights hash mismatch: expected ${options.weightsSha256}, got ${actualHash}`);
  }
  const transformers = await import("@huggingface/transformers");
  transformers.env.allowLocalModels = true;
  transformers.env.allowRemoteModels = false;
  const extractor = await transformers.pipeline("feature-extraction", modelPath, {
    dtype: options.dtype ?? "q8",
  }) as unknown as FeatureExtractor;
  return new LocalTransformersEmbeddingProvider(options, extractor);
}

