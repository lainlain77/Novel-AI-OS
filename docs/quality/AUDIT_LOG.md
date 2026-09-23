# 项目记忆审计日志

Updated: 2026-09-14
Baseline: a4975d94333375076c49e79076776bf954bc1929

## 初始发现

已核实六个文件；没有 ADR、讨论、问题、历史和模块规格。Manifest 多处路径不存在，旧状态把没有产物支持的 Context 研究记为进行中。完整会话两次超时，来源不完整。详见 [登记](../../memory/SOURCE_REGISTER.md)。

## 编辑前 P1–P6 检查

| 编辑批次 | 范围与依据 | 六项检查结论 |
| --- | --- | --- |
| B1 接手/协作/状态 | SRC-001/003；补齐维护规则与事实状态 | P1–P6 通过；未更改原则，未触及故事数据 |
| B2 来源/历史/讨论/ADR | SRC-001/002/003；明确历史覆盖，细节保持 proposed | P1–P6 通过；ADR-007/008 未冒充已接受 |
| B3 架构细化 | SRC-004；以六项约束建立候选契约及案例 | P1 统一对象，P2 外围发布，P3/P4 组合能力，P5 实例隔离，P6 明确确认；通过 |
| B4 问题/任务/Manifest/自检 | 本轮产物与真实文件图 | P1–P6 通过；维护工具不替代 Kernel，不触碰 Canon |

本表记录本轮编辑前的审查依据和结论；不宣称有已实现的自动语义冲突判断器。

## 验证记录

执行环境：Node.js v24.19.0。对本轮本地完整文件集运行：

- `node scripts/validate-memory.mjs`：退出码 0；首次结果为 46 个文件、190 个本地链接、9 个 ADR、10 个问题记录，全部结构检查通过。补写本审计的引用后在发布前再次运行，最终链接数以检查器输出为准。
- `node scripts/validate-memory.mjs --self-test`：退出码 0；正常基线和 12 个故障检测用例通过。覆盖丢文件、坏链接、坏锚点、未登记文件、ADR 状态漂移、提案进入定案表、丢失原则、交接任务不一致、未知来源、启动顺序漂移、缺批准来源和无法解析的 Manifest。故障样本只存在内存，不修改仓库。

内容演练由本轮同一协作者执行，不是独立新会话测试：

| 用例 | 回答及证据 | 结果 |
| --- | --- | --- |
| H1 | 目标是从零可接手的项目记忆；当前是文档基础与架构提案，创作产品未开始；见 [状态](../../PROJECT_STATE.md) | 通过 |
| H2 | 通用 Kernel、平台无关、题材非底层、能力组合、Library 隔离、作者控制 Canon；理由及来源可沿 [决定索引](../../SETTLED_DECISIONS.md) 读到 ADR-001–006 | 通过 |
| H3 | ADR-007/008、字段/接口、检索和技术选型未定；[ADR 索引](../../adr/README.md) 与规格状态一致 | 通过 |
| H4 | 历史只有有限摘录；完整读取两次超时，六文件基线已核实；[来源登记](../../memory/SOURCE_REGISTER.md) 与 Q001 明确覆盖缺口 | 通过 |
| H5 | 下一步 T002 对 S1–S6 做最小契约演练；[当前任务](../../planning/CURRENT_TASK.md) 有输入、步骤、产出和完成条件 | 通过 |
| H6 | [记忆维护设计](../memory/MEMORY_SYSTEM.md) 指定主记录、关联更新与检查；协作协议要求编辑前 P1–P6 审查 | 通过 |
| H7 | [场景](../architecture/ACCEPTANCE_SCENARIOS.md) 明确实例不污染原版、未确认不写 Canon、过时批准重审及角色误信边界；没有伪称运行时通过 | 通过 |
| H8 | [最新交接](../../memory/handoffs/LATEST.md) 明确本地保存不能证明发布，需核验远端分支/提交；提供版本定位方法 | 通过：流程可复现 |

交叉审查未发现本轮文档与 P1–P6 的未处理冲突。PROJECT_STATE、Manifest、ROADMAP、CURRENT_TASK 和 LATEST 一致指向 T002；已确定目标与提案分开，新增理由没有冒称完整历史。

审计结论：达到“项目记忆初版已建立并完成同会话自检”。Q001/Q010 保持 open，不能提升为“全部历史恢复”或“任意 AI 已验证无缝接手”。

## 自检能力的边界

结构检查只能核对文档关系和结构化约束，不能证明自然语言没有隐藏矛盾。架构 S1–S6 是用例规格，未在产品运行时执行。独立接手 Q010 尚未执行；历史完整性 Q001 尚未解决。远端发布另外核实，不能由本地检查结果推断。

## 2026-09-14 V5 全面设计基线审计

### 编辑前 P1–P6

| 批次 | 内容 | 结论 |
| --- | --- | --- |
| B5 总体蓝图与研究 | 本体、Context Engine、七技能、技术与扩展 | P1 统一对象；P2 平台外围；P3/P4 题材能力组合；P5 素材实例隔离；P6 只产出候选；通过 |
| B6 核心契约 | StoryRecord、Knowledge、Proposal、Context Packet、S1–S6 | 作用域/版本/来源完整，未确认和过时批准不能写 Canon；通过 |
| B7 作者工作流 | 写作、修改、导入、审查、Library、Style | Canon Inbox 显式确认，秘密与人物知识分离；通过 |
| B8 项目治理同步 | 状态、来源、问题、任务、路线、Manifest、交接 | 研究/提案/实现状态分开，未改 accepted ADR；通过 |

### 结构和内容验证

- `node scripts/validate-memory.mjs`：首次发现两份研究文档 authority 值不在允许集合、CURRENT_TASK 提前引用尚未创建的 ADR 编号；修复后退出码 0。
- 修复后结果：51 个文件、235 个本地链接、9 个 ADR、14 个开放问题记录通过。新增文件与 Manifest 登记数均为 51，无未登记或缺失路径。
- `git diff --check`：无空白错误；Windows 工作区仅提示未来 checkout 的 LF/CRLF 转换。
- 全部 Markdown 围栏成对；Context 深度研究保留来源链接和资料边界。

### 人工语义检查

- 本体状态明确为设计仓库，未把文档写成应用已实现。
- Context 外部研究标为 completed，V5 运行评估保持 pending；Q002 未被错误关闭。
- 七技能报告标为 reconstructed audit，原附件与逐文件 hash/脚本/许可审计保留到 Q001/Q013 和 V1.1。
- T002 的 S1–S6 纸面契约已交付，T003 的输入、范围、步骤和完成条件可从 CURRENT_TASK 独立读取。
- 首个工程切片有明确默认技术路线，向量、图数据库、多 Agent、云同步和平台适配以评估或需求后置。

本轮仍未完成 Q010 独立新会话接手，也未运行创作产品测试；这些限制不会因结构检查通过而改变。

## 2026-09-14 T003 运行审计

### P1–P6

| 范围 | 结论 |
| --- | --- |
| 通用记录与 fixture | 使用统一 Record 外壳，没有按题材建表；P1/P3 通过 |
| 平台与能力边界 | 未把发布平台或题材模块嵌入存储；P2/P4 通过 |
| story/branch scope | 两作品、两分支检索隔离通过；Library 未被故事记录反写；P5 通过 |
| Canon transaction | ready proposal 不写入，stale 拒绝、失败回滚、成功才递增 revision；P6 通过 |

### 自动验证

环境：Windows，Node.js 24.19.0，Node 内置 SQLite/FTS5，内存数据库，无第三方运行依赖。

- `npm test`：10/10 通过，单次总时长约 0.24 秒；
- 覆盖跨作品、跨分支、人物误信、他人知识、作者秘密、读者未来信息、未确认写入、原子提交、stale approval、回滚、派生失效和预算遗漏；
- `npm run validate`：通过，61 个文件、255 个本地链接、12 个 ADR、14 个问题记录；随后 10/10 运行测试通过，总时长约 0.24 秒。
- `node scripts/validate-memory.mjs --self-test`：T004 推进后发现故障用例把旧任务号 T002 写死；改为匹配当前 `Next-task` 行后重新执行，正常基线与 12 个故障检测用例全部通过。

### 结论边界

T003 是 Context/Canon 核心的 implemented baseline，可以称为首个可运行纵向切片。它不是完整创作产品，也没有验证百万字性能、语义召回、真实模型、云隐私或多人合并。相应开放项继续保留。

## 2026-09-14 T004 工作流审计

- ModelAdapter 没有 NovelStore 引用，只接收 Context Packet；P6 通过。
- fake draft 只包含获准的顾沉 POV 内容，未出现作者秘密、世界真相或林晚知识；ADR-010 通过。
- suggestion、prepared proposal 和 ready proposal 均不改变 Canon；apply 后 revision 才从 0 变 1，reject 保持 0；ADR-009/012 通过。
- 本地页面和 `/api/compile` 冒烟测试通过，无外部账号或服务。
- T003 10 项与 T004 4 项合计 14/14 通过，一次总时长约 0.41 秒。

界面仍是最小工作流验证器，未完成真实模型、持久化项目、完整编辑器或作者可用性评审。T005 继续处理百万字规模，Q009/Q012 保留产品与隐私范围。

## 2026-09-15 T005 百万字基准审计

固定 seed `novel-ai-os-t005-v1` 在系统临时目录生成数据库并清理，只保留脚本和 JSON。主故事 1,072,358 字符，总记录 2,131，数据库 9,187,328 bytes，建库 324.518 ms。

- 45/45 必须命中，60 次禁止项检查零泄漏，provenance 错误 0；
- 70 次 Context 编译 p50 58.108 ms、p95 66.762 ms、max 70.186 ms；
- 派生摘要失效事务 2.866 ms，stale=true；
- 5 个无共同词的同义改写 0/5，记录为 FTS 能力边界，不伪装成通过。

P1–P6 未被改变：统一记录、平台外围、题材非架构、能力组合、scope 隔离与 proposal transaction 均保持。ADR-013 的混合检索必须在允许集合内运行，不能通过全库向量检索绕过 ADR-010。

## 2026-09-15 T006 混合检索审计

新增 4 项回归后总计 18/18 通过。spy provider 证明语义通道没有接触 gate 外记录；cache 以 model ID + content hash 区分；provider 版本变化建立新 cache；embedding 故障时 FTS 正常降级。

百万字基准：主故事 1,073,770 字符，总记录 2,162。FTS 语义 Recall@16=0/30，fixture embedding/hybrid=30/30、MRR=1；FTS/hybrid 精确查询均为 30/30。hybrid p95 63.737 ms，安全泄漏、provenance 错误和解释缺失均为 0。cache 增加 528,384 bytes。

审核边界：`FixtureConceptEmbeddingProvider` 是确定性测试替身。结果只能证明 policy order、接口、缓存、融合和指标流程，不能证明真实中文 embedding 质量。T007 保留许可证、模型 hash 和自然语料验证。
\n\n## 2026-09-23 T007 运行时适配器审计\n\n- P1–P6：通过。适配器只实现通用 EmbeddingProvider，不改变题材 Kernel、Policy Gate 或 Canon 写入边界。\n- `npm test`：20/20 通过；覆盖批处理、CLS + normalize 参数和错误维度拒绝。\n- 权重校验在加载入口执行，远程模型加载关闭；模型文件和私人语料不进入仓库。\n- 结论：T007 工程接入完成，生产语义质量和完整自然语料评测仍开放。\n