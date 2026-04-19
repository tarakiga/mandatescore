import type { EvidenceItem, PromiseStatusDecision } from "../types";
import type { SavedPromiseRecord } from "../stores/promise-store";

const KEPT_MIN_AVG_CONFIDENCE = 0.75;
const KEPT_MIN_CREDIBILITY_TIER = 4;

export class StatusClassifierService {
  public async classify(input: {
    readonly promises: readonly SavedPromiseRecord[];
    readonly evidenceItems: readonly EvidenceItem[];
  }): Promise<readonly PromiseStatusDecision[]> {
    return input.promises.map((promise) => classifyPromise(promise, input.evidenceItems));
  }
}

function classifyPromise(
  promise: SavedPromiseRecord,
  evidenceItems: readonly EvidenceItem[]
): PromiseStatusDecision {
  const matchingEvidence = evidenceItems.filter((evidence) =>
    hasTokenOverlap(promise.statementText, evidence.summary)
  );

  const hasLawOrBudget = matchingEvidence.some(
    (evidence) => evidence.evidenceType === "law" || evidence.evidenceType === "budget"
  );
  const hasHighCredibilityEvidence = matchingEvidence.some(
    (evidence) => evidence.credibilityTier >= KEPT_MIN_CREDIBILITY_TIER
  );
  const hasAnyEvidence = matchingEvidence.length > 0;
  const avgConfidence =
    matchingEvidence.length === 0
      ? 0.45
      : matchingEvidence.reduce((sum, evidence) => sum + evidence.confidence, 0) / matchingEvidence.length;

  const keptCandidate = hasLawOrBudget;
  const guardrailPassed = !keptCandidate || (hasHighCredibilityEvidence && avgConfidence >= KEPT_MIN_AVG_CONFIDENCE);
  const guardrailReason = guardrailPassed
    ? undefined
    : "kept_requires_high_credibility_evidence_and_min_confidence";

  const status: PromiseStatusDecision["status"] =
    keptCandidate && guardrailPassed
      ? "kept"
      : hasAnyEvidence
        ? "in_progress"
        : "broken";
  const confidence = Number(Math.max(0.5, Math.min(0.95, avgConfidence)).toFixed(2));
  const citations = matchingEvidence.map((evidence) => evidence.evidenceId);

  return {
    promiseId: promise.promiseId,
    promiseKey: promise.promiseKey,
    status,
    confidence,
    explanation:
      status === "kept"
        ? "High-quality policy evidence aligns with the promised action."
        : status === "in_progress"
          ? guardrailPassed
            ? "Some supporting evidence exists, but completion criteria are not fully met."
            : "Evidence exists, but kept guardrails were not satisfied; routed as in-progress for review."
          : "No reliable supporting evidence was found for this commitment.",
    citations,
    requiresReview: confidence < 0.7 || status === "broken" || !guardrailPassed,
    classifierModelVersion: "status-v1",
    guardrail: {
      passed: guardrailPassed,
      reason: guardrailReason
    }
  };
}

function hasTokenOverlap(a: string, b: string): boolean {
  const aTokens = new Set(tokenize(a));
  const bTokens = tokenize(b);
  return bTokens.some((token) => aTokens.has(token));
}

function tokenize(text: string): readonly string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}
