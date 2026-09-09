# ADR 索引

ADR 状态表示决策权威，不表示代码完成。accepted 要有作者确认依据；本轮 ADR-000–006 记录用户已明确的目标和原则，替代项比较与影响说明含本轮整理。ADR-007/008 是新增提案。

| ADR | 状态 | 内容 |
| --- | --- | --- |
| [ADR-000](ADR-000-project-memory.md) | accepted | 仓库作为可持续接手的项目记忆 |
| [ADR-001](ADR-001-universal-kernel.md) | accepted | 通用 Story Kernel |
| [ADR-002](ADR-002-platform-independent.md) | accepted | 平台无关 |
| [ADR-003](ADR-003-genre-not-architecture.md) | accepted | 题材不作为底层架构 |
| [ADR-004](ADR-004-composable-capabilities.md) | accepted | Capability 组合 |
| [ADR-005](ADR-005-canon-control.md) | accepted | 作者控制 Canon |
| [ADR-006](ADR-006-library-instance-separation.md) | accepted | Library 与故事实例隔离 |
| [ADR-007](ADR-007-blueprint-derivation.md) | proposed | Blueprint 与派生关系 |
| [ADR-008](ADR-008-memory-first-architecture.md) | proposed | 项目记忆与运行时记忆边界 |

## 状态维护

proposed → accepted 需要可定位的作者确认及决定内容；accepted → superseded 需要新的替代 ADR 和相互链接；deprecated 记录停止使用的原因。仅改文字、补证据或修链接不必新建 ADR。编号永久保留，不重编号，不把提案放进已确定决定清单。

新增记录包含 Status、Recorded、Sources、Decision authority、Supersedes、背景、选项、决定/提案、理由、后果、未决及关联。来源 ID 见 [登记](../memory/SOURCE_REGISTER.md)。状态同步 [Manifest](../CONTEXT_MANIFEST.yaml) 与 [已确定决定](../SETTLED_DECISIONS.md)。
