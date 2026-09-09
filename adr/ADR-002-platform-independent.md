# ADR-002: 平台无关

Status: accepted
Recorded: 2026-09-09
Sources: SRC-001, SRC-003
Decision authority: SRC-001 用户确认的方向；不含实现批准
Supersedes: none

## 背景

原原则要求发布平台规则属于外围 Publishing Layer，不进入核心创作架构。

## 选项

在 Kernel 内加入番茄/起点专属约束；通过外围发布适配消费故事内容。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

核心故事表达与发布平台独立；若未来需要平台适配，在外围处理，不反向约束核心。

## 理由

发布环境可能变化，同一故事也可能面向多个平台。核心不应依赖某个平台的规则才可成立。

## 后果与未采用项

未来发布层有单独转换/校验责任。平台无关不等于禁止任何平台适配；本轮没有新增发布集成。

## 未决事项与重审条件

Q007 技术边界、Q009 工作流；具体平台需求未取得，不推测。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-architecture-origin.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
