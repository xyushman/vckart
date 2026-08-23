import { HelpCircle, Mail, MessageCircle, FileText } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-4xl mx-auto h-full w-full animate-in fade-in">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Help & Support</h1>
        <p className="text-[var(--text-secondary)]">Learn how to use VCKart or get in touch with our team.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 transition-colors group cursor-pointer">
          <div className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-[var(--foreground)]">Voice Commands Guide</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Learn what you can say to the assistant.</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 transition-colors group cursor-pointer">
          <div className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-[var(--foreground)]">Documentation</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Read the full platform guide and architecture.</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 transition-colors group cursor-pointer md:col-span-2">
          <div className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-[var(--foreground)]">Contact Support</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Email us directly for any issues or feedback regarding your orders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
