import { useState, useEffect, useCallback } from "react";
import { TIMESERIES_ENDPOINT, TOKEN, CACHE_KEY } from "../config.js";
import { readCache, writeCache } from "./cache.js";

/**
 * Fetches /stats/timeseries?days=N — per-day messages and new-user counts
 * for the trend chart. Same stale-while-revalidate caching as useStats.
 * status: "loading" | "refreshing" | "ok" | "stale" | "error"
 */
export function useTimeseries(days) {
  const [series, setSeries] = useState(null);
  const [status, setStatus] = useState("loading");

  const cacheKey = `${CACHE_KEY}:timeseries:${days}`;

  useEffect(() => {
    const cached = readCache(cacheKey);
    setSeries(cached ? cached.data.series : null);
  }, [cacheKey]);

  const load = useCallback(async () => {
    setStatus((s) => (s === "ok" || s === "stale" ? "refreshing" : "loading"));
    try {
      const res = await fetch(`${TIMESERIES_ENDPOINT}?token=${TOKEN}&days=${days}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSeries(json.series);
      setStatus("ok");
      writeCache(cacheKey, { data: json, savedAt: new Date().toISOString() });
    } catch {
      const cached = readCache(cacheKey);
      if (cached) {
        setSeries(cached.data.series);
        setStatus("stale");
      } else {
        setStatus("error");
      }
    }
  }, [days, cacheKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { series, status, reload: load };
}
