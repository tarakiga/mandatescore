export type ScoreTone = "neutral" | "success" | "warning" | "danger";

// Card tone is intentionally derived from the overall fulfillment score.
// This keeps a single, consistent visual signal across the app.
export function getScoreTone(score: number): ScoreTone {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "danger";
}
