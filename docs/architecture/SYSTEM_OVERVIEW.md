# 系统架构总览

Status: proposed
Sources: SRC-001, SRC-002, SRC-003, SRC-004

六项 [原则](ARCHITECTURE_PRINCIPLES.md) 已确定；本页的模块分工和数据流为可评审草案。当前没有运行时实现。

## 责任与边界

| 部分 | 负责 | 输入 → 输出 | 不承担 |
| --- | --- | --- | --- |
| Project Memory | 目标、理由、决定、状态、交接 | 讨论/工作证据 → 可追溯资料 | 小说世界正式事实存储 |
| Story Kernel | 统一对象、关系、变化、知识及来源 | 有范围的对象/候选事件 → 表达与校验结果 | 题材专属底层、平台规则 |
| Capability | 专门规则与任务能力的组合 | Kernel 对象+能力配置 → 约束/建议 | 静默覆盖其他能力或 Canon |
| Library | 可复用素材及来源 | 原版/候选新版本 → 故事实例候选 | 接收故事经历的自动反向写入 |
| Story Canon | 作者确认的事实范围 | 经确认且基线有效的变更 → 新事实版本 | 自动接受草稿和模型推断 |
| Planning | 目标、情节、章节和场景计划 | 作者意图+上下文 → 计划及候选变化 | 计划直接成为已经发生的事件 |
| Context Engine | 筛选与组织任务上下文 | 任务+范围+来源版本 → 上下文包/缺口 | 决定何为正式事实 |
| AI Workflow | 协调读取、生成、校验、作者审阅 | 上下文包 → 建议/审查结果 | 自行批准 Canon 修改 |
| Publishing | 可选外围发布转换 | 作品输出 → 平台形式 | 反向定义 Kernel |

## 一个创作任务的数据流

1. 作者设定任务，选择故事/分支、适用时点和权限范围。
2. Context Engine 按范围读取 Canon、所需 Library 来源和明确标识的草稿/计划；项目架构任务使用 Project Memory。
3. Planning 和 Capability 在统一 Kernel 表达上提出候选场景及变化。
4. 校验来源、能力冲突、知识边界、Library 隔离，展示建议和未解决问题。
5. 作者选择是否接受具体 Canon 变更；基线不一致需重新比较。
6. 成功应用后更新版本、来源与受影响派生资料；失败保留原 Canon 和可恢复的候选记录。

第 5–6 步是必要约束的候选实现流程；具体事务和版本设计尚待 Q004。图式顺序不表示需要六个微服务。

## 规格导航

[Kernel](../kernel/STORY_KERNEL.md) · [Capability](../capability/CAPABILITY_SYSTEM.md) · [Library/Canon](../library/LIBRARY_CANON.md) · [Planning](../planning/PLANNING_SYSTEM.md) · [Context](../context/CONTEXT_ENGINE.md) · [AI Workflow](../ai/AI_WORKFLOW.md) · [Project Memory](../memory/MEMORY_SYSTEM.md) · [实现边界](../technical/IMPLEMENTATION_BOUNDARIES.md)

优先验证 [场景](ACCEPTANCE_SCENARIOS.md)，根据问题修订契约，再决定技术栈。不要把这些文档的存在当作模块完成。
