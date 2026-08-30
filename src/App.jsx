import { useState } from "react";
import { useStats } from "./api/useStats.js";
import { useTimeseries } from "./api/useTimeseries.js";
import PulseLine from "./components/PulseLine.jsx";
import StatusBadge from "./components/StatusBadge.jsx";
import RangeSelector from "./components/RangeSelector.jsx";
import MetricCard from "./components/MetricCard.jsx";
import BreakdownBars from "./components/BreakdownBars.jsx";
import TrendChart from "./components/TrendChart.jsx";

export default function App() {
  const [days, setDays] = useState(30);
  const { data, status, errMsg, lastUpdated, reload, autoRefresh, setAutoRefresh } = useStats(days);
  const { series } = useTimeseries(days);
  const isBusy = status === "loading" || status === "refreshing";
  const isStale = status === "stale";

  return (
    <div className="min-h-screen w-full bg-bg text-text flex justify-center">
      <div className="w-full max-w-md px-4 py-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Thanzi Coach</h1>
            <p className="text-[11px] text-muted tracking-wide">WhatsApp bot &middot; vitals</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <PulseLine active={status !== "error"} />

        <RangeSelector days={days} onChange={setDays} />

        {isStale && (
          <div className="mt-4 rounded-lg border border-[#3A2E1A] bg-[#1A1509] px-3 py-2.5 text-xs text-[#E8C08A] leading-relaxed flex items-center justify-between">
            <span>Showing cached data from {lastUpdated ? lastUpdated.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "earlier"} — couldn't reach the worker.</span>
            <button onClick={reload} className="shrink-0 ml-2 text-[#E8C08A] font-medium underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-lg border border-[#3A2420] bg-[#1A100D] px-3 py-3 text-xs text-[#F2A98A] leading-relaxed">
            Couldn't reach the worker ({errMsg}) and no cached data is available yet. If this is the first load,
            your Worker likely needs an <code>Access-Control-Allow-Origin</code> header on <code>/stats</code> so
            this page can fetch it directly.
            <button onClick={reload} className="mt-2 block rounded-md bg-[#2A1712] px-3 py-1.5 text-[#F2A98A] font-medium">
              Retry
            </button>
          </div>
        )}

        {data && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <MetricCard label="Total users" value={data.total_users} />
              <MetricCard label="New users" value={data.new_users} accent="#3ECF8E" />
              <MetricCard label="Active users" value={data.active_users} />
              <MetricCard label="Returning" value={data.returning_users} accent="#F2A65A" />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <MetricCard label={`Msgs (${data.period_days}d)`} value={data.messages_in_period} />
              <MetricCard label="Msgs all-time" value={data.messages_all_time} />
            </div>

            <TrendChart series={series} />

            <BreakdownBars data={data} />
          </>
        )}

        <div className="mt-5 flex items-center justify-between text-[11px] text-muted">
          <span>
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "—"}
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-green"
              />
              auto (60s)
            </label>
            <button onClick={reload} className="text-green font-medium">
              {isBusy ? "…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
