# Project History

Updated: 2026-09-14

精确时间仅来自已取得的 Git 记录。对话中的概念演化与代码仓库事件分别记录；没有证据的日期不补写。

## 已核实仓库事件

以下时间为 UTC，上海时间加 8 小时。

| UTC 时间 | 提交 | 实际内容 |
| --- | --- | --- |
| 2026-09-09 04:56:36 | [b588ad7](https://github.com/lainlain77/Novel-AI-OS/commit/b588ad766f53fe3bc0071b813b0768112c1f5400) | Initial commit：README |
| 2026-09-09 05:50:10 | [a735c3a](https://github.com/lainlain77/Novel-AI-OS/commit/a735c3a4dd62d0cd42204f896b3882c2a1d026ba) | 新增 AI_START_HERE |
| 2026-09-09 05:50:15 | [6be18af](https://github.com/lainlain77/Novel-AI-OS/commit/6be18afc2df4ab57ef3cfc1033b49b721661db13) | 新增 PROJECT_STATE |
| 2026-09-09 05:50:20 | [a7d90ff](https://github.com/lainlain77/Novel-AI-OS/commit/a7d90fff72334dc00a94bad83f4e7f3fda950506) | 新增 Context Manifest |
| 2026-09-09 05:50:25 | [3895568](https://github.com/lainlain77/Novel-AI-OS/commit/3895568ff6a548f1fa202e8a42fc1915e8fcd98f) | 新增架构原则 |
| 2026-09-09 05:56:11 | [2e8c2ae](https://github.com/lainlain77/Novel-AI-OS/commit/2e8c2ae65ba98bb34375e6b973f0ac3da5d7d7b5) | 强化状态追踪要求 |
| 2026-09-09 05:56:16 | [a4975d9](https://github.com/lainlain77/Novel-AI-OS/commit/a4975d94333375076c49e79076776bf954bc1929) | 新增 AI 协作协议；本轮审计基线 |

证据范围：[SRC-003](memory/SOURCE_REGISTER.md)。读取该基线时仅有六个文件，未有 ADR、讨论记忆、开放问题或产品实现。

## 概念演化摘要

根据 SRC-002 的助手摘要，项目从 AI 写作工具的想法扩展为通用小说创作系统，讨论了通用 Kernel、可组合能力、可复用素材与故事实例隔离，随后强调仓库外部记忆和跨 AI 接手。具体发生日期和完整论证待 Q001 补录。

不能据此认定“阶段 1–4”已完成，也不能由 V5 名称反推存在四个已发布版本。原对话列出的下一批文件属于计划，完成与否应检查对应提交。

## 2026-09-09 本轮资料整理

以 SRC-001 为范围补齐讨论、ADR、问题、架构草案及交接，修复虚空目录导航，建立可重复检查。该事件的精确提交由 Git 保存，见 [变更日志](CHANGELOG.md) 和 [审计记录](docs/quality/AUDIT_LOG.md)；避免为自引用提交号反复制造新提交。

下一阶段是契约和场景验证，而非直接假定架构已冻结开始完整应用开发。

## 2026-09-14 V5 全面整理

通过已连接的 GitHub App 定位并核实 lainlain77/Novel-AI-OS，拉取 main 的 769ba3b 作为本轮起点。用户要求全面整理项目本体、疑问、后续和扩展，并授权本轮选择组织与首个实现基线。

本轮把 Context Engine 外部研究、七技能方法审计、V5 总体蓝图、核心契约和作者工作流纳入仓库，完成 T002 的 S1–S6 纸面演练。来源与附件限制分别登记为 SRC-005–008 和 Q001/Q013。产品代码仍未开始，下一阶段为 T003 可执行 schema、fixture 和 Context/Canon 纵向切片。

## 2026-09-14 T003 纵向切片

项目首次加入创作运行时代码：TypeScript 类型与应用存储、SQLite/FTS5 schema、任务感知 Policy Gate、Context Packet、Canon proposal transaction、派生失效，以及两作品/两分支 fixture。10 项确定性回归在 Node.js 24.19.0 通过。该里程碑证明核心隔离和事务边界可执行，不代表完整编辑器、模型调用或百万字性能已经完成。ADR-008–011 依据用户授权和运行证据 accepted；下一任务为 T004。
