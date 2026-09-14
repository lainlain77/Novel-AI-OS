# Current Task

Updated: 2026-09-14
Task-ID: T005
Status: ready
Title: 百万字长篇 Context Engine 基准与检索消融

## 接手点

T003 已交付 Context/Canon 核心，T004 已交付 Model Adapter、fake、本地 API 和最小作者工作台；14 项测试通过。当前仍只有小 fixture，不能据此宣称百万字召回、延迟或成本达标。

## 目标与范围

建立可复现的约一百万汉字长篇 fixture 和基准脚本，测量 SQLite 导入、FTS5、Policy Gate、Context Packet、token 预算、跨作品/分支隔离、未来信息阻断和摘要失效。以失败集决定是否加入向量混合检索；不先部署向量库或图数据库。

## 可立即执行的步骤

1. 生成固定 seed 的章节、场景、人物、线程、Knowledge、秘密、未来揭示、同名污染项和针式事实；记录字符数与记录数。
2. 把正文块与结构化记录分开，保留 chapter/scene/narrative cursor 和 provenance。
3. 定义至少 30 个查询的标准答案：must include、must exclude、允许遗漏与任务预算。
4. 记录数据库体积、构建时间、p50/p95 检索与装配延迟、Recall@k、隔离/泄漏率、来源准确率和预算利用率。
5. 做 FTS only、较长上下文、摘要启用/失效三组消融；语义失败样本稳定后再实现嵌入 adapter 候选。
6. 把硬件、Node/SQLite 版本、日期、数据 seed 和命令写入报告；同步 Q002/Q011 和 ADR-011 的适用范围。

## 完成标准

- fixture 可由脚本重建，不提交巨型生成数据库；
- 文本规模约一百万汉字，包含可定位的困难与禁止样本；
- 指标、阈值、失败样本和复现命令齐全；
- 零跨作品/分支/秘密/未来信息泄漏；
- 对是否需要向量或图扩展给出基于数据的结论；
- 完整检查、项目状态、交接、Manifest 和路线同步。

## 停止条件

若词法基线无法召回同义、隐喻或跨段指代，先固化失败题，再增加可替换 embedding/rerank adapter。不得为了提高 Recall 绕过 ADR-010 的允许集合，也不得把派生摘要当成 Canon。
