# ADR-009: Canon 提案使用修订绑定与原子事务

Status: accepted
Recorded: 2026-09-14
Sources: SRC-001, SRC-005
Decision authority: 用户授权本轮整理并决定实现基线；P6 为既定约束
Supersedes: none

## 背景

AI 产出的候选变化不能自动成为 Canon。作者审阅期间 Canon 可能继续变化，多项变化也可能部分失败，因此“点击接受”必须绑定作者看到的具体基线和变更集合。

## 选项

候选包括直接更新 Canon、逐项非事务写入，以及带基线和变更集的原子 proposal。前两项不能可靠解释批准范围，也不能防止部分失败。

## 决定或提案

采用 `ChangeProposal + baseRevision + contextManifestHash + atomic changes`。proposal 保存和应用分开；应用前比较 branch 当前 revision，全部预检查通过后在单个数据库事务中提交。过时 proposal 转为 stale；部分接受通过生成一份只含所选变化的新 proposal 表达。

## 理由

这一方案直接满足 P6，能解释作者批准了什么、依据是什么，并阻止旧批准覆盖新 Canon。事务和乐观并发控制比在 UI 层拼接多次写入更容易验证与恢复。

## 后果与未采用项

每个分支需要单调 revision，所有 Canon 写入必须经过统一事务边界。历史记录保留 superseded revision；派生资料按 dependency edge 失效。未来多人协作可以替换存储和合并算法，但不能绕过提案、基线检查和可审计提交。

## 未决事项与重审条件

T003 已运行保存不写入、成功原子提交、过时拒绝、多变化回滚和摘要失效测试。多人实时合并、离线同步和跨设备恢复仍在 Q014；若其需求证明单 revision 无法承载，可新增替代 ADR，但必须保留 P6。

## 关联

[实现记录](../docs/technical/VERTICAL_SLICE_T003.md) · [核心契约](../docs/architecture/CORE_CONTRACTS.md) · [ADR-005](ADR-005-canon-control.md)
