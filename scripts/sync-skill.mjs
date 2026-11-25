// Usage: node scripts/sync-skill.mjs [--check] [--dest <dir>]
// Mirrors the skill's shipping set into installed copies.
// Without --dest, syncs/checks ~/.claude/skills/zifeiyu-ppt-skill and
// ~/.agents/skills/zifeiyu-ppt-skill (whenever ~/.agents/skills exists).
// --check reports drift (exit 1) without writing — run before releases so
// project dir and installed skills never silently diverge.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const check = args.includes('--check');
const di = args.indexOf('--dest');

function resolveDestinations() {
  if (di >= 0 && args[di + 1]) return [resolve(args[di + 1])];
  const targets = [join(homedir(), '.claude/skills/zifeiyu-ppt-skill')];
  const agentsRoot = join(homedir(), '.agents/skills');
  if (existsSync(agentsRoot)) {
    targets.push(join(agentsRoot, 'zifeiyu-ppt-skill'));
  }
  return targets;
}

const SHIP = ['SKILL.md', 'README.md', 'README.en.md', 'package.json', 'assets', 'references', 'scripts', 'templates', 'examples', 'styles', 'docs/styles'];
const EXCLUDE = /(^|\/)(node_modules|\.DS_Store|deck\.pptx|deck\.pdf|deck-web\.pdf|renders|renders-pptx|\.export-crops|\.regress)(\/|$)/;

const walk = (base, dir = base, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (EXCLUDE.test(relative(base, p))) continue;
    statSync(p).isDirectory() ? walk(base, p, out) : out.push(relative(base, p));
  }
  return out;
};
const digest = (p) => {
  const st = statSync(p);
  // big binaries (fonts-src) compare by size; everything else by content
  return st.size > 4 * 1024 * 1024 ? `size:${st.size}` : createHash('sha1').update(readFileSync(p)).digest('hex');
};

const files = SHIP.flatMap((s) => {
  const p = join(root, s);
  if (!existsSync(p)) return [];
  return statSync(p).isDirectory() ? walk(p).map((f) => join(s, f)) : [s];
});

const dests = resolveDestinations();

if (check) {
  let totalDrifted = 0;
  for (const dest of dests) {
    const drift = [];
    for (const f of files) {
      const target = join(dest, f);
      if (!existsSync(target)) drift.push(`missing  ${f}`);
      else if (digest(join(root, f)) !== digest(target)) drift.push(`differs  ${f}`);
    }
    if (drift.length) {
      console.log(`=== ${dest} ===`);
      for (const d of drift.slice(0, 40)) console.log(d);
      if (drift.length > 40) console.log(`... and ${drift.length - 40} more`);
    }
    console.log(`${dest}: ${files.length} files checked, ${drift.length} drifted`);
    totalDrifted += drift.length;
  }
  process.exit(totalDrifted ? 1 : 0);
}

for (const dest of dests) {
  mkdirSync(dest, { recursive: true });
  for (const f of files) cpSync(join(root, f), join(dest, f));
  console.log(`${files.length} files synced to ${dest}`);
}
