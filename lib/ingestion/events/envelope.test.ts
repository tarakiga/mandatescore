import { describe, expect, test } from "vitest";
import { createEventEnvelope, isEventEnvelope } from "./envelope";

describe("event envelope", () => {
  test("creates v1 envelope with required fields", () => {
    const envelope = createEventEnvelope({
      traceId: "trace-123",
      payload: { hello: "world" }
    });

    expect(envelope.schema_version).toBe("v1");
    expect(envelope.trace_id).toBe("trace-123");
    expect(typeof envelope.event_id).toBe("string");
    expect(isEventEnvelope(envelope)).toBe(true);
  });

  test("rejects invalid envelope shape", () => {
    expect(isEventEnvelope({ schema_version: "v2" })).toBe(false);
  });
});
