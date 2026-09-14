# Latest Handoff

Updated: 2026-09-14
Completed-task: T003
Next-task: T004
Target: lainlain77/Novel-AI-OS / main
Starting-baseline: 0a3e275b672ad9eb016d5d94b59aac20f3f68981

## 本轮结果

T003 已把纸面契约转成第一份可运行的创作核心。`src/store.ts` 使用 Node 内置 SQLite/FTS5 实现 story/branch/revision、结构化 scope、知识与秘密 Policy Gate、词法检索、token 预算、Context Packet、ChangeProposal、乐观并发、原子提交和递归派生失效。

`src/fixture.ts` 固定两部作品与两个分支，包含同名顾沉、循环规则、世界真相、顾沉误信、林晚知识、作者秘密、读者线索、未来揭示和旧摘要。`tests/context-canon.test.ts` 的 10 项回归全部通过。

新增 [T003 实现记录](../../docs/technical/VERTICAL_SLICE_T003.md)。ADR-008 根据运行证据转 accepted；新增并接受 ADR-009 Canon transaction、ADR-010 knowledge gate、ADR-011 SQLite/FTS5 首版基线。依据是用户已授权本轮全面整理并决定实现基线，且 T003 提供了可复核代码与测试。

## 已验证行为

- story 与 branch 硬隔离，另一作品同名人物和另一分支事实不进入 packet；
- 人物只得到 public 与自己的 Knowledge，读者受 narrative cursor 限制，作者秘密需要显式 grant；
- proposal 保存不写 Canon，应用成功才递增 revision；
- stale approval 被拒绝，多项失败整体回滚；
- 源记录替换后依赖摘要标 stale；
- Context Packet 保留来源、revision、选择原因、预算、遗漏和策略/内容指纹。

## 限制

当前只用小型确定性 fixture 和近似 token 计数。没有真实模型、完整编辑器、内容寻址大文本、百万字语料、向量检索、图投影、云同步或平台发布。FTS5 基线不证明语义召回达标。Q002/Q005/Q009/Q011/Q012/Q014 保留这些边界。

## 下一步

执行 [T004](../../planning/CURRENT_TASK.md)：先定义 Model Adapter 和 deterministic fake，保证模型只能返回 Draft/ChangeProposal；再实现最小作者工作台，显示 Context Inspector、草稿、Canon diff、接受/拒绝与 stale 提示。真实云模型连接和正文外发策略后置到明确配置。

## 恢复与核验

仓库根运行 `npm run validate`，应同时通过项目记忆结构检查和 10 项运行测试；`npm run demo` 输出顾沉 POV packet。发布前比较远端 main，不覆盖并行修改。只有 GitHub 上可读取到提交和文件时才能报告已同步。
