# 实现边界与技术待决事项

Status: implemented_and_measured_baseline
Sources: SRC-003, SRC-004

当前仓库包含文档、项目记忆检查脚本、Context/Canon 纵向切片、可替换 Model Adapter、deterministic fake 和最小作者工作台。SQLite schema、FTS5、Policy Gate、Context Packet、Canon transaction 与本地 UI 已实现；真实模型、完整编辑器、发布适配、云服务和完整产品仍未实现。

## 已受原则约束的边界

Kernel 不依赖题材/平台专属模型；Capability 通过共同表达工作；Library 和故事实例隔离；Canon 写入需要作者明确确认；读取/检索不能绕过范围和来源。

逻辑模块不等于必须独立部署。单进程、模块化应用或服务拆分仍待需求和验证决定。

## 选型前要取得的证据

Q007：单作者/多人、离线需求、数据可携带性、恢复需求和预期规模；Q004：版本、批准、冲突和恢复；Q002：检索基准与预算；Q009：最小作者操作路径。

T002 已形成 [核心契约与 S1–S6 纸面演练](../architecture/CORE_CONTRACTS.md)。T003 已实现本地优先、模块化单体、SQLite + FTS5；T004 已实现无 Canon 写权的 Model Adapter 与浏览器工作台。运行证据见 [T003](VERTICAL_SLICE_T003.md) 和 [T004](WORKBENCH_T004.md)。内容寻址大文本和正式桌面壳仍是后续边界。

T005 已在百万字合成长篇上证明精确 FTS、隔离和延迟基线达标，同时测得无共享词同义查询 0/5。T006 已实现 ADR-013 的 adapter、cache 和 RRF，并用 fixture provider 验证语义回归与零泄漏。T007 已加入固定 revision/hash、禁止远程加载的本地 Transformers embedding provider；具体生产模型选择仍需许可证、人工标注与安全回归。图数据库、多 Agent、分布式服务和云同步只有在评估显示必要时引入。详细结果见 [T005](../quality/LONG_CONTEXT_BENCHMARK_T005.md)、[T006](../quality/HYBRID_RETRIEVAL_BENCHMARK_T006.md) 与 [T007](../quality/EMBEDDING_CANDIDATES_T007.md)。

## 实现完成的定义

规格 accepted 与实现 completed 分别记录。实现需要实际代码、可运行入口、与边界有关的验证结果及已知限制。仅新增 README 或伪代码不能算实现。后续路线图见 [ROADMAP](../../planning/ROADMAP.md)。
