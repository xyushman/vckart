import { RefreshCw } from 'lucide-react';

export default function AdminSyncPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Sync Jobs</h1>
        <p className="text-[var(--text-secondary)]">Manage marketplace connections and API syncs.</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
        <RefreshCw className="w-16 h-16 text-[var(--border)] mb-6 animate-spin-slow" />
        <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)]">No active sync jobs</h2>
        <p className="text-[var(--text-secondary)] max-w-md">Connect Amazon, Google, or Flipkart APIs to start syncing products.</p>
      </div>
    </div>
  );
}
