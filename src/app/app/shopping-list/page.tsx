'use client';

import { useState } from 'react';
import { ShoppingBag, Plus, Mic, CheckCircle2, Circle, Trash2, Search } from 'lucide-react';

interface ListItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
}

export default function ShoppingListPage() {
  const [items, setItems] = useState<ListItem[]>([
    { id: '1', name: 'Organic Honey 500g', category: 'Groceries', completed: false },
    { id: '2', name: 'Almond Milk (Unsweetened)', category: 'Dairy', completed: false },
    { id: '3', name: 'Avocados (Pack of 4)', category: 'Produce', completed: true },
    { id: '4', name: 'Whole Wheat Bread', category: 'Bakery', completed: false },
  ]);
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    const newItem: ListItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: 'Added Manually',
      completed: false,
    };
    
    setItems([newItem, ...items]);
    setNewItemName('');
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const activeItems = items.filter(i => !i.completed);
  const completedItems = items.filter(i => i.completed);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl mx-auto h-full w-full animate-in fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Shopping List</h1>
          <p className="text-[var(--text-secondary)]">Manage your active grocery and product list.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-medium shadow-lg shadow-[var(--accent)]/20 hover:bg-[var(--accent-hover)] transition-colors">
            <Mic className="w-4 h-4" /> Speak
          </button>
        </div>
      </header>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3 shadow-sm focus-within:border-[var(--accent)] transition-colors">
        <Search className="w-5 h-5 text-[var(--text-muted)]" />
        <input 
          type="text" 
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="What do you need to buy?" 
          className="flex-1 bg-transparent text-sm focus:outline-none text-[var(--foreground)]"
        />
        <button 
          type="submit"
          disabled={!newItemName.trim()}
          className="bg-[var(--foreground)] text-[var(--background)] px-4 py-1.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-opacity"
        >
          Add
        </button>
      </form>

      <div className="flex flex-col gap-8 pb-10">
        
        {/* Active Items */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-2">
            To Buy <span className="bg-[var(--surface-3)] text-[var(--foreground)] px-2 py-0.5 rounded-full text-xs">{activeItems.length}</span>
          </h2>
          
          {activeItems.length === 0 ? (
            <div className="text-center py-10 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl text-[var(--text-muted)] text-sm">
              You have everything you need!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {activeItems.map(item => (
                <div key={item.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between group hover:border-[var(--accent)]/50 transition-colors shadow-sm">
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                    <button className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                      <Circle className="w-6 h-6" />
                    </button>
                    <div>
                      <p className="font-semibold text-sm text-[var(--foreground)]">{item.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="flex flex-col gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Checked Off
            </h2>
            <div className="flex flex-col gap-2">
              {completedItems.map(item => (
                <div key={item.id} className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                    <button className="text-[var(--success)]">
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <div>
                      <p className="font-semibold text-sm text-[var(--text-secondary)] line-through">{item.name}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
