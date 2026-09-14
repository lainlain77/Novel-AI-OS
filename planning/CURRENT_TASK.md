# Current Task

Updated: 2026-09-14
Task-ID: T004
Status: ready
Title: 可替换 Model Adapter 与最小作者工作台

## 接手点

T003 已交付可运行的 Context/Canon 纵向切片，见 [实现与验证](../docs/technical/VERTICAL_SLICE_T003.md)。代码已覆盖结构化 Policy Gate、FTS5、Context Packet、proposal 保存/应用、过时拒绝、原子回滚和派生失效；10 项回归全部通过。

## 目标与范围

把确定性核心接到作者可观察的端到端流程：选择任务与 POV → 编译 Context Packet → 调用可替换 Model Adapter 或 deterministic fake → 显示草稿、来源、遗漏和权限 → 生成结构化 ChangeProposal → 接受/拒绝 → 查看 Canon revision。

首版界面用于验证工作流，不承担完整编辑器、排版或发布。真实模型不是完成前提；必须先用 fake adapter 跑通，并保证模型输出没有直接数据库写权限。

## 可立即执行的步骤

1. 定义 Model Adapter 输入输出、模型元数据、token usage、错误和取消契约。
2. 实现 deterministic fake adapter，并将任何模型结果限制为 Draft 或 ChangeProposal。
3. 建立本地 API/应用服务，复用现有 NovelStore，不让界面直接写 Canon 表。
4. 做最小作者工作台：任务/POV、Context Inspector、草稿、Canon diff、接受/拒绝、stale 提示。
5. 用现有 fixture 跑人物 POV、读者分析、作者秘密授权和旧批准四条端到端路径。
6. 记录界面选择、运行方式、截图或可复现演示、测试和已知限制；同步项目记忆。

## 完成标准

- fake adapter 下端到端流程可运行且无需外部账号；
- 模型层只能返回草稿/提案，不能直接改变 Canon；
- Context Inspector 显示来源 revision、入选原因、遗漏、预算和秘密 grant；
- 作者接受后 revision 才变化，拒绝和 stale 均不写入；
- 关键行为有自动测试，项目检查通过；
- PROJECT_STATE、ROADMAP、LATEST、CHANGELOG、Manifest 和相关问题同步。

## 停止条件

真实云模型接入涉及供应商、密钥、费用和正文外发时，先完成 adapter 和 fake 流程，再把具体连接作为 Q012 的显式配置决定。不得为了界面速度绕过 ADR-009/010。
