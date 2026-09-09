# 架构起点与边界

Recorded: 2026-09-09
Sources: SRC-001, SRC-002, SRC-003
Coverage: partial_history

## 问题与背景

如何使世界构建、故事规划、长篇连续性和创作知识管理使用共同的基础？可见历史摘要将目标称为“小说 AI 创作操作系统”。原仓库明确列出八类 Kernel 对象和平台外围原则。

## 已有决定与理由

通用 Kernel、题材非底层、平台无关已由用户再次明确。题材混合会使按题材拆分的模型难以组合；平台发布要求属于外部环境。以上理由依据摘要和原原则整理，不能视为完整历史逐字复原。

## 本轮替代方案分析

按平台/题材分叉底层会让同一故事对象需要不同表示，不符合 P1–P3；以通用对象为基础、能力扩展为上层符合已有约束。平台独立不意味着永远禁止发布适配，而是适配不能进入 Kernel 语义。

## 当前结论与影响

accepted 方向见 [ADR-001](../../adr/ADR-001-universal-kernel.md)、[ADR-002](../../adr/ADR-002-platform-independent.md)、[ADR-003](../../adr/ADR-003-genre-not-architecture.md)。八类对象名称有历史依据，字段和服务边界仍需验证。

未决：Q007 技术实现、Q009 作者工作流。下一步用 [验收案例](../../docs/architecture/ACCEPTANCE_SCENARIOS.md) 检查 [Kernel 草案](../../docs/kernel/STORY_KERNEL.md)，不按题材新增独立底层。
