# Latest Handoff

Updated: 2026-09-14
Completed-task: T004
Next-task: T005
Target: lainlain77/Novel-AI-OS / main
Starting-baseline: 589822973249ad02e0c32f0ffa074e49203e7168

## 本轮结果

T004 在 T003 的确定性核心上加入可替换 Model Adapter、deterministic fake、AuthorWorkflowService、本地 HTTP API 和作者工作台。运行 `npm run workbench` 后可在 `127.0.0.1:4173` 操作任务、POV、秘密授权、Context Inspector、草稿、Canon proposal、接受和拒绝。

ModelAdapter 只接收已过滤的 Context Packet，不持有 Store；返回值只有 Draft 或 ProposalSuggestion。应用服务负责把 suggestion 包装成带 manifest、base revision 和 provenance 的 ChangeProposal。save 只进入 ready Inbox，apply 才写 Canon；reject 不改变 revision，stale 仍由底层事务拒绝。

新增 [T004 实现记录](../../docs/technical/WORKBENCH_T004.md) 和 accepted [ADR-012](../../adr/ADR-012-model-adapter-boundary.md)。T004 新增 4 项测试，连同 T003 共 14 项通过。

## 限制

工作台使用内存 fixture 和 fake adapter，只验证权限与操作路径。没有真实模型、持久化项目浏览器、完整正文编辑、流式输出、diff 高亮、撤销栈、正式桌面打包或多人身份。真实模型的数据外发与日志策略留在 Q012。

## 下一步

执行 [T005](../../planning/CURRENT_TASK.md)：构造固定 seed 的百万字长篇 fixture 和查询标准答案，测量 SQLite/FTS5 导入、Recall、p50/p95、预算、来源及零泄漏，再决定是否加入向量混合检索或图投影。

## 恢复与核验

仓库根执行 `npm run validate`，应通过结构检查和 14 项测试；`npm run workbench` 启动界面。先比较远端 main 与本交接基线，避免覆盖并行修改。只有远端文件与提交可读后才能报告已同步。
