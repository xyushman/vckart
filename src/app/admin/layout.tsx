import Link from 'next/link';
import { LayoutDashboard, Package, Database, RefreshCw, Users, MessageSquare, BarChart, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-surface-2 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-sm">Admin</span> VCKart
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Overview</h3>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-foreground">
              <LayoutDashboard className="w-4 h-4 text-accent" /> Dashboard
            </Link>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Catalog</h3>
            <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-muted-foreground hover:text-foreground">
              <Package className="w-4 h-4" /> Products
            </Link>
            <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-muted-foreground hover:text-foreground">
              <Database className="w-4 h-4" /> Inventory
            </Link>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sources</h3>
            <Link href="/admin/sync" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-4 h-4" /> Sync Jobs
            </Link>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customers</h3>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-muted-foreground hover:text-foreground">
              <Users className="w-4 h-4" /> Users
            </Link>
            <Link href="/admin/conversations" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-muted-foreground hover:text-foreground">
              <MessageSquare className="w-4 h-4" /> Conversations
            </Link>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Intelligence</h3>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-muted-foreground hover:text-foreground">
              <BarChart className="w-4 h-4" /> Analytics
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <Link href="/app" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-error mt-1">
            <LogOut className="w-4 h-4" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
