# ADR-010: 知识与秘密硬过滤先于上下文排序

Status: accepted
Recorded: 2026-09-14
Sources: SRC-001, SRC-005, SRC-007
Decision authority: 用户授权本轮整理并决定实现基线；S5 与 Context 研究提供约束
Supersedes: none

## 背景

世界事实、人物所知、读者已见内容和作者秘密不是同一类真相。相关性检索若先接触全局内容，再要求模型忽略禁区，会造成跨书污染、人物全知和未来信息泄漏。

## 选项

候选包括仅用提示词约束模型、检索后过滤，以及检索前生成确定性允许集合。前两项会让禁止内容先进入共享检索或模型上下文。

## 决定或提案

TaskContract 必须声明 story、branch、base revision、narrative cursor、audience、POV 和秘密授权。Context Engine 先按这些字段生成允许集合，再做检索、排序、预算和压缩。被过滤记录不能由摘要、缓存、reranker 或模型恢复。

首版人物上下文只允许 public 记录及该人物自己的 Knowledge；读者上下文只允许 public/reader 且不晚于 cursor；作者秘密需要作者任务的显式 grant。世界事实不会自动等于人物常识。

## 理由

权限和叙事知识边界属于正确性条件，不是相关性偏好。确定性硬门比提示词约束可测试、可审计，也能让 Context Inspector 解释每条内容为何进入。

## 后果与未采用项

记录需要显式 visibility、sensitivity、knower、叙事位置和来源。标注缺失时采取保守拒绝，可能降低召回；产品需要为作者提供清楚的标注和诊断入口。复杂的读者“可推断知识”继续作为带置信度的派生记录，不能伪装为确定事实。

## 未决事项与重审条件

T003 的两作品、两分支、误信、秘密和未来揭示用例全部通过。大规模导入的自动标注和推断泄漏仍在 Q005/Q011；若增加新受众类型，应扩展 policy，而不是绕开 gate。

## 关联

[实现记录](../docs/technical/VERTICAL_SLICE_T003.md) · [Context 研究](../docs/research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md) · [核心契约](../docs/architecture/CORE_CONTRACTS.md)
