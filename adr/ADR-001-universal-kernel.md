# ADR-001: 通用 Story Kernel

Status: accepted
Recorded: 2026-09-09
Sources: SRC-001, SRC-003
Decision authority: SRC-001 用户确认的方向；不含实现批准
Supersedes: none

## 背景

故事会同时包含人物、规则、事件和知识变化，需要跨题材表达。原架构列出 Entity、Rule、State、Relation、Event、Knowledge、Derivation、Provenance。

## 选项

各题材独立底层；所有内容只用无结构文本；通用对象配合上层能力。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

所有题材使用统一 Kernel 表达；沿用八类核心概念。详细字段、存储和对象约束仍为草案。

## 理由

通用基础使同一故事的多种题材能力可协作，避免同一对象在各模块中互不兼容。

## 后果与未采用项

具体能力需映射到共同语义；抽象过大可能难以使用，应通过少量代表场景验证。无结构文本仍可保存原文，但不能替代必要的状态/来源边界。

## 未决事项与重审条件

Q003 组合契约、Q007 实现边界；八类名称存在不等于 schema 已冻结。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-architecture-origin.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
