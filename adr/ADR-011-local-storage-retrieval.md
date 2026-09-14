# ADR-011: 首版采用本地 SQLite 与 FTS5 检索基线

Status: accepted
Recorded: 2026-09-14
Sources: SRC-005, SRC-007
Decision authority: 用户授权本轮决定首个实现基线
Supersedes: none

## 背景

首个纵向切片需要版本、事务、结构化过滤、全文检索和可携带本地数据。向量库、图数据库、分布式服务或 Agent 框架会增加部署和调试面，但尚无 V5 失败样本证明这些复杂度必要。

## 选项

候选包括关系数据库加全文检索、独立向量库、图数据库和分布式服务组合。当前没有长篇失败集证明后三项的额外部署与一致性成本必要。

## 决定或提案

首版用 TypeScript 模块化单体和 Node 内置 SQLite/FTS5。SQLite 保存结构化源记录、提案和依赖；FTS5 提供词法候选。Model Adapter、向量索引、图投影、对象存储和同步都保持可替换边界，按评估增量加入。

## 理由

SQLite 同时支持事务、索引、全文检索和单文件恢复，足以先验证最重要的隔离与 Canon 不变量。零第三方运行依赖减少供应链和启动成本，也便于固定 fixture 回归。

## 后果与未采用项

FTS5 对同义、隐喻和远距离关系召回有限，当前字符 token 估算也不能代替具体模型 tokenizer。长篇性能、语义召回、并发和云同步必须另测。向量和图不是禁用项；它们需要用失败集和收益证明引入。

## 未决事项与重审条件

T003 在内存 SQLite 上完成 10 个测试。T005 在 1,072,358 字符合成长篇上测得精确 Recall 1.0、泄漏 0、p95 66.762 ms，同时无共享词语义 Recall 为 0。SQLite/FTS5 保留为源与词法 fallback；语义扩展由 ADR-013 决定。若后续体积、并发或自然语料失败，再更新本决定的适用范围。

## 关联

[实现记录](../docs/technical/VERTICAL_SLICE_T003.md) · [实现边界](../docs/technical/IMPLEMENTATION_BOUNDARIES.md) · [Context 研究](../docs/research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md)
