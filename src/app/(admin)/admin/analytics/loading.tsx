export default function AnalyticsLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-lg bg-[var(--border)]" />
          <div className="h-4 w-64 rounded bg-[var(--border)]" />
        </div>
        <div className="h-9 w-40 rounded-2xl bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[16px] border border-[var(--border)] p-6 space-y-4">
            <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
            <div className="h-10 w-16 rounded bg-[var(--border)]" />
            <div className="h-3 w-24 rounded bg-[var(--border)]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[40px] border border-[var(--border)] p-10 space-y-6">
            <div className="h-6 w-40 rounded bg-[var(--border)]" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-3 w-12 rounded bg-[var(--border)]" />
                <div className="flex-1 h-6 rounded bg-[var(--border)]" />
                <div className="h-3 w-8 rounded bg-[var(--border)]" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-[var(--border)] rounded-[48px] h-64 w-full" />
    </div>
  );
}
