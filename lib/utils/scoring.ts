export function scoreColor(score: number): string {
  if (score >= 70) return "var(--color-score-high)";
  if (score >= 40) return "var(--color-score-mid)";
  return "var(--color-score-low)";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Exceptional";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Decent";
  if (score >= 35) return "Weak";
  return "Poor";
}

export function slopLabel(score: number): string {
  if (score >= 75) return "High Slop";
  if (score >= 50) return "Moderate Slop";
  if (score >= 25) return "Low Slop";
  return "Clean";
}

export function slopColor(score: number): string {
  if (score >= 75) return "var(--color-danger)";
  if (score >= 50) return "var(--color-warning)";
  if (score >= 25) return "var(--color-score-mid)";
  return "var(--color-success)";
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function scoreBarWidth(score: number): string {
  return `${clamp(score, 0, 100)}%`;
}
