# 已确定决定

Updated: 2026-09-09

accepted 表示设计方向有来源，并不表示已有软件实现。主依据为 [SRC-001 当前用户要求](memory/SOURCE_REGISTER.md)，辅以已核实仓库 SRC-003。下表是索引；完整理由与替代项见 ADR。

| ID | 已确定内容 | 理由 | 记录 |
| --- | --- | --- | --- |
| D000 | 仓库保存可持续接手的项目记忆 | 聊天不可作为唯一上下文；决定、原因、未决项和下一步需共同保留 | [ADR-000](adr/ADR-000-project-memory.md) |
| P1 | 统一通用 Story Kernel | 混合题材共享对象及变化表达 | [ADR-001](adr/ADR-001-universal-kernel.md) |
| P2 | 平台规则在外围 Publishing Layer | 发布平台变化不应重塑故事核心 | [ADR-002](adr/ADR-002-platform-independent.md) |
| P3 | 题材不作为底层划分 | 题材可以交叉，不能依赖互斥数据模型 | [ADR-003](adr/ADR-003-genre-not-architecture.md) |
| P4 | Capability 可组合、叠加、局部启用 | 无限流中的爱情线需要多个能力同时工作 | [ADR-004](adr/ADR-004-composable-capabilities.md) |
| P5 | Library 与 Story Canon 隔离 | 小说内经历不能污染可复用素材原版 | [ADR-006](adr/ADR-006-library-instance-separation.md) |
| P6 | 作者控制 Canon，AI 不静默修改 | 建议和推理不能自行成为故事正式事实 | [ADR-005](adr/ADR-005-canon-control.md) |

以下不在已确定清单：具体数据库、RAG/Graph RAG/长上下文/混合方案、模型或供应商、Kernel 字段 schema、事件溯源、分支合并算法、界面框架、Blueprint 详细语义、记忆层实现。[ADR-007](adr/ADR-007-blueprint-derivation.md) 与 [ADR-008](adr/ADR-008-memory-first-architecture.md) 为 proposed。

不得无理由反复重开已确定方向；新证据、明确冲突或作者修改目标时允许提出替代，保留旧记录及关系。当前六项原则没有被本轮细化提案改变。
