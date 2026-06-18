import type { LegendItem } from "./types";

type MapLegendProps = {
  title?: string;
  items: LegendItem[];
  className?: string;
};

export function MapLegend({ title = "Legend", items, className }: MapLegendProps) {
  return (
    <div className={className ?? "rounded-lg border border-slate-200 bg-white p-3 shadow-sm"}>
      <p className="mb-2 text-sm font-semibold text-slate-700">{title}</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm border border-slate-300"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapLegend;
