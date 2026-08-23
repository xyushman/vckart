import { prisma } from '@/lib/db';
import { Database, RefreshCw, Users, MessageSquare, TrendingUp, Search } from 'lucide-react';

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in">
      
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Overview</h1>
        <p className="text-[var(--text-secondary)]">High-level metrics for your VCKart conversational commerce platform.</p>
      </header>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-1 hover:border-[var(--accent)]/50 transition-colors">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2"><Database className="w-4 h-4 text-[var(--accent)]" /> Total Products</p>
          <h2 className="text-4xl font-bold">{products.length}</h2>
          <p className="text-xs text-[var(--success)] mt-2 font-medium">+12% from last month</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-1 hover:border-[var(--accent)]/50 transition-colors">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-[var(--warning)]" /> Active Users</p>
          <h2 className="text-4xl font-bold">1,248</h2>
          <p className="text-xs text-[var(--success)] mt-2 font-medium">+5% from last month</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-1 hover:border-[var(--accent)]/50 transition-colors">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[var(--info)]" /> Voice Searches</p>
          <h2 className="text-4xl font-bold">18,421</h2>
          <p className="text-xs text-[var(--success)] mt-2 font-medium">94.2% success rate</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-1 hover:border-[var(--accent)]/50 transition-colors justify-between">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-[var(--text-secondary)]" /> Last Sync</p>
          <h2 className="text-2xl font-bold">Just now</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">All sources healthy</p>
        </div>
      </div>

      {/* Quick Inventory Table */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Recent Inventory</h2>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-2)]">
            <div className="flex items-center bg-[var(--background)] border border-[var(--border)] rounded-full px-4 py-2 text-sm w-full max-w-sm focus-within:border-[var(--accent)]/50 transition-colors">
              <Search className="w-4 h-4 mr-2 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search catalog..." className="bg-transparent focus:outline-none w-full text-[var(--foreground)]" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--text-muted)] uppercase tracking-wider bg-[var(--surface-3)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                {products.slice(0, 10).map(prod => (
                  <tr key={prod.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="px-6 py-4 font-semibold">{prod.name}</td>
                    <td className="px-6 py-4">{prod.category}</td>
                    <td className="px-6 py-4 font-medium text-[var(--accent)]">₹{prod.price}</td>
                    <td className="px-6 py-4 capitalize text-[var(--text-secondary)]">{prod.source}</td>
                    <td className="px-6 py-4 text-right">
                      {prod.availability ? (
                        <span className="text-[var(--success)] flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span> In Stock
                        </span>
                      ) : (
                        <span className="text-[var(--error)] flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--error)]"></span> Out of Stock
                        </span>
                      )}
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
