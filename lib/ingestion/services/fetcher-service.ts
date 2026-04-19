import { createHash } from "node:crypto";

export type FetchedArtifact = {
  readonly sourceDocumentId: string;
  readonly sourceUrl: string;
  readonly mimeType: string;
  readonly languageCode: string;
  readonly contentHash: string;
  readonly rawContent: string;
};

export class FetcherService {
  public async fetch(sourceDocumentId: string, sourceUrl: string): Promise<FetchedArtifact> {
    const rawContent = `Fetched content for ${sourceUrl}`;
    return {
      sourceDocumentId,
      sourceUrl,
      mimeType: "text/html",
      languageCode: "en",
      contentHash: createHash("sha256").update(rawContent).digest("hex"),
      rawContent
    };
  }
}
