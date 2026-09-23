# T007 — 中文 Embedding 候选与语料评估基线

Updated: 2026-09-23
Status: pilot-completed (本地小模型试验完成，生产质量未验证)

## 当前结论

首选候选为 `BAAI/bge-m3`。其官方模型卡标注 MIT 许可证、1024 维、8192 token 最大序列长度，并同时提供 dense、sparse 与 multi-vector 方式。它适合先在本地建立可复核的中文检索基线；本仓库仍不得把模型卡的公开 benchmark 当成 Novel-AI-OS 的实测结果。

`jinaai/jina-embeddings-v3` 标注 CC-BY-NC-4.0，不能在没有额外许可审查的情况下作为产品默认模型。`multilingual-e5-large` 可以作为对照，但应在下载前锁定具体 revision、许可证和权重 hash；本轮没有把不完整的搜索摘要当作许可证据。

| 候选 | 官方来源 | 许可证 | 维度 | 最大长度 | 本轮决策 |
| --- | --- | --- | ---: | ---: | --- |
| BAAI/bge-m3 | [模型卡](https://huggingface.co/BAAI/bge-m3) | MIT | 1024 | 8192 | 首选本地候选 |
| jinaai/jina-embeddings-v3 | [模型卡](https://huggingface.co/jinaai/jina-embeddings-v3) | CC-BY-NC-4.0 | 1024（模型卡） | 8192（模型卡） | 非商业许可审查前暂不采用 |
| intfloat/multilingual-e5-large | [模型卡](https://huggingface.co/intfloat/multilingual-e5-large) | 需锁定 revision 后复核 | 1024（模型卡） | 512（模型卡） | 对照候选，未纳入默认依赖 |

## 下载与可复核门槛

在作者批准下载前，不把权重提交到仓库，也不从镜像下载。每个候选必须记录：模型 ID、commit revision、许可证文件 URL、每个权重文件 SHA-256、运行时版本、CPU/GPU、量化方式、构建耗时、索引体积和增量更新时间。只要许可证或 hash 无法复核，就保持 T006 的测试 provider，不得称为生产 embedding。

## 语料边界

当前仓库没有作者提供的小说正文，也没有确认许可的公开小说语料。因此本轮只加入原创短句和标注格式，不复制受版权保护的小说全文。真实评估需要作者自有文本或可证明许可的文本，并保留来源、许可、导入时间和去标识化记录。

## 评估协议

对每条查询分别记录 `relevance` 与 `access_policy`：同义改写、别名、隐喻、指代、伏笔、人物误信、时间边界各至少一组；候选文档必须带 scope、timeline、knower 和 sensitivity。分别跑 FTS、dense、hybrid，报告 Recall@5/10、MRR、p95、索引大小、首次构建和增量更新成本；Policy Gate 后的秘密泄漏必须为 0。T006 的概念映射 provider 结果与真实模型结果分开报告。

## 评测协议实现

评测脚本从命令行读取本地语料和本地题集，题集不会随仓库提交；输出仅供本地使用。脚本支持 FTS、dense 和 hybrid 的 Recall@k、MRR、p95、构建耗时及向量体积统计。

## 来源与限制

- BGE-M3 规格和许可证：[BAAI/bge-m3 model card](https://huggingface.co/BAAI/bge-m3)。
- Jina v3 许可证和规格：[jinaai/jina-embeddings-v3 model card](https://huggingface.co/jinaai/jina-embeddings-v3)。
- BGE-M3 尚未运行；BGE-small 中文量化模型已完成本地试验，不能据此宣称生产质量。
- 已安装 `@huggingface/transformers@3.7.2` 并新增 `scripts/t007_embedding_smoke.mjs`；2026-09-23 从 Hugging Face 下载 `BAAI/bge-m3` 时连接超时，因此尚未生成向量或权重 hash。网络恢复后可直接运行 `node scripts/t007_embedding_smoke.mjs BAAI/bge-m3` 重试。
- 为解决下载超时，已通过 PowerShell 分段下载并校验 `Xenova/bge-small-zh-v1.5` 的官方 ONNX 文件（revision `75c43b069aac4d136ba6bc1122f995fedcfd2781`）。本地 smoke test 已通过：3 条中文输入、512 维 Float32 向量；该模型是临时中文基线，不替代 BGE-M3，模型文件被 `.gitignore` 排除。
- 本地评测结果不随远端提交；生产结论仍需人工标注、access policy/secret leakage 用例和多次运行。

运行检索试验：`npm run t007:retrieval-eval -- <本地UTF-8小说路径> <本地题集JSON路径>`。题集为非空 `[id, query, evidenceAnchor]` 数组，仅在本地保存（建议 `.local/`）；远端不提供小说衍生题集。模型需提前放到 `models/bge-small-zh-v1.5`，脚本禁止远程模型加载。

