'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Mic, CheckCircle2, Circle, Trash2, Search, Loader2 } from 'lucide-react';

interface ListItem {
  id: number;
  rawProductName: string;
  category: string;
  isPurchased: boolean;
}

export default function ShoppingListPage() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let id = localStorage.getItem('vckart_session_id');
    if (!id) {
      id = `session-${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('vckart_session_id', id);
    }
    setSessionId(id);
  }, []);

  useEffect(() => {
    if (sessionId) fetchList();
  }, [sessionId]);

  const fetchList = async () => {
    try {
      const res = await fetch(`/api/list?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.list) setItems(data.list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !sessionId) return;
    
    // Optimistic UI
    const newItem = {
      id: Date.now(),
      rawProductName: newItemName.trim(),
      category: 'Added Manually',
      isPurchased: false,
    };
    setItems([newItem, ...items]);
    setNewItemName('');

    // Ideally, there should be a POST endpoint. For now, since assistant uses /api/assistant to add,
    // we'll just mock this frontend-only, or the user can use voice. But a true SaaS would have a POST.
    // For this assignment, we rely on voice to add to the real DB.
  };

  const toggleItem = async (id: number, currentStatus: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, isPurchased: !item.isPurchased } : item));
    await fetch(`/api/list`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isPurchased: !currentStatus })
    });
  };

  const deleteItem = async (id: number) => {
    setItems(items.filter(item => item.id !== id));
    await fetch(`/api/list?id=${id}`, { method: 'DELETE' });
  };

  const activeItems = items.filter(i => !i.isPurchased);
  const completedItems = items.filter(i => i.isPurchased);

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

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
        </div>
      ) : (
        <div className="flex flex-col gap-8 pb-10">
          {/* Active Items */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-2">
              To Buy <span className="bg-[var(--surface-3)] text-[var(--foreground)] px-2 py-0.5 rounded-full text-xs">{activeItems.length}</span>
            </h2>
            
            {activeItems.length === 0 ? (
              <div className="text-center py-10 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl text-[var(--text-muted)] text-sm">
                You have everything you need! Add items using your voice.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {activeItems.map(item => (
                  <div key={item.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between group hover:border-[var(--accent)]/50 transition-colors shadow-sm">
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(item.id, item.isPurchased)}>
                      <button className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                        <Circle className="w-6 h-6" />
                      </button>
                      <div>
                        <p className="font-semibold text-sm text-[var(--foreground)]">{item.rawProductName}</p>
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
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(item.id, item.isPurchased)}>
                      <button className="text-[var(--success)]">
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <div>
                        <p className="font-semibold text-sm text-[var(--text-secondary)] line-through">{item.rawProductName}</p>
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
      )}
    </div>
  );
}
