function buildPath(values, w, h, max) {
  if (values.length === 0) return "";
  const stepX = values.length > 1 ? w / (values.length - 1) : 0;
  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = h - (max > 0 ? (v / max) * h : 0);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function TrendChart({ series }) {
  if (!series || series.length === 0) return null;

  const W = 300;
  const H = 90;
  const messages = series.map((d) => d.messages);
  const newUsers = series.map((d) => d.new_users);
  const max = Math.max(...messages, ...newUsers, 1);

  const msgPath = buildPath(messages, W, H, max);
  const userPath = buildPath(newUsers, W, H, max);

  const first = series[0]?.date?.slice(5) ?? "";
  const last = series[series.length - 1]?.date?.slice(5) ?? "";

  return (
    <div className="mt-2 rounded-lg border border-line bg-surface px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-widest text-muted">Trend</p>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-muted2">
            <span className="h-1.5 w-1.5 rounded-full bg-green" /> messages
          </span>
          <span className="flex items-center gap-1 text-muted2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" /> new users
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" preserveAspectRatio="none">
        <path d={msgPath} fill="none" stroke="#3ECF8E" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={userPath} fill="none" stroke="#F2A65A" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
      </svg>

      <div className="mt-1 flex items-center justify-between text-[10px] text-muted">
        <span>{first}</span>
        <span>{last}</span>
      </div>
    </div>
  );
}
