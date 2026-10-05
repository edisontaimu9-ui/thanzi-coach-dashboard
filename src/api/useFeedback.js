import { useState, useEffect, useCallback } from "react";
import { FEEDBACK_ENDPOINT, FEEDBACK_TOKEN_KEY } from "../config.js";

function readToken() {
  try {
    return localStorage.getItem(FEEDBACK_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

/**
 * Fetches /stats/feedback (the rated questions). The token is entered by the owner and stored only
 * in this browser; a 403 clears it so the unlock box comes back.
 * status: "locked" | "loading" | "ok" | "error"
 */
export function useFeedback(days, rating) {
  const [token, setTokenState] = useState(readToken);
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState(readToken() ? "loading" : "locked");
  const [errMsg, setErrMsg] = useState("");

  const setToken = useCallback((value) => {
    const t = (value || "").trim();
    try {
      if (t) localStorage.setItem(FEEDBACK_TOKEN_KEY, t);
      else localStorage.removeItem(FEEDBACK_TOKEN_KEY);
    } catch {
      /* storage unavailable: token just lasts for this session */
    }
    setTokenState(t);
    setErrMsg("");
    setStatus(t ? "loading" : "locked");
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setStatus("loading");
    try {
      const res = await fetch(
        `${FEEDBACK_ENDPOINT}?token=${encodeURIComponent(token)}&days=${days}&rating=${rating}&limit=50`,
        { cache: "no-store" }
      );
      if (res.status === 403) {
        setToken("");
        setErrMsg("Wrong token");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setItems(json.items || []);
      setStatus("ok");
    } catch (e) {
      setErrMsg(e.message || "Request failed");
      setStatus("error");
    }
  }, [token, days, rating, setToken]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, status, errMsg, reload: load, setToken };
}
