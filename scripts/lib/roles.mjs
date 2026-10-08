// Fixed role vocabulary shared by every style: layouts declare one via
// data-role; the content-shape decision table and data-honesty rules key on it.
export const ROLES = [
  'cover', 'agenda', 'section', 'statement', 'kpi', 'compare',
  'points', 'process', 'timeline', 'image', 'image-text', 'closing',
  'bars', 'table', 'gallery', 'cycle', 'matrix', 'system', 'video', 'audio',
];
export const CORE_ROLES = ROLES.slice(0, 12);
export const DATA_ROLES = ['kpi', 'bars', 'table'];
