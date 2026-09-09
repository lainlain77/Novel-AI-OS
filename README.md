# Novel-AI-OS

小说 AI 创作操作系统：支持世界构建、故事规划、长篇连续性、AI 协作和创作知识管理。当前以项目记忆和架构设计为主，尚未实现小说创作应用。

目标是让任何具备仓库读取能力的 AI、新对话或协作者，从仓库恢复目标、决定、原因、进度和下一步。历史材料缺失时，必须能识别缺口；不能把摘要冒充完整历史。

从 [AI_START_HERE.md](AI_START_HERE.md) 开始接手。当前工作见 [PROJECT_STATE.md](PROJECT_STATE.md)，可执行下一步见 [当前任务](planning/CURRENT_TASK.md)。

## 核心约束

通用 Kernel、平台无关、题材非底层、Capability 组合、Library 与 Canon 隔离、AI 不静默修改 Canon。规范入口是 [原则](docs/architecture/ARCHITECTURE_PRINCIPLES.md) 和 [已确定决定](SETTLED_DECISIONS.md)。

## 资料导航

| 要了解什么 | 入口 |
| --- | --- |
| 如何参与及交接 | [AI 协作协议](AI_COLLABORATION_PROTOCOL.md)、[最新交接](memory/handoffs/LATEST.md) |
| 决策及原因 | [ADR 索引](adr/README.md)、[讨论记忆](memory/discussions/README.md) |
| 结论来自哪里 | [来源登记](memory/SOURCE_REGISTER.md)、[项目历史](PROJECT_HISTORY.md) |
| 还有什么未解决 | [开放问题](planning/OPEN_QUESTIONS.md)、[路线图](planning/ROADMAP.md) |
| 模块如何配合 | [架构总览](docs/architecture/SYSTEM_OVERVIEW.md)、[术语](GLOSSARY.md) |
| 机器怎样按需读取 | [Context Manifest](CONTEXT_MANIFEST.yaml) |
| 如何证明可以接手 | [接手验收](docs/quality/HANDOFF_ACCEPTANCE.md)、[审计记录](docs/quality/AUDIT_LOG.md) |

## 本地自检

仓库根目录执行 `node scripts/validate-memory.mjs`；检查器自身的故障用例执行 `node scripts/validate-memory.mjs --self-test`。需要 Node.js；不需要安装第三方包。脚本检查资料结构，人工验收负责判断内容是否足以接手。这里的脚本属于文档维护工具，不代表创作产品已经实现。

V5 是既有资料中的设计称呼，尚未核实存在 V1–V4 的完整记录或 V5 软件发布。见 [来源登记](memory/SOURCE_REGISTER.md)。
