"use client";

import { useCallback, useEffect, useState } from "react";
import type { Device } from "@/domain/device/types";
import { getInventoryRepository } from "@/repositories/IndexedDbInventoryRepository";
import { deviceEvents } from "@/repositories/events";

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const repo = getInventoryRepository();
      const all = await repo.getDevices();
      setDevices(all);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load devices.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const repo = getInventoryRepository();
        const all = await repo.getDevices();
        if (cancelled) return;
        setDevices(all);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load devices.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    const unsubscribe = deviceEvents.subscribe(() => void load());

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { devices, loading, error, refresh };
}
