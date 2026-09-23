import { pipeline, env } from '@huggingface/transformers';
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.cacheDir = './.hf-cache';

const model = process.argv[2] || './models/bge-small-zh-v1.5';
const samples = ['旧钥匙被藏在花盆底下', '守门人害怕水却假装勇敢', '三年前那场火灾之后的钟声'];
console.log(`loading ${model}`);
const extractor = await pipeline('feature-extraction', model, { dtype: 'q8' });
const output = await extractor(samples, { pooling: 'cls', normalize: true });
console.log(JSON.stringify({ model, rows: output.dims?.[0] ?? samples.length, dims: output.dims?.at(-1), dtype: output.data?.constructor?.name }));

