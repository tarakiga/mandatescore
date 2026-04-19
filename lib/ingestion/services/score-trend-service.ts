import type { PromiseStatusDecision } from "../types";

export type ScoreRecomputeResult = {
  readonly mandateScore: number;
  readonly keptCount: number;
  readonly inProgressCount: number;
  readonly brokenCount: number;
};

export type TrendRecomputeResult = {
  readonly trendScore: number;
  readonly formulaVersion: string;
  readonly signals: {
    readonly search_volume_index: number;
    readonly recency_index: number;
    readonly evidence_velocity_index: number;
    readonly score_movement_index: number;
  };
};

export class ScoreTrendService {
  public recomputeScore(statusDecisions: readonly PromiseStatusDecision[]): ScoreRecomputeResult {
    const keptCount = statusDecisions.filter((s) => s.status === "kept").length;
    const inProgressCount = statusDecisions.filter((s) => s.status === "in_progress").length;
    const brokenCount = statusDecisions.filter((s) => s.status === "broken").length;
    const total = Math.max(1, keptCount + inProgressCount + brokenCount);
    const mandateScore = Number((((keptCount + inProgressCount * 0.5) / total) * 100).toFixed(2));
    return { mandateScore, keptCount, inProgressCount, brokenCount };
  }

  public recomputeTrend(score: ScoreRecomputeResult): TrendRecomputeResult {
    const searchVolume = clamp(45 + score.keptCount * 8 - score.brokenCount * 3);
    const recency = 80;
    const velocity = clamp(30 + score.inProgressCount * 12);
    const movement = clamp(score.mandateScore);
    const trendScore = Number((0.4 * searchVolume + 0.25 * recency + 0.2 * velocity + 0.15 * movement).toFixed(2));
    return {
      trendScore,
      formulaVersion: "trend-v1",
      signals: {
        search_volume_index: searchVolume,
        recency_index: recency,
        evidence_velocity_index: velocity,
        score_movement_index: movement
      }
    };
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
