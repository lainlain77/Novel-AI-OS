# Current Task

Updated: 2026-09-09
Task-ID: T002
Status: ready
Title: Kernel 最小契约与边界案例评审草案

## 接手点

T001 项目记忆补全已形成文档和自检产物，结果见 [审计](../docs/quality/AUDIT_LOG.md)。下一位协作者从本任务继续，不重复初始化仓库。Q001 历史补录和 Q010 独立接手测试可并行进行。

## 目标与范围

基于已有草案，把“原则允许什么、禁止什么”转成可评审的最小对象/作用域/版本/来源/变更契约。完成的是设计验证，不能直接把 schema 或技术栈标为作者已批准。

前置阅读：[原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)、[ADR 索引](../adr/README.md)、[Kernel](../docs/kernel/STORY_KERNEL.md)、[Capability](../docs/capability/CAPABILITY_SYSTEM.md)、[Library/Canon](../docs/library/LIBRARY_CANON.md)、[工作流](../docs/ai/AI_WORKFLOW.md)、[S1–S6](../docs/architecture/ACCEPTANCE_SCENARIOS.md)、[Q003–Q006](OPEN_QUESTIONS.md)。

## 可立即执行的步骤

1. 对八类 Kernel 概念逐项给出最小示例，说明身份、作用域、版本、时间、来源由对象还是外层容器承载。
2. 以 S1/S2 检查混合能力、共享身份、原版/双故事实例和派生版本；列出表达不了的地方。
3. 以 S3/S4 明确候选变化状态、作者确认绑定范围、基线冲突和失败恢复的契约。
4. 以 S5/S6 检查角色误信、跨故事检索和发布/素材升级对核心的影响。
5. 将可选方案、冲突、样例和推荐理由写入现有规格及讨论；更新问题、ADR 提案、状态和交接。

## 产出与完成标准

每个 S1–S6 都有具体输入、候选表达、预期与禁止变化、逐项结论和缺口。Q003–Q006 各有可评审方案或说明仍缺的证据；P1–P6 无未处理冲突；所有新增内容可从 Manifest 定位，结构检查通过。

设计草案完成不要求假装作者已批准；需作者决定的具体选择集中展示证据和差异后再提出。未取得完整历史不阻塞以上新增分析，但必须标为本轮 proposed。

## 不足与恢复

无运行时或技术栈可供测试。遇到缺少作者偏好时先做独立的表达/边界验证，把影响决策的具体选项记录到问题中。中断时把已验证场景、未验证场景和下一步写入 [LATEST](../memory/handoffs/LATEST.md)。
