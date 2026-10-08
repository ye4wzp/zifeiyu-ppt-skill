import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const STYLE_LINK = /<link[^>]+href="assets\/styles\/([\w-]+)\/style\.css"/;

// A deck is in style mode when it links assets/styles/<id>/style.css;
// anything else is a legacy (pre-style-library) deck with the old rules.
export function loadStyle(indexPath) {
  const html = readFileSync(indexPath, 'utf8');
  const m = html.match(STYLE_LINK);
  if (!m) return { mode: 'legacy' };
  const deckDir = dirname(indexPath);
  const dir = resolve(deckDir, 'assets/styles', m[1]);
  const manifestPath = resolve(dir, 'manifest.json');
  if (!existsSync(manifestPath)) throw new Error(`style "${m[1]}": missing ${manifestPath}`);
  const sheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
    .map((l) => resolve(deckDir, l[1]))
    .filter(existsSync);
  return { mode: 'style', id: m[1], dir, manifest: JSON.parse(readFileSync(manifestPath, 'utf8')), sheets };
}
