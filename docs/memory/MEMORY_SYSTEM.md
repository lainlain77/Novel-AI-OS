# 项目记忆体系

Status: active_working_design
Sources: SRC-001, SRC-002, SRC-003, SRC-004

本设计管理仓库接手资料；故事运行时记忆仅有 [ADR-008](../../adr/ADR-008-memory-first-architecture.md) 提案。不能把文档维护工具当作已完成的创作引擎。

## 信息的主记录

| 信息 | 主记录 | 同步对象 |
| --- | --- | --- |
| 接手读取顺序与主题路由 | CONTEXT_MANIFEST.yaml | AI_START_HERE、README |
| 已确定原则与理由 | accepted ADR | 原则、SETTLED_DECISIONS |
| 原始依据及覆盖限制 | memory/SOURCE_REGISTER.md | 讨论、历史、相关 ADR |
| 讨论演化和候选比较 | memory/discussions | ADR、问题及相关规格 |
| 当前事实状态 | PROJECT_STATE.md | 最新交接、当前任务 |
| 待解决问题 | planning/OPEN_QUESTIONS.md | 任务、路线图及规格 |
| 下一步工作与验收 | planning/CURRENT_TASK.md | PROJECT_STATE、LATEST |
| 最新停止点 | memory/handoffs/LATEST.md | 当前任务、审计 |
| 事件与变更记录 | PROJECT_HISTORY、CHANGELOG、Git | 状态与审计 |

表中主记录表示维护职责。发现主记录与依据冲突时要调查并修订，不能因它叫“主记录”就覆盖作者确认。Manifest 的 authority 字段区分规范、提案、工作记录、来源和工具；不是额外的授权系统。

## 更新事务的工作约定

一次实质变更应作为一个连贯增量完成：改动前 P1–P6 检查 → 修改主记录 → 更新关联 → 结构检查 → 内容验收 → 保存/发布 → 核实远端。若过程被打断，LATEST 标明未完成部分，不能只留下“下次继续”。

不要求每个错字生成新讨论和 ADR。新增长期决定、改变事实状态或引入未决事项时才需要更新对应类型；所有导航必须保持可用。

## Manifest 约定

CONTEXT_MANIFEST.yaml 使用 JSON 兼容的 YAML 1.2 子集，可由 JSON.parse 读取，无需 YAML 第三方依赖。包含 schema_version、project、startup_order、principles、sources、adrs、routes、documents、current_task、open_questions、latest_handoff。

documents 登记所有仓库文件及权威类别；routes 只引用现存文件。计划中尚不存在的模块写入开放问题/路线图，不伪造路径。状态只报告可观察产物，不把 proposed 改成 implemented。

## 历史与失效

Git 保存文件旧版本；LATEST 是当前交接，不在每轮复制整套文档。来源补齐、作者改目标或新证据推翻摘要时，记录纠正及受影响结论。对尚未取得的历史保持缺口，直到实际读取和核对后关闭问题。

## 检查边界

结构检查可以发现丢文件、链接/锚点错误、未登记文件、ADR 状态/来源矛盾、原则映射或任务关联丢失。它不能证明历史完整、设计正确或所有 AI 均能独立接手。这些由 [接手验收](../quality/HANDOFF_ACCEPTANCE.md) 和 Q001/Q010 追踪。
