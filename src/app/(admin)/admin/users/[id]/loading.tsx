export default function UserDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-20 rounded bg-[var(--border)]" />

      <div className="bg-white rounded-[16px] border border-[var(--border)] p-10 flex gap-8">
        <div className="w-20 h-20 rounded-full bg-[var(--border)] flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="h-7 w-48 rounded bg-[var(--border)]" />
          <div className="h-4 w-56 rounded bg-[var(--border)]" />
          <div className="flex gap-3">
            <div className="h-6 w-20 rounded-md bg-[var(--border)]" />
            <div className="h-4 w-32 rounded bg-[var(--border)]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 max-w-md space-y-4">
        <div className="h-5 w-32 rounded bg-[var(--border)]" />
        <div className="h-3 w-16 rounded bg-[var(--border)]" />
        <div className="h-10 w-full rounded-lg bg-[var(--border)]" />
        <div className="h-10 w-32 rounded-lg bg-[var(--border)]" />
      </div>
    </div>
  );
}
