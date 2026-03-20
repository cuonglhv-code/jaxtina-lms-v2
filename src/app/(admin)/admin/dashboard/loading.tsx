export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-52 rounded-lg bg-[var(--border)]" />
          <div className="h-4 w-64 rounded bg-[var(--border)]" />
        </div>
        <div className="h-4 w-36 rounded bg-[var(--border)]" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[16px] border border-[var(--border)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
            </div>
            <div className="h-10 w-16 rounded bg-[var(--border)]" />
            <div className="h-3 w-28 rounded bg-[var(--border)]" />
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: table + quick actions */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[16px] border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-4 bg-[var(--chalk)] border-b border-[var(--border)] flex gap-8">
              {['Name', 'Role', 'Joined'].map((h) => (
                <div key={h} className="h-3 w-16 rounded bg-[var(--border)]" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-[var(--border)] last:border-b-0">
                <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
                <div className="h-4 w-32 rounded bg-[var(--border)]" />
                <div className="ml-auto h-5 w-16 rounded-md bg-[var(--border)]" />
                <div className="h-4 w-20 rounded bg-[var(--border)]" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[16px] border border-[var(--border)] p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[var(--border)]" />
                <div className="h-4 w-28 rounded bg-[var(--border)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: sidebar panels */}
        <div className="lg:col-span-2 space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[16px] border border-[var(--border)] p-6 space-y-4">
              <div className="h-5 w-32 rounded bg-[var(--border)]" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded bg-[var(--border)]" />
                    <div className="h-3 w-8 rounded bg-[var(--border)]" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--border)]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
