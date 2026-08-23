import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">User Management</h1>
        <p className="text-[var(--text-secondary)]">Manage user accounts and conversational profiles.</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
        <Users className="w-16 h-16 text-[var(--border)] mb-6" />
        <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)]">User Directory</h2>
      </div>
    </div>
  );
}
