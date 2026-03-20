export default function ResultsLoading() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }} className="space-y-8 animate-pulse">
      {/* Back nav */}
      <div className="h-4 w-36 rounded bg-[var(--border)]" />

      {/* Band card */}
      <div className="bg-white rounded-[16px] border border-[var(--border)] p-10 space-y-4">
        <div className="h-3 w-56 rounded bg-[var(--border)]" />
        <div className="h-3 w-24 rounded bg-[var(--border)]" />
        <div className="h-20 w-32 rounded-lg bg-[var(--border)]" />
        <div className="h-1 w-full rounded bg-[var(--border)]" />
      </div>

      {/* 2×2 criteria grid */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[12px] border border-[var(--border)] p-6 space-y-3">
            <div className="h-3 w-24 rounded bg-[var(--border)]" />
            <div className="h-8 w-14 rounded bg-[var(--border)]" />
            <div className="h-1 w-full rounded bg-[var(--border)]" />
          </div>
        ))}
      </div>

      {/* Improvements */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded bg-[var(--border)]" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[12px] border border-[var(--border)] p-4 flex gap-3">
            <div className="h-5 w-5 rounded bg-[var(--border)]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-full rounded bg-[var(--border)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--border)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
