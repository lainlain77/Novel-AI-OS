# Changelog

## 2026-09-23 — T007 本地 embedding 评测入口

- 新增可离线运行的中文 embedding smoke test 和 FTS/dense/hybrid 评测脚本。
- 新增运行时 `LocalTransformersEmbeddingProvider`：权重 hash 校验、远程加载禁用、批处理、归一化 CLS pooling 和版本化 provider ID。
- 新增 2 项无模型文件的适配器单元测试，项目自动测试增至 20 项。
- 新增可选 `createLocalHybridContextEngine` 入口，将本地 embedding 与既有 FTS fallback/RRF 管线组合；新增回归后测试增至 21 项。
- 新增异步 ContextCompiler 和 `createLocalAuthorWorkflowService`，工作台 compile/generate 可显式使用本地混合检索；测试增至 22 项。
- 固定模型 revision、量化方式和本地加载边界；远程模型加载默认关闭。
- 评测脚本只读取命令行提供的本地语料与题集，私人正文和衍生结果不提交到仓库。
- T007 仍保持开放：人工标注覆盖、Policy Gate 泄漏、多次运行和完整规模成本待继续验证。

## 2026-09-15 — T006 Policy-gated Hybrid Retriever

- 新增 Retriever/Embedding Provider 接口、SQLite 版本化向量缓存、RRF 融合、词法 fallback 和 Context channel provenance。
- 新增 30 条无共同词语义回归；百万字 fixture 上 FTS 0/30，fixture embedding/hybrid 30/30，hybrid 精确查询仍为 30/30。
- 内容 hash 缓存后 hybrid p95 从约 121 ms 降至约 64 ms；数据库缓存增量约 528 KB。
- T006 安全指标为泄漏 0、来源错误 0、解释缺失 0；自动测试增至 18 项。
- 明确 fixture provider 不是生产语义模型；真实本地模型与许可语料评估进入 T007。

## 2026-09-15 — T005 百万字 Context 基准

- 新增固定 seed 的 1,072,358 字符、2,131 记录长篇生成器与可复现 JSON 结果，不提交巨型数据库。
- 45/45 精确召回、60 次禁止项零泄漏、来源错误 0；Context p50 58.108 ms、p95 66.762 ms，派生失效 2.866 ms。
- 5 个无共享词同义改写 0/5，确认 FTS5 不能单独承担语义检索。
- 接受 ADR-013：在 Policy Gate 允许集合内加入可替换混合检索，暂不照搬独立向量库或 GraphRAG。

## 2026-09-14 — T004 Model Adapter 与作者工作台

- 新增无 Canon 写权限的 Model Adapter 契约和 deterministic fake；模型只接收已过滤 Context Packet，只返回 Draft 或 ProposalSuggestion。
- 新增应用服务、本地 HTTP API 与作者工作台，显示任务、POV、秘密授权、Context Inspector、草稿、Canon Inbox、接受和拒绝。
- 新增 4 项工作流/API 测试；连同 T003 共 14 项通过，无需账号、密钥或外部服务。
- 接受 ADR-012；当前任务推进到 T005 百万字长篇基准。

## 2026-09-14 — T003 可运行 Context/Canon 核心

- 新增零第三方依赖的 TypeScript + SQLite/FTS5 纵向切片，实现作品/分支/revision、知识与秘密 Policy Gate、Context Packet、预算和来源指纹。
- 实现 ChangeProposal 保存与原子应用、stale approval 拒绝、失败回滚、历史 supersede 和递归派生摘要失效。
- 新增两作品/两分支 fixture 与 10 项回归；同名人物、POV、读者未来信息、作者秘密、未确认写入和事务边界全部通过。
- 接受 ADR-008–011，记录运行边界和已知限制；当前任务推进至 T004 Model Adapter 与最小作者工作台。

## 2026-09-14 — V5 全面设计基线

- 新增 V5 总体蓝图，统一产品本体、模块边界、数据域、创作流程、技术路线、评估、反模式和长期扩展。
- 新增核心契约与 S1–S6 纸面演练，完成 T002；当前任务推进为 T003 可执行规格与评估夹具。
- 将截至 2026-09-09 的 Context Engine 深度研究正式纳入仓库，区分研究完成与运行评估待执行。
- 新增七技能重新审计与融合 V1.0，明确吸收、改造、拒绝和原包 V1.1 复核边界。
- 新增作者工作流；更新 Context/技术规格、来源、状态、路线图、开放问题、Manifest、交接和导航。
- 首个工程切片选择本地优先、TypeScript 模块化单体、SQLite + FTS5、内容寻址原文和可替换 Model Adapter。

## 2026-09-09 — 项目记忆补全初版

在已核实基线 a4975d94333375076c49e79076776bf954bc1929 上建立可交接资料链。

- 扩充接手入口、AI 协作协议、状态与真实文件 Manifest；加入术语、决定索引及仓库级 AGENTS。
- 新增讨论记忆、来源登记、ADR-000–008、开放问题、历史、路线图及最新交接。ADR-007/008 标为提案。
- 增补 Kernel、Capability、Library/Canon、Planning、Context、AI 工作流和记忆系统的可评审设计及验收案例。
- 新增结构检查器、检查器故障用例和人工接手验收记录。
- 纠正原 Manifest 对不存在目录的引用，以及缺乏产物证据的研究/实现进度；保留六项既定原则。

验证结果与限制见 [审计日志](docs/quality/AUDIT_LOG.md)。本轮不包含小说创作产品实现、技术选型定案或完整历史恢复。

## 2026-09-09 — 已核实的原始基础

初始提交及后续六次提交建立 README、接手入口、项目状态、Manifest、原则和协作协议。精确时间与提交链接见 [PROJECT_HISTORY](PROJECT_HISTORY.md)。旧对话中宣布将补充的 ADR、讨论和模块文档在上述基线中不存在。
