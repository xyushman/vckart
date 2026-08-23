import Link from 'next/link';
import { ChevronRight, Mic, Search, ListFilter, CheckCircle2, Box, ArrowRight, LayoutDashboard, ShoppingBag, MessageSquare, Terminal, Database, Server, Cpu, Globe } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-20 pb-24">
      
      {/* 1. MAIN CONTENT HEADER */}
      <section id="introduction" className="flex flex-col gap-4 scroll-mt-24">
        <div className="flex items-center text-sm font-medium text-[var(--text-muted)] gap-2 mb-2">
          <Link href="/docs" className="hover:text-[var(--foreground)] transition-colors">Documentation</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--accent)]">Overview</span>
        </div>
        
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Platform Overview</span>
        
        <h1 className="text-5xl md:text-[64px] leading-[1.05] font-[700] tracking-tight text-[var(--foreground)] max-w-3xl">
          VCKart: <br/>
          <span className="text-[var(--text-secondary)]">The Conversational <br/>Commerce Engine</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-xl max-w-2xl leading-relaxed mt-4">
          A deep dive into the architecture, AI pipelines, and data models that power VCKart's voice-first shopping experience.
        </p>
      </section>

      {/* 2. ARCHITECTURE OVERVIEW */}
      <section id="architecture" className="flex flex-col gap-8 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">01 — System Architecture</span>
        <h2 className="text-3xl font-bold tracking-tight">How VCKart Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-[var(--accent)]/50 transition-colors">
            <div className="w-12 h-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">1. Voice Input</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Users speak natural language commands via the Web Speech API on the frontend, converted instantly to text transcripts.</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-[var(--accent)]/50 transition-colors">
            <div className="w-12 h-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">2. NLP Engine</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Google Gemini 2.5 Flash processes the transcript, mapping it to strict JSON schemas representing user intent and filters.</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-[var(--accent)]/50 transition-colors">
            <div className="w-12 h-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">3. State & Search</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">The API updates the persistent conversation state in PostgreSQL via Prisma, executing filtered searches across unified inventory.</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-[var(--accent)]/50 transition-colors">
            <div className="w-12 h-12 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">4. Dynamic UI</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Next.js React Server Components render real-time interactive widgets (lists, carousels, compare tables) based on the exact intent.</p>
          </div>
        </div>
      </section>

      {/* 3. AI & INTENTS */}
      <section id="ai-intents" className="flex flex-col gap-8 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">02 — Natural Language Processing</span>
        <h2 className="text-3xl font-bold tracking-tight">Structured AI Intents</h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-3xl">
          VCKart doesn't just parse text; it uses LLMs to maintain a complex state machine. Every user message is mapped to one of the following structured intents:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl">
            <h4 className="font-mono text-[var(--accent)] text-sm mb-2">PRODUCT_SEARCH</h4>
            <p className="text-sm text-[var(--text-secondary)]">Initiates a new search. Extracts entity names (e.g., "sugar"), max prices (e.g., 200), and attributes (brand, color, size).</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl">
            <h4 className="font-mono text-[var(--accent)] text-sm mb-2">FILTER_UPDATE</h4>
            <p className="text-sm text-[var(--text-secondary)]">Modifies existing search state. Example: "Make it under 100" retains the "sugar" query but updates the `maxPrice` state.</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl">
            <h4 className="font-mono text-[var(--accent)] text-sm mb-2">CLARIFICATION_REQUIRED</h4>
            <p className="text-sm text-[var(--text-secondary)]">Triggered when a query is too broad. Generates clarification UI chips automatically (e.g., "Men's or Women's?").</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl">
            <h4 className="font-mono text-[var(--accent)] text-sm mb-2">COMPARE_PRODUCTS</h4>
            <p className="text-sm text-[var(--text-secondary)]">Triggers a side-by-side spec comparison table for the top 2-3 items in the current search context.</p>
          </div>
        </div>
      </section>

      {/* 4. DATA MODELS */}
      <section id="database" className="flex flex-col gap-8 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">03 — Data Architecture</span>
        <h2 className="text-3xl font-bold tracking-tight">PostgreSQL & Prisma Schema</h2>
        
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl shadow-black/50">
          <div className="bg-[var(--surface-2)] px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Core Entities</span>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[var(--text-secondary)] border-b border-[var(--border)] text-xs uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-medium pr-8">Model</th>
                  <th className="pb-3 font-medium pr-8">Key Fields</th>
                  <th className="pb-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                <tr>
                  <td className="py-4 font-mono text-[var(--accent)] pr-8">User</td>
                  <td className="py-4 font-mono text-xs pr-8 text-[var(--text-muted)]">email, role, listId</td>
                  <td className="py-4 text-[var(--text-secondary)]">Supports multi-tenant auth (USER vs ADMIN).</td>
                </tr>
                <tr>
                  <td className="py-4 font-mono text-[var(--accent)] pr-8">Product</td>
                  <td className="py-4 font-mono text-xs pr-8 text-[var(--text-muted)]">price, attributes (JSON), tags</td>
                  <td className="py-4 text-[var(--text-secondary)]">Unified catalog item with dynamic JSON schemas.</td>
                </tr>
                <tr>
                  <td className="py-4 font-mono text-[var(--accent)] pr-8">StoreListing</td>
                  <td className="py-4 font-mono text-xs pr-8 text-[var(--text-muted)]">storeName, url, price</td>
                  <td className="py-4 text-[var(--text-secondary)]">1-to-Many relation with Product. Tracks prices across D-Mart, BlinkIt, etc.</td>
                </tr>
                <tr>
                  <td className="py-4 font-mono text-[var(--accent)] pr-8">ConversationSession</td>
                  <td className="py-4 font-mono text-xs pr-8 text-[var(--text-muted)]">sessionId, state (JSON)</td>
                  <td className="py-4 text-[var(--text-secondary)]">Maintains the ongoing conversational context and search filters.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. API REFERENCE */}
      <section id="api" className="flex flex-col gap-8 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">04 — API Reference</span>
        <h2 className="text-3xl font-bold tracking-tight">Core Endpoints</h2>
        
        {/* Endpoint 1 */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden font-mono text-sm shadow-xl shadow-black/50">
          <div className="bg-[var(--surface-2)] px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
            <span className="text-xs font-bold bg-[var(--success)]/20 text-[var(--success)] px-2 py-0.5 rounded">POST</span>
            <span className="text-[var(--foreground)] font-semibold">/api/assistant</span>
            <span className="ml-auto text-[var(--text-muted)] text-xs">Primary Conversational Engine</span>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">Request Payload</p>
              <pre className="bg-[var(--surface-2)] p-4 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] overflow-x-auto">
<code className="text-[#F5F7FA]">{"{"}</code><br/>
<code className="text-[var(--accent)]">  "transcript"</code><code className="text-[#F5F7FA]">: </code><code className="text-[var(--success)]">"Find brown sugar under 250"</code><code className="text-[#F5F7FA]">,</code><br/>
<code className="text-[var(--accent)]">  "sessionId"</code><code className="text-[#F5F7FA]">: </code><code className="text-[var(--success)]">"sess_abc123"</code><br/>
<code className="text-[#F5F7FA]">{"}"}</code>
              </pre>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">Response Payload (Structured UI State)</p>
              <pre className="bg-[var(--surface-2)] p-4 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] overflow-x-auto">
<code className="text-[#F5F7FA]">{"{"}</code><br/>
<code className="text-[var(--accent)]">  "action"</code><code className="text-[#F5F7FA]">: </code><code className="text-[var(--success)]">"PRODUCT_SEARCH"</code><code className="text-[#F5F7FA]">,</code><br/>
<code className="text-[var(--accent)]">  "message"</code><code className="text-[#F5F7FA]">: </code><code className="text-[var(--success)]">"I found 3 options..."</code><code className="text-[#F5F7FA]">,</code><br/>
<code className="text-[var(--accent)]">  "results"</code><code className="text-[#F5F7FA]">: </code><code className="text-[#F5F7FA]">[...]</code><code className="text-[#F5F7FA]">,</code><br/>
<code className="text-[var(--accent)]">  "state"</code><code className="text-[#F5F7FA]">: </code><code className="text-[#F5F7FA]">{"{"}</code><br/>
<code className="text-[var(--accent)]">    "searchQuery"</code><code className="text-[#F5F7FA]">: </code><code className="text-[var(--success)]">"brown sugar"</code><code className="text-[#F5F7FA]">,</code><br/>
<code className="text-[var(--accent)]">    "filters"</code><code className="text-[#F5F7FA]">: </code><code className="text-[#F5F7FA]">{"{"} "maxPrice": 250 {"}"}</code><br/>
<code className="text-[#F5F7FA]">  {"}"}</code><br/>
<code className="text-[#F5F7FA]">{"}"}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Endpoint 2 */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden font-mono text-sm shadow-xl shadow-black/50">
          <div className="bg-[var(--surface-2)] px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
            <span className="text-xs font-bold bg-[#6475F5]/20 text-[#6475F5] px-2 py-0.5 rounded">GET</span>
            <span className="text-[var(--foreground)] font-semibold">/api/list</span>
            <span className="ml-auto text-[var(--text-muted)] text-xs">Shopping Cart Sync</span>
          </div>
          <div className="p-6">
            <p className="text-[var(--text-secondary)] font-sans">
              Fetches the current user's shopping list dynamically. Connected to the conversational engine so that when a user says "Add it to my list", this endpoint reflects the new state instantly.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
