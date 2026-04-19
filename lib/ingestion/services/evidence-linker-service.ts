import type { EvidenceItem, PromiseEvidenceLinkCandidate } from "../types";
import type { SavedPromiseRecord } from "../stores/promise-store";

export class EvidenceLinkerService {
  public async createEvidenceAndLinkCandidates(input: {
    readonly sourceDocumentId: string;
    readonly sourceText: string;
    readonly promises: readonly SavedPromiseRecord[];
  }): Promise<{
    readonly evidenceItems: readonly EvidenceItem[];
    readonly links: readonly PromiseEvidenceLinkCandidate[];
  }> {
    const evidenceItems = extractEvidenceItems(input.sourceDocumentId, input.sourceText);
    const links = generateLinkCandidates(input.promises, evidenceItems);
    return { evidenceItems, links };
  }
}

function extractEvidenceItems(sourceDocumentId: string, sourceText: string): readonly EvidenceItem[] {
  const statements = sourceText
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return statements
    .filter((line) => /\b(passed|approved|budget|report|audit|hearing|announced)\b/i.test(line))
    .map((line) => ({
      evidenceId: crypto.randomUUID(),
      sourceDocumentId,
      evidenceType: classifyEvidenceType(line),
      summary: line,
      confidence: 0.78,
      credibilityTier: classifyCredibilityTier(line)
    }));
}

function classifyEvidenceType(text: string): EvidenceItem["evidenceType"] {
  if (/budget|fund/i.test(text)) return "budget";
  if (/report|audit/i.test(text)) return "report";
  if (/hearing|oversight/i.test(text)) return "oversight";
  if (/passed|approved|law/i.test(text)) return "law";
  if (/fact.?check/i.test(text)) return "factcheck";
  return "speech";
}

function classifyCredibilityTier(text: string): EvidenceItem["credibilityTier"] {
  if (/passed|approved|law|gazette|official/i.test(text)) return 5;
  if (/budget|fund|report|audit/i.test(text)) return 4;
  if (/oversight|hearing/i.test(text)) return 3;
  if (/speech|announced/i.test(text)) return 2;
  return 1;
}

function generateLinkCandidates(
  promises: readonly SavedPromiseRecord[],
  evidenceItems: readonly EvidenceItem[]
): readonly PromiseEvidenceLinkCandidate[] {
  const links: PromiseEvidenceLinkCandidate[] = [];
  for (const promise of promises) {
    for (const evidence of evidenceItems) {
      const confidence = overlapScore(promise.statementText, evidence.summary);
      if (confidence < 0.2) continue;
      links.push({
        promiseId: promise.promiseId,
        promiseKey: promise.promiseKey,
        evidenceId: evidence.evidenceId,
        confidence,
        requiresReview: confidence < 0.7
      });
    }
  }
  return links;
}

function overlapScore(a: string, b: string): number {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 || setB.size === 0) return 0;
  let overlap = 0;
  setA.forEach((token) => {
    if (setB.has(token)) overlap += 1;
  });
  return Number((overlap / Math.max(setA.size, setB.size)).toFixed(2));
}

function tokenize(text: string): readonly string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}
