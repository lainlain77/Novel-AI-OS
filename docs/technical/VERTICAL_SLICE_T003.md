# T003 Context/Canon 可运行纵向切片

Status: implemented_baseline  
Updated: 2026-09-14  
Runtime: Node.js 24.19.0, built-in SQLite/FTS5, zero third-party dependencies

## 目的

本切片把 `CORE_CONTRACTS` 的安全和 Canon 边界转成第一份可运行证据。它不是完整编辑器，也不调用语言模型；它先验证模型接入之前必须成立的确定性规则。

入口：

- `src/types.ts`：StoryRecord、TaskContract、ContextPacket、ChangeProposal；
- `src/store.ts`：SQLite schema、Policy Gate、FTS5、预算装配、Canon transaction 和派生失效；
- `src/fixture.ts`：两部作品、两个分支、同名人物、循环、误信、作者秘密、读者线索、未来揭示和旧摘要；
- `src/demo.ts`：输出顾沉 POV 的 Context Packet；
- `tests/context-canon.test.ts`：回归标准答案。

运行：

```text
npm test
npm run demo
npm run validate
```

## 数据边界

SQLite 保存 story、branch、record、proposal 和 dependency edge。每条 record 必须带 story/branch、创建修订、叙事位置、visibility、sensitivity 和 provenance。FTS5 索引只负责候选相关性，最终候选仍与结构化的允许记录 ID 求交集。

Policy Gate 的首版规则：

1. 先限定 story、branch、Canon revision、叙事位置、accepted 状态及派生资料有效性；
2. 作者秘密只有 `audience=author` 且任务显式授予 `includeAuthorSecrets` 才可进入；
3. 人物任务只接收 public 记录与该 POV 人物自己的 Knowledge；
4. 读者任务只接收 public/reader 记录，并受 narrative cursor 截止；
5. 排序、预算和输出不得恢复已被过滤的内容。

这些规则故意偏保守。某个世界常识是否对所有人物公开，必须由记录显式标为 public，而不能从“事实为真”推断“人物知道”。

## Context Packet

装配结果包含任务、基线 revision、policy fingerprint、内容 manifest、sections、omissions、token budget 和实际估算。每个 section 保留 record ID、来源 revision、敏感级别、provenance 和入选原因。

当前 token 估算是确定性的字符近似，只用于预算路径测试；接入具体模型时必须由 Model Adapter 提供真实 tokenizer，并把模型/编码器版本写入 manifest。当前 FTS5 是词法基线，不代表百万字召回已达标。

## Canon transaction

提案保存与应用分开。保存 proposal 不改变 Canon。应用时以 `BEGIN IMMEDIATE` 开启事务，比较 proposal 的 `baseRevision` 与 branch 当前 revision，预检查全部 atomic changes，再一次性写入、递增 revision、标记依赖的摘要为 stale，并把 proposal 设为 applied。

任何目标缺失、ID 冲突或跨 scope 修改都会回滚全部变化。基线已变化时，旧 proposal 记为 stale 并拒绝应用。旧 revision 的记录保留 `supersededRevision`，因此可以审计历史视图。

## 2026-09-14 验证结果

在 Windows、Node.js 24.19.0、内存 SQLite 上运行 10 个确定性测试，全部通过，单次总时长约 0.23 秒。覆盖：

- 跨作品同名人物隔离；
- 跨分支隔离；
- POV 自身误信可见，他人知识、世界真相和作者秘密不可见；
- 读者 cutoff 阻止未来揭示；
- 作者秘密需要显式 task grant；
- ready proposal 不自动写 Canon；
- 原子替换和递归派生失效；
- stale approval 拒绝；
- 多变化失败整体回滚；
- 预算遗漏、约束优先和来源指纹。

本结果证明最小安全路径可执行，不证明百万字性能、语义召回质量、模型生成质量、云端隐私或多人合并正确性。Q002/Q009/Q011/Q012/Q014 继续跟踪这些范围。

## 下一扩展点

首选下一步是 Model Adapter 与最小作者工作台：用同一个 Context Packet 生成草稿或结构化 Proposal，在界面上显示来源、遗漏、秘密授权、diff 和 stale 状态。随后扩充固定语料到长篇规模并比较 FTS、向量混合和更长上下文；只有词法召回失败样本稳定出现时才增加向量索引，只有关系多跳任务有明确收益时才增加图投影。

关联：[核心契约](../architecture/CORE_CONTRACTS.md) · [Context 研究](../research/CONTEXT_ENGINE_RESEARCH_2026-09-09.md) · [ADR-009](../../adr/ADR-009-canon-transaction.md) · [ADR-010](../../adr/ADR-010-knowledge-gate.md) · [ADR-011](../../adr/ADR-011-local-storage-retrieval.md)
