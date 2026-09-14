# T005 百万字长篇 Context Engine 基准

Status: completed_synthetic_baseline
Updated: 2026-09-15
Data seed: `novel-ai-os-t005-v1`

## 结论

在 1,072,358 个主故事字符、2,131 条总记录的合成长篇上，SQLite/FTS5 基线完成 45/45 个必须命中的精确词法用例，60 次跨作品、跨分支、他人知识、作者秘密与未来信息检查零泄漏。70 次 Context 编译的 p50 为 58.108 ms，p95 为 66.762 ms，最大 70.186 ms。

同一基线对 5 个完全没有共同词的同义改写查询召回为 0/5。这是明确的能力边界：FTS5 可以继续承担精确事实、名称、ID 和低成本 fallback，但小说的同义、隐喻和语义回忆需要可替换的 embedding/rerank 候选层。新候选仍必须在 ADR-010 的允许集合内运行。

## 可复现环境

- 日期：2026-09-15（Asia/Shanghai；结果 UTC 时间为 2026-09-14T16:05:39.895Z）；
- 系统：Windows x64；
- Node.js：v24.16.0；
- CPU：AMD Ryzen 7 4800H；16 logical CPUs；
- 内存：15.4 GiB；
- 数据库：Node 内置 SQLite/FTS5；无第三方依赖；
- 命令：`npm run benchmark -- --output benchmarks/results/t005-local-2026-09-15.json`。

脚本在系统临时目录重建数据库，运行后删除数据库，只提交生成器和小型 JSON 结果。固定 seed 与标准查询位于 `benchmarks/long-context.ts`。

## 数据构成

生成 2,100 个约 510 字的场景块，并加入：

- 30 个精确针式事实；
- 5 个 POV 专属误信；
- 5 个作者秘密；
- 5 个未来读者揭示；
- 5 个备选分支污染项；
- 5 个另一作品的同关键词污染项；
- 5 个同义改写目标；
- 1 个依赖开篇记录的派生摘要。

主故事/main 文本共 1,072,358 字符。总记录 2,131，数据库 9,187,328 bytes，批量建库 324.518 ms。

## 指标

| 指标 | 结果 | 首版门槛 | 判定 |
| --- | ---: | ---: | --- |
| 精确词法 Recall | 1.000（45/45） | 1.000 | 通过 |
| 禁止项泄漏 | 0/60 | 0 | 通过 |
| Provenance 错误 | 0 | 0 | 通过 |
| Context p50 | 58.108 ms | ≤ 75 ms | 通过 |
| Context p95 | 66.762 ms | ≤ 100 ms | 通过 |
| Context max | 70.186 ms | 记录，不作硬门槛 | 观察 |
| 平均预算利用率 | 7.85% | 记录 | 说明精确查询无需塞满窗口 |
| 派生失效事务 | 2.866 ms，摘要 stale=true | 正确且 ≤ 25 ms | 通过 |
| 无共享词语义 Recall | 0.000（0/5） | 用于暴露 FTS 边界 | 预期失败 |

门槛是本轮首版工程目标，不是跨硬件 SLA。后续更换 tokenizer、索引或 schema 时复跑并保留结果，不能只保留最好一次。

## 架构含义

1. 百万字原文不应整体塞入长上下文。精确任务平均只用了 7.85% 的 1,200 token 预算，任务感知选择更省、更易审计。
2. 权限过滤不能交给向量相似度或模型。当前零泄漏来自结构化 story/branch/audience/cursor gate；任何新 retriever 只处理允许 ID。
3. 不需要为了百万字规模立即引入独立向量数据库。当前 9.2 MB 单文件和 <100 ms p95 足以保留本地 SQLite 为源与词法 fallback。
4. 需要语义候选能力，但应先定义 embedding adapter、版本化向量和融合评估，再选择本地扩展或外部服务。
5. GraphRAG 不应因“人物关系复杂”直接照搬。此基准没有多跳失败证据；图投影要由独立关系任务证明收益。

## 限制与下一步

这是固定模板生成的合成语料，不代表真实小说的词汇漂移、隐喻、指代、伏笔和章节重写分布。测试没有真实模型 tokenizer、embedding 成本、冷启动/多次运行分布、并发写入和自然语料人工标注。

T006 将保留本基准，增加 policy-gated hybrid retriever 接口、版本化 embedding 缓存和语义失败题；比较 FTS only 与 hybrid 的 Recall/延迟/体积。真实云 embedding 的正文外发必须遵守 Q012。

关联：[原始结果](../../benchmarks/results/t005-local-2026-09-15.json) · [ADR-011](../../adr/ADR-011-local-storage-retrieval.md) · [ADR-013](../../adr/ADR-013-policy-gated-hybrid-retrieval.md) · [Context 研究](../research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md)
