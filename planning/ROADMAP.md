# Roadmap

Updated: 2026-09-14

阶段表示依赖顺序，不是日期承诺。状态对应可观察产物，不按文档数量判断产品完成。

| 阶段 | 状态 | 产出 | 完成条件/依赖 |
| --- | --- | --- | --- |
| Phase 0 项目记忆基础 | foundation_delivered；完整历史/独立验收待补 | 入口、来源、ADR、讨论、状态、问题、交接、自检 | 本轮结构与内容审计；Q001/Q010 另行追踪 |
| Phase 1 Kernel 与边界契约 | paper_contract_delivered；冻结待评审 | 最小对象/作用域/版本/来源/提案契约 | [S1–S6 纸面演练](../docs/architecture/CORE_CONTRACTS.md)完成；转入可执行 schema 与 fixture |
| Phase 2 Planning 与作者流程 | proposed | 计划到草稿及事实差异的工作流 | 依赖 Phase 1；Q009 评审 |
| Phase 3 Context 与运行时记忆 | minimal_runtime_delivered；long_scale_pending | 研究基线、标准任务集、候选对比、失效设计 | T003 硬过滤、FTS、预算、来源和失效通过；百万字评估待 Q002/Q011 |
| Phase 4 AI 协作实现契约 | minimal_runtime_delivered | 角色权限、提案/确认、失败恢复 | ADR-009/010/012 与 T003/T004 已验证；真实模型隐私见 Q012 |
| Phase 5 最小产品实现 | author_slice_delivered；long_scale_next | 可运行的端到端创作切片 | 本地工作台与 14 项测试通过；T005 验证百万字规模 |
| Phase 6 后续能力与外围发布 | not_scheduled | 按实际需求扩展 | 不改变六项原则，具体范围由作者确定 |

Phase 2/3 可以在共享契约稳定后并行设计；不能因编号靠前而声称要先冻结全部规划再研究检索。每次只推进有明确验收条件的任务。新发现的问题进入 [OPEN_QUESTIONS](OPEN_QUESTIONS.md)。

当前执行入口为 [CURRENT_TASK](CURRENT_TASK.md)，不是重新建立另一份待办清单。
