"use client";

import { useCallback, useEffect, useState } from "react";
import type { Device } from "@/domain/device/types";
import { getInventoryRepository } from "@/repositories/IndexedDbInventoryRepository";
import { deviceEvents } from "@/repositories/events";

export function useDevice(id: string) {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const refresh = useCallback(async () => {
    const repo = getInventoryRepository();
    const found = await repo.getDevice(id);
    setDevice(found);
    setNotFound(!found);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const repo = getInventoryRepository();
      const found = await repo.getDevice(id);
      if (cancelled) return;
      setDevice(found);
      setNotFound(!found);
      setLoading(false);
    };

    void load();
    const unsubscribe = deviceEvents.subscribe(() => void load());

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [id]);

  return { device, loading, notFound, refresh };
}
