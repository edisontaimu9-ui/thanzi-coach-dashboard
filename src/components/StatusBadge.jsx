export default function StatusBadge({ status }) {
  const isBusy = status === "loading" || status === "refreshing";
  const isError = status === "error";
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${isError ? "bg-red" : "bg-green"}`}
        style={{ boxShadow: isError ? "0 0 6px #F2755A" : "0 0 6px #3ECF8E" }}
      />
      <span className="text-[11px] text-muted2">
        {isError ? "offline" : isBusy ? "syncing" : "live"}
      </span>
    </div>
  );
}
