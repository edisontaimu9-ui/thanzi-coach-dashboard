function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-[11px] text-muted2">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[#152420] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-text font-mono">{value}</span>
    </div>
  );
}

export default function BreakdownBars({ data }) {
  const max = Math.max(data.new_users, data.active_users, data.returning_users, 1);
  return (
    <div className="mt-5 rounded-lg border border-line bg-surface px-4 py-4">
      <p className="text-[11px] uppercase tracking-widest text-muted mb-3">
        User breakdown &middot; {data.period_days}d
      </p>
      <div className="flex flex-col gap-2.5">
        <BarRow label="New" value={data.new_users} max={max} color="#3ECF8E" />
        <BarRow label="Active" value={data.active_users} max={max} color="#5CC8E8" />
        <BarRow label="Returning" value={data.returning_users} max={max} color="#F2A65A" />
      </div>
    </div>
  );
}
