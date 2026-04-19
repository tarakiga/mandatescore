import type { PromiseCandidate } from "../types";

export class PromiseExtractionService {
  public async extractFromText(sourceText: string): Promise<readonly PromiseCandidate[]> {
    const statements = sourceText
      .split(/(?<=[.!?])\s+/)
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 20);

    const candidates = statements
      .filter((statement) => /will|pledge|promise|commit/i.test(statement))
      .map((statement, index) => ({
        promiseKey: `promise-${index + 1}-${hashKey(statement)}`,
        statementText: statement,
        extractionConfidence: scoreConfidence(statement),
        extractionModelVersion: "extract-v1",
        rationale: "Contains clear commitment language and a concrete action clause."
      }));

    return candidates;
  }
}

function scoreConfidence(statement: string): number {
  const hasTimeSignal = /\b(by|within|before|after)\b/i.test(statement);
  const hasActionSignal = /\b(build|fund|reduce|expand|create|deliver|ban)\b/i.test(statement);
  const base = 0.65;
  const score = base + (hasTimeSignal ? 0.15 : 0) + (hasActionSignal ? 0.15 : 0);
  return Math.min(0.95, Number(score.toFixed(2)));
}

function hashKey(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
