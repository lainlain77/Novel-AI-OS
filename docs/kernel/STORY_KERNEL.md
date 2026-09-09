# Story Kernel 草案

Status: proposed
Sources: SRC-003, SRC-004

统一 Kernel 与八类核心概念有原始依据；本页字段建议及操作语义是本轮提案。不能当作已批准的数据库 schema。

## 八类对象的最小职责

| 对象 | 表达 | 示例 | 需要澄清 |
| --- | --- | --- | --- |
| Entity | 可持续引用的身份 | 角色 A、循环房间 | 跨故事实例 ID 和类型 |
| Rule | 适用范围及条件下的约束 | 午夜重置房间状态 | 生效期与冲突表达 |
| State | 对象在时点/区间的状态 | 房门关闭、角色受伤 | 快照与变化的关系 |
| Relation | 对象间的关系与变化 | A 信任 B | 有向/多方关系、时效 |
| Event | 在范围与时间上的变化 | A 取得钥匙 | 计划事件与已确认事件区别 |
| Knowledge | 主体所知/所信的命题 | A 误以为 B 背叛 | 错误信念、获知时间、可见范围 |
| Derivation | 从版本/素材派生的关系 | 血人原版到故事实例 | 复制与版本引用 |
| Provenance | 证据和演化来源 | 作者确认、素材版本、原文位置 | 撤回、过时和冲突证据 |

## 契约候选

对象或其外层记录需要能够表达身份、故事/分支/素材范围、版本、状态和来源。事件/状态/知识还需适用时间；哪些字段内嵌、哪些由容器提供尚待 T002。

Kernel 的通用性并不要求所有记录都有相同字段，也不要求每种对象独立建表。候选操作为读取对象、验证候选变化、展示影响、应用已批准变化。外层工作流负责作者批准，Kernel 必须能够防止绕过该边界的写入。

Proposed 最小示意（非 schema，不是实际故事 Canon）：

```json
{
  "id": "example:story-a:belief-1",
  "kind": "Knowledge",
  "scope": {"story": "example-a", "branch": "main"},
  "subject": "character-a",
  "claim": "character-b betrayed character-a",
  "belief_status": "believed",
  "effective_after": "scene-03",
  "record_status": "proposed",
  "provenance": [{"kind": "illustrative-example"}]
}
```

作者可以确认“A 相信 B 背叛”，这不自动确认“B 实际背叛”。record_status 和命题真假/信念状态必须区分，避免把 Knowledge 纳入 Canon 时改变世界真相。

## 必须满足的边界

- 同一角色可以同时参与重置规则和关系变化，不复制成两套题材角色。
- 草稿事件不会自动改变当前正式状态；时间和版本有冲突时报告冲突。
- 角色所知、作者已知和读者可见分别表达；角色不能因为模型知道真相就提前获知。
- 来源能区分素材原版、实例、派生和作者确认；跨故事引用不授予写权限。
- 平台规则不成为 Entity/State 的核心必填条件。

## 验证与未决

使用 [S1–S6](../architecture/ACCEPTANCE_SCENARIOS.md) 验证表达是否足够。Q003/Q004/Q005/Q006/Q007 涉及组合、版本、知识、实例和存储；当前没有回答这些问题的完整运行时实现。
