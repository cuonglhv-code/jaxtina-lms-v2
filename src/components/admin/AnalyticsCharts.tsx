'use client';

/**
 * Custom SVG-based charts for the Jaxtina Admin Analytics.
 * Designed for high-end aesthetics with zero dependencies.
 */

interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartDataItem[];
  height?: number;
}

/**
 * A horizontal funnel showing the flow of submissions with status breakdown.
 */
export function ThroughputFunnel({ data }: ChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-6 w-full">
      {data.map((item) => {
        const width = (item.value / max) * 100;
        return (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-sans text-[10px] font-black uppercase tracking-widest text-[var(--mist)] italic">
                {item.label}
              </span>
              <span className="font-display text-2xl font-black italic tracking-tighter text-[var(--midnight)] leading-none">
                {item.value}
              </span>
            </div>
            <div className="h-4 w-full bg-[var(--chalk)] rounded-full overflow-hidden border border-[var(--border)]">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                style={{ 
                  width: `${width}%`, 
                  background: item.color || `linear-gradient(90deg, var(--ocean), var(--jade))` 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * A vertical bar chart showing the distribution of students across IELTS bands.
 */
export function BandDistribution({ data }: ChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full flex items-end justify-between h-[240px] px-2 pt-10">
      {data.map((item) => {
        const hPercent = (item.value / max) * 100;
        return (
          <div key={item.label} className="flex flex-col items-center gap-4 flex-1 group relative h-full">
            <div className="w-full flex justify-center items-end h-full px-1 mb-2">
              {/* Tooltip on hover */}
              <div className="absolute top-0 px-2 py-1 bg-[var(--midnight)] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {item.value} Students
              </div>
              <div 
                className="w-full max-w-[44px] rounded-t-xl transition-all duration-700 ease-out hover:brightness-110 shadow-lg shadow-[var(--jade)]/10"
                style={{ 
                  height: `${hPercent}%`, 
                  background: `linear-gradient(180deg, var(--jade), var(--jade-light))`,
                  opacity: 0.2 + (hPercent / 100) * 0.8 
                }}
              />
            </div>
            <span className="font-sans text-[10px] font-black text-[var(--mist)] leading-none uppercase italic">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
