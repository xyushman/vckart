import { Search, Compass, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function DiscoverPage() {
  // Fetch a few real products for the "Recommended" section
  const recommendedProducts = await prisma.product.findMany({
    take: 4,
    orderBy: {
      price: 'desc'
    }
  });

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-5xl mx-auto h-full w-full animate-in fade-in">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Discover</h1>
        <p className="text-[var(--text-secondary)]">Explore products you might actually like.</p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Star className="w-5 h-5 text-[var(--accent)]" /> Recommended for you</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedProducts.map((prod) => (
            <Link href="/app" key={prod.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden group hover:border-[var(--accent)]/50 transition-all shadow-sm flex flex-col">
              <div className="relative h-40 bg-[var(--surface-3)] overflow-hidden">
                <img 
                  src={prod.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.name + ' minimal product')}?width=300&height=300&nologo=true&seed=${prod.id}`} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-3 flex flex-col flex-1 gap-1.5">
                <h4 className="font-semibold text-sm leading-tight text-[var(--foreground)] line-clamp-2">{prod.name}</h4>
                <p className="text-xs text-[var(--text-muted)] capitalize">{prod.category}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
                  <span className="font-bold text-[var(--accent)]">₹{prod.price}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">View</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[var(--warning)]" /> Trending searches</h2>
        <div className="flex flex-wrap gap-3">
          {['Organic Honey', 'Wireless Earbuds', 'Running Shoes Under ₹3000', 'Brown Sugar 2kg'].map(chip => (
            <Link href={`/app`} key={chip} className="px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/50 transition-colors shadow-sm">
              {chip}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
