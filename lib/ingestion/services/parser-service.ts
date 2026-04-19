import type { ParseDocumentInput, ParseDocumentOutput, ParsedDocumentBlock } from "../types";

export class ParserService {
  public async parse(input: ParseDocumentInput): Promise<ParseDocumentOutput> {
    const blocks = input.mimeType.includes("pdf")
      ? parsePdfFallback(input.rawContent)
      : parseHtml(input.rawContent);

    const nonEmptyBlocks = blocks.filter((block) => block.textContent.trim().length > 0);
    const parseQualityScore = blocks.length === 0 ? 0 : Math.min(1, nonEmptyBlocks.length / blocks.length);

    return {
      sourceDocumentId: input.sourceDocumentId,
      blockCount: blocks.length,
      parseQualityScore,
      blocks
    };
  }
}

function parseHtml(rawContent: string): readonly ParsedDocumentBlock[] {
  const plainText = rawContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return [];
  return plainText.split(/(?<=[.!?])\s+/).map((sentence, index) => ({
    blockIndex: index,
    blockType: index === 0 ? "heading" : "paragraph",
    textContent: sentence
  }));
}

function parsePdfFallback(rawContent: string): readonly ParsedDocumentBlock[] {
  const lines = rawContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => ({
    blockIndex: index,
    blockType: line.startsWith("- ") ? "bullet" : "paragraph",
    textContent: line
  }));
}
