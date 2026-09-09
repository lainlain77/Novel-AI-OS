# ADR-004: Capability 组合

Status: accepted
Recorded: 2026-09-09
Sources: SRC-001, SRC-002, SRC-003
Decision authority: SRC-001 用户确认的方向；不含实现批准
Supersedes: none

## 背景

原原则允许能力组合、叠加和局部启用；摘要以循环场景和关系/情感线并存为例。

## 选项

每次只选择一个能力；每种混合题材新增系统；在共同 Kernel 上组合能力。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

采用可组合、可叠加、可局部启用的 Capability。组合必须服从 Kernel、隔离和 Canon 控制原则。

## 理由

避免为每个能力组合建立专用底层，让能力在同一对象上协作。

## 后果与未采用项

组合可能发生规则冲突，需要可见的验证结果；可组合不意味着所有能力天然兼容。依赖声明、优先级和冲突机制尚未定案。

## 未决事项与重审条件

Q003：Reset 与关系/记忆保留的冲突怎样表达并经作者选择。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-genre-capability.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
