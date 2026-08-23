import { prisma } from '@/lib/db';
import { Package, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    take: 50,
    orderBy: { id: 'desc' }
  });

  return (
    <div className="p-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Product Catalog</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage the normalized product database for VCKart AI.</p>
        </div>
        <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface-3)] overflow-hidden shrink-0 border border-[var(--border)]">
                        <img 
                          src={product.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(product.name + ' minimal grocery isolated')}?width=100&height=100&nologo=true&seed=${product.id}`} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="font-medium text-[var(--foreground)] truncate max-w-[200px] block">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-3)] text-[var(--text-secondary)] border border-[var(--border)]">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{product.rating || '4.5'}</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-[10px] text-[var(--text-muted)]">({product.reviewCount || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.availability ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--success)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--warning)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]"></span> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[var(--text-muted)] hover:text-[var(--foreground)] p-1 rounded transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    <Package className="w-12 h-12 text-[var(--border)] mx-auto mb-3" />
                    <p className="font-medium">No products found</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Try syncing providers or adding products manually.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
