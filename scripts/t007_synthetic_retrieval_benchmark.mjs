import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { buildT003Fixture } from "../src/fixture.ts";
import { BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION, loadLocalTransformersEmbeddingProvider } from "../src/local-embedding.ts";
import {
  EmbeddingRetriever,
  HybridContextEngine,
  HybridRetriever,
  SqliteFtsRetriever,
} from "../src/retrieval.ts";
import { NovelStore } from "../src/store.ts";

const CASES = [
  ["fact-00", "月蚀临近时，银铃村的井水会变咸，北门石槽能够滤出可饮用的水。", "月食前后村民要去哪里取干净的饮水？"],
  ["fact-01", "雾港的旧钟每天在潮汐最高之前敲响三次，守潮人以此确认堤坝即将承压。", "守潮人怎样判断海堤快要承受最大水压？"],
  ["fact-02", "赤陶商队把账册藏在第三辆车的夹层，只有车轴发出两声短响才会打开暗板。", "商队的账簿藏在哪里，什么信号能打开机关？"],
  ["fact-03", "北岭的雪线下降后，灰羽信使必须绕过松谷，因为谷中的冷雾会让信鸽失去方向。", "雪线变低时信使为何不走松谷？"],
  ["fact-04", "青铜城的夜巡以檐角灯为界，灯火熄灭表示内城已经进入换岗禁行时段。", "内城换岗期间怎样判断街道已经禁止通行？"],
  ["fact-05", "暮河镇的药师把止血草晒在西窗，午后转为阴面可以保留草叶的苦味成分。", "药师如何晾晒止血草以保存药效？"],
  ["fact-06", "白沙驿站的备用钥匙缝在柜台底部的蓝布里，掌柜只在暴雨封路时取出它。", "驿站的备用钥匙藏在什么地方，何时会使用？"],
  ["fact-07", "镜湖边的渔网不能碰到芦苇花，花粉会使丝线变脆，渔户会在清晨先清理水面。", "渔户为什么每天清晨先清除芦苇花？"],
  ["fact-08", "赤石矿洞的安全标记是倒三角白漆，看到连续两个标记就意味着前方缺氧。", "矿工用什么标志识别缺氧路段？"],
  ["fact-09", "长风驿的信件按木牌颜色分拣，黑牌代表需要在日落前交到北门，不得混入普通邮袋。", "哪些信件必须在太阳落山前送到北门？"],
  ["fact-10", "柳影村的粮仓地板留有通风缝，冬季封住南侧而保留东侧，防止霜气进入谷堆。", "冬天粮仓要封住哪一侧来避免谷物受霜？"],
  ["fact-11", "沉星塔的观测者记录流星时先校准铜盘，再把时间刻在内圈，外圈只写天气。", "观测流星时记录时间前需要先做什么？"],
];

const outputFlag = process.argv.indexOf("--output");
const outputPath = outputFlag >= 0 ? path.resolve(process.argv[outputFlag + 1]) : undefined;
const modelPath = path.resolve(process.env.LOCAL_EMBEDDING_MODEL_PATH ?? "../models/bge-small-zh-v1.5");
const provider = await loadLocalTransformersEmbeddingProvider({
  modelPath,
  modelId: "Xenova/bge-small-zh-v1.5",
  revision: "75c43b069aac4d136ba6bc1122f995fedcfd2781",
  weightsSha256: "15b717c382bcb518ba457b93ea6850ede7f4f1cd8937454aa06972366cd19bcc",
  dimensions: 512,
  dtype: "q8",
  queryInstruction: BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION,
});

const store = new NovelStore(":memory:");
store.createStory({ projectId: "t007-synthetic", storyId: "synthetic-story", storyName: "合成检索基准", branchId: "main" });
store.createBranch("synthetic-story", "alternate", "合成分支");
store.createStory({ projectId: "t007-synthetic", storyId: "other-story", storyName: "隔离作品", branchId: "main" });
const provenance = [{ sourceType: "system", sourceRef: "synthetic:t007-v1" }];
const records = CASES.map(([id, content]) => ({
  id,
  projectId: "t007-synthetic",
  storyId: "synthetic-story",
  branchId: "main",
  kind: "Event",
  role: "manuscript",
  visibility: "public",
  content,
  provenance,
}));
for (let index = 0; index < 96; index++) {
  records.push({
    id: "distractor-" + index,
    projectId: "t007-synthetic",
    storyId: "synthetic-story",
    branchId: "main",
    kind: "Event",
    role: "manuscript",
    visibility: "public",
    content: "合成背景片段 " + index + "：旅人检查门闩、雨具和火种，沿着旧路继续前行。",
    provenance,
  });
}
records.push({
  id: "synthetic-secret",
  projectId: "t007-synthetic",
  storyId: "synthetic-story",
  branchId: "main",
  kind: "AuthorIntent",
  role: "canon",
  visibility: "author",
  sensitivity: "author_secret",
  content: "SYNTHETIC_SECRET：作者尚未公开的结局安排。",
  provenance,
});
records.push({
  id: "synthetic-future",
  projectId: "t007-synthetic",
  storyId: "synthetic-story",
  branchId: "main",
  kind: "Knowledge",
  role: "manuscript",
  visibility: "reader",
  narrativeFrom: 999,
  content: "SYNTHETIC_FUTURE：尚未到达的未来事件。",
  provenance,
});
records.push({
  id: "synthetic-other-scope",
  projectId: "t007-synthetic",
  storyId: "other-story",
  branchId: "main",
  kind: "Event",
  role: "manuscript",
  visibility: "public",
  content: "SYNTHETIC_OTHER_SCOPE：另一作品的相似线索。",
  provenance,
});
records.push({
  id: "synthetic-alternate",
  projectId: "t007-synthetic",
  storyId: "synthetic-story",
  branchId: "alternate",
  kind: "Event",
  role: "manuscript",
  visibility: "public",
  content: "SYNTHETIC_ALTERNATE：另一分支的相似线索。",
  provenance,
});
store.seedAcceptedRecords(records);

const dense = new EmbeddingRetriever(store, provider, 32);
const ftsEngine = new HybridContextEngine(store, new SqliteFtsRetriever(store));
const denseEngine = new HybridContextEngine(store, dense);
const hybridEngine = new HybridContextEngine(store, new HybridRetriever([
  new SqliteFtsRetriever(store),
  dense,
]));
const taskFor = (query, index) => ({
  taskId: "t007-synthetic-" + index,
  storyId: "synthetic-story",
  branchId: "main",
  baseRevision: 0,
  audience: "author",
  narrativeCursor: 100,
  query,
  tokenBudget: 1200,
});
const warmupTask = taskFor(CASES[0][2], 0);
await denseEngine.compile(warmupTask);

const timings = { fts: [], dense: [], hybrid: [] };
const ranks = { fts: [], dense: [], hybrid: [] };
let leaks = 0;
let provenanceErrors = 0;
for (let repeat = 0; repeat < 3; repeat++) {
  for (let index = 0; index < CASES.length; index++) {
    const [target, , query] = CASES[index];
    const task = taskFor(query, index);
    for (const [name, engine] of [["fts", ftsEngine], ["dense", denseEngine], ["hybrid", hybridEngine]]) {
      const started = performance.now();
      const packet = await engine.compile(task);
      timings[name].push(performance.now() - started);
      const rank = packet.sections.findIndex((section) => section.recordId === target);
      ranks[name].push(rank < 0 ? null : rank + 1);
      const content = packet.sections.map((section) => section.content).join("\n");
      if (/SYNTHETIC_(SECRET|FUTURE|OTHER_SCOPE|ALTERNATE)/.test(content)) leaks++;
      if (packet.sections.some((section) => section.provenance.some((item) => item.sourceRef !== "synthetic:t007-v1"))) {
        provenanceErrors++;
      }
    }
  }
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)] ?? 0;
}
function metric(name) {
  const positions = ranks[name];
  const valid = positions.filter((value) => value !== null);
  return {
    recallAt1: valid.filter((value) => value <= 1).length / positions.length,
    recallAt5: valid.filter((value) => value <= 5).length / positions.length,
    mrr: positions.reduce((sum, value) => sum + (value ? 1 / value : 0), 0) / positions.length,
    p50Ms: percentile(timings[name], 0.5),
    p95Ms: percentile(timings[name], 0.95),
    maxMs: Math.max(...timings[name]),
  };
}
const result = {
  schema: "novel-ai-os-t007-synthetic-retrieval-v1",
  measuredAt: new Date().toISOString(),
  fixture: { cases: CASES.length, distractors: 96, repeatsPerCase: 3, records: records.length },
  model: {
    id: provider.id,
    revision: "75c43b069aac4d136ba6bc1122f995fedcfd2781",
    dimensions: provider.dimensions,
    dtype: "q8",
    queryInstruction: BGE_ZH_RETRIEVAL_QUERY_INSTRUCTION,
  },
  results: { fts: metric("fts"), dense: metric("dense"), hybrid: metric("hybrid") },
  safety: { leaks, provenanceErrors, cacheEntries: store.embeddingCacheCount(provider.id) },
  limitations: [
    "The corpus is synthetic and does not represent private or production novel text.",
    "Labels are authored with the fixture and are not independent human judgments.",
    "Metrics are a local pilot; they do not establish general Chinese retrieval quality.",
  ],
};
if (outputPath) {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(result, null, 2) + "\n", "utf8");
}
console.log(JSON.stringify(result, null, 2));
store.close();
await provider.close();

