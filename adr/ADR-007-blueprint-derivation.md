# ADR-007: Blueprint 与派生关系

Status: proposed
Recorded: 2026-09-09
Sources: SRC-002, SRC-004
Decision authority: 本轮设计提案，尚无作者批准
Supersedes: none

## 背景

摘要提到要建立 Blueprint derivation ADR，却未提供完整设计。不能把名称出现等同于方案已批准。

## 选项

素材快照复制并记录来源；固定版本引用加实例覆盖；共享可变继承。第三项若自动反向污染原版则违反 P5。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

提议 Blueprint 表示可复用描述/约束，Instance 固定一个来源版本，Derivation 记录派生关系；具体复制/引用方式尚待比较。

## 理由

保留来源可以解释实例如何产生，同时通过作用域隔离保护原版。此段为本轮设计分析，不是历史定案。

## 后果与未采用项

可能增加版本和冲突处理复杂度。不得默认原版升级会修改已存在故事，不得把血人示例转成强制命名规范。

## 未决事项与重审条件

Q006：用双故事、原版升级、再导出三个用例比较候选；记录格式和迁移影响后由作者接受设计，才可改为 accepted。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-creative-library.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
