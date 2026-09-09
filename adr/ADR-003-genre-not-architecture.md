# ADR-003: 题材不作为底层架构

Status: accepted
Recorded: 2026-09-09
Sources: SRC-001, SRC-002, SRC-003
Decision authority: SRC-001 用户确认的方向；不含实现批准
Supersedes: none

## 背景

无限流加入爱情的摘要案例说明题材会重叠。原原则明确题材不是数据库结构。

## 选项

题材互斥地选择底层；题材作为组织标签或能力预设，在统一 Kernel 上表达。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

Genre 不决定独立底层。题材特征通过可组合能力表达。旧文档中“Genre = Capability”是层级说明，不冻结一题材对应一个能力。

## 理由

多个题材可以在同一故事甚至同一场景出现，互斥底层将把自然的叙事组合变成迁移问题。

## 后果与未采用项

需要持续核对能力是否偷偷形成独立的故事事实系统。题材标签仍可用于组织、筛选或预设。

## 未决事项与重审条件

Q003 能力组合协议；题材预设清单未定。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-genre-capability.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
