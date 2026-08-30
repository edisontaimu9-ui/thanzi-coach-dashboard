import { useState, useEffect, useCallback, useRef } from "react";
import { ENDPOINT, TOKEN, CACHE_KEY } from "../config.js";
import { readCache, writeCache } from "./cache.js";

/**
 * Fetches /stats?days=N from the Thanzi Coach worker, with a localStorage
 * fallback: if the network request fails but a previous successful result
 * for this range is cached, that cached result is shown with status
 * "stale" instead of a hard error screen.
 *
 * Returns { data, status, errMsg, lastUpdated, reload, autoRefresh, setAutoRefresh }.
 * status: "loading" | "refreshing" | "ok" | "stale" | "error"
 *   - "error" only happens when there's no cached data at all to fall back to.
 */
export function useStats(days) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const timerRef = useRef(null);

  const cacheKey = `${CACHE_KEY}:${days}`;

  // On range change, show any cached value immediately while the fresh
  // fetch is in flight, instead of a blank loading state.
  useEffect(() => {
    const cached = readCache(cacheKey);
    if (cached) {
      setData(cached.data);
      setLastUpdated(new Date(cached.savedAt));
    } else {
      setData(null);
      setLastUpdated(null);
    }
  }, [cacheKey]);

  const load = useCallback(async () => {
    setStatus((s) => (s === "ok" || s === "stale" ? "refreshing" : "loading"));
    setErrMsg("");
    try {
      const res = await fetch(`${ENDPOINT}?token=${TOKEN}&days=${days}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const now = new Date();
      setData(json);
      setStatus("ok");
      setLastUpdated(now);
      writeCache(cacheKey, { data: json, savedAt: now.toISOString() });
    } catch (e) {
      const cached = readCache(cacheKey);
      if (cached) {
        setData(cached.data);
        setLastUpdated(new Date(cached.savedAt));
        setStatus("stale");
      } else {
        setStatus("error");
      }
      setErrMsg(e.message || "Request failed");
    }
  }, [days, cacheKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(load, 60000);
      return () => clearInterval(timerRef.current);
    }
    return undefined;
  }, [autoRefresh, load]);

  return { data, status, errMsg, lastUpdated, reload: load, autoRefresh, setAutoRefresh };
}
