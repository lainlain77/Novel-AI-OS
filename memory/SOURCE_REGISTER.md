# 来源登记

Updated: 2026-09-09

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

## 缺口处理

Q001 追踪完整历史补录。收到可访问原文后按来源登记 → 对比已有摘要 → 标记差异 → 更新讨论/问题/状态顺序处理。无变化无需重写 ADR；有冲突保留原摘要和纠正理由。不得为了让资料看起来完整而虚构日期、批准记录或版本沿革。
