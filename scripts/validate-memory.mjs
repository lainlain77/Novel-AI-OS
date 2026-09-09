#!/usr/bin/env node
// Repository documentation checks only; this is not a story runtime.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = 'CONTEXT_MANIFEST.yaml';
const startup = [
  'AI_START_HERE.md', 'PROJECT_STATE.md', manifestPath,
  'docs/architecture/ARCHITECTURE_PRINCIPLES.md', 'SETTLED_DECISIONS.md',
  'adr/README.md', 'AI_COLLABORATION_PROTOCOL.md', 'memory/SOURCE_REGISTER.md',
  'memory/handoffs/LATEST.md', 'planning/CURRENT_TASK.md', 'planning/OPEN_QUESTIONS.md',
];
const principleMap = {
  P1: 'ADR-001', P2: 'ADR-002', P3: 'ADR-003',
  P4: 'ADR-004', P5: 'ADR-006', P6: 'ADR-005',
};
const authorityTypes = new Set([
  'accepted_decision', 'proposed_design', 'normative', 'working_record', 'provenance', 'tool',
]);

function readSnapshot(dir = root, prefix = '', result = new Map()) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(item.name)) continue;
    if (item.isSymbolicLink()) throw new Error(`Symlink is not supported: ${prefix}${item.name}`);
    const relative = prefix + item.name;
    if (item.isDirectory()) readSnapshot(path.join(dir, item.name), relative + '/', result);
    else result.set(relative, fs.readFileSync(path.join(dir, item.name), 'utf8'));
  }
  return result;
}

function withoutFences(text) {
  return text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
}

function anchors(text) {
  const counts = new Map();
  const result = new Set();
  for (const match of withoutFences(text).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const slug = match[1].trim().toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
    const count = counts.get(slug) || 0;
    counts.set(slug, count + 1);
    result.add(slug + (count ? `-${count}` : ''));
  }
  return result;
}

export function validate(snapshot) {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  let manifest;
  try { manifest = JSON.parse(snapshot.get(manifestPath)); }
  catch (error) { return { errors: [`Manifest parse error: ${error.message}`], fileCount: snapshot.size }; }
  const shapeOK = manifest && typeof manifest === 'object'
    && ['documents', 'startup_order', 'principles', 'sources', 'adrs'].every(k => Array.isArray(manifest[k]))
    && manifest.routes && typeof manifest.routes === 'object'
    && manifest.current_task && manifest.open_questions && Array.isArray(manifest.open_questions.ids)
    && manifest.project;
  if (!shapeOK) return { errors: ['Manifest required fields have invalid shapes'], fileCount: snapshot.size };
  check(manifest.schema_version === 1, 'Unsupported manifest schema_version');
  check(JSON.stringify(manifest.startup_order) === JSON.stringify(startup), 'Startup order differs from the reviewed entry sequence');

  const registered = new Map();
  for (const doc of manifest.documents) {
    check(typeof doc.path === 'string' && !doc.path.includes('\\') && !doc.path.startsWith('/')
      && !doc.path.split('/').includes('..'), `Invalid registered path: ${doc.path}`);
    check(!registered.has(doc.path), `Duplicate document: ${doc.path}`);
    registered.set(doc.path, doc);
    check(snapshot.has(doc.path), `Missing registered file: ${doc.path}`);
    check(authorityTypes.has(doc.authority), `Invalid authority: ${doc.path}`);
    if (doc.authority === 'proposed_design' && snapshot.has(doc.path)) {
      check(/^Status: proposed(?:\b|_)/m.test(snapshot.get(doc.path)), `Proposed document has inconsistent status: ${doc.path}`);
    }
  }
  for (const filename of snapshot.keys()) check(registered.has(filename), `Unregistered file: ${filename}`);

  const references = [...manifest.startup_order, manifest.current_task.path,
    manifest.open_questions.path, manifest.latest_handoff, ...manifest.sources.map(s => s.path),
    ...manifest.adrs.map(a => a.path)];
  for (const [route, files] of Object.entries(manifest.routes)) {
    check(Array.isArray(files) && files.length > 0, `Empty or invalid route: ${route}`);
    if (Array.isArray(files)) references.push(...files);
  }
  for (const filename of references) check(registered.has(filename) && snapshot.has(filename), `Broken manifest reference: ${filename}`);

  const sources = new Map();
  const sourceText = snapshot.get('memory/SOURCE_REGISTER.md') || '';
  for (const source of manifest.sources) {
    check(/^SRC-\d{3}$/.test(source.id) && !sources.has(source.id), `Invalid or duplicate source: ${source.id}`);
    check(sourceText.includes(`## ${source.id} `), `Source missing from register: ${source.id}`);
    sources.set(source.id, source);
  }

  const adrs = new Map();
  const adrIndex = snapshot.get('adr/README.md') || '';
  const settled = snapshot.get('SETTLED_DECISIONS.md') || '';
  for (const adr of manifest.adrs) {
    check(/^ADR-\d{3}$/.test(adr.id) && !adrs.has(adr.id), `Invalid or duplicate ADR: ${adr.id}`);
    adrs.set(adr.id, adr);
    const body = snapshot.get(adr.path) || '';
    check(body.startsWith(`# ${adr.id}: `), `ADR heading mismatch: ${adr.path}`);
    check(['accepted', 'proposed', 'deprecated', 'superseded'].includes(adr.status), `Invalid ADR status: ${adr.id}`);
    check(body.match(/^Status: (\w+)$/m)?.[1] === adr.status, `ADR status mismatch: ${adr.id}`);
    const bodySources = (body.match(/^Sources: (.+)$/m)?.[1] || '').split(', ').sort();
    check(Array.isArray(adr.sources) && JSON.stringify(bodySources) === JSON.stringify([...adr.sources].sort()), `ADR source mismatch: ${adr.id}`);
    for (const id of adr.sources || []) check(sources.has(id), `Unknown ADR source: ${adr.id}/${id}`);
    for (const heading of ['背景', '选项', '决定或提案', '理由', '后果与未采用项', '未决事项与重审条件', '关联']) {
      check(body.includes(`## ${heading}`), `ADR missing section: ${adr.id}/${heading}`);
    }
    const indexRow = adrIndex.split('\n').find(line => line.startsWith(`| [${adr.id}]`));
    check(indexRow?.includes(`| ${adr.status} |`), `ADR index mismatch: ${adr.id}`);
    if (adr.status === 'accepted') {
      check(adr.sources.includes(adr.confirmed_by) && ['current_user_instruction', 'author_confirmation'].includes(sources.get(adr.confirmed_by)?.type), `Accepted ADR lacks confirmation source: ${adr.id}`);
      check(registered.get(adr.path)?.authority === 'accepted_decision', `ADR authority mismatch: ${adr.id}`);
    } else {
      check(!settled.split('\n').some(line => line.startsWith('|') && line.includes(adr.id)), `Unaccepted ADR appears in settled decision table: ${adr.id}`);
      if (adr.status === 'proposed') check(registered.get(adr.path)?.authority === 'proposed_design', `Proposed ADR authority mismatch: ${adr.id}`);
      if (adr.status === 'superseded') {
        const replacement = body.match(/^Superseded-by: (ADR-\d{3})$/m)?.[1];
        check(replacement && manifest.adrs.some(a => a.id === replacement && a.id !== adr.id), `Superseded ADR lacks replacement: ${adr.id}`);
      }
    }
  }
  check(manifest.principles.length === 6, 'Exactly six core principles are required');
  check(new Set(manifest.principles.map(p => p.id)).size === 6, 'Duplicate principle ID');
  const principleText = snapshot.get('docs/architecture/ARCHITECTURE_PRINCIPLES.md') || '';
  for (const [id, expected] of Object.entries(principleMap)) {
    const record = manifest.principles.find(p => p.id === id);
    check(record?.adr === expected && adrs.get(expected)?.status === 'accepted', `Principle mapping/authority mismatch: ${id}`);
    check(principleText.includes(`Principle: ${id} `), `Principle missing from normative document: ${id}`);
  }

  const current = snapshot.get(manifest.current_task.path) || '';
  check(current.includes(`Task-ID: ${manifest.current_task.id}\n`), 'Current task ID mismatch');
  check(current.includes(`Status: ${manifest.current_task.status}\n`), 'Current task status mismatch');
  const handoff = snapshot.get(manifest.latest_handoff) || '';
  check(handoff.includes(`Next-task: ${manifest.current_task.id}\n`), 'Handoff next task mismatch');
  const questions = snapshot.get(manifest.open_questions.path) || '';
  const questionIds = new Set(manifest.open_questions.ids);
  check(questionIds.size === manifest.open_questions.ids.length, 'Duplicate open question ID');
  for (const id of questionIds) check(questions.includes(`## ${id} `), `Missing question detail: ${id}`);
  for (const match of questions.matchAll(/^## (Q\d{3}) /gm)) check(questionIds.has(match[1]), `Unregistered question: ${match[1]}`);

  let linkCount = 0;
  for (const [filename, text] of snapshot) {
    if (!filename.endsWith('.md')) continue;
    const prose = withoutFences(text);
    for (const match of prose.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
      const target = match[1].replace(/^<|>$/g, '').trim();
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
      linkCount++;
      let decoded;
      try { decoded = decodeURIComponent(target); }
      catch { errors.push(`Invalid encoded link in ${filename}: ${target}`); continue; }
      const [targetFile, fragment] = decoded.split('#');
      const resolved = targetFile ? path.posix.normalize(path.posix.join(path.posix.dirname(filename), targetFile)) : filename;
      check(!targetFile.startsWith('/') && !resolved.startsWith('../'), `Link escapes repository: ${filename} -> ${target}`);
      check(snapshot.has(resolved), `Broken Markdown link: ${filename} -> ${target}`);
      if (fragment && snapshot.has(resolved)) check(anchors(snapshot.get(resolved)).has(fragment), `Broken Markdown anchor: ${filename} -> ${target}`);
    }
    for (const match of prose.matchAll(/\b(SRC-\d{3})\b/g)) check(sources.has(match[1]), `Unknown source reference in ${filename}: ${match[1]}`);
    for (const match of prose.matchAll(/\b(Q\d{3})\b/g)) check(questionIds.has(match[1]), `Unknown question reference in ${filename}: ${match[1]}`);
    for (const match of prose.matchAll(/\b(ADR-\d{3})\b/g)) check(adrs.has(match[1]), `Unknown ADR reference in ${filename}: ${match[1]}`);
  }
  return { errors: [...new Set(errors)], fileCount: snapshot.size, linkCount, adrCount: adrs.size, questionCount: questionIds.size };
}

function selfTest(snapshot) {
  const positive = validate(snapshot);
  if (positive.errors.length) throw new Error('Fix baseline before self-test: ' + positive.errors.join('; '));
  const editManifest = (copy, edit) => {
    const value = JSON.parse(copy.get(manifestPath));
    edit(value);
    copy.set(manifestPath, JSON.stringify(value));
  };
  const tests = [
    ['missing file', c => c.delete('docs/kernel/STORY_KERNEL.md'), 'Missing registered file'],
    ['broken link', c => c.set('README.md', c.get('README.md') + '\n[missing](missing.md)\n'), 'Broken Markdown link'],
    ['broken anchor', c => c.set('README.md', c.get('README.md') + '\n[missing](GLOSSARY.md#no-such-section)\n'), 'Broken Markdown anchor'],
    ['unregistered file', c => c.set('extra.md', '# Extra\n'), 'Unregistered file'],
    ['ADR status drift', c => c.set('adr/ADR-007-blueprint-derivation.md', c.get('adr/ADR-007-blueprint-derivation.md').replace('Status: proposed', 'Status: accepted')), 'ADR status mismatch'],
    ['proposal promoted in index', c => c.set('SETTLED_DECISIONS.md', c.get('SETTLED_DECISIONS.md') + '\n| ADR-007 | accepted |\n'), 'Unaccepted ADR'],
    ['missing principle', c => editManifest(c, m => m.principles.pop()), 'Exactly six core principles'],
    ['wrong next task', c => c.set('memory/handoffs/LATEST.md', c.get('memory/handoffs/LATEST.md').replace('Next-task: T002', 'Next-task: T999')), 'Handoff next task mismatch'],
    ['unknown source', c => c.set('README.md', c.get('README.md') + '\nSRC-999\n'), 'Unknown source reference'],
    ['startup drift', c => editManifest(c, m => m.startup_order.reverse()), 'Startup order differs'],
    ['missing approval source', c => editManifest(c, m => { m.adrs[0].confirmed_by = 'SRC-004'; }), 'Accepted ADR lacks confirmation'],
    ['malformed manifest', c => c.set(manifestPath, '{'), 'Manifest parse error'],
  ];
  for (const [name, mutate, expected] of tests) {
    const copy = new Map(snapshot);
    mutate(copy);
    const result = validate(copy);
    if (!result.errors.some(e => e.includes(expected))) throw new Error(`Self-test failed to detect ${name}: ${result.errors.join('; ')}`);
  }
  console.log(`PASS: clean baseline and ${tests.length} failure-detection cases. Fixtures are in memory; no repository files changed.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const snapshot = readSnapshot();
    if (process.argv.includes('--self-test')) selfTest(snapshot);
    else {
      const result = validate(snapshot);
      if (result.errors.length) {
        console.error(result.errors.map(e => `FAIL: ${e}`).join('\n'));
        process.exitCode = 1;
      } else console.log(`PASS: ${result.fileCount} files, ${result.linkCount} local links, ${result.adrCount} ADRs, ${result.questionCount} open question records. Structural checks only; semantic and independent handoff review are separate.`);
    }
  } catch (error) { console.error(`FAIL: ${error.message}`); process.exitCode = 1; }
}
