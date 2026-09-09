# ADR-006: Library 与故事实例隔离

Status: accepted
Recorded: 2026-09-09
Sources: SRC-001, SRC-002
Decision authority: SRC-001 用户确认的方向；不含实现批准
Supersedes: none

## 背景

摘要中的血人素材进入小说并衍生变化，用户明确要求 Library 与 Canon 隔离。

## 选项

共享可变素材并把故事经历回写；隔离故事实例并保留来源。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

素材原版与具体故事实例/Canon 分离；实例经历不能自动修改原版或其他故事。来源关系可以保留。

## 理由

素材应能被多部小说复用，各故事的发展不应改变其他作品的起点。

## 后果与未采用项

需要明确实例作用域和来源版本。可以提出独立的素材新版本，但是否采用由作者决定，不自动覆盖原版。

## 未决事项与重审条件

Q006 复制或版本引用、Blueprint 和导出机制；示例名称不是已确定 ID 标准。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-creative-library.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
