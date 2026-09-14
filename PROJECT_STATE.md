# PROJECT STATE

Updated: 2026-09-14

## 当前目标与阶段

将 Novel-AI-OS 从可接手的架构资料库推进为可运行的 V5 最小产品。首个 Context/Canon 核心切片已经完成，下一步连接 Model Adapter 与作者工作台。V5 仍是设计标签，不是已发布软件版本。

当前阶段：Architecture Consolidation completed / Context-Canon Core implemented / Author Workflow Slice ready。

## 已有事实

| 项目 | 当前状态 | 证据 |
| --- | --- | --- |
| GitHub 仓库 | lainlain77/Novel-AI-OS，main；T003 发布提交在本轮结束时记录 | [来源 SRC-008](memory/SOURCE_REGISTER.md) |
| 六项原则 | P1–P6 accepted，未被本轮改变 | [决定](SETTLED_DECISIONS.md) |
| V5 总体设计 | 本体、分层、数据域、流程、技术基线、评估和扩展已形成 proposed baseline | [总体蓝图](docs/architecture/V5_MASTER_BLUEPRINT.md) |
| 核心契约 | StoryRecord、Scope/Timeline、Knowledge、Proposal、Context Packet 及 S1–S6 纸面演练已完成 | [核心契约](docs/architecture/CORE_CONTRACTS.md) |
| Context Engine 研究 | 截止 2026-09-09 的研究报告已入库；首版推荐方案明确，运行评估未执行 | [研究报告](docs/research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md) |
| 七技能融合 | 方法与架构审计 V1.0 已完成；原压缩包文件/hash/脚本复核待 V1.1 | [七技能报告](docs/research/SEVEN_SKILLS_AUDIT_AND_FUSION_V1.md) |
| 作者工作流 | 新建、规划、写作、Canon Inbox、旧章修改、导入、审查、Library、风格和恢复路径已整理 | [作者工作流](docs/product/AUTHOR_WORKFLOWS.md) |
| 首个工程基线 | TypeScript + SQLite/FTS5 已定案并实现；内容寻址大文本和 Model Adapter 待下一切片 | [ADR-011](adr/ADR-011-local-storage-retrieval.md) |
| Context/Canon 代码 | implemented_baseline；Policy Gate、Context Packet、Canon transaction、fixture 和 10 项测试 | [T003 记录](docs/technical/VERTICAL_SLICE_T003.md) |
| 完整创作产品 | not_completed；模型、作者界面、导入、发布与云同步未实现 | [当前任务](planning/CURRENT_TASK.md) |

## 设计状态边界

- accepted：仓库记忆目标和 P1–P6。
- proposed design baseline：V5 总体蓝图、作者工作流及尚未实现的模块规格。
- research completed：Context Engine 外部研究；不等于 V5 性能已经验证。
- reconstructed audit：七技能方法融合；不等于原包逐文件供应链审计。
- implemented baseline：ADR-008–011、SQLite/FTS5、Context/Canon 核心与确定性测试；适用范围可由后续实测 ADR 更新。
- not implemented：模型调用、UI、内容寻址大文本、平台发布、云同步和完整产品测试。

## 尚不能宣称完成

不能宣称完整应用已开发、百万字性能达标、RAG/长上下文选型已由 V5 大规模实测、七技能原包已逐文件核验、全部历史已恢复、任意 AI 已通过独立接手测试，或所有 proposed 字段已经冻结。

原附件只剩占位记录，GitHub 仓库没有七技能源码。相关会话已恢复更多可见内容，但 SRC-002 的更早分支仍不完整。Q001/Q010/Q013 保留这些限制。

## 当前下一步

执行 [T004](planning/CURRENT_TASK.md)：定义可替换 Model Adapter，用 deterministic fake 跑通任务、Context Inspector、草稿、结构化提案、接受/拒绝和 stale 提示，再做最小作者工作台。真实云模型和正文外发策略由 Q012 单独决定。

全部未决项以 [OPEN_QUESTIONS](planning/OPEN_QUESTIONS.md) 为主记录，路线见 [ROADMAP](planning/ROADMAP.md)。

## 更新规则

每次实质变化同步本文件、CHANGELOG、CURRENT_TASK、LATEST、Manifest 及受影响的 ADR/问题/规格，执行 `node scripts/validate-memory.mjs` 和 P1–P6 审查。只有实际远端提交可访问时才报告“已同步 GitHub”。
