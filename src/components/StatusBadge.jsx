export default function StatusBadge({ status }) {
  const isBusy = status === "loading" || status === "refreshing";
  const isError = status === "error";
  const isStale = status === "stale";

  const color = isError ? "#F2755A" : isStale ? "#F2A65A" : "#3ECF8E";
  const label = isError ? "offline" : isStale ? "stale" : isBusy ? "syncing" : "live";
  const bgClass = isError ? "bg-red" : isStale ? "bg-amber" : "bg-green";

  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${bgClass}`} style={{ boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[11px] text-muted2">{label}</span>
    </div>
  );
}
