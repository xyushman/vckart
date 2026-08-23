import { Heart, Bell } from 'lucide-react';

export default function SavedPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-5xl mx-auto h-full w-full animate-in fade-in">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Saved Products</h1>
        <p className="text-[var(--text-secondary)]">Products you've saved for later or set price alerts on.</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
        <Heart className="w-16 h-16 text-[var(--border)] mb-6" />
        <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)]">No saved products yet</h2>
        <p className="text-[var(--text-secondary)]">When you save a product from the assistant, it will appear here along with price drop alerts.</p>
      </div>
    </div>
  );
}
