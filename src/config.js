export const BASE = "https://thanzi-coach-whatsapp.edisontaimu9.workers.dev";
export const ENDPOINT = `${BASE}/stats`;
export const TIMESERIES_ENDPOINT = `${BASE}/stats/timeseries`;
export const TOKEN = "thanzi-stats-2026";
export const RANGES = [7, 14, 30, 90];
export const CACHE_KEY = "thanzi-stats-cache-v1";
export const FEEDBACK_ENDPOINT = `${BASE}/stats/feedback`;
// Unlike TOKEN above, the feedback token is NEVER stored in this source: it is typed into the
// dashboard once and kept in this browser's localStorage (see api/useFeedback.js).
export const FEEDBACK_TOKEN_KEY = "thanzi-feedback-token";
