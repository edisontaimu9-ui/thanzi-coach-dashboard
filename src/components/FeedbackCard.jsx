import { useState } from "react";
import { useFeedback } from "../api/useFeedback.js";

function When({ iso }) {
  const d = new Date(iso);
  return (
    <span className="text-[11px] text-muted">
      {d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

function UnlockBox({ onUnlock, errMsg }) {
  const [value, setValue] = useState("");
  return (
    <div className="mt-3">
      <p className="text-xs text-muted2 leading-relaxed">
        Enter your feedback token to see the questions people rated. It is stored only in this browser.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Feedback token"
          className="flex-1 min-w-0 rounded-md border border-line bg-bg px-3 py-2 text-sm text-text"
        />
        <button onClick={() => onUnlock(value)} className="rounded-md bg-[#152420] px-3 py-2 text-sm text-green font-medium">
          Unlock
        </button>
      </div>
      {errMsg && <p className="mt-2 text-xs text-[#F2A98A]">{errMsg}</p>}
    </div>
  );
}

function FeedbackList({ days, rating }) {
  const { items, status, errMsg, reload, setToken } = useFeedback(days, rating);

  if (status === "locked") return <UnlockBox onUnlock={setToken} errMsg={errMsg} />;

  return (
    <div className="mt-3">
      {status === "loading" && !items && <p className="text-xs text-muted">Loading…</p>}
      {status === "error" && (
        <p className="text-xs text-[#F2A98A]">
          Couldn't load ({errMsg}).{" "}
          <button onClick={reload} className="underline underline-offset-2">Retry</button>
        </p>
      )}
      {items && items.length === 0 && (
        <p className="text-xs text-muted">Nothing rated {rating === "down" ? "👎" : "👍"} in this period.</p>
      )}
      {items && items.length > 0 && (
        <ul className="flex flex-col divide-y divide-line">
          {items.map((it) => (
            <li key={it.id} className="py-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-text break-words">{it.question}</p>
                <When iso={it.rated_at} />
              </div>
              <details className="mt-1">
                <summary className="text-[11px] text-green cursor-pointer select-none">Bot's answer</summary>
                <p className="mt-1 text-xs text-muted2 whitespace-pre-wrap break-words">{it.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => setToken("")} className="mt-3 text-[11px] text-muted underline underline-offset-2">
        Lock
      </button>
    </div>
  );
}

export default function FeedbackCard({ data, days }) {
  const [rating, setRating] = useState("down");
  const up = data?.feedback_up ?? 0;
  const down = data?.feedback_down ?? 0;
  const total = up + down;
  const pct = data?.feedback_satisfaction != null ? Math.round(data.feedback_satisfaction * 100) : null;

  return (
    <div className="mt-5 rounded-lg border border-line bg-surface px-4 py-4">
      <p className="text-[11px] uppercase tracking-widest text-muted mb-3">Answer feedback &middot; {days}d</p>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-2xl tabular-nums" style={{ color: "#3ECF8E" }}>👍 {up}</span>
        <span className="font-mono text-2xl tabular-nums" style={{ color: "#F2A98A" }}>👎 {down}</span>
        {pct != null && <span className="ml-auto text-xs text-muted2">{pct}% helpful &middot; {total} rated</span>}
      </div>

      <div className="mt-4 flex gap-2 text-xs">
        {[["down", "👎 Not helpful"], ["up", "👍 Helpful"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setRating(key)}
            className={`rounded-md px-3 py-1.5 ${rating === key ? "bg-[#152420] text-text" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <FeedbackList days={days} rating={rating} />
    </div>
  );
}
