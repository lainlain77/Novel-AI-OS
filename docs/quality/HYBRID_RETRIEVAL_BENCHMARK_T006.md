# T006 Policy-gated Hybrid Retriever 基准

Status: interface_and_fixture_baseline_completed
Updated: 2026-09-15
Data seed: `novel-ai-os-t006-v1`

## 结论

T006 已实现 Retriever Adapter、Embedding Provider、版本化 embedding cache、Reciprocal Rank Fusion、词法失败降级和带通道/分数/模型/hash 的 Context provenance。所有 retriever 的输入都是 ADR-010 已过滤的记录集合。

在 1,073,770 个主故事字符、2,162 条总记录、30 个无词面重合语义题上：FTS Recall@16=0，fixture embedding 与 hybrid 均为 1.0、MRR=1.0；hybrid 同时保持 30/30 精确查询。安全检查的泄漏、来源错误和解释缺失均为 0。

这证明接口顺序、缓存、融合、fallback 和评估流程可执行，不证明生产语义模型已经选定。当前 `FixtureConceptEmbeddingProvider` 是固定同义概念映射，只用于回归数学与安全边界，不能被宣传为通用小说 embedding。

## 实现边界

- `NovelStore.listEligibleRecords` 是唯一 hard gate 入口；
- `SqliteFtsRetriever` 只在允许 ID 中返回词法候选；
- `EmbeddingRetriever` 只为允许记录生成/读取向量；
- cache key 包含 record ID、provider/model ID 和内容 SHA-256，保存维度与 source revision；
- 模型版本变化产生独立 cache，不静默复用旧向量；
- `HybridRetriever` 使用 RRF 合并成功通道；embedding 故障时 FTS 继续工作；
- Context section 保存 fused score、channel rank、model ID 和 content hash；
- 相似度只解释“为何被选中”，不代表内容为真或可写 Canon。

## 可复现环境

- 时间：2026-09-15（Asia/Shanghai）；
- Node.js v24.16.0，Windows x64；
- AMD Ryzen 7 4800H，16 logical CPUs，15.4 GiB memory；
- Node 内置 SQLite/FTS5，零第三方运行依赖；
- 命令：`npm run benchmark:hybrid -- --output benchmarks/results/t006-local-2026-09-15.json`。

## 结果

建库：FTS/记录 298.737 ms；fixture embedding cache 2,100 项，构建 84.291 ms。数据库从 9,158,656 增至 9,687,040 bytes，增加 528,384 bytes（约 5.77%）。

| 策略/任务 | Recall@16 | MRR | p50 | p95 | max |
| --- | ---: | ---: | ---: | ---: | ---: |
| FTS / 无共享词语义 | 0.000 | 0.000 | 55.540 ms | 59.646 ms | 60.711 ms |
| fixture embedding / 语义 | 1.000 | 1.000 | 60.269 ms | 65.588 ms | 79.822 ms |
| hybrid / 语义 | 1.000 | 1.000 | 60.389 ms | 63.737 ms | 66.892 ms |
| FTS / 精确 | 1.000 | 1.000 | 55.935 ms | 58.338 ms | 63.999 ms |
| hybrid / 精确 | 1.000 | 1.000 | 60.356 ms | 63.929 ms | 66.048 ms |

内容 hash 缓存优化前 hybrid p95 约 121 ms；缓存后约 64 ms。这说明百万字上下文不应在每次查询重新哈希全文。正式实现仍需测量冷启动、增量改稿和真实高维向量的成本。

## 自动回归

T006 新增 4 项测试：

1. spy embedding provider 实际接收的 corpus 不含作者秘密、世界真相、他人 Knowledge、未来记录、其他作品或分支；
2. hybrid 能召回无词面重合的 fixture 同义事实，并输出 channel/model/hash；
3. 相同内容和模型命中 cache，模型版本变化生成独立 cache；
4. embedding 离线时词法通道继续返回结果。

连同 T003/T004 共 18/18 项测试通过。

## 不应照搬的方法

- 不对全库先做向量检索再事后删除秘密；provider 根本不应看到禁区内容。
- 不因百万字规模默认部署独立向量数据库；当前 cache 增量很小，先测真实向量后决定。
- 不把 embedding 相似度当事实置信度、人物知识或 Canon 状态。
- 不用 GraphRAG 替换全部检索；它需要独立多跳关系失败集。
- 不让模型或 Agent 自行把检索结果写入 memory/Canon；仍走 Proposal transaction。
- 不用 fixture provider 的 100% 结果宣传生产语义质量。

## 下一步

T007 负责生产候选：审计本地 embedding 模型的许可证、体积、中文长文本能力和运行依赖，选择固定版本；同时建立真实小说片段或许可语料的人工相关性集。只有这两项完成后，才能比较真实 semantic quality 和云/本地成本。

关联：[原始结果](../../benchmarks/results/t006-local-2026-09-15.json) · [T005](LONG_CONTEXT_BENCHMARK_T005.md) · [ADR-013](../../adr/ADR-013-policy-gated-hybrid-retrieval.md) · [实现](../../src/retrieval.ts)
