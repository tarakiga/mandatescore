import { Pool } from "pg";

type ReviewPriority = "low" | "normal" | "high";
type ReviewState = "open" | "in_review" | "resolved";

export type ReviewTask = {
  readonly id: string;
  readonly entityType: "promise" | "link" | "status";
  readonly entityId: string;
  readonly reason: string;
  readonly priority: ReviewPriority;
  readonly state: ReviewState;
  readonly createdAt: string;
  readonly resolvedAt?: string;
  readonly notes?: string;
};

interface ReviewStore {
  enqueue(input: Omit<ReviewTask, "id" | "createdAt" | "state">): Promise<ReviewTask>;
  list(state?: ReviewState): Promise<readonly ReviewTask[]>;
  resolve(taskId: string, notes?: string): Promise<ReviewTask | null>;
}

class InMemoryReviewStore implements ReviewStore {
  private readonly tasks = new Map<string, ReviewTask>();

  public async enqueue(input: Omit<ReviewTask, "id" | "createdAt" | "state">): Promise<ReviewTask> {
    const task: ReviewTask = {
      id: crypto.randomUUID(),
      entityType: input.entityType,
      entityId: input.entityId,
      reason: input.reason,
      priority: input.priority,
      state: "open",
      createdAt: new Date().toISOString()
    };
    this.tasks.set(task.id, task);
    return task;
  }

  public async list(state?: ReviewState): Promise<readonly ReviewTask[]> {
    const all = Array.from(this.tasks.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return state ? all.filter((task) => task.state === state) : all;
  }

  public async resolve(taskId: string, notes?: string): Promise<ReviewTask | null> {
    const existing = this.tasks.get(taskId);
    if (!existing) return null;
    const updated: ReviewTask = {
      ...existing,
      state: "resolved",
      resolvedAt: new Date().toISOString(),
      notes
    };
    this.tasks.set(taskId, updated);
    return updated;
  }
}

class PostgresReviewStore implements ReviewStore {
  private readonly pool: Pool;

  public constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async enqueue(input: Omit<ReviewTask, "id" | "createdAt" | "state">): Promise<ReviewTask> {
    const task: ReviewTask = {
      id: crypto.randomUUID(),
      entityType: input.entityType,
      entityId: input.entityId,
      reason: input.reason,
      priority: input.priority,
      state: "open",
      createdAt: new Date().toISOString()
    };
    await this.pool.query(
      `
      INSERT INTO review_queue (id, entity_type, entity_id, reason, priority, state, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [task.id, task.entityType, task.entityId, task.reason, task.priority, task.state, task.createdAt]
    );
    return task;
  }

  public async list(state?: ReviewState): Promise<readonly ReviewTask[]> {
    const params: unknown[] = [];
    const whereClause = state ? "WHERE state = $1" : "";
    if (state) params.push(state);
    const { rows } = await this.pool.query<{
      id: string;
      entity_type: ReviewTask["entityType"];
      entity_id: string;
      reason: string;
      priority: ReviewPriority;
      state: ReviewState;
      created_at: string;
      resolved_at: string | null;
    }>(
      `
      SELECT id, entity_type, entity_id, reason, priority, state, created_at, resolved_at
      FROM review_queue
      ${whereClause}
      ORDER BY created_at ASC
      `,
      params
    );
    return rows.map((row) => ({
      id: row.id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      reason: row.reason,
      priority: row.priority,
      state: row.state,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at ?? undefined
    }));
  }

  public async resolve(taskId: string, notes?: string): Promise<ReviewTask | null> {
    const resolvedAt = new Date().toISOString();
    const { rowCount } = await this.pool.query(
      `
      UPDATE review_queue
      SET state = 'resolved', resolved_at = $2
      WHERE id = $1
      `,
      [taskId, resolvedAt]
    );
    if (!rowCount) return null;
    const { rows } = await this.pool.query<{
      id: string;
      entity_type: ReviewTask["entityType"];
      entity_id: string;
      reason: string;
      priority: ReviewPriority;
      state: ReviewState;
      created_at: string;
      resolved_at: string | null;
    }>(
      `
      SELECT id, entity_type, entity_id, reason, priority, state, created_at, resolved_at
      FROM review_queue
      WHERE id = $1
      `,
      [taskId]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      reason: row.reason,
      priority: row.priority,
      state: row.state,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at ?? undefined,
      notes
    };
  }
}

let singleton: ReviewStore | null = null;

function getReviewStore(): ReviewStore {
  if (singleton) return singleton;
  const mode = process.env.INGESTION_DATA_STORE?.toLowerCase();
  const connectionString = process.env.DATABASE_URL;
  singleton = mode === "postgres" && connectionString
    ? new PostgresReviewStore(connectionString)
    : new InMemoryReviewStore();
  return singleton;
}

export async function enqueueReviewTask(input: Omit<ReviewTask, "id" | "createdAt" | "state">): Promise<ReviewTask> {
  return getReviewStore().enqueue(input);
}

export async function listReviewTasks(state?: ReviewState): Promise<readonly ReviewTask[]> {
  return getReviewStore().list(state);
}

export async function resolveReviewTask(taskId: string, notes?: string): Promise<ReviewTask | null> {
  return getReviewStore().resolve(taskId, notes);
}
