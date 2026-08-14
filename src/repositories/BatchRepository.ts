import type { Batch } from "@/domain/batch/types";

export interface BatchRepository {
  getBatches(): Promise<Batch[]>;
  getBatch(id: string): Promise<Batch | null>;
  findByName(name: string): Promise<Batch | null>;
  createBatch(batch: Batch): Promise<void>;
  getActiveBatchId(): Promise<string | null>;
  setActiveBatchId(id: string): Promise<void>;
}
