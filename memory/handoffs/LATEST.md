# Latest Handoff

Updated: 2026-09-23
Completed-task: T007-pilot
Next-task: T007-expansion
Target: lainlain77/Novel-AI-OS / main
Starting-baseline: b5879e06c1fd2a5db4dc88350d8f89a7f3026efd

## 本轮结果\n\nT007 已提交通用评测入口、候选模型许可证说明和本地运行边界。Transformers.js 可加载固定 revision 的中文量化模型；脚本支持本地语料/题集参数、FTS/dense/hybrid、Recall@k、MRR、p95 和向量体积统计。私人正文及衍生题集未进入远端。

T006 实现 `src/retrieval.ts`：RetrieverAdapter、EmbeddingProvider、SqliteFtsRetriever、EmbeddingRetriever、HybridRetriever、HybridContextEngine 和 fixture-only 概念 provider。NovelStore 新增 hard-gated eligible records 入口及 SQLite embedding cache，cache 保存 record/model/content hash/dimensions/source revision。

Hybrid 使用 RRF，Context section 输出 fused score、channel rank、model ID 和 content hash。所有语义 provider 只接收 gate 后的记录；embedding 通道失败时 FTS 继续工作。内容 hash 在内存缓存，避免每次查询重新哈希百万字全文。

T006 基准 seed `novel-ai-os-t006-v1`：1,073,770 个主故事字符、2,162 条记录、30 个语义题。FTS 语义 0/30；fixture embedding 与 hybrid 30/30、MRR=1；FTS/hybrid 精确题均 30/30。hybrid p95 63.737 ms，泄漏/来源错误/解释缺失均为 0。缓存 2,100 项，数据库增加 528,384 bytes。详细见 [报告](../../docs/quality/HYBRID_RETRIEVAL_BENCHMARK_T006.md)。

新增 4 项测试，总计 18/18 通过。工作台 Context Inspector 已能显示 retrieval channel/model/rank 元数据。

## 运行时适配器\n\n`LocalTransformersEmbeddingProvider` 已接入 `EmbeddingProvider` 契约：固定 revision/hash、禁用远程加载、批处理、归一化 CLS pooling 和维度校验。21 项本地测试通过；真实作者工作台仍保持 fake adapter 默认值。\n\n## 限制\n\n当前 pilot 只用于验证运行链路，不关闭生产语义评估；真实模型选择、人工标注覆盖、Policy Gate 泄漏和多次运行仍待扩充。

FixtureConceptEmbeddingProvider 是固定概念映射测试替身，不是生产语义模型。30/30 只证明接口、policy order、cache、融合与回归计算。没有下载外部模型；没有真实小说人工相关性集、模型许可证/hash、真实高维向量成本或云正文外发测试。

## 下一步\n\n扩充不含私人正文的可授权语料协议和人工答案，补充 access policy/secret leakage 回归，再进行完整规模评测。

执行 [T007](../../planning/CURRENT_TASK.md)：审计许可证清楚的中文/多语 embedding 候选，固定版本与 hash；使用用户自有或明确许可的小说式语料建立人工答案，复跑质量、延迟、体积和失效。没有许可清楚的模型/语料时不下载不明文件，也不把正文发送云端。

## 恢复与核验

运行 `npm run validate` 检查结构与 18 项测试；运行 `npm run benchmark:hybrid -- --output benchmarks/results/t006-local-2026-09-15.json` 重建 T006 结果。任何 provider 都必须只接收 `listEligibleRecords` 的结果。
