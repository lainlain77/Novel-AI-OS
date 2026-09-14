# 来源登记

Updated: 2026-09-14

记录我们实际取得的资料，不把缺失部分推测为历史。用户可见的讨论理由可以整理；不存储模型私有内部推理。来源类型与内容状态分开：一段助手发言是可见事实，但它声称的完成状态仍需验证。

## SRC-001 — 本轮用户明确要求

类型：current_user_instruction。取得日期：2026-09-09。可直接核实，未分配公开会话链接。

原文：

> 继续完善 GitHub 仓库 lainlain77/Novel-AI-OS。持续自检当前项目记忆体系是否满足目标：任何 AI/新对话从零开始可无缝接手。重点补充 memory/discussions、ADR、OPEN_QUESTIONS、PROJECT_HISTORY、AI 协作协议、Context Manifest、架构文档。每次修改前检查是否与已确定原则冲突：通用 Kernel、平台无关、题材非底层、Capability 组合、Library 与 Canon 隔离、AI 不静默修改 Canon。

用法：证明任务目标、修改范围和六项约束。不能由此推断用户已选定数据库、检索策略或字段格式。

## SRC-002 — 前面对话的有限摘录

类型：bounded_conversation_preview。来源标题：分支 · 分支 · 优化小说创作架构。会话 ID：6aa0ee9e-d698-83e8-859f-b2ed04f9de3f。

可尝试通过 [原对话](https://chatgpt.com/c/6aa0ee9e-d698-83e8-859f-b2ed04f9de3f) 访问，可能需要原账号权限；仓库接手不依赖该链接可用。记录日期为本轮整理日期，不宣称每段讨论发生于此日。

摘录中用户要求把决定、讨论、未实现、待实现、疑问及规划整理进项目，以让任意 AI/新对话从零衔接；随后表示继续，并要求持续自检。

可见助手摘要涉及：

- 用通用 Kernel 与可组合 Capability 支持混合题材；以无限流加爱情为例。
- Library 与小说实例分离；以“血人001 → 血人001-A → 血人001-A-01”解释来源与变化，小说经历不污染原库。
- Context Engine 候选包括 Long Context、RAG、Graph RAG、Hybrid；属于待研究问题。
- 计划添加讨论、ADR、PROJECT_HISTORY、Open Questions、Roadmap 与交接。
- 曾声称已提交入口、状态、Manifest、原则、协作协议；这些文件已由 SRC-003 核实。

限制：摘录中的部分助手回复被截断；两次获取完整会话均超时。没有取得更早分支、附件、Kernel“完整设计”或 Blueprint 细节。摘录不支持把全部助手规划当作作者已批准方案；本轮讨论文档会标记重建摘要和新增分析。

## SRC-003 — 已核实 GitHub 基线

类型：repository_snapshot。仓库：lainlain77/Novel-AI-OS，分支 main。
提交：[a4975d94333375076c49e79076776bf954bc1929](https://github.com/lainlain77/Novel-AI-OS/commit/a4975d94333375076c49e79076776bf954bc1929)。

递归文件树未被截断，共 6 个文件，均已全文读取：

- [README.md](https://github.com/lainlain77/Novel-AI-OS/blob/a4975d94333375076c49e79076776bf954bc1929/README.md)
- [AI_START_HERE.md](https://github.com/lainlain77/Novel-AI-OS/blob/a4975d94333375076c49e79076776bf954bc1929/AI_START_HERE.md)
- [PROJECT_STATE.md](https://github.com/lainlain77/Novel-AI-OS/blob/a4975d94333375076c49e79076776bf954bc1929/PROJECT_STATE.md)
- [CONTEXT_MANIFEST.yaml](https://github.com/lainlain77/Novel-AI-OS/blob/a4975d94333375076c49e79076776bf954bc1929/CONTEXT_MANIFEST.yaml)
- [AI_COLLABORATION_PROTOCOL.md](https://github.com/lainlain77/Novel-AI-OS/blob/a4975d94333375076c49e79076776bf954bc1929/AI_COLLABORATION_PROTOCOL.md)
- [ARCHITECTURE_PRINCIPLES.md](https://github.com/lainlain77/Novel-AI-OS/blob/a4975d94333375076c49e79076776bf954bc1929/docs/architecture/ARCHITECTURE_PRINCIPLES.md)

基线的八类 Kernel 对象为 Entity、Rule、State、Relation、Event、Knowledge、Derivation、Provenance。没有数据库、服务代码或测试实现。旧 Manifest 引用了不存在的模块目录，不等于这些模块已经存在。

## SRC-004 — 本轮审计及设计整理

类型：current_session_analysis。日期：2026-09-09。

包括基线检查、跨文件一致性审查、结构检查器运行、人工接手用例以及为缺失架构补写的提案。验证结果看 [审计日志](../docs/quality/AUDIT_LOG.md)。

新增理由、字段、接口和案例标为本轮分析或 proposed，不能回填成历史原话。文档写入和远端发布分别核实；当前文件版本以包含它的 Git 提交为准。

## SRC-005 — 2026-09-14 当前用户授权

类型：current_user_instruction。用户要求继续全面整理 Novel-AI-OS，包括疑问、后续、扩展和本体，并表示“你来决定”。这授权本轮选择文档组织方式和首个实现基线；不代表产品已经实现，也不把每个 proposed 字段自动提升为 accepted 架构决定。

本轮选择：建立 V5 总体蓝图、核心契约、作者工作流、Context Engine 研究基线和七技能融合报告；首个工程切片推荐本地优先、模块化单体、SQLite + FTS5 和可替换模型适配器。

## SRC-006 — 可访问的《优化小说创作架构》记录

类型：chatgpt_thread。会话 ID：6aa009ff-ab60-83e9-8784-c80940d93cf9，标题：优化小说创作架构。2026-09-14 通过分页接口读取可访问记录。

可核实内容包括：通用 Kernel、State/Event/Knowledge/Relation 的细化讨论；Planning 中 Story Core、Spine、PlanNode、NarrativeThread、Reader Experience；平台外围化；七技能的公开索引分析和融合理由；Context Engine 是后续核心模块。部分单条长回复在接口输出中截断，因此本轮以明确可见段落和已有原则交叉核对。

该会话记录了一条“User attached 1 file”的占位消息，但接口 attachments 为空，没有文件名、下载地址或内容。它证明曾有附件，不证明附件内具体文件和统计。

## SRC-007 — Context Engine 外部研究

类型：research_report。研究截止日：2026-09-09；整理入库：2026-09-14。产物：[Context Engine 深度研究](../docs/research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md)。

覆盖 long context、RAG、GraphRAG、Agent memory、压缩、缓存、provenance、评估和产品实践。报告内保存论文与官方资料链接、证据限制和技术建议。研究结果支持提出首版方案，不替代 V5 自身运行评估。

## SRC-008 — 2026-09-14 GitHub 仓库快照

类型：repository_snapshot。仓库：[lainlain77/Novel-AI-OS](https://github.com/lainlain77/Novel-AI-OS)，分支 main，检查时 HEAD 为 769ba3bb89bf29abbba6df5de3dd8a8cb07a0083。

通过 GitHub App 枚举仓库和权限，再完整拉取默认分支。检查时仓库为公开，当前账号具有 push/admin 权限；仓库含项目记忆和架构文档，没有七技能源码、创作应用、数据库或 UI 实现。目录树、最近提交和本地状态均已核对。

## 缺口处理

Q001 追踪完整历史与附件补录。当前相关会话可分页读取，但 SRC-002 指向的更早分支和七技能原始压缩包仍未取得。收到材料后按来源登记 → hash/目录清单 → 对比已有摘要 → 标记差异 → 更新讨论/问题/状态顺序处理。无变化无需重写 ADR；有冲突保留原摘要和纠正理由。不得为了让资料看起来完整而虚构日期、批准记录、文件统计或版本沿革。
