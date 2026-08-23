import { Package, Search } from 'lucide-react';

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Product Editor</h1>
        <p className="text-[var(--text-secondary)]">Manage product details, imagery, and static metadata.</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
        <Package className="w-16 h-16 text-[var(--border)] mb-6" />
        <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Product Editor Loading...</h2>
        <p className="text-[var(--text-secondary)] max-w-md">Select a product from the Inventory tab to edit its dynamic attributes.</p>
      </div>
    </div>
  );
}
