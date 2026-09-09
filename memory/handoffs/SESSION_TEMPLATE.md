# 会话交接模板

使用时填入实际结果，更新 LATEST；Git 保留旧版。不得留下未填写模板却宣称交接完成。

## 必填内容

- 日期、目标仓库/分支、读取的基线提交。
- 用户本轮目标和持续有效的约束，必要时引用来源。
- 实际完成的文件/操作；区分本地、远端、设计、实现。
- P1–P6 编辑前审查结果、检查命令/结果、内容验收证据。
- 新决定及批准来源；新增提案；已解决/仍开放问题。
- 已知限制，包括读不到的历史、未执行的测试。
- 当前任务 ID、精确下一步、依赖、产出和完成标准。
- 中断/失败恢复步骤、未保存工作或并行修改风险。
- 发布核验：工具返回的提交或通过 Git 定位本文件版本的方法；不得编造远端成功。

## 仅能传递文本时的资料包

按顺序提供 AI_START_HERE、PROJECT_STATE、CONTEXT_MANIFEST、ARCHITECTURE_PRINCIPLES、SETTLED_DECISIONS、adr/README、AI_COLLABORATION_PROTOCOL、SOURCE_REGISTER、LATEST、CURRENT_TASK、OPEN_QUESTIONS，再按 Manifest routes 补相关 ADR/讨论/规格全文。长文件分段传递并标明完整性。

新协作者需按 [接手验收](../../docs/quality/HANDOFF_ACCEPTANCE.md) 回答问题并引用文件。不能拿不到入口却只凭旧助手的口头总结继续改核心架构。
