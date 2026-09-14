# T004 Model Adapter 与作者工作台

Status: implemented_baseline
Updated: 2026-09-14
Runtime: Node.js 24，零第三方依赖

## 已实现

T004 把确定性的 Context/Canon 核心接到可观察的作者流程：

- `src/model.ts` 定义可替换 ModelAdapter，并提供 deterministic FakeModelAdapter；
- `src/workflow.ts` 编排 Context Packet、模型输出、Proposal 准备、保存、接受和拒绝；
- `src/server.ts` 提供只在本机监听的最小 HTTP API；
- `public/index.html` 提供任务、POV、秘密授权、Context Inspector、草稿、Canon Inbox 和确认界面；
- `tests/workflow.test.ts` 验证模型边界与端到端 API。

运行 `npm run workbench` 后打开 `http://127.0.0.1:4173`。页面默认使用 T003 循环旅店 fixture，不需要模型账号、密钥或网络服务。

## 权限链

ModelAdapter 的唯一输入是已经过滤的 Context Packet、创作意图和输出类型。adapter 没有 NovelStore 或数据库引用。它只能返回 Draft 或 ProposalSuggestion；应用服务把 suggestion 包装为带 manifest、base revision 和 provenance 的 ChangeProposal。

状态变化分为四步：

1. 生成 suggestion：Canon 不变；
2. prepare proposal：只形成可审阅对象；
3. save：进入 ready Canon Inbox，Canon 仍不变；
4. apply：作者显式接受后才调用 ADR-009 的原子事务并递增 revision。

reject 将 ready proposal 标为 rejected，不改变 Canon。基线变化时 apply 仍由底层 stale 检查拒绝，因此 UI 或模型不能绕过并发边界。

## Context Inspector

界面显示每条 section 的角色、内容、record ID、source revision、入选原因和敏感级别，同时显示 packet token 预算与 Canon revision。秘密授权属于本次 TaskContract，不写成全局开关。

当前界面是工作流验证器，不是完整小说编辑器。它只服务单一内存 fixture，没有持久化项目选择、正文编辑、diff 高亮、撤销栈、身份认证、可访问性专项审计和打包安装程序。

## 验证

T003 的 10 项核心测试继续通过；T004 新增 4 项：

- fake draft 只包含获准的 POV packet，不能改变 Canon；
- suggestion 经过 prepare/save/apply 后才进入 Canon；
- 作者拒绝不改变 revision；
- 本地工作台页面和编译 API 可独立运行，不依赖外部服务。

全部 14 项测试在本机一次运行约 0.41 秒。该结果不评价真实模型质量、供应商隐私或百万字召回；这些分别由 Q012 与 T005/Q011 处理。

关联：[ADR-012](../../adr/ADR-012-model-adapter-boundary.md) · [T003](VERTICAL_SLICE_T003.md) · [作者工作流](../product/AUTHOR_WORKFLOWS.md)
