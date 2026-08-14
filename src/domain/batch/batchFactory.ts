import { v4 as uuidv4 } from "uuid";
import type { Batch } from "./types";

export function createBatch(name: string, expectedCount?: number): Batch {
  return {
    id: uuidv4(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    expectedCount:
      expectedCount !== undefined && Number.isFinite(expectedCount) && expectedCount > 0
        ? Math.floor(expectedCount)
        : undefined,
  };
}
