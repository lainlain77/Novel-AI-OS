# Novel-AI-OS 七技能重新审计与融合报告 V1.0

Status: reconstructed_audit  
Updated: 2026-09-14  
Scope: 七套公开小说创作 Skill 的方法、风险与 V5 融合边界

## 1. 审计结论

七套技能不是七个应同时运行的“专家系统”，也不能当作七份相互独立的证据。它们大量共享网文生产观念、Markdown 持久化套路、章节工作流和平台经验。V5 应把它们拆成可验证的通用能力，吸收方法，移除平台和固定公式，所有写入统一进入 Canon 提案流程。

最值得融合的共同能力有八类：

1. 长篇持续状态，而不是每章重新提示；
2. 卷目标、章节任务和场景使命的分层规划；
3. 写作前读取当前人物、地点、线程、近期问题和相关原文；
4. 写作后提取事件、状态、知识和线程候选变化；
5. 伏笔、谜团、承诺和期待的生命周期追踪；
6. Plan 与 Actual 分开并能发现偏离；
7. 连续性、结构、人物、情绪和风格的分层审查；
8. 用样本和作者修订形成可撤销的 Style/Procedural Memory。

它们不能直接成为 V5 底层。每章字数、固定爽点、黄金三章、欺—打—悬、升级频率、关键词判定高潮等只能作为可选 Strategy Profile；覆盖式 Markdown 记忆、自动改大纲、自动写回人物状态、把推断当事实则违反 P5/P6。

## 2. 证据范围

本轮已重新读取 GitHub 仓库、原对话可访问记录及其中对七技能的公开索引分析。可识别的技能为：

- `@user_634bbcdc/g113593`
- `@laoxi/fanqiexiaoshuoxiezuo`
- `@davtime/qimaoxiaoshuoxiezuo`
- `@user_fb9c3efc/perfectly-replicate-writing-skills`
- `@clawhub_hanbinsite/my-novel-writer`
- `@davtime/qidianxiaoshuoxiezuo`
- `@user_7ca3a4d6/fiction-crafter`

限制：原对话只向当前任务返回“User attached 1 file”的占位文本，附件二进制、文件树、hash 和脚本没有恢复；GitHub 仓库也未包含七技能源码。因此本报告完成**方法与架构重新审计**，没有冒充完成原压缩包的逐文件供应链审计。历史中曾出现的“96 个 Markdown、72 个唯一内容、41 个文件位于重复组”等统计未能复核，不作为本报告事实。取得原包后应补充 V1.1 附录，不需要推翻已经独立成立的 P1–P6 和融合边界。

## 3. 审计维度

| 维度 | 检查问题 | V5 合格条件 |
| --- | --- | --- |
| 任务入口 | 何时触发，要求用户提供什么 | 能从不同创作阶段进入，不强迫固定模板 |
| 上下文读取 | 读取哪些故事、人物、原文和计划 | 受 ContextGrant、版本、时间和 POV 限制 |
| 记忆模型 | 保存事实、摘要、状态还是经验 | 类型分开，来源可追溯，摘要可失效 |
| 写入权限 | 是否自动更新设定、大纲或记忆 | 只能生成 Proposal，作者确认后进入 Canon |
| 规划模型 | 章节、卷、情节和线程怎样表达 | Plan 与 Actual 分离，节点可移动和分支 |
| 连续性 | 怎样识别人物、物品、关系和伏笔变化 | 回查原文/Canon，不能只靠关键词 |
| 风格学习 | 学习文本特征还是推断作者人格 | 仅学习作品可观察特征，范围可撤销 |
| 平台耦合 | 是否固化某平台频率、字数和套路 | 移到可选策略或 Publishing Layer |
| 可组合性 | 与其他题材/能力同时使用是否冲突 | 在统一 Kernel 上声明依赖与冲突 |
| Provenance | 能否说明规则、事实和结论来自哪里 | 记录技能版本、输入锚点、输出和确认链 |
| 成本 | 是否每次加载全部文件、全书或多 Agent | 任务感知加载，按收益增加复杂度 |
| 安全 | 外部内容能否改变权限或执行工具 | 内容只作数据，不能授予工具和 Canon 权限 |

## 4. 逐项审计

### 4.1 g113593

**主要价值**：关注开篇吸引、情绪变化、读者继续阅读的动机、场景中的承诺与回报。它提醒 V5 不能只保存“世界发生了什么”，还要表达读者被建立了什么期待。

**融合位置**：

- AuthorIntent：作者希望这一段制造何种体验；
- NarrativeThread：Promise、Expectation、Payoff、Consequence；
- Review：检测未兑现期待、情绪曲线和场景出口问题；
- Strategy Profile：作者主动选择时提供商业网文检查。

**不能照搬**：固定开篇字数、黄金三行、每章必须爆点或钩子、评论诱导。系统可以报告“连续六个场景只增加压力”，但应由作者判断这是否符合意图。

### 4.2 fanqiexiaoshuoxiezuo

**主要价值**：把长篇写作视为持续工程，强调卷目标、章节任务、连续性包和断点续写，而不是孤立生成一章。

**融合位置**：

- Volume/Arc Contract 与 Chapter Mission 作为 PlanNode 视图；
- Scene Context Profile：人物当前状态、地点、活跃线程、近期问题和必要原文；
- Episode Card 与断点恢复；
- 写前 Context Contract。

**不能照搬**：平台章节区间、固定爽点密度、默认把所有状态塞进同一 Markdown。Episode Card 是派生导航，关键事实需回到 Canon/原文。

### 4.3 qimaoxiaoshuoxiezuo

**主要价值**：写后回填、卷级规划、情绪/伏笔追踪、关键情节图和审查闭环。它把“写完后更新连续性”变成必要步骤。

**融合位置**：

- Draft Extractor：提取候选 Event、State、Relation、Knowledge；
- Thread Lifecycle：Seeded/Open/Developing/Escalating/Payoff/Subverted/Abandoned；
- Review Pipeline：连续性、人物、因果、线程和意图分层检查；
- Plan/Actual Diff。

**不能照搬**：欺—打—悬、每章完整爽点、关键词直接判定高潮/伏笔、写完自动覆盖人物和大纲。提取结果必须带证据、置信与提案状态。

### 4.4 perfectly-replicate-writing-skills

**主要价值**：用多篇样本、正反例和多个可观察维度分析风格，避免用“细腻”“高级”等空泛标签。

**融合位置**：Style Profile / Procedural Memory，建议维度包括：

- 词汇指纹与禁用表达；
- 句长、节奏和句式分布；
- 段落结构与留白；
- 叙事距离和视角习惯；
- 对话比例、话轮和潜台词；
- 修辞、意象和感官偏好；
- 情绪表达方式；
- 格式习惯；
- 负面约束和作者明确纠正。

**不能照搬**：从作品推断作者身份、价值观、心理或“思维克隆”；复制在世作者的个人风格作为产品核心；把统计特征当硬约束。V5 优先学习用户自己的文本和明确偏好，输出可查看、可撤销、按作品或场景限定。

### 4.5 my-novel-writer

**主要价值**：人物、世界、大纲、章节摘要、未完线索的持久化；允许写作中动态调整计划；把伏笔作为有开闭状态的长期对象。

**融合位置**：

- Story Bible 作为 Canon 的可读投影；
- Entity/State 历史与 Scene Boundary State；
- Episode Card 与 NarrativeThread；
- 计划修改生成显式 Plan Diff；
- 项目恢复清单。

**不能照搬**：用当前人物卡覆盖历史状态、让 JSON/Markdown 成为唯一事实、自动从正文更新大纲并视为已确认。V5 需要事件/状态历史、版本和来源。

### 4.6 qidianxiaoshuoxiezuo

**主要价值**：立项、选题、大纲、卷规划、Bible、逐章、质检、数据复盘和断点续写的生产闭环；关注长线目标、阶段、资源与读者承诺。

**融合位置**：

- 可选的 Project Workflow 模板；
- Story Core、PlanNode、Arc Contract、Resource/Progression Capability；
- Reader Promise / Expectation Thread；
- 写作与复盘任务模板。

**不能照搬**：起点追订逻辑、固定升级/打脸频率、黄金三章或商业公式。平台资料带版本和来源，只能服务外围分析或发布变体。

### 4.7 fiction-crafter

**主要价值**：写新章前主动读取全局走向、卷任务、角色状态、地点、关键剧情、Bible、最近章节和已知问题；审查覆盖多个层次。

**融合位置**：

- Task-aware Context Profile；
- Context Checklist 与缺口提示；
- 章节/场景风险检查；
- Context Inspector，解释每份资料为什么入选；
- Review 分层视图。

**不能照搬**：每次全文加载全部资料、固定爽点密度、所有分析维度强制总分、把审查结论自动写入事实。检查项应随任务、题材能力和作者意图组合。

## 5. 重复与相关性风险

这些技能的相似设计不等于“七个独立专家一致认为”。重新审计必须把以下来源相关性作为默认假设：

- 同一作者、镜像站或二次打包可能复用相同模板；
- 平台写作技能可能共享同一批黄金三章、爽点、字数和钩子规则；
- Markdown memory、chapter summary、learnings 等目录可能来自通用 Agent Skill 模板；
- 同名或改名文件不能按数量重复计票；
- 页面描述、SKILL.md、脚本和 references 的实际行为可能不同。

因此 V1.1 原包复核需要以内容 hash、规范化文本 hash、近似重复、来源 URL、作者、发布时间和脚本调用关系建立谱系。重复组只保留一份方法证据，同时记录各技能怎样改变参数或流程。

## 6. 融合后的通用能力

| V5 能力 | 来自七技能的启发 | 正式输入 | 输出 | 写入边界 |
| --- | --- | --- | --- | --- |
| Story Incubator | 立项与方向生成 | 想法、已有材料、偏好 | Story Core/方向候选 | 不自动确认为 Canon |
| Hierarchical Planner | 卷章场景任务 | Intent、Thread、Canon | PlanNode 与任务视图 | Plan 与 Actual 分离 |
| Context Profile | 写前资料清单 | Task Contract | Context requirements | 不能扩大权限 |
| Context Compiler | 连续性包与断点恢复 | 授权数据、预算 | Context Packet | 只读，不决定事实 |
| Draft Generator | 逐场景写作 | Packet、Scene Mission | Draft | Draft 非 Canon |
| Change Extractor | 写后回填 | Draft、来源锚点 | 候选变化 | 进入 Canon Inbox |
| Thread Manager | 伏笔/期待/谜团追踪 | 计划与实际事件 | 生命周期候选 | 关闭/兑现需证据 |
| Review Pipeline | 多层质检 | Intent、正文、Canon | 有证据的问题列表 | 意见非批准 |
| Style Learner | 多样本风格分析 | 作者授权样本与修订 | Style Profile 候选 | 可撤销、限定作用域 |
| Session Recovery | 长篇持久化 | 最新版本、任务状态 | 恢复包 | 不复制过时摘要为事实 |

## 7. Skill 接入契约

每个未来 Skill 以 manifest 注册：

```yaml
skill_id: string
version: semver
purpose: string
supported_tasks: []
required_context:
  kinds: []
  scopes: []
  max_sensitivity: public|story|author_secret
outputs: []
proposed_changes: []
dependencies: []
conflicts: []
strategy_tags: []
provenance:
  source: string
  license: string|null
permissions:
  canon_write: false
  library_write: proposal_only
  tool_actions: explicit_workflow_only
```

运行时只加载当前任务需要的技能段落。Skill 的 required_context 是请求，Policy Gate 可以缩小或拒绝；Skill 不能直接取得全文库、其他作品或作者秘密。输出必须标明 skill_id、版本、输入 Context Manifest 和模型运行记录，以便复现和撤销。

## 8. 对 V5 模块的具体改变

七技能不会增加新的底层事实系统，而会带来以下上层设计：

- Planning：加入 Chapter Mission、Arc Contract、Reader Expectation 和 Plan/Actual 视图；
- Context Engine：加入任务 Profile、最近问题、活跃线程和写前缺口检查；
- AI Workflow：固定“生成后提取候选变化 → 审查 → Canon Inbox”的闭环；
- Review：从单次润色拆成连续性、知识、因果、线程、意图和风格证据；
- Memory：加入 Episode Card、Scene Boundary State、Thread State 和批准的 Procedural Memory；
- Library：风格、模式和工作流模板可复用，但故事实例经历不回写；
- UI：Canon Inbox、Thread Board、Context Inspector 和 Style Profile 编辑器。

## 9. 不应实现的模式

以下模式直接列入反模式清单：

- 同时把七套 SKILL.md 全文拼到每次提示；
- 按题材创建七套人物、世界、记忆和剧情数据库；
- 用关键词出现次数决定爽点、高潮、伏笔是否存在；
- 写完章节自动覆盖人物卡、Bible、当前状态和大纲；
- 用一个不断增长的 Markdown 文件保存百万字全部记忆；
- 将章节摘要当作 Canon 证据，且不记录源版本；
- 让平台规则决定通用 Kernel 或强制每章结构；
- 通过模仿技能推断作者本人身份、心理和价值观；
- 让 Skill 的脚本因正文中的指令取得工具权限；
- 把多个相似技能的相同规则当作独立投票提高置信度。

## 10. 分阶段落地

### Stage A：无插件运行

先把融合能力写入 V5 自身契约：Context Profile、PlanNode/Thread、Episode Card、Change Proposal、Review Finding 和 Style Profile。SQLite + FTS5 可支持首个纵向切片。

### Stage B：内部 Skill Adapter

将写前检查、写后提取、线程审查和风格分析实现为内置 Skill manifest。每项通过固定评估夹具，验证权限、来源、Canon 不变和失败恢复。

### Stage C：外部 Skill 导入

增加静态审计：文件 hash、许可证、脚本、网络/文件权限、提示注入、写入声明、重复来源。默认沙箱运行，外部 Skill 只返回结构化建议。

### Stage D：可共享生态

稳定 manifest 和评估后再支持用户安装、版本锁定、升级差异和撤销。评分以任务通过率、污染率、来源准确率、成本和作者采纳率为主，不以“生成字数”排名。

## 11. V1.1 原包复核清单

取得 `novel-skills-7pack.tar.gz` 后执行：

1. 记录原包 SHA-256、大小、文件时间和来源；
2. 安全列出目录，不执行任何脚本；
3. 对所有文件做 SHA-256、规范化文本 hash 与近似重复聚类；
4. 逐个读取 SKILL.md、manifest、scripts、references 和示例；
5. 建立文件 → 技能 → 来源 → 规则 → V5 模块映射；
6. 标记硬编码字数、节奏、平台规则、自动写回和越权行为；
7. 核对许可证、外链、安装命令、依赖和供应链风险；
8. 对本报告逐条标为 confirmed、revised、rejected 或 not_present；
9. 将差异追加到报告，不擦除 V1.0 的证据限制；
10. 更新 SOURCE_REGISTER、Manifest、审计日志和交接。

## 12. 最终融合判断

七技能最适合作为 **workflow pattern library** 和 **review/context profile 来源**。它们不应直接决定 V5 的数据模型、事实权威或作者流程。V5 的稳定底座仍是统一 Kernel、版本化 Canon、人物/读者知识隔离、任务感知 Context Engine、显式 Proposal/Confirm 工作流和可追溯派生链。

报告的逐文件复核缺口是来源完整性问题，不影响上述架构判断；它影响的是对某个具体文件、脚本和版本的归因。该缺口保留在 Q001，并由 V1.1 清单关闭。

