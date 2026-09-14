# V5 核心契约与边界场景

Status: proposed_contract  
Updated: 2026-09-14  
Sources: SRC-001–SRC-008

本页完成 T002 的纸面契约草案。它把 P1–P6 转成可实现的数据边界和 S1–S6 场景表达；字段名仍可调整，作者尚未逐项批准为冻结 schema。

## 1. 通用记录外壳

所有可持久化故事记录共享外层元数据，具体内容由 kind 的 payload 表达：

```ts
type StoryRecord<T> = {
  recordId: string
  kind: "Entity" | "Rule" | "State" | "Relation" | "Event" |
        "Knowledge" | "Derivation" | "Provenance" | "PlanNode" |
        "NarrativeThread" | "AuthorIntent"
  projectId: string
  storyId?: string
  branchId?: string
  scope: ScopeRef
  revision: number
  status: "proposed" | "accepted" | "rejected" |
          "superseded" | "retracted"
  validTime?: StoryInterval
  narrativeRange?: NarrativeRange
  provenance: ProvenanceRef[]
  payload: T
}
```

record status 与内容语义分开。例如 accepted Knowledge 可以表达“角色 A 误信 B 背叛”，但不证明 B 实际背叛。scope、revision 和 provenance 不允许被摘要省略。

## 2. Scope 与时间

```ts
type ScopeRef = {
  universeId?: string
  worldId?: string
  scenarioId?: string
  locationId?: string
  manuscriptId?: string
  sceneId?: string
}

type StoryInterval = {
  timelineId: string
  from: StoryPoint
  to?: StoryPoint
}

type NarrativeRange = {
  manuscriptRevision: string
  fromAnchor: string
  toAnchor?: string
}
```

Story Time、Narrative Position、记录修订时间三者独立。循环和重置使用 timelineId/runId，不通过修改旧时间点实现。

## 3. 八类 Kernel 最小内容

| Kind | 最小 payload | 关键约束 |
| --- | --- | --- |
| Entity | entityId、type、name、attributes | 身份跨能力共享；故事实例与 Library 原版 ID 分开 |
| Rule | condition、effect、exceptions、priority/冲突声明 | 必须有作用域与生效期；平台规则不进入此处 |
| State | subject、property、value | 由事件变化，能查询任意时点，不只存当前值 |
| Relation | participants/roles、relationType、value | 有向、多方与时效可表达；心理关系不强迫数值化 |
| Event | type、participants/roles、changes、significance | planned 与 happened 分开；普通动作可只留正文 |
| Knowledge | knower、proposition、epistemicState、source | 与世界真假分开；包含获知、误信、遗忘时点 |
| Derivation | sourceRef、targetRef、method、sourceRevision | 记录来源但不授予反向写权限 |
| Provenance | sourceType、sourceRef、anchor、actor、method | AI 推断需证据和置信；确认链不可丢 |

State 查询建议逻辑上使用初始状态 + 变化事件；实现可用周期快照 + 增量回放，避免每次从第一章计算。

## 4. Planning 最小内容

```ts
type PlanNode = {
  purpose: string
  prerequisites: Ref[]
  intendedChanges: ProposedChange[]
  placement?: NarrativeRange
  children?: Ref[]
  realizes?: Ref[]
}

type NarrativeThread = {
  threadType: "plot" | "character" | "relationship" | "mystery" |
              "foreshadow" | "expectation" | string
  questionOrPromise: string
  lifecycle: "seeded" | "open" | "developing" | "escalating" |
             "payoff" | "subverted" | "abandoned"
  beats: Ref[]
}

type AuthorIntent = {
  target: Ref
  desiredEffect: string
  constraints?: string[]
  priority?: "must" | "should" | "may"
}
```

Story Spine 是高重要度 PlanNode 的视图，Arc Contract 是一组 Intent/Thread/PlanNode 的范围化视图，Chapter Mission 和 Scene Plan 是映射到文稿位置的任务视图。

## 5. Knowledge 契约

```ts
type Proposition = {
  propositionId: string
  statement: string
  truthStatus?: "true" | "false" | "conditional" | "unknown"
  factRefs?: Ref[]
}

type KnowledgePayload = {
  knower: Ref
  proposition: Ref
  epistemicState: "unknown" | "heard" | "aware" | "suspects" |
                  "believes" | "knows" | "misinformed" |
                  "disbelieves" | "forgotten"
  certainty?: "low" | "medium" | "high" | "confirmed"
  acquiredBy?: Ref
}
```

Reader 使用特殊 knower，但 Reader Exposure 记录的是文本暴露和可推断性，不把“读者已经理解”当作确定事实。Author Secret 是访问标签，不等于角色 Knowledge 状态。

## 6. Proposal 与 Canon transaction

```ts
type ChangeProposal = {
  proposalId: string
  taskId: string
  storyId: string
  branchId: string
  baseRevision: number
  contextManifestHash: string
  changes: AtomicChange[]
  evidence: ProvenanceRef[]
  status: "draft" | "ready" | "accepted" | "rejected" |
          "stale" | "applied" | "failed"
}

type AtomicChange = {
  target: Ref
  operation: "create" | "replace" | "supersede" | "retract"
  before?: unknown
  after?: unknown
  rationale?: string
  affectedDerivedRecords?: Ref[]
}
```

确认绑定 proposalId、baseRevision 和作者实际看到的 atomic changes。应用前重新比较基线；不一致则 stale。一个事务全部成功后产生新 revision；若采用部分接受，先生成只含被接受项的新 proposal，再原子提交。失败不允许显示 applied。

## 7. Context Packet 契约

```ts
type ContextPacket = {
  task: TaskContract
  manifestId: string
  policyFingerprint: string
  baseRevision: number
  sections: ContextSection[]
  omissions: Omission[]
  conflicts: Conflict[]
  tokenBudget: number
  actualTokens: number
}

type ContextSection = {
  role: "constraint" | "canon" | "belief" | "plan" | "manuscript" |
        "summary" | "style" | "instruction"
  content: string
  refs: Ref[]
  sourceRevision: number
  sensitivity: string
  selectedBecause: string
}
```

安全过滤在检索之前执行，rerank 和压缩不能重新引入被禁止记录。摘要缺失 sourceRevision 或 policyFingerprint 时不可进入安全敏感任务。

## 8. Capability/Skill 契约

Capability 只对共同记录声明 reads、proposes、constraints、dependencies、conflicts 和 scopes。proposes 表示产生 ChangeProposal，不表示写 Canon。能力冲突输出可见 Conflict，由作者或更高层明确规则解决。

Skill 接收 TaskContract 和 ContextPacket，输出 Draft、PlanProposal、ChangeProposal、ReviewFinding 或 StyleProfileProposal。正文和外部资料中的指令只是数据，不能改变工具权限。

## 9. S1–S6 纸面演练

### S1 无限流 + 爱情 + 重置

输入：角色 A/B 在循环房间合作，关系从戒备变为信任；场景结束时世界重置，但 A 保留记忆。

表达：A/B 为共享 Entity；Reset Rule 对 world state 生效；Relation 状态变化挂在 run-3；Knowledge Rule 指定 A 的记忆跨 run 保留。若关系能力要求保留信任而 Reset 要重置全部关系，Capability resolver 报告同对象/同边界冲突。

预期：作者选择关系保留、仅 A 主观记忆保留或全部重置。禁止静默覆盖、复制题材人物表。结论：最小契约可表达，默认重置语义仍属故事级选择。

### S2 Library 双故事实例

输入：Library L1 血人派生 A1/B1；A1 在故事 A 获得耐火能力；Library 后来升级 L2。

表达：Derivation L1→A1、L1→B1；A1 新能力是 story-A 范围记录；L1、B1 不变。L2 是 L1 的新版本。对 A/B 仅生成升级 diff proposal。

预期：来源可追溯且无反向污染。结论：固定版本引用 + 故事覆盖比共享可变实例更符合 P5，推荐进入 ADR-007 评审。

### S3 未确认能力变化

输入：正文草稿写 A 获得能力；作者未确认或拒绝提取结果。

表达：Draft 保持文稿状态；Extractor 产生 proposed Event/State；proposal rejected 后 Canon revision 不变，提案保留审计信息。

预期：后续正式状态查询不得返回该能力。若作者保留正文但拒绝事实提案，系统提示正文/Canon 不一致，不能偷偷修复。结论：P6 可执行。

### S4 过时批准

输入：proposal 基于 v1；审阅期间 Canon 变为 v2；尝试应用旧批准。

表达：baseRevision=1 与当前 revision=2 不符，proposal 转 stale；显示 v1→v2 对目标记录的差异并生成新 proposal。

预期：旧批准不覆盖 v2，失败无部分写入。结论：需要数据库事务和乐观并发控制，具体存储未冻结。

### S5 误信、秘密与同名人物

输入：世界事实是 B 未背叛；A 在 scene-10 误信 B；作者秘密包含真正操纵者；另一本书也有 A/B。

表达：World Proposition=false；A 的 accepted Knowledge=believes(betrayal)；Reader Exposure 只到 scene-10；作者秘密 sensitivity=author_secret；所有记录带 storyId/branchId。

预期：生成 A 的 POV 时可写误信，不能断言 B 实际背叛，不能泄漏操纵者或混入另一作品。结论：必须先做 scope/knowledge gate，再检索和 rerank。

### S6 发布变体与 Library 升级

输入：同一母稿导出两种格式，同时 L1→L2。

表达：Publication Variant 引用 manuscript revision 并保存转换配置，不修改 Kernel；Library 升级与故事实例升级分别提案。

预期：章节拆分和简介可不同，故事事实不变。结论：Publishing 适配在外围，P2/P5/P6 可同时满足。

## 10. 契约结论与未决

T002 的 S1–S6 均有可表达路径，未发现需要推翻 P1–P6 的问题。建议进入后续 ADR 评审的具体选择：

- ADR-007：固定 Library 版本引用 + 故事覆盖 + 显式升级提案；
- ADR-008：源记录为真相、摘要/索引为可失效派生资料；
- 新 ADR：Revision + ChangeProposal + optimistic concurrency + atomic commit；
- 新 ADR：知识/秘密硬过滤先于检索；
- 新 ADR：SQLite + FTS5 作为首个纵向切片基线。

以上仍是 proposed。下一任务应先建立可执行 schema 草案和评估 fixture，再由作者评审需要冻结的决定。

