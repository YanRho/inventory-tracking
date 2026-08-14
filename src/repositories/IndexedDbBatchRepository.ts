import type { Batch } from "@/domain/batch/types";
import type { BatchRepository } from "./BatchRepository";
import { BATCHES_STORE, META_STORE, getDb } from "./db";
import { batchEvents } from "./events";

const ACTIVE_BATCH_KEY = "activeBatchId";

export class IndexedDbBatchRepository implements BatchRepository {
  async getBatches(): Promise<Batch[]> {
    const db = await getDb();
    const batches = await db.getAll(BATCHES_STORE);
    return batches.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBatch(id: string): Promise<Batch | null> {
    const db = await getDb();
    const batch = await db.get(BATCHES_STORE, id);
    return batch ?? null;
  }

  async findByName(name: string): Promise<Batch | null> {
    const db = await getDb();
    const batch = await db.getFromIndex(BATCHES_STORE, "name", name.trim());
    return batch ?? null;
  }

  async createBatch(batch: Batch): Promise<void> {
    const db = await getDb();
    const existing = await db.getFromIndex(BATCHES_STORE, "name", batch.name);
    if (existing) {
      throw new Error(`Batch "${batch.name}" already exists.`);
    }
    await db.add(BATCHES_STORE, batch);
    batchEvents.emit();
  }

  async getActiveBatchId(): Promise<string | null> {
    const db = await getDb();
    const record = await db.get(META_STORE, ACTIVE_BATCH_KEY);
    return record?.value ?? null;
  }

  async setActiveBatchId(id: string): Promise<void> {
    const db = await getDb();
    await db.put(META_STORE, { key: ACTIVE_BATCH_KEY, value: id });
    batchEvents.emit();
  }
}

let singleton: IndexedDbBatchRepository | null = null;

export function getBatchRepository(): BatchRepository {
  if (!singleton) {
    singleton = new IndexedDbBatchRepository();
  }
  return singleton;
}
