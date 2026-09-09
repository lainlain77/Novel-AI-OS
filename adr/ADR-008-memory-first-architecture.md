# ADR-008: 项目记忆与运行时记忆边界

Status: proposed
Recorded: 2026-09-09
Sources: SRC-002, SRC-004
Decision authority: 本轮设计提案，尚无作者批准
Supersedes: none

## 背景

外部项目记忆目标已由 ADR-000 接受，但 Context Engine、故事事实、草稿、角色知识和素材检索如何协作还没有完整设计。

## 选项

把所有信息放一个无范围的上下文池；按范围/权威/用途组织并按任务组合；进一步分层或分存储。

这些选项是依据可见材料整理的设计比较；未经完整原对话验证的部分不声称是历史原话。

## 决定或提案

提议明确区分项目记忆、Library、Story Canon、工作草稿和派生摘要/索引，用来源、版本和范围连接；暂不决定数据库数目或检索技术。

## 理由

一条摘要或一个角色的误信不能自动提升为事实；题材能力仍共享 Kernel。分清逻辑责任有利于检查污染和过时信息。

## 后果与未采用项

需要处理派生摘要失效和访问范围；引入额外元数据。逻辑边界不等于已决定部署分层或多数据库。

## 未决事项与重审条件

Q002/Q005/Q008：先验证跨故事隔离、角色误信、Canon 更新后的旧摘要和小预算检索，再形成可批准的实现方案。

有新证据或作者改变目标时可重审，不能静默改写旧决定。

## 关联

[讨论记忆](../memory/discussions/2026-09-09-context-engine.md) · [来源](../memory/SOURCE_REGISTER.md) · [开放问题](../planning/OPEN_QUESTIONS.md) · [原则](../docs/architecture/ARCHITECTURE_PRINCIPLES.md)
