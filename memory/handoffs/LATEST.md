# Latest Handoff

Updated: 2026-09-15
Completed-task: T005
Next-task: T006
Target: lainlain77/Novel-AI-OS / main
Starting-baseline: 197cd85117ffe3cdadd585963f1aa1304cf8207d

## 本轮结果

T005 新增 `benchmarks/long-context.ts`，固定 seed 生成百万字合成长篇并在系统临时目录运行 SQLite/FTS5 基准。原始小型结果保存于 `benchmarks/results/t005-local-2026-09-15.json`，详细解释见 [基准报告](../../docs/quality/LONG_CONTEXT_BENCHMARK_T005.md)。

最终数据：主故事 1,072,358 字符，总记录 2,131，数据库 9,187,328 bytes，建库 324.518 ms。45 个精确必须命中用例 Recall=1.0；60 次跨作品、跨分支、人物知识、作者秘密和未来信息检查泄漏为 0；provenance 错误 0。70 次 Context 编译 p50 58.108 ms、p95 66.762 ms、最大 70.186 ms。依赖摘要失效事务 2.866 ms。

5 个没有共同词的同义改写查询 Recall=0。该失败被保留为 T006 回归证据，不能用精确查询 100% 掩盖。基于这一结果与 Context 研究，新增 accepted ADR-013：Policy Gate 先生成允许集合，再在集合内组合 FTS 和可替换 embedding 候选；暂不指定向量库、模型或 GraphRAG。

## 限制

数据是固定模板合成语料，尚未覆盖真实小说的隐喻、指代、伏笔、改稿分布和人工相关性标注。没有真实 tokenizer、embedding 成本、冷启动分布、并发或云隐私测试。当前结果是本机基线，不是跨硬件 SLA。

## 下一步

执行 [T006](../../planning/CURRENT_TASK.md)：分离 eligible set 与 Retriever Adapter，增加版本化 embedding cache 和可解释融合；把语义题扩到至少 30 条，对比 FTS/embedding/hybrid 的 Recall@k、MRR、p95、体积和构建成本，同时保持零泄漏。

## 恢复与核验

运行 `npm run benchmark -- --output benchmarks/results/t005-local-2026-09-15.json` 可重建结果；运行 `npm run validate` 检查资料和 14 项回归。任何新 retriever 都不能看到 ADR-010 gate 外的记录。先比较远端 main 与起始基线，避免覆盖并行修改。
