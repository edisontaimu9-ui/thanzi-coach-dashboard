export default function MetricCard({ label, value, unit, accent }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-widest text-muted">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold tabular-nums font-mono" style={{ color: accent || "#E8F3EE" }}>
          {value}
        </span>
        {unit && <span className="text-xs text-muted">{unit}</span>}
      </div>
    </div>
  );
}
