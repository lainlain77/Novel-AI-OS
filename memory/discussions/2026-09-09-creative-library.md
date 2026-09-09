# Library、实例与小说经历

Recorded: 2026-09-09
Sources: SRC-001, SRC-002
Coverage: partial_history

## 问题与历史摘要

复用脑洞进入小说后发生变化，会不会反过来污染原始素材？摘要给出“血人001 → 血人001-A → 血人001-A-01”的示例，并强调小说经历不污染原库。当前用户明确要求 Library 与 Canon 隔离。

这组三段名称是解释例子，不是已确认的全局 ID 语法、版本规则或数据表结构。

## 当前决定与替代分析

隔离原则 accepted，见 [ADR-006](../../adr/ADR-006-library-instance-separation.md)。本轮分析两个实现候选：显式复制并保存来源，或引用固定版本加实例覆盖。两者都可能满足隔离；尚未选型。共享可变对象并自动反向同步不符合 P5。

## 本轮细化提案

素材以某个版本实例化进明确故事范围；实例经历只影响自身。若作者希望把改编提炼回素材库，应作为新的候选版本单独审阅，不能直接覆盖原版。该操作流程与 ID 字段仍是 [Library/Canon 草案](../../docs/library/LIBRARY_CANON.md) 中的 proposed 设计。

## 未决与下一步

Q006：Blueprint 的含义、来源字段、版本和导出规则。原摘要提到“Blueprint derivation”要补 ADR，但没有完整说明。[ADR-007](../../adr/ADR-007-blueprint-derivation.md) 因而为 proposed。

以 S2“同一素材进入两部小说，一部发生变异”验证原版和另一故事均不被修改；不要把隔离误写成从此完全不能保留来源关系。
