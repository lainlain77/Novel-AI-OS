# AI START HERE

你正在接手 Novel-AI-OS（小说 AI 创作操作系统）。先恢复项目状态，再开始工作。当前为记忆基础建设及架构整理阶段，尚无创作产品实现；V5 仅是沿用的设计称呼。

## 从零接手

按以下顺序读取；机器入口 [CONTEXT_MANIFEST.yaml](CONTEXT_MANIFEST.yaml) 的 startup_order 使用同一顺序。文件较长时可以分段读完，不得仅靠文件名判断内容。

1. 本文件：目标与接手要求。
2. [PROJECT_STATE.md](PROJECT_STATE.md)：事实状态及边界。
3. [CONTEXT_MANIFEST.yaml](CONTEXT_MANIFEST.yaml)：真实文件地图、主题路由及提案状态。
4. [架构原则](docs/architecture/ARCHITECTURE_PRINCIPLES.md)：P1–P6。
5. [已确定决定](SETTLED_DECISIONS.md) 与 [ADR 索引](adr/README.md)：结论、理由及哪些仍是提案。
6. [AI 协作协议](AI_COLLABORATION_PROTOCOL.md)：修改、自检和交接流程。
7. [来源登记](memory/SOURCE_REGISTER.md)：证据范围与缺失历史。
8. [最新交接](memory/handoffs/LATEST.md)：本轮结果、风险及停止点。
9. [当前任务](planning/CURRENT_TASK.md) 与 [开放问题](planning/OPEN_QUESTIONS.md)：下一步和未决事项。

再通过 Manifest 的 routes 读取相关 ADR、讨论和规格。处理架构变更时必须读取该原则对应 ADR 的全文；不需要在所有任务中重读全部历史。

## 开始工作前应能回答

- 项目要完成什么，当前实际有什么？
- 六项原则是什么，为什么选它们？
- 哪些只是提案，哪些资料无法核实？
- 当前下一步的输入、产出、依赖及完成条件是什么？
- 本次工作怎样保留作者对 Canon 的控制，怎样避免污染 Library？

答案必须能指向仓库文件。答不出来就记录具体缺口，继续读取；不要凭空补成“我们以前决定过”。

## 阅读受限时

只有网页能力时，依次打开以上链接；只有文本传递能力时，使用 [交接模板](memory/handoffs/SESSION_TEMPLATE.md) 中的资料包清单。若连必读文件也拿不到，明确报告缺失文件，不能宣称已无缝接手。

项目记忆保存的是可核实的讨论摘要、决定和工作记录，不是任何模型的私有内部思维过程。历史完整性和接手可用性分别验收，见 [接手验收](docs/quality/HANDOFF_ACCEPTANCE.md)。
