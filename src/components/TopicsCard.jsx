const COLORS = ["#3ECF8E", "#5CC8E8", "#F2A65A", "#B79CF2", "#F2A98A", "#8FD0A8", "#E8D55C", "#7C8DA6"];

function Row({ label, n, pct, max, color }) {
  const width = max > 0 ? Math.max(4, Math.round((n / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[11px] text-muted2 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[#152420] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${width}%`, background: color }} />
      </div>
      <span className="w-14 shrink-0 text-right text-xs tabular-nums text-text font-mono">
        {n} <span className="text-muted">{pct}%</span>
      </span>
    </div>
  );
}

/** "What people ask about": counts per topic from /stats `topics` (counts only, no message text). */
export default function TopicsCard({ data }) {
  const topics = (data?.topics || []).filter((t) => t.topic !== "admin");
  const total = topics.reduce((s, t) => s + t.n, 0);
  const shown = topics.slice(0, 8);
  const max = shown[0]?.n || 0;

  return (
    <div className="mt-5 rounded-lg border border-line bg-surface px-4 py-4">
      <p className="text-[11px] uppercase tracking-widest text-muted mb-3">
        What people ask about &middot; {data?.period_days}d
      </p>
      {shown.length === 0 ? (
        <p className="text-xs text-muted">No data yet. Topics are counted from new messages.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {shown.map((t, i) => (
            <Row
              key={t.topic}
              label={t.label}
              n={t.n}
              pct={total > 0 ? Math.round((t.n / total) * 100) : 0}
              max={max}
              color={COLORS[i % COLORS.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
