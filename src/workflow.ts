import { randomUUID } from "node:crypto";
import type { ChangeProposal, ContextPacket, ModelOutput, TaskContract } from "./types.ts";
import type { ModelAdapter } from "./model.ts";
import { NovelStore } from "./store.ts";

export interface GenerationRun {
  packet: ContextPacket;
  output: ModelOutput;
}

export interface ContextCompiler {
  compile(task: TaskContract): ContextPacket | Promise<ContextPacket>;
}

export class AuthorWorkflowService {
  readonly store: NovelStore;
  readonly model: ModelAdapter;
  readonly contextCompiler?: ContextCompiler;

  constructor(
    store: NovelStore,
    model: ModelAdapter,
    contextCompiler?: ContextCompiler,
  ) {
    this.store = store;
    this.model = model;
    this.contextCompiler = contextCompiler;
  }

  compile(task: TaskContract): ContextPacket {
    return this.store.compileContext(task);
  }

  async compileAsync(task: TaskContract): Promise<ContextPacket> {
    return this.contextCompiler ? await this.contextCompiler.compile(task) : this.compile(task);
  }

  async generate(input: {
    task: TaskContract;
    instruction: string;
    outputKind: "draft" | "proposal";
    signal?: AbortSignal;
  }): Promise<GenerationRun> {
    const packet = await this.compileAsync(input.task);
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

