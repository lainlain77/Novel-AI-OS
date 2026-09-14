# ADR-012: Model Adapter 没有 Canon 写权限

Status: accepted
Recorded: 2026-09-14
Sources: SRC-001, SRC-005, SRC-007
Decision authority: 用户授权继续推进实现；P6 与 T004 运行证据约束模型边界
Supersedes: none

## 背景

系统需要支持不同云模型、本地模型和测试替身，同时不能让供应商 SDK、模型工具调用或自由文本输出绕过 Context Policy 与作者确认。

## 选项

候选包括让模型直接调用数据库工具、让 adapter 持有应用服务，以及只给 adapter 已过滤的 Context Packet 并限制结构化输出。前两项把权限和供应商实现耦合，难以证明 P6。

## 决定或提案

ModelAdapter 只接收 Context Packet、创作意图、输出类型和取消信号，只返回 Draft 或 ProposalSuggestion 与模型元数据。它不持有 NovelStore，不执行 Canon 写入。应用服务负责把 suggestion 包装成 ChangeProposal，作者确认后才进入 ADR-009 的事务。

## 理由

模型替换不应改变数据权限。把不可信生成与确定性状态机分开，能统一 fake、本地和云模型，也便于记录输入 manifest、token usage、错误和来源。

## 后果与未采用项

供应商特有工具调用必须转换为受限 suggestion，不能直接暴露数据库。流程多一步 proposal 审阅，但这正是作者控制 Canon 所需。真实模型接入还需 Q012 的外发、日志、缓存和密钥策略。

## 未决事项与重审条件

流式输出、重试、取消、模型路由和结构化输出校验需要在真实 adapter 中补充。无论供应商如何变化，不应移除 Context Packet 输入边界和无 Canon 写权限；若需自动化批处理，作者应批准明确范围的 proposal policy，而不是授予模型数据库权限。

## 关联

[T004 实现](../docs/technical/WORKBENCH_T004.md) · [ADR-009](ADR-009-canon-transaction.md) · [ADR-010](ADR-010-knowledge-gate.md) · [AI 工作流](../docs/ai/AI_WORKFLOW.md)
