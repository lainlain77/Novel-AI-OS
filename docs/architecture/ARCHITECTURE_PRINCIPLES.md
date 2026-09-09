# Architecture Principles

Updated: 2026-09-09
Status: accepted_principles
Sources: SRC-001, SRC-003；P5 另有 SRC-002 摘要佐证。

本页是六项原则的检查入口，理由与证据见 [已确定决定](../../SETTLED_DECISIONS.md)。以下原有五条保留，P5 隔离由当前用户明确要求补入。对象字段和模块实现不在此冻结。

## 1. Universal Kernel

Principle: P1 · [ADR-001](../../adr/ADR-001-universal-kernel.md)

所有故事必须使用统一底层表达。

核心对象：
- Entity
- Rule
- State
- Relation
- Event
- Knowledge
- Derivation
- Provenance

## 2. Genre Independent

Principle: P3 · [ADR-003](../../adr/ADR-003-genre-not-architecture.md)

题材不是数据库结构。

修仙、推理、恐怖、无限流、灾难等题材特征通过 Capability 表达。题材可以组织多个能力，能力也可以跨题材复用，不要求一一对应。

## 3. Platform Independent

Principle: P2 · [ADR-002](../../adr/ADR-002-platform-independent.md)

发布平台规则属于外围 Publishing Layer。

不进入核心创作架构。

## 4. Composable Capability

Principle: P4 · [ADR-004](../../adr/ADR-004-composable-capabilities.md)

能力可以组合、叠加、局部启用。

## 5. Author Controls Canon

Principle: P6 · [ADR-005](../../adr/ADR-005-canon-control.md)

AI 提供建议、推理、分析。

最终事实由作者确认。

AI 不静默修改 Canon。草稿、计划、推断、检索和摘要不能自动成为已确认事实。

## 6. Library / Canon Isolation

Principle: P5 · [ADR-006](../../adr/ADR-006-library-instance-separation.md)

Library 原版与具体故事实例及 Canon 隔离。实例经历不自动回写原版或其他故事；保留来源关系不等于授予反向修改权限。

## 修改前的冲突检查

每轮按 P1–P6 检查方案，并在 [审计日志](../quality/AUDIT_LOG.md) 记录结果。出现冲突时先说明触及哪条原则及影响，不能静默改写已确定方向。[协作协议](../../AI_COLLABORATION_PROTOCOL.md) 定义重审流程。
