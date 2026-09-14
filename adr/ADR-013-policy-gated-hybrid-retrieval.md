# ADR-013: 在 Policy Gate 内增加可替换混合检索

Status: accepted
Recorded: 2026-09-15
Sources: SRC-004, SRC-005, SRC-007
Decision authority: 用户授权持续推进实现；T005 百万字实测与既有研究提供证据
Supersedes: none

## 背景

T005 证明 FTS5 在百万字合成长篇上可以满足精确事实召回、延迟和隔离门槛，但没有共同词的同义改写为 0/5。小说任务包含同义、隐喻和跨章节措辞变化，单一词法通道不够。

## 选项

候选包括只保留 FTS、把全部数据交给外部向量库、默认 GraphRAG，以及在确定性允许集合内组合词法和可替换语义候选。第一项已出现可复现失败；中间两项缺少成本与多跳收益证据。

## 决定或提案

Context Engine 增加 Retriever Adapter 和混合融合边界：结构化 Policy Gate 先产生允许记录集合，FTS 与 embedding retriever 只对允许集合取候选，融合层保留各通道分数与来源，再进入预算装配。FTS 继续作为精确通道与离线 fallback。

本 ADR 不指定 embedding 模型、向量数据库或融合算法。首版优先在 SQLite 相邻边界保存版本化向量缓存；只有体积、延迟或并发实测失败才引入独立向量服务。图投影由多跳任务单独决定。

## 理由

这一选择直接修复已测得的语义缺口，同时保留 ADR-010 的安全不变量和 ADR-011 的本地简单性。adapter 边界允许替换本地/云 embedding，并把模型版本、维度、内容 hash 与 policy fingerprint 纳入 provenance。

## 后果与未采用项

系统需要 embedding 缓存失效、重建、版本迁移和额外评估；混合分数不能伪装成事实置信度。禁止先对全库向量搜索再事后过滤敏感内容。暂不采用默认外部向量数据库或 GraphRAG 全量复制。

## 未决事项与重审条件

T006 比较 FTS only、local hybrid 和可选 cloud embedding 的 Recall、p95、体积、构建成本与泄漏。若真实语料没有语义收益，adapter 可以关闭；若 SQLite 邻接向量无法满足规模门槛，再用新 ADR 决定存储。Q012 决定正文是否可发云服务。

## 关联

[T005 报告](../docs/quality/LONG_CONTEXT_BENCHMARK_T005.md) · [ADR-010](ADR-010-knowledge-gate.md) · [ADR-011](ADR-011-local-storage-retrieval.md) · [Context 研究](../docs/research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md)
