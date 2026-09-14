# PROJECT STATE

Updated: 2026-09-14

## 当前目标与阶段

将 Novel-AI-OS 从可接手的架构资料库推进为可实现的 V5 设计基线，并开始首个 Context/Canon 纵向切片。V5 仍是设计标签，不是已发布软件版本。

当前阶段：Architecture Consolidation completed / Executable Contract & Vertical Slice ready。

## 已有事实

| 项目 | 当前状态 | 证据 |
| --- | --- | --- |
| GitHub 仓库 | lainlain77/Novel-AI-OS，main；本轮基线 769ba3b | [来源 SRC-008](memory/SOURCE_REGISTER.md) |
| 六项原则 | P1–P6 accepted，未被本轮改变 | [决定](SETTLED_DECISIONS.md) |
| V5 总体设计 | 本体、分层、数据域、流程、技术基线、评估和扩展已形成 proposed baseline | [总体蓝图](docs/architecture/V5_MASTER_BLUEPRINT.md) |
| 核心契约 | StoryRecord、Scope/Timeline、Knowledge、Proposal、Context Packet 及 S1–S6 纸面演练已完成 | [核心契约](docs/architecture/CORE_CONTRACTS.md) |
| Context Engine 研究 | 截止 2026-09-09 的研究报告已入库；首版推荐方案明确，运行评估未执行 | [研究报告](docs/research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md) |
| 七技能融合 | 方法与架构审计 V1.0 已完成；原压缩包文件/hash/脚本复核待 V1.1 | [七技能报告](docs/research/SEVEN_SKILLS_AUDIT_AND_FUSION_V1.md) |
| 作者工作流 | 新建、规划、写作、Canon Inbox、旧章修改、导入、审查、Library、风格和恢复路径已整理 | [作者工作流](docs/product/AUTHOR_WORKFLOWS.md) |
| 首个工程基线 | 本地优先、TypeScript 模块化单体、SQLite + FTS5、内容寻址原文、可替换 Model Adapter | [实现边界](docs/technical/IMPLEMENTATION_BOUNDARIES.md) |
| 创作产品代码 | not_started；仓库仍只有文档和项目记忆检查脚本 | [当前任务](planning/CURRENT_TASK.md) |

## 设计状态边界

- accepted：仓库记忆目标和 P1–P6。
- proposed design baseline：V5 总体蓝图、核心契约、作者工作流及模块规格。
- research completed：Context Engine 外部研究；不等于 V5 性能已经验证。
- reconstructed audit：七技能方法融合；不等于原包逐文件供应链审计。
- recommended implementation baseline：首个纵向切片技术路线；可以用实测证据替换。
- not implemented：数据库、Context Engine、模型调用、UI、Canon transaction、索引和产品测试。

## 尚不能宣称完成

不能宣称应用已开发、百万字性能达标、RAG/长上下文选型已由 V5 实测、七技能原包已逐文件核验、全部历史已恢复、任意 AI 已通过独立接手测试，或所有 proposed 字段已经冻结。

原附件只剩占位记录，GitHub 仓库没有七技能源码。相关会话已恢复更多可见内容，但 SRC-002 的更早分支仍不完整。Q001/Q010/Q013 保留这些限制。

## 当前下一步

执行 [T003](planning/CURRENT_TASK.md)：把核心契约转成 schema、fixture 和最小 Context/Canon 纵向切片。优先验证跨故事隔离、作者秘密、人物误信、过时批准、原子提交和摘要失效，再决定向量、图数据库、多 Agent 或云同步。

全部未决项以 [OPEN_QUESTIONS](planning/OPEN_QUESTIONS.md) 为主记录，路线见 [ROADMAP](planning/ROADMAP.md)。

## 更新规则

每次实质变化同步本文件、CHANGELOG、CURRENT_TASK、LATEST、Manifest 及受影响的 ADR/问题/规格，执行 `node scripts/validate-memory.mjs` 和 P1–P6 审查。只有实际远端提交可访问时才报告“已同步 GitHub”。
