import { describe, expect, test } from "vitest";
import { ParserService } from "./parser-service";

describe("ParserService", () => {
  test("parses html into normalized blocks", async () => {
    const service = new ParserService();
    const result = await service.parse({
      sourceDocumentId: "doc-1",
      mimeType: "text/html",
      rawContent: "<h1>Promise tracker</h1><p>We will build housing quickly.</p>"
    });

    expect(result.sourceDocumentId).toBe("doc-1");
    expect(result.blockCount).toBeGreaterThan(0);
    expect(result.parseQualityScore).toBeGreaterThan(0);
  });

  test("parses pdf fallback by lines", async () => {
    const service = new ParserService();
    const result = await service.parse({
      sourceDocumentId: "doc-2",
      mimeType: "application/pdf",
      rawContent: "Line one\n- Bullet line"
    });

    expect(result.blocks[1]?.blockType).toBe("bullet");
  });
});
