# ADR-005: 作者控制 Canon

Status: accepted
Recorded: 2026-09-09
Sources: SRC-001, SRC-003
Decision authority: SRC-001 用户确认的方向；不含实现批准
Supersedes: none

## 背景

AI 会生成建议、推理、摘要和候选故事内容。它们不一定准确，也不必符合作者最终意图。

## 选项

生成或检索即写入 Canon；作者审阅明确变更后确认。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

AI 不静默修改 Canon，正式事实由作者确认。读取、建议、验证、确认和应用需要在工作中可区分。

## 理由

作者必须知道哪些事实发生变化，能够拒绝建议；不能让模型推断在未察觉时成为后续创作依据。

## 后果与未采用项

需要提供清楚的变更和来源。实现时还须处理过时批准、分支及失败回滚；本 ADR 不选定存储或事务机制。

## 未决事项与重审条件

Q004 Canon 版本与批准、Q005 知识范围、Q008 工作流。具体审批 UI 不在此冻结。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-ai-handoff.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
