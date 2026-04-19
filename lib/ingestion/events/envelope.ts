export type EventEnvelope<TPayload> = {
  readonly event_id: string;
  readonly trace_id: string;
  readonly occurred_at: string;
  readonly schema_version: "v1";
  readonly payload: TPayload;
};

type EnvelopeInput<TPayload> = {
  readonly traceId: string;
  readonly payload: TPayload;
  readonly eventId?: string;
  readonly occurredAt?: string;
};

export function createEventEnvelope<TPayload>(input: EnvelopeInput<TPayload>): EventEnvelope<TPayload> {
  return {
    event_id: input.eventId ?? crypto.randomUUID(),
    trace_id: input.traceId,
    occurred_at: input.occurredAt ?? new Date().toISOString(),
    schema_version: "v1",
    payload: input.payload
  };
}

export function isEventEnvelope(value: unknown): value is EventEnvelope<unknown> {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.event_id === "string" &&
    typeof v.trace_id === "string" &&
    typeof v.occurred_at === "string" &&
    v.schema_version === "v1" &&
    "payload" in v
  );
}
