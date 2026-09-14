import { randomUUID } from "node:crypto";
import type { ChangeProposal, ContextPacket, ModelOutput, TaskContract } from "./types.ts";
import type { ModelAdapter } from "./model.ts";
import { NovelStore } from "./store.ts";

export interface GenerationRun {
  packet: ContextPacket;
  output: ModelOutput;
}

export class AuthorWorkflowService {
  readonly store: NovelStore;
  readonly model: ModelAdapter;

  constructor(
    store: NovelStore,
    model: ModelAdapter,
  ) {
    this.store = store;
    this.model = model;
  }

  compile(task: TaskContract): ContextPacket {
    return this.store.compileContext(task);
  }

  async generate(input: {
    task: TaskContract;
    instruction: string;
    outputKind: "draft" | "proposal";
    signal?: AbortSignal;
  }): Promise<GenerationRun> {
    const packet = this.compile(input.task);
    const output = await this.model.generate({
      packet,
      instruction: input.instruction,
      outputKind: input.outputKind,
      signal: input.signal,
    });
    return { packet, output };
  }

  prepareProposal(run: GenerationRun): ChangeProposal {
    if (run.output.kind !== "proposal_suggestion") {
      throw new Error("A draft cannot be converted into Canon automatically");
    }
    const id = randomUUID();
    const task = run.packet.task;
    return {
      proposalId: `proposal-${id}`,
      taskId: task.taskId,
      storyId: task.storyId,
      branchId: task.branchId,
      baseRevision: run.packet.baseRevision,
      contextManifestHash: run.packet.manifestId,
      changes: [{
        operation: "create",
        after: {
          id: `record-${id}`,
          projectId: this.store.getProjectId(task.storyId),
          storyId: task.storyId,
          branchId: task.branchId,
          ...run.output.suggestion,
          provenance: [{
            sourceType: "ai_inference",
            sourceRef: run.packet.manifestId,
            method: run.output.metadata.model,
          }],
        },
      }],
      evidence: [{
        sourceType: "ai_inference",
        sourceRef: run.packet.manifestId,
        method: run.output.metadata.model,
      }],
    };
  }

  saveProposal(proposal: ChangeProposal): void {
    this.store.saveProposal(proposal);
  }

  applyProposal(proposalId: string): { status: "applied"; revision: number } {
    return this.store.applyProposal(proposalId);
  }

  rejectProposal(proposalId: string): void {
    this.store.rejectProposal(proposalId);
  }
}
