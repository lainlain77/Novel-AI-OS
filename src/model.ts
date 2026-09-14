import type { ContextPacket, ModelOutput } from "./types.ts";

export interface ModelRequest {
  packet: ContextPacket;
  instruction: string;
  outputKind: "draft" | "proposal";
  signal?: AbortSignal;
}

export interface ModelAdapter {
  readonly id: string;
  generate(request: ModelRequest): Promise<ModelOutput>;
}

export class FakeModelAdapter implements ModelAdapter {
  readonly id = "fake-local-v1";

  async generate(request: ModelRequest): Promise<ModelOutput> {
    if (request.signal?.aborted) throw new DOMException("Generation cancelled", "AbortError");
    const evidence = request.packet.sections.map((section) => section.content).join("；");
    const generatedAt = "deterministic-fixture";
    if (request.outputKind === "draft") {
      const text = `【本地假模型草稿】${request.instruction}\n可用上下文：${evidence || "无"}`;
      return {
        kind: "draft",
        text,
        metadata: {
          provider: "local-fixture",
          model: this.id,
          generatedAt,
          inputTokens: request.packet.actualTokens,
          outputTokens: estimate(text),
        },
      };
    }
    const content = `AI_SUGGESTION：${request.instruction}`;
    return {
      kind: "proposal_suggestion",
      suggestion: {
        kind: "State",
        role: "canon",
        visibility: "author",
        sensitivity: "normal",
        content,
        payload: { generatedFromManifest: request.packet.manifestId },
      },
      rationale: `基于 ${request.packet.sections.length} 条获准上下文生成，需作者确认。`,
      metadata: {
        provider: "local-fixture",
        model: this.id,
        generatedAt,
        inputTokens: request.packet.actualTokens,
        outputTokens: estimate(content),
      },
    };
  }
}

function estimate(text: string): number {
  return Math.max(1, Math.ceil([...text].length / 2.5));
}
