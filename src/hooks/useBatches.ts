"use client";

import { useCallback, useEffect, useState } from "react";
import type { Batch } from "@/domain/batch/types";
import { createBatch as buildBatch } from "@/domain/batch/batchFactory";
import { getBatchRepository } from "@/repositories/IndexedDbBatchRepository";
import { batchEvents } from "@/repositories/events";

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeBatchId, setActiveBatchIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const repo = getBatchRepository();
      const [all, activeId] = await Promise.all([repo.getBatches(), repo.getActiveBatchId()]);
      if (cancelled) return;
      setBatches(all);
      setActiveBatchIdState(activeId && all.some((b) => b.id === activeId) ? activeId : null);
      setLoading(false);
    };

    void load();
    const unsubscribe = batchEvents.subscribe(() => void load());

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // If nothing is active yet but batches exist, default to the most recently created one.
  useEffect(() => {
    if (!loading && !activeBatchId && batches.length > 0) {
      void getBatchRepository().setActiveBatchId(batches[0].id);
    }
  }, [loading, activeBatchId, batches]);

  const createBatch = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Batch name is required.");
    const repo = getBatchRepository();
    const existing = await repo.findByName(trimmed);
    if (existing) throw new Error(`Batch "${trimmed}" already exists.`);
    const batch = buildBatch(trimmed);
    await repo.createBatch(batch);
    await repo.setActiveBatchId(batch.id);
    return batch;
  }, []);

  const setActiveBatch = useCallback(async (id: string) => {
    await getBatchRepository().setActiveBatchId(id);
  }, []);

  const activeBatch = batches.find((b) => b.id === activeBatchId) ?? null;

  return { batches, activeBatch, activeBatchId, loading, createBatch, setActiveBatch };
}
