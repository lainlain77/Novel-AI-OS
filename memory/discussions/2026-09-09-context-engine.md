# 长篇小说 Context Engine

Recorded: 2026-09-09
Sources: SRC-002, SRC-003, SRC-004
Coverage: partial_history

## 问题与证据

可见摘要提出百万字小说的上下文如何管理，候选有 Long Context、RAG、Graph RAG、Hybrid。原 Manifest 写过 context_engine_research in_progress，但基线无研究文档、实验或测量数据。现在保存问题，不能把旧状态当作已完成研究的证据。

## 本轮候选比较框架

长上下文、检索、关系扩展和混合方案均需用相同任务对比：是否找全必要事实、是否误取其他故事/分支内容、是否泄漏角色尚未知信息、能否保留来源、消耗多少上下文预算。这里是研究计划，没有声称任何方案性能领先，也没有选定模型或供应商。

## 约束与当前状态

检索和摘要不能自行改变 Canon；Library、故事正式事实、草稿和项目记忆需要明确范围。事实冲突应暴露来源和版本，不可靠“看起来合理”合并。这些要求落实 P5/P6；查询字段和模块接口仍 proposed。

## 未决与下一步

Q002 负责检索选型与度量；Q005 负责世界事实/角色知识/读者信息范围；Q008 负责项目记忆与运行时记忆关系。相关提案：[Context Engine](../../docs/context/CONTEXT_ENGINE.md)、[ADR-008](../../adr/ADR-008-memory-first-architecture.md)。

下一步先制作有标准答案的小场景，验证跨故事隔离、错误信念和旧摘要失效，再决定是否需要更大规模实验。不得把“先试验”写成已实现检索服务。
