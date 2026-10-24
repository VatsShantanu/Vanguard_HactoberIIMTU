// ─── "Today" for the whole app (real clock) ────────────────────────────
export const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const TODAY_ISO = toISO(TODAY);

// ─── Category Helpers ──────────────────────────────────────────────────
export const CATEGORY_CONFIG = {
  'Hackathon':      { className: 'cat-hackathon', emoji: '🚀', color: '#6D56FF', light: '#F1EFFF', border: '#AA9FFF' },
  'Academic':       { className: 'cat-academic',  emoji: '📚', color: '#2F6BFF', light: '#E8F1FF', border: '#93B4FF' },
  'Coding Contest': { className: 'cat-contest',   emoji: '💻', color: '#E83CAB', light: '#FFF0FA', border: '#FF94D9' },
  'Workshop':       { className: 'cat-workshop',  emoji: '🛠️', color: '#F59E0B', light: '#FFF7DB', border: '#FBBF24' },
  'Robotics':       { className: 'cat-robotics',  emoji: '🤖', color: '#F04438', light: '#FFE9E7', border: '#FDA29B' },
  'Bootcamp':       { className: 'cat-workshop',  emoji: '⚡', color: '#F59E0B', light: '#FFF7DB', border: '#FBBF24' },
};

export function getCatConfig(category) {
  return CATEGORY_CONFIG[category] || { className: 'cat-workshop', emoji: '📌', color: '#75726A', light: '#F7F6F2', border: '#C9C5B6' };
}

// ─── Countdown ──────────────────────────────────────────────────────────
export function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - TODAY) / 86400000);
}

export function getCountdownLabel(days) {
  if (days === null) return null;
  if (days < 0)   return { label: `${Math.abs(days)}d ago`, urgent: false, past: true };
  if (days === 0) return { label: 'Today', urgent: true, past: false };
  if (days === 1) return { label: 'Tomorrow', urgent: true, past: false };
  if (days <= 3)  return { label: `${days} days left`, urgent: true, past: false };
  return { label: `${days} days`, urgent: false, past: false };
}

// ─── Formatting ─────────────────────────────────────────────────────────
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
export function getDateParts(dateStr) {
  const d = dateStr ? new Date(dateStr) : TODAY;
  return {
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()).padStart(2, '0'),
    weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    year: String(d.getFullYear()),
  };
}
export function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
