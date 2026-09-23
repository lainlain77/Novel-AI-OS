import path from "node:path";
import { buildT003Fixture } from "../src/fixture.ts";
import { FakeModelAdapter } from "../src/model.ts";
import { createLocalAuthorWorkflowService } from "../src/local-workflow.ts";

const store = buildT003Fixture();
const modelPath = path.resolve(process.env.LOCAL_EMBEDDING_MODEL_PATH ?? "../models/bge-small-zh-v1.5");
const { service, provider } = await createLocalAuthorWorkflowService(store, new FakeModelAdapter(), {
  modelPath,
  modelId: "Xenova/bge-small-zh-v1.5",
  revision: "75c43b069aac4d136ba6bc1122f995fedcfd2781",
  weightsSha256: "15b717c382bcb518ba457b93ea6850ede7f4f1cd8937454aa06972366cd19bcc",
  dimensions: 512,
  dtype: "q8",
});
const run = await service.generate({
  task: {
    taskId: "t007-local-workflow-smoke",
    storyId: "story-loop",
    branchId: "main",
    baseRevision: 0,
    audience: "character",
    povEntityId: "gu-chen",
    narrativeCursor: 12,
    query: "KEY_BELIEF",
    tokenBudget: 600,
  },
  instruction: "检查后门",
  outputKind: "draft",
});
const content = run.packet.sections.map((section) => section.content).join("\n");
if (content.includes("KEY_SECRET") || content.includes("KEY_TRUTH")) throw new Error("Policy leakage detected");
if (store.getRevision("story-loop", "main") !== 0) throw new Error("Draft path changed Canon");
console.log(JSON.stringify({ provider: provider.id, sections: run.packet.sections.length, revision: store.getRevision("story-loop", "main"), output: run.output.kind }));
await provider.close();
store.close();

