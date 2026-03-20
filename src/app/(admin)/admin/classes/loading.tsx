export default function ClassesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-32 rounded-lg bg-[var(--border)]" />
          <div className="h-4 w-24 rounded bg-[var(--border)]" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-[var(--border)]" />
      </div>

      <div className="bg-white rounded-[16px] border border-[var(--border)] overflow-hidden">
        <div className="px-4 py-3 bg-[var(--chalk)] border-b border-[var(--border)] flex gap-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 w-16 rounded bg-[var(--border)]" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 py-4 flex gap-8 border-b border-[var(--border)] last:border-b-0">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="h-4 flex-1 rounded bg-[var(--border)]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
