import Link from 'next/link';
import { Search, Moon, ChevronRight, Hash } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-theme min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-14 items-center px-6 max-w-[1400px] mx-auto">
          {/* Left: Logo & Context */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[var(--accent)] flex items-center justify-center">
                <span className="text-[var(--background)] font-bold text-xs">V</span>
              </div>
              <span className="font-semibold tracking-tight text-[var(--foreground)]">VCKart</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
              <Link href="/docs" className="text-[var(--foreground)]">Docs</Link>
              <Link href="/app" className="hover:text-[var(--foreground)] transition-colors">Product</Link>
              <Link href="#architecture" className="hover:text-[var(--foreground)] transition-colors">Architecture</Link>
              <Link href="#api" className="hover:text-[var(--foreground)] transition-colors">API</Link>
              <Link href="#roadmap" className="hover:text-[var(--foreground)] transition-colors">Roadmap</Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center ml-auto gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text-muted)] cursor-pointer hover:border-[var(--accent)]/50 transition-colors">
              <Search className="w-4 h-4" />
              <span>Search documentation...</span>
              <kbd className="ml-4 font-sans text-xs bg-[var(--surface-3)] px-1.5 rounded">⌘K</kbd>
            </div>
            <div className="flex items-center gap-3 ml-2 border-l border-[var(--border)] pl-4">
              <Link href="https://github.com/vckart" target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-[1400px] mx-auto">
        {/* Left Sidebar Navigation */}
        <aside className="fixed top-14 z-30 hidden w-64 shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-[var(--border)] py-6 pr-6 lg:block">
          <nav className="flex flex-col gap-8 px-6">
            
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Getting Started</h4>
              <Link href="#introduction" className="flex items-center gap-2 text-sm text-[var(--accent)] font-medium bg-[var(--accent)]/10 border-l-2 border-[var(--accent)] -ml-6 pl-[22px] py-1.5 transition-colors">
                <Hash className="w-4 h-4" /> Platform Overview
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Architecture</h4>
              <Link href="#architecture" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
                <Hash className="w-4 h-4" /> System Architecture
              </Link>
              <Link href="#ai-intents" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
                <Hash className="w-4 h-4" /> NLP & AI Intents
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Data Layer</h4>
              <Link href="#database" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
                <Hash className="w-4 h-4" /> PostgreSQL Schema
              </Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Technical</h4>
              <Link href="#api" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
                <Hash className="w-4 h-4" /> Developer API
              </Link>
            </div>

          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="px-6 py-10 max-w-[900px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
