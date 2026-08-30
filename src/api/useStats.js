import { useState, useEffect, useCallback, useRef } from "react";
import { ENDPOINT, TOKEN } from "../config.js";

/**
 * Fetches /stats?days=N from the Thanzi Coach worker.
 * Returns { data, status, errMsg, lastUpdated, reload, autoRefresh, setAutoRefresh }.
 * status: "loading" | "refreshing" | "ok" | "error"
 */
export function useStats(days) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const timerRef = useRef(null);

  const load = useCallback(async () => {
    setStatus((s) => (s === "ok" ? "refreshing" : "loading"));
    setErrMsg("");
    try {
      const res = await fetch(`${ENDPOINT}?token=${TOKEN}&days=${days}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setStatus("ok");
      setLastUpdated(new Date());
    } catch (e) {
      setStatus("error");
      setErrMsg(e.message || "Request failed");
    }
  }, [days]);

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
