import { createEventEnvelope } from "./events/envelope";
import { INGESTION_TOPICS } from "./events/topics";
import { publishTopicEnvelope, type PublishResult } from "./events/publisher";
import { FetcherService } from "./services/fetcher-service";
import { ParserService } from "./services/parser-service";
import { PromiseExtractionService } from "./services/promise-extraction-service";
import { getParsedBlockStore } from "./stores/parsed-block-store";
import type { ParsedDocumentBlock } from "./types";

type DocumentFetchedPayload = {
  readonly topic: typeof INGESTION_TOPICS.documentFetched;
  readonly source_document_id: string;
  readonly content_hash: string;
  readonly blob_path: string;
  readonly mime_type: string;
  readonly language_code: string;
};

type DocumentParsedPayload = {
  readonly topic: typeof INGESTION_TOPICS.documentParsed;
  readonly source_document_id: string;
  readonly block_count: number;
  readonly parse_quality_score: number;
  readonly blocks: readonly ParsedDocumentBlock[];
};

const fetcherService = new FetcherService();
const parserService = new ParserService();
const extractionService = new PromiseExtractionService();

export async function runParsePipeline(input: {
  readonly traceId: string;
  readonly sourceDocumentId: string;
  readonly sourceUrl: string;
}): Promise<{
  readonly fetchedEvent: ReturnType<typeof createEventEnvelope<DocumentFetchedPayload>>;
  readonly parsedEvent: ReturnType<typeof createEventEnvelope<DocumentParsedPayload>>;
  readonly publishResults: readonly PublishResult[];
}> {
  const fetched = await fetcherService.fetch(input.sourceDocumentId, input.sourceUrl);
  const parsed = await parserService.parse({
    sourceDocumentId: input.sourceDocumentId,
    mimeType: fetched.mimeType,
    rawContent: fetched.rawContent
  });
  await getParsedBlockStore().save(parsed);

  const fetchedEvent = createEventEnvelope({
    traceId: input.traceId,
    payload: {
      topic: INGESTION_TOPICS.documentFetched,
      source_document_id: fetched.sourceDocumentId,
      content_hash: fetched.contentHash,
      blob_path: `memory://${fetched.sourceDocumentId}`,
      mime_type: fetched.mimeType,
      language_code: fetched.languageCode
    }
  });
  const fetchedPublish = await publishTopicEnvelope(INGESTION_TOPICS.documentFetched, fetchedEvent);

  const parsedEvent = createEventEnvelope({
    traceId: input.traceId,
    payload: {
      topic: INGESTION_TOPICS.documentParsed,
      source_document_id: parsed.sourceDocumentId,
      block_count: parsed.blockCount,
      parse_quality_score: parsed.parseQualityScore,
      blocks: parsed.blocks
    }
  });
  const parsedPublish = await publishTopicEnvelope(INGESTION_TOPICS.documentParsed, parsedEvent);

  return { fetchedEvent, parsedEvent, publishResults: [fetchedPublish, parsedPublish] };
}

export async function runPromiseExtraction(text: string) {
  return extractionService.extractFromText(text);
}
