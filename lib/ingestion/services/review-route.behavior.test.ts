import { describe, expect, test } from "vitest";
import { POST as extractPost } from "@/app/api/ingestion/extract-promises/route";
import { GET as listTasksGet } from "@/app/api/review/tasks/route";
import { POST as decidePost } from "@/app/api/review/tasks/[taskId]/decision/route";

describe("review route behavior", () => {
  test("lists and resolves review tasks", async () => {
    await extractPost(
      new Request("http://localhost/api/ingestion/extract-promises", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          officialId: "official-review",
          sourceDocumentId: "doc-review",
          sourceText: "We pledge to improve transport."
        })
      })
    );

    const listResponse = await listTasksGet(new Request("http://localhost/api/review/tasks?state=open"));
    expect(listResponse.status).toBe(200);
    const listPayload = await listResponse.json() as { tasks: Array<{ id: string }> };
    expect(listPayload.tasks.length).toBeGreaterThan(0);

    const decisionResponse = await decidePost(
      new Request("http://localhost/api/review/tasks/decision", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes: "Reviewed" })
      }),
      { params: Promise.resolve({ taskId: listPayload.tasks[0]!.id }) }
    );
    expect(decisionResponse.status).toBe(200);
  });
});
