export default function UsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 rounded-lg bg-[var(--border)]" />
          <div className="h-4 w-40 rounded bg-[var(--border)]" />
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-3 bg-[var(--chalk)] border-b border-[var(--border)] flex gap-12">
          {['Name', 'Email', 'Role', 'Joined', ''].map((h, i) => (
            <div key={i} className="h-3 w-16 rounded bg-[var(--border)]" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-5 py-4 flex items-center gap-4 border-b border-[var(--border)] last:border-b-0"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
            <div className="h-4 w-36 rounded bg-[var(--border)]" />
            <div className="ml-4 h-4 w-40 rounded bg-[var(--border)]" />
            <div className="ml-auto h-5 w-16 rounded-md bg-[var(--border)]" />
            <div className="h-4 w-24 rounded bg-[var(--border)]" />
            <div className="h-4 w-10 rounded bg-[var(--border)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
