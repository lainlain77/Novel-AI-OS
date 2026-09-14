# Current Task

Updated: 2026-09-14
Task-ID: T003
Status: ready
Title: Context/Canon 纵向切片的可执行规格与评估夹具

## 接手点

T002 已完成纸面契约与 S1–S6 演练，见 [CORE_CONTRACTS](../docs/architecture/CORE_CONTRACTS.md)。V5 总体设计、Context Engine 研究、七技能融合和作者工作流已形成可追溯基线。当前没有产品代码；本任务把设计转成可运行的最小实现规格。

## 目标与范围

定义并实现或准备实现一个本地优先纵向切片：作品/分支/Scene → 版本化 Canon/Knowledge → Task Contract → Context Packet → Draft/Change Proposal → 作者确认 → 原子提交与派生失效。

本任务不实现完整编辑器、GraphRAG、多 Agent、云同步或平台适配。首个技术基线为 TypeScript 模块化单体、SQLite + FTS5、内容寻址原文和可替换 Model Adapter。

前置阅读：[总体蓝图](../docs/architecture/V5_MASTER_BLUEPRINT.md)、[核心契约](../docs/architecture/CORE_CONTRACTS.md)、[Context 研究](../docs/research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md)、[作者工作流](../docs/product/AUTHOR_WORKFLOWS.md)、Q002/Q004/Q005/Q008/Q011。

## 可立即执行的步骤

1. 将 StoryRecord、Scope/Timeline、Knowledge、ChangeProposal、ContextPacket 转成版本化 schema 草案和迁移策略。
2. 建立两部作品、两个分支、回忆/循环、同名人物、误信、作者秘密和旧摘要的最小 fixture。
3. 定义 Task Contract、Policy Gate、结构化查询、FTS 检索、预算装配和 Context Inspector 输出。
4. 实现或原型化 proposal stale 检查、原子提交、失败恢复和派生依赖失效。
5. 跑 S1–S6 与 Q011 指标，记录必须包含、禁止包含、来源正确性、token、延迟和失败样本。
6. 根据结果为 Canon transaction、knowledge gate 和首版存储/检索分别提出新的 ADR，并在创建后分配正式编号。

## 产出与完成标准

- 可执行或可直接编码的 schema/接口规格，字段与 CORE_CONTRACTS 可追踪；
- 可版本化的评估 fixture 和标准答案；
- 最小检索/装配与 Canon 提交流程可演示；
- S1–S6 无跨故事污染、秘密泄漏或未确认写入；
- 性能/成本结果注明模型、版本、硬件和日期；
- 新增代码与文档被 Manifest 登记，结构检查和相关测试通过；
- PROJECT_STATE、OPEN_QUESTIONS、ROADMAP、LATEST 和 CHANGELOG 同步。

## 决策与停止条件

首版先验证正确性、隔离和可追溯，再优化召回与速度。若 SQLite/FTS 在标准任务上不能满足门槛，记录失败后再比较向量或图扩展。模型不可用不阻止完成 deterministic fixture、Policy Gate 和存储事务。
