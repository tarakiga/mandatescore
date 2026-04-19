export type ParsedBlockType = "heading" | "paragraph" | "table" | "bullet" | "quote";

export type ParsedDocumentBlock = {
  readonly blockIndex: number;
  readonly blockType: ParsedBlockType;
  readonly textContent: string;
  readonly sectionPath?: string;
  readonly pageNumber?: number;
};

export type ParseDocumentInput = {
  readonly sourceDocumentId: string;
  readonly mimeType: string;
  readonly rawContent: string;
};

export type ParseDocumentOutput = {
  readonly sourceDocumentId: string;
  readonly blockCount: number;
  readonly parseQualityScore: number;
  readonly blocks: readonly ParsedDocumentBlock[];
};

export type PromiseCandidate = {
  readonly promiseKey: string;
  readonly statementText: string;
  readonly extractionConfidence: number;
  readonly extractionModelVersion: string;
  readonly rationale: string;
};

export type EvidenceItem = {
  readonly evidenceId: string;
  readonly sourceDocumentId: string;
  readonly evidenceType: "law" | "budget" | "report" | "speech" | "oversight" | "factcheck";
  readonly summary: string;
  readonly confidence: number;
  readonly credibilityTier: 1 | 2 | 3 | 4 | 5;
};

export type PromiseEvidenceLinkCandidate = {
  readonly promiseId: string;
  readonly promiseKey: string;
  readonly evidenceId: string;
  readonly confidence: number;
  readonly requiresReview: boolean;
};

export type PromiseStatus = "kept" | "in_progress" | "broken";

export type PromiseStatusDecision = {
  readonly promiseId: string;
  readonly promiseKey: string;
  readonly status: PromiseStatus;
  readonly confidence: number;
  readonly explanation: string;
  readonly citations: readonly string[];
  readonly requiresReview: boolean;
  readonly classifierModelVersion: string;
  readonly guardrail: {
    readonly passed: boolean;
    readonly reason?: string;
  };
};
