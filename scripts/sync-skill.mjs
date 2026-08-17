// Usage: node scripts/sync-skill.mjs [--check] [--dest <dir>]
// Mirrors the skill's shipping set into the installed copy. --check
// reports drift (exit 1) without writing — run it before releases so the
// project dir and ~/.claude/skills never silently diverge.
import { cpSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const check = args.includes('--check');
const di = args.indexOf('--dest');
const dest = resolve(di >= 0 ? args[di + 1] : join(homedir(), '.claude/skills/zifeiyu-ppt-skill'));

const SHIP = ['SKILL.md', 'README.md', 'README.en.md', 'package.json', 'assets', 'references', 'scripts', 'templates', 'examples'];
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

if (check) {
  const drift = [];
  for (const f of files) {
    const target = join(dest, f);
    if (!existsSync(target)) drift.push(`missing  ${f}`);
    else if (digest(join(root, f)) !== digest(target)) drift.push(`differs  ${f}`);
  }
  for (const d of drift) console.log(d);
  console.log(`\n${files.length} files checked: ${drift.length} drifted`);
  process.exit(drift.length ? 1 : 0);
}

for (const f of files) cpSync(join(root, f), join(dest, f));
console.log(`${files.length} files synced to ${dest}`);
