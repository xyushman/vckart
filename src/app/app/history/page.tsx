import { Clock, MessageSquare, RotateCcw } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-4xl mx-auto h-full w-full animate-in fade-in">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Conversation History</h1>
        <p className="text-[var(--text-secondary)]">Review or resume previous shopping conversations.</p>
      </header>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Today</span>
          
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between hover:border-[var(--accent)]/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--foreground)]">"Find brown sugar"</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">8 results · Ended 2 hours ago</p>
              </div>
            </div>
            <button className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2 hover:text-[var(--foreground)]">
              <RotateCcw className="w-4 h-4" /> Resume
            </button>
          </div>
          
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between hover:border-[var(--accent)]/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--foreground)]">"Show black shirts under ₹1500"</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">12 results · Ended 5 hours ago</p>
              </div>
            </div>
            <button className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2 hover:text-[var(--foreground)]">
              <RotateCcw className="w-4 h-4" /> Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
