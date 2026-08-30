import { RANGES } from "../config.js";

export default function RangeSelector({ days, onChange }) {
  return (
    <div className="mt-4 flex gap-1 rounded-lg bg-surface border border-line p-1">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className="flex-1 rounded-md py-1.5 text-xs font-medium transition-colors"
          style={{
            background: days === r ? "#3ECF8E" : "transparent",
            color: days === r ? "#0A1310" : "#8AA096",
          }}
        >
          {r}d
        </button>
      ))}
    </div>
  );
}
