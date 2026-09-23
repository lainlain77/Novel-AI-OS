import path from "node:path";
import { once } from "node:events";
import { buildT003Fixture } from "../src/fixture.ts";
import { FakeModelAdapter } from "../src/model.ts";
import { createWorkbenchServer } from "../src/server.ts";
import { createLocalAuthorWorkflowService } from "../src/local-workflow.ts";
import { BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION } from "../src/local-embedding.ts";

const store = buildT003Fixture();
const modelPath = path.resolve(process.env.LOCAL_EMBEDDING_MODEL_PATH ?? "../models/bge-small-zh-v1.5");
const { service, provider } = await createLocalAuthorWorkflowService(store, new FakeModelAdapter(), {
  modelPath,
  modelId: "Xenova/bge-small-zh-v1.5",
  revision: "75c43b069aac4d136ba6bc1122f995fedcfd2781",
  weightsSha256: "15b717c382bcb518ba457b93ea6850ede7f4f1cd8937454aa06972366cd19bcc",
  dimensions: 512,
  dtype: "q8",
  queryInstruction: BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION,
});
const server = createWorkbenchServer(service);
server.listen(0, "127.0.0.1");
await once(server, "listening");
const address = server.address();
if (!address || typeof address === "string") throw new Error("server did not expose a TCP address");
const base = "http://127.0.0.1:" + address.port;
const task = {
  taskId: "t007-local-server-smoke",
  storyId: "story-loop",
  branchId: "main",
  baseRevision: 0,
  audience: "character",
  povEntityId: "gu-chen",
  narrativeCursor: 12,
  query: "KEY_BELIEF",
  tokenBudget: 600,
};

async function post(pathname, body) {
  const response = await fetch(base + pathname, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(pathname + " failed: " + JSON.stringify(payload));
  return payload;
}

try {
  const compiled = await post("/api/compile", { task });
  const generated = await post("/api/generate", {
    task,
    instruction: "检查后门",
    outputKind: "draft",
  });
  const serialized = JSON.stringify(generated);
  if (serialized.includes("KEY_SECRET") || serialized.includes("KEY_TRUTH")) {
    throw new Error("policy leakage detected");
  }
  if (store.getRevision("story-loop", "main") !== 0) throw new Error("draft path changed Canon");
  console.log(JSON.stringify({
    provider: provider.id,
    compileSections: compiled.sections.length,
    output: generated.output.kind,
    revision: store.getRevision("story-loop", "main"),
  }));
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await provider.close();
  store.close();
}

