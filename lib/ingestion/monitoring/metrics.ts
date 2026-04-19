import type { PublishResult } from "../events/publisher";
import type { PromiseStatusDecision } from "../types";

type ConfidenceBucket = "lt_0_60" | "0_60_to_0_74" | "0_75_to_0_89" | "gte_0_90";

type MetricsState = {
  publishTotal: number;
  publishDeadLetterTotal: number;
  publishLatencyMs: number[];
  classifierDecisionTotal: number;
  classifierConfidenceBuckets: Record<ConfidenceBucket, number>;
};

const state: MetricsState = {
  publishTotal: 0,
  publishDeadLetterTotal: 0,
  publishLatencyMs: [],
  classifierDecisionTotal: 0,
  classifierConfidenceBuckets: {
    lt_0_60: 0,
    "0_60_to_0_74": 0,
    "0_75_to_0_89": 0,
    gte_0_90: 0
  }
};

export function recordPublishResult(result: PublishResult): void {
  state.publishTotal += 1;
  if (result.status === "dead_letter") {
    state.publishDeadLetterTotal += 1;
    state.publishLatencyMs.push(0);
    return;
  }

  const occurred = Date.parse(result.event.envelope.occurred_at);
  const published = Date.parse(result.event.publishedAt);
  const latency = Number.isFinite(occurred) && Number.isFinite(published) ? Math.max(0, published - occurred) : 0;
  state.publishLatencyMs.push(latency);
}

export function recordClassifierDecisions(decisions: readonly PromiseStatusDecision[]): void {
  for (const decision of decisions) {
    state.classifierDecisionTotal += 1;
    state.classifierConfidenceBuckets[toConfidenceBucket(decision.confidence)] += 1;
  }
}

export function getMonitoringSnapshot() {
  const dlqRate = state.publishTotal === 0 ? 0 : Number((state.publishDeadLetterTotal / state.publishTotal).toFixed(4));
  const p95 = percentile(state.publishLatencyMs, 95);
  return {
    publish: {
      total: state.publishTotal,
      deadLetterTotal: state.publishDeadLetterTotal,
      deadLetterRate: dlqRate,
      latencyP95Ms: p95
    },
    classifier: {
      total: state.classifierDecisionTotal,
      confidenceBuckets: { ...state.classifierConfidenceBuckets }
    }
  };
}

export function resetMonitoringMetrics(): void {
  state.publishTotal = 0;
  state.publishDeadLetterTotal = 0;
  state.publishLatencyMs = [];
  state.classifierDecisionTotal = 0;
  state.classifierConfidenceBuckets = {
    lt_0_60: 0,
    "0_60_to_0_74": 0,
    "0_75_to_0_89": 0,
    gte_0_90: 0
  };
}

function toConfidenceBucket(confidence: number): ConfidenceBucket {
  if (confidence < 0.6) return "lt_0_60";
  if (confidence < 0.75) return "0_60_to_0_74";
  if (confidence < 0.9) return "0_75_to_0_89";
  return "gte_0_90";
}

function percentile(values: readonly number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index] ?? 0;
}
