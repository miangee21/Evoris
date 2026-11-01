//src/shared/lib/relative-time.ts
export function formatRelativeTime(
  value: string | null | undefined,
  nowMs: number = Date.now(),
): string {
  if (!value) return "Unknown";
  const ms = /^\d+$/.test(value) ? Number(value) * 1000 : Date.parse(value);
  if (!Number.isFinite(ms)) return "Unknown";
  const diffSeconds = Math.max(0, Math.floor((nowMs - ms) / 1000));
  if (diffSeconds < 60) return "just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60)
    return diffMinutes === 1
      ? "1 minute ago"
      : `${String(diffMinutes)} minutes ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return diffHours === 1 ? "1 hour ago" : `${String(diffHours)} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30)
    return diffDays === 1 ? "1 day ago" : `${String(diffDays)} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12)
    return diffMonths === 1
      ? "1 month ago"
      : `${String(diffMonths)} months ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "1 year ago" : `${String(diffYears)} years ago`;
}
