import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { cpus, tmpdir, totalmem } from "node:os";
import { dirname, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { hash, NovelStore } from "../src/store.ts";
import type { ChangeProposal, StoryRecordInput, TaskContract } from "../src/types.ts";

const SEED = "novel-ai-os-t005-v1";
const CHUNKS = 2_100;
const NEEDLES = 30;
const SEMANTIC_CASES = 5;
const tempRoot = mkdtempSync(join(tmpdir(), "novel-ai-os-t005-"));
const dbPath = join(tempRoot, "benchmark.sqlite");
const outputArg = process.argv.indexOf("--output");
const outputPath = outputArg >= 0 ? resolve(process.argv[outputArg + 1]) : undefined;
const source = [{ sourceType: "system" as const, sourceRef: `benchmark:${SEED}` }];

function filler(index: number): string {
  const base = `第${index}场，雨声敲打旧旅店的窗。顾沉记录门牌、钟声、气味与同行者的反应，仍无法判断循环边界。`;
  return (base + "走廊灯光依次熄灭，远处传来钥匙碰撞声。人物只依据亲历信息行动，叙述不提前解释谜底。").repeat(8).slice(0, 510);
}

function record(id: string, content: string, extra: Partial<StoryRecordInput> = {}): StoryRecordInput {
  return {
    id,
    projectId: "benchmark-project",
    storyId: "long-story",
    branchId: "main",
    kind: "Event",
    role: "manuscript",
    visibility: "public",
    content,
    provenance: source,
    ...extra,
  };
}

function task(query: string, extra: Partial<TaskContract> = {}): TaskContract {
  return {
    taskId: `benchmark-${query}`,
    storyId: "long-story",
    branchId: "main",
    baseRevision: 0,
    audience: "author",
    narrativeCursor: CHUNKS + 100,
    query,
    tokenBudget: 1_200,
    ...extra,
  };
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ?? 0;
}

const store = new NovelStore(dbPath);
store.createStory({ projectId: "benchmark-project", storyId: "long-story", storyName: "百万字循环旅店", branchId: "main" });
store.createBranch("long-story", "alternate", "备选分支");
store.createStory({ projectId: "benchmark-project", storyId: "poison-story", storyName: "同名污染对照", branchId: "main" });

const records: StoryRecordInput[] = [];
for (let i = 0; i < CHUNKS; i++) {
  const needle = i < NEEDLES ? ` NEEDLE_${String(i).padStart(2, "0")}：第${i}号线索指向北侧楼梯。` : "";
  records.push(record(`chunk-${i}`, filler(i) + needle, { narrativeFrom: i }));
}
for (let i = 0; i < 5; i++) {
  records.push(record(`belief-${i}`, `BELIEF_${i}：顾沉误以为林晚在第${i}次循环隐瞒出口。`, {
    kind: "Knowledge", role: "belief", visibility: "character", knowerId: "gu-chen", narrativeFrom: 500,
  }));
  records.push(record(`secret-${i}`, `SECRET_${i}：作者秘密说明经理安排了第${i}次假出口。`, {
    kind: "AuthorIntent", role: "canon", visibility: "author", sensitivity: "author_secret",
  }));
  records.push(record(`future-${i}`, `FUTURE_${i}：第1900场以后读者才看见第${i}枚真钥匙。`, {
    kind: "Knowledge", role: "manuscript", visibility: "reader", narrativeFrom: 1_900 + i,
  }));
  records.push({
    ...record(`alt-${i}`, `ALT_${i}：备选分支中的第${i}条不同事实。`), branchId: "alternate",
  });
  records.push({
    ...record(`poison-${i}`, `NEEDLE_${String(i).padStart(2, "0")} POISON_${i}：另一部作品的同名顾沉给出相反答案。`),
    storyId: "poison-story",
  });
}
for (let i = 0; i < SEMANTIC_CASES; i++) {
  records.push(record(`semantic-${i}`, `SEMANTIC_TARGET_${i}：顾沉在房间里发现一把绯红雨伞，伞柄刻着月桂叶。`, {
    kind: "State", role: "canon", visibility: "author", narrativeFrom: 700 + i,
  }));
}
records.push(record("derived-summary", "DERIVED_SUMMARY：第一场摘要依赖开篇记录。", {
  kind: "Summary", role: "summary", visibility: "author", derived: true,
}));

const characterCount = records.filter((item) => item.storyId === "long-story" && item.branchId === "main")
  .reduce((sum, item) => sum + [...item.content].length, 0);
const buildStart = performance.now();
store.seedAcceptedRecords(records);
store.addDependency("derived-summary", "chunk-0");
const buildMs = performance.now() - buildStart;

const latencies: number[] = [];
let required = 0;
let found = 0;
let forbiddenChecks = 0;
let leaks = 0;
const failures: Array<{ case: string; reason: string }> = [];
const budgetUtilization: number[] = [];
let provenanceErrors = 0;
let semanticFound = 0;

function timedCompile(contract: TaskContract) {
  const start = performance.now();
  const packet = store.compileContext(contract);
  latencies.push(performance.now() - start);
  budgetUtilization.push(packet.actualTokens / packet.tokenBudget);
  for (const section of packet.sections) {
    if (!section.provenance.some((item) => item.sourceRef === `benchmark:${SEED}`)) provenanceErrors++;
  }
  return packet;
}

function check(caseName: string, contract: TaskContract, mustInclude: string, mustExclude: string[] = []) {
  const packet = timedCompile(contract);
  const text = packet.sections.map((section) => section.content).join("\n");
  required++;
  if (text.includes(mustInclude)) found++;
  else failures.push({ case: caseName, reason: `missing ${mustInclude}` });
  for (const forbidden of mustExclude) {
    forbiddenChecks++;
    if (text.includes(forbidden)) {
      leaks++;
      failures.push({ case: caseName, reason: `leaked ${forbidden}` });
    }
  }
  return packet;
}

for (let i = 0; i < NEEDLES; i++) {
  const key = `NEEDLE_${String(i).padStart(2, "0")}`;
  check(`needle-${i}`, task(key), key, ["POISON_"]);
}
for (let i = 0; i < 5; i++) {
  check(`belief-own-${i}`, task(`BELIEF_${i}`, { audience: "character", povEntityId: "gu-chen", narrativeCursor: 1_000 }), `BELIEF_${i}`, ["SECRET_", "FUTURE_"]);
  forbiddenChecks++;
  const other = timedCompile(task(`BELIEF_${i}`, { audience: "character", povEntityId: "lin-wan", narrativeCursor: 1_000 }));
  if (other.sections.some((section) => section.content.includes(`BELIEF_${i}`))) {
    leaks++;
    failures.push({ case: `belief-other-${i}`, reason: `leaked BELIEF_${i}` });
  }
  check(`secret-granted-${i}`, task(`SECRET_${i}`, { includeAuthorSecrets: true }), `SECRET_${i}`);
  forbiddenChecks++;
  const noSecret = timedCompile(task(`SECRET_${i}`));
  if (noSecret.sections.some((section) => section.content.includes(`SECRET_${i}`))) {
    leaks++;
    failures.push({ case: `secret-denied-${i}`, reason: `leaked SECRET_${i}` });
  }
  check(`future-after-${i}`, task(`FUTURE_${i}`, { audience: "reader", narrativeCursor: 2_000 }), `FUTURE_${i}`);
  forbiddenChecks++;
  const before = timedCompile(task(`FUTURE_${i}`, { audience: "reader", narrativeCursor: 1_000 }));
  if (before.sections.some((section) => section.content.includes(`FUTURE_${i}`))) {
    leaks++;
    failures.push({ case: `future-before-${i}`, reason: `leaked FUTURE_${i}` });
  }
  forbiddenChecks++;
  const otherBranch = timedCompile(task(`ALT_${i}`));
  if (otherBranch.sections.some((section) => section.content.includes(`ALT_${i}`))) {
    leaks++;
    failures.push({ case: `alternate-branch-${i}`, reason: `leaked ALT_${i}` });
  }
}

for (let i = 0; i < SEMANTIC_CASES; i++) {
  const packet = timedCompile(task(`RED_PARASOL_${i}`));
  if (packet.sections.some((section) => section.content.includes(`SEMANTIC_TARGET_${i}`))) semanticFound++;
}

const proposal: ChangeProposal = {
  proposalId: "benchmark-invalidation",
  taskId: "benchmark-invalidation",
  storyId: "long-story",
  branchId: "main",
  baseRevision: 0,
  contextManifestHash: hash({ seed: SEED, operation: "invalidation" }),
  changes: [{
    operation: "replace",
    targetId: "chunk-0",
    after: record("chunk-0-v2", filler(0) + " NEEDLE_00：修改后的第0号线索指向钟楼。", { narrativeFrom: 0 }),
  }],
  evidence: source,
};
store.saveProposal(proposal);
const invalidationStart = performance.now();
store.applyProposal(proposal.proposalId);
const invalidationMs = performance.now() - invalidationStart;
const derivedInvalidated = store.getRecord("derived-summary")?.stale === true;

store.close();
const result = {
  schema: "novel-ai-os-long-context-benchmark-v1",
  seed: SEED,
  measuredAt: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    cpu: cpus()[0]?.model.trim() ?? "unknown",
    logicalCpus: cpus().length,
    memoryGiB: Number((totalmem() / 2 ** 30).toFixed(1)),
  },
  fixture: { records: records.length, mainStoryCharacters: characterCount, targetCharacters: 1_000_000 },
  storage: { databaseBytes: statSync(dbPath).size, buildMs: Number(buildMs.toFixed(3)) },
  retrieval: {
    measuredQueries: latencies.length,
    requiredCases: required,
    recall: required ? found / required : 0,
    forbiddenChecks,
    leaks,
    p50Ms: Number(percentile(latencies, 0.5).toFixed(3)),
    p95Ms: Number(percentile(latencies, 0.95).toFixed(3)),
    maxMs: Number(Math.max(...latencies).toFixed(3)),
    averageBudgetUtilization: Number((budgetUtilization.reduce((a, b) => a + b, 0) / budgetUtilization.length).toFixed(4)),
    provenanceErrors,
  },
  semanticLexicalBaseline: {
    cases: SEMANTIC_CASES,
    recall: semanticFound / SEMANTIC_CASES,
    expectedLimitation: "FTS5 cannot match paraphrases with no shared lexical token",
  },
  invalidation: { appliedMs: Number(invalidationMs.toFixed(3)), derivedInvalidated },
  failures,
};

const serialized = JSON.stringify(result, null, 2) + "\n";
if (outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialized, "utf8");
}
console.log(serialized);

const resolvedTemp = resolve(tempRoot);
if (!resolvedTemp.startsWith(resolve(tmpdir()))) throw new Error("Refusing to clean a path outside the temp directory");
rmSync(resolvedTemp, { recursive: true, force: true });
if (result.retrieval.recall !== 1 || leaks !== 0 || provenanceErrors !== 0 || !derivedInvalidated || characterCount < 1_000_000) process.exitCode = 1;
