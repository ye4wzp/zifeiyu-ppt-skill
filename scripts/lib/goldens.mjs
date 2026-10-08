import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// legacy goldens retire as their style packages land (spec §8)
const LEGACY = ['showcase', 'media'];

// Every golden deck with the baseline directory it is compared against.
export function listGoldens(root) {
  const styles = existsSync(join(root, 'styles')) ? readdirSync(join(root, 'styles')).sort() : [];
  return [
    ...LEGACY.filter((d) => existsSync(join(root, 'examples', d, 'index.html')))
      .map((d) => ({ name: d, dir: join(root, 'examples', d), baseline: join(root, 'baselines', d) })),
    ...styles.filter((id) => existsSync(join(root, 'styles', id, 'golden/index.html')))
      .map((id) => ({ name: `styles/${id}`, style: id, dir: join(root, 'styles', id, 'golden'), baseline: join(root, 'baselines/styles', id) })),
  ];
}
