export default function CoursesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-36 rounded-lg bg-[var(--border)]" />
          <div className="h-4 w-24 rounded bg-[var(--border)]" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[16px] border border-[var(--border)] p-6 space-y-3"
          >
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-[var(--border)]" />
              <div className="h-5 w-20 rounded-full bg-[var(--border)]" />
            </div>
            <div className="h-6 w-3/4 rounded bg-[var(--border)]" />
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-[var(--border)]" />
              <div className="h-3 w-2/3 rounded bg-[var(--border)]" />
            </div>
            <div className="h-3 w-24 rounded bg-[var(--border)]" />
            <div className="flex gap-2 pt-1">
              <div className="flex-1 h-9 rounded-lg bg-[var(--border)]" />
              <div className="flex-1 h-9 rounded-lg bg-[var(--border)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
