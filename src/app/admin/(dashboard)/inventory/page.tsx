import { Database } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Inventory</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage warehouse stock and availability levels.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--border)] rounded-xl bg-[var(--surface)]/50">
        <Database className="w-12 h-12 text-[var(--text-muted)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--foreground)]">Inventory Module</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-2 text-center max-w-sm">
          This section is currently under development. Soon you'll be able to manage multi-warehouse stock levels here.
        </p>
      </div>
    </div>
  );
}
