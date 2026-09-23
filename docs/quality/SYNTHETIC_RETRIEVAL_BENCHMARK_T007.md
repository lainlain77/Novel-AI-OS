# T007 合成中文检索基准

## 范围

本基准使用仓库内固定的合成中文故事片段，不读取私人小说正文。12 个查询各对应一个目标记录，另有 96 个公开干扰记录；每个查询重复 5 次，并同时跑语义改写题和带唯一别名的精确题。作品、分支、作者秘密和未来记录同时进入 fixture，用于检查 Policy Gate 和 provenance。语料来源与许可见 [数据声明](T007_DATA_PROVENANCE.md)。

运行命令：

\`\`\`bash
npm run t007:synthetic-benchmark -- --output benchmarks/results/t007-synthetic-local.json
\`\`\`

模型固定为 \`Xenova/bge-small-zh-v1.5\`，revision 为 \`75c43b069aac4d136ba6bc1122f995fedcfd2781\`，量化为 q8，权重 hash 为 \`15b717c382bcb518ba457b93ea6850ede7f4f1cd8937454aa06972366cd19bcc\`。查询使用 BGE 中文检索 instruction，并记录在 provider ID 中。

## 结果

| 查询类型 / 通道 | Recall@1 | Recall@5 | MRR | p50 | p95 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 语义 / SQLite FTS | 0.000 | 0.000 | 0.000 | 约 1.2 ms | 约 1.4 ms |
| 语义 / 本地 dense | 1.000 | 1.000 | 1.000 | 约 6.7 ms | 约 7.8 ms |
| 语义 / hybrid | 1.000 | 1.000 | 1.000 | 约 6.8 ms | 约 8.0 ms |
| 精确 / SQLite FTS | 1.000 | 1.000 | 1.000 | 约 1.3 ms | 约 1.5 ms |
| 精确 / 本地 dense | 0.000 | 0.083 | 0.042 | 约 5.7 ms | 约 6.3 ms |
| 精确 / hybrid | 0.083 | 1.000 | 0.542 | 约 5.9 ms | 约 6.8 ms |

首次建立 108 条向量耗时约 346 ms，原始向量约 216 KiB；加入一条记录的增量 embedding 约 4.9 ms。安全检查为：泄漏 0、provenance 错误 0。hybrid 在精确题的 Recall@5 与 FTS 持平，但 RRF 会让少数目标不在第 1 名，这个排序边界需要产品侧决定是否增加 lexical exact boost。完整机器结果见 [JSON 结果](../../benchmarks/results/t007-synthetic-local.json)。

## 解释边界

这证明固定合成 fixture 上的本地模型、查询 instruction、hybrid 管线和 Policy Gate 可以连通。合成片段不是自然小说，标签不是独立人工标注，结果不能外推为生产中文召回质量，也不关闭真实许可语料评测。

