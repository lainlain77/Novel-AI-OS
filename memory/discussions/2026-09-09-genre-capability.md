# 无限流加入爱情：题材与能力

Recorded: 2026-09-09
Sources: SRC-001, SRC-002, SRC-003
Coverage: partial_history

## 问题与已有材料

可见助手摘要引用过“无限流加入爱情怎么办”的讨论。这里记录的是摘要中的案例，未取得该问题所在的原始完整回合。当前用户直接确认题材非底层和 Capability 组合。

摘要用 Scenario / Reset / Reward 表示无限流相关能力，用 Relationship / Emotion / Choice 表示爱情相关能力。它们是例子，不是最终模块清单。

## 替代与理由

历史摘要不支持每个题材各造一套系统，因为混合时边界会冲突。本轮进一步分析：将 Genre 作为能力集合的标签/预设，可以让场景循环和关系变化共同作用于 Entity、State、Relation、Event 等对象。

## 当前结论

P3/P4 accepted；Genre 不必与单个 Capability 一一对应。能力可组合、叠加、局部启用；具体依赖、命名空间和冲突处理仍 proposed，不能假设“可组合”意味着任何组合都无条件兼容。

见 [ADR-003](../../adr/ADR-003-genre-not-architecture.md)、[ADR-004](../../adr/ADR-004-composable-capabilities.md)。

## 本轮发现的未决项

一次 Reset 是否重置双方关系、角色记忆或仅重置物理状态？若两项能力规则冲突，应展示冲突并由作者确定适用范围，不能静默覆盖。Q003 负责该协议，Q005 负责知识边界。

影响：使用 [Capability 草案](../../docs/capability/CAPABILITY_SYSTEM.md) 和 S1 验收用例继续；不得把上述 Reset 行为写为历史定案。
