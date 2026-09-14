# ADR 索引

ADR 状态表示决策权威，不表示完整产品完成。accepted 要有作者确认或明确授权依据；ADR-008–011 依据用户授权的实现基线和 T003 运行证据定案。ADR-007 仍是提案。

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
| [ADR-008](ADR-008-memory-first-architecture.md) | accepted | 项目记忆与运行时记忆边界 |
| [ADR-009](ADR-009-canon-transaction.md) | accepted | Canon 提案的修订绑定与原子事务 |
| [ADR-010](ADR-010-knowledge-gate.md) | accepted | 知识与秘密硬过滤先于检索排序 |
| [ADR-011](ADR-011-local-storage-retrieval.md) | accepted | 本地 SQLite 与 FTS5 首版基线 |

## 状态维护

proposed → accepted 需要可定位的作者确认及决定内容；accepted → superseded 需要新的替代 ADR 和相互链接；deprecated 记录停止使用的原因。仅改文字、补证据或修链接不必新建 ADR。编号永久保留，不重编号，不把提案放进已确定决定清单。

新增记录包含 Status、Recorded、Sources、Decision authority、Supersedes、背景、选项、决定/提案、理由、后果、未决及关联。来源 ID 见 [登记](../memory/SOURCE_REGISTER.md)。状态同步 [Manifest](../CONTEXT_MANIFEST.yaml) 与 [已确定决定](../SETTLED_DECISIONS.md)。
