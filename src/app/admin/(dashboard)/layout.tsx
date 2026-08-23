'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Package, Database, RefreshCw, Users, MessageSquare, BarChart, Settings, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getLinkClasses = (href: string, exact: boolean = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-[var(--surface-hover)] text-[var(--foreground)]' : 'text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
    }`;
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface-2)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
            <span className="bg-[var(--accent)] text-white px-2 py-0.5 rounded text-sm">Admin</span> VCKart
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <h3 className="px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Overview</h3>
            <Link href="/admin" className={getLinkClasses('/admin', true)}>
              <LayoutDashboard className="w-4 h-4 text-[var(--accent)]" /> Dashboard
            </Link>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Catalog</h3>
            <Link href="/admin/products" className={getLinkClasses('/admin/products')}>
              <Package className="w-4 h-4" /> Products
            </Link>
            <Link href="/admin/inventory" className={getLinkClasses('/admin/inventory')}>
              <Database className="w-4 h-4" /> Inventory
            </Link>
            <Link href="/admin/sync" className={getLinkClasses('/admin/sync')}>
              <RefreshCw className="w-4 h-4" /> Product Sync
            </Link>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Sources</h3>
            <div className="px-3 py-2 text-sm text-[var(--text-secondary)] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Google
            </div>
            <div className="px-3 py-2 text-sm text-[var(--text-secondary)] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Amazon
            </div>
            <div className="px-3 py-2 text-sm text-[var(--text-secondary)] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Flipkart
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Management</h3>
            <Link href="/admin/users" className={getLinkClasses('/admin/users')}>
              <Users className="w-4 h-4" /> Users
            </Link>
            <Link href="/admin/analytics" className={getLinkClasses('/admin/analytics')}>
              <BarChart className="w-4 h-4" /> Analytics
            </Link>
            <Link href="/admin/settings" className={getLinkClasses('/admin/settings')}>
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </div>
        </nav>

        <div className="border-t border-[var(--border)] p-4 space-y-4">
          <Link href="/assistant" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to VCKart
          </Link>
          
          <div className="flex items-center justify-between px-3">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-[120px]">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-[var(--text-secondary)]">Administrator</p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors p-2 rounded-lg hover:bg-[var(--error)]/10"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--background)] relative overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
