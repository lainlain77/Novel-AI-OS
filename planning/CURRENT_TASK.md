# Current Task

Updated: 2026-09-15
Task-ID: T006
Status: ready
Title: Policy-gated Hybrid Retriever 与语义回归

## 接手点

T005 已用固定 seed 生成 1,072,358 字符、2,131 记录的长篇基准。45/45 精确词法查询通过，60 次禁止项零泄漏，p95 66.762 ms；5 个无共享词同义查询 0/5，证明 FTS5 不能单独承担语义召回。详见 [报告](../docs/quality/LONG_CONTEXT_BENCHMARK_T005.md) 与 ADR-013。

## 目标与范围

实现 Retriever Adapter 与可解释混合融合，在 ADR-010 允许集合内组合 FTS 和 embedding 候选。首轮对比本地可运行方案，记录内容 hash、embedding 模型版本、维度、构建/查询成本和失效；不默认引入独立向量数据库或 GraphRAG。

## 可立即执行的步骤

1. 把 NovelStore 的 eligible records 与候选检索接口分离，保持 hard gate 的单一入口。
2. 定义 LexicalRetriever、EmbeddingRetriever、FusionResult 与每通道 provenance/score。
3. 选择一个可固定版本的本地 embedding 基线；若需云服务，先完成接口和脱敏/授权路径，再按 Q012 接入。
4. 扩充 T005 的同义、隐喻、别名、跨章节指代失败集，至少 30 条语义题。
5. 比较 FTS only、embedding only、hybrid 的 Recall@k、MRR、p50/p95、索引体积与构建时间；所有方案必须保持零泄漏。
6. 实现内容 hash 与模型版本驱动的向量失效/重建，避免旧 embedding 静默复用。

## 完成标准

- 新 retriever 看不到 story/branch/audience/cursor gate 之外的记录；
- FTS fallback 保持可用，离线或 embedding 失败不破坏精确查询；
- 语义失败集相对 FTS 有明确、可复现的提升；
- score、通道、模型版本与来源可在 Context Inspector 中解释；
- 成本与隐私边界记录清楚，不把相似度当 Canon 置信度；
- 测试、基准、项目记忆和 GitHub 同步通过。

## 停止条件

若本地 embedding 依赖过重或许可证/供应链不清楚，先保留 adapter、fixture 与比较协议，不下载不明模型。云 embedding 必须由单次任务 grant 控制正文外发；GraphRAG 继续等待多跳关系失败证据。
