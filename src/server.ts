import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { buildT003Fixture } from "./fixture.ts";
import { FakeModelAdapter } from "./model.ts";
import { AuthorWorkflowService, type GenerationRun } from "./workflow.ts";
import type { ChangeProposal, TaskContract } from "./types.ts";

const htmlPath = fileURLToPath(new URL("../public/index.html", import.meta.url));

export function createWorkbenchServer(service = new AuthorWorkflowService(buildT003Fixture(), new FakeModelAdapter())) {
  return createServer(async (request, response) => {
    try {
      await route(service, request, response);
    } catch (error) {
      json(response, 400, { error: error instanceof Error ? error.message : String(error) });
    }
  });
}

async function route(service: AuthorWorkflowService, request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? "/", "http://localhost");
  if (request.method === "GET" && url.pathname === "/") {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(await readFile(htmlPath));
    return;
  }
  if (request.method === "GET" && url.pathname === "/api/bootstrap") {
    json(response, 200, {
      adapter: service.model.id,
      storyId: "story-loop",
      branchId: "main",
      revision: service.store.getRevision("story-loop", "main"),
    });
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/compile") {
    const body = await bodyJson<{ task: TaskContract }>(request);
    json(response, 200, service.compile(body.task));
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/generate") {
    const body = await bodyJson<{ task: TaskContract; instruction: string; outputKind: "draft" | "proposal" }>(request);
    const run = await service.generate(body);
    const proposal = run.output.kind === "proposal_suggestion" ? service.prepareProposal(run) : undefined;
    json(response, 200, { ...run, proposal });
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/proposal/save") {
    const body = await bodyJson<{ proposal: ChangeProposal }>(request);
    service.saveProposal(body.proposal);
    json(response, 200, { status: "ready", revision: service.store.getRevision(body.proposal.storyId, body.proposal.branchId) });
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/proposal/apply") {
    const body = await bodyJson<{ proposalId: string }>(request);
    json(response, 200, service.applyProposal(body.proposalId));
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/proposal/reject") {
    const body = await bodyJson<{ proposalId: string }>(request);
    service.rejectProposal(body.proposalId);
    json(response, 200, { status: "rejected" });
    return;
  }
  json(response, 404, { error: "Not found" });
}

async function bodyJson<T>(request: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
}

function json(response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.NOVEL_OS_PORT ?? 4173);
  createWorkbenchServer().listen(port, "127.0.0.1", () => {
    console.log(`Novel-AI-OS workbench: http://127.0.0.1:${port}`);
  });
}
