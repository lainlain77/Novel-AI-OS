# T007 合成中文检索基准

## 范围

本基准使用仓库内固定的合成中文故事片段，不读取私人小说正文。12 个查询各对应一个目标记录，另有 96 个公开干扰记录；每个查询重复 3 次。作品、分支、作者秘密和未来记录同时进入 fixture，用于检查 Policy Gate 和 provenance。

运行命令：

\`\`\`bash
npm run t007:synthetic-benchmark -- --output benchmarks/results/t007-synthetic-local.json
\`\`\`

模型固定为 \`Xenova/bge-small-zh-v1.5\`，revision 为 \`75c43b069aac4d136ba6bc1122f995fedcfd2781\`，量化为 q8，权重 hash 为 \`15b717c382bcb518ba457b93ea6850ede7f4f1cd8937454aa06972366cd19bcc\`。查询使用 BGE 中文检索 instruction，并记录在 provider ID 中。

## 结果

| 通道 | Recall@1 | Recall@5 | MRR | p50 | p95 |
| --- | ---: | ---: | ---: | ---: | ---: |
| SQLite FTS | 0.000 | 0.000 | 0.000 | 约 1.2 ms | 约 2.0 ms |
| 本地 dense | 1.000 | 1.000 | 1.000 | 约 7.2 ms | 约 8.4 ms |
| hybrid | 1.000 | 1.000 | 1.000 | 约 7.4 ms | 约 8.3 ms |

安全检查为：泄漏 0、provenance 错误 0；embedding cache 写入 108 条。完整机器结果见 [JSON 结果](../../benchmarks/results/t007-synthetic-local.json)。

## 解释边界

这证明固定合成 fixture 上的本地模型、查询 instruction、hybrid 管线和 Policy Gate 可以连通。合成片段不是自然小说，标签不是独立人工标注，结果不能外推为生产中文召回质量，也不关闭真实许可语料评测。

