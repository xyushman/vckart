import { prisma } from '@/lib/db';
import { Search, UserCog, MoreVertical } from 'lucide-react';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' }
  });

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">User Management</h1>
        <p className="text-[var(--text-secondary)]">Manage user accounts and roles.</p>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{users.length} total users</h2>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-2)]">
            <div className="flex items-center bg-[var(--background)] border border-[var(--border)] rounded-full px-4 py-2 text-sm w-full max-w-sm focus-within:border-[var(--accent)]/50 transition-colors">
              <Search className="w-4 h-4 mr-2 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search users..." className="bg-transparent focus:outline-none w-full text-[var(--foreground)]" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--text-muted)] uppercase tracking-wider bg-[var(--surface-3)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="px-6 py-4 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold">
                        {(user.name || '?').charAt(0).toUpperCase()}
                      </div>
                      {user.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                        user.role === 'DEMO' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--success)] flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors p-2">
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors p-2 ml-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
