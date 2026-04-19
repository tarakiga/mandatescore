import { Pool } from "pg";
import type { ParseDocumentOutput } from "../types";

export interface ParsedBlockStore {
  save(parsed: ParseDocumentOutput): Promise<void>;
}

class InMemoryParsedBlockStore implements ParsedBlockStore {
  private readonly records: ParseDocumentOutput[] = [];

  public async save(parsed: ParseDocumentOutput): Promise<void> {
    this.records.push(parsed);
  }
}

class PostgresParsedBlockStore implements ParsedBlockStore {
  private readonly pool: Pool;

  public constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async save(parsed: ParseDocumentOutput): Promise<void> {
    for (const block of parsed.blocks) {
      await this.pool.query(
        `
        INSERT INTO parsed_document_block
          (id, source_document_id, block_index, block_type, text_content, section_path, page_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (source_document_id, block_index) DO UPDATE
        SET block_type = EXCLUDED.block_type,
            text_content = EXCLUDED.text_content,
            section_path = EXCLUDED.section_path,
            page_number = EXCLUDED.page_number
        `,
        [
          crypto.randomUUID(),
          parsed.sourceDocumentId,
          block.blockIndex,
          block.blockType,
          block.textContent,
          block.sectionPath ?? null,
          block.pageNumber ?? null
        ]
      );
    }
  }
}

let singleton: ParsedBlockStore | null = null;

export function getParsedBlockStore(): ParsedBlockStore {
  if (singleton) return singleton;
  const mode = process.env.INGESTION_DATA_STORE?.toLowerCase();
  const connectionString = process.env.DATABASE_URL;
  singleton = mode === "postgres" && connectionString
    ? new PostgresParsedBlockStore(connectionString)
    : new InMemoryParsedBlockStore();
  return singleton;
}
