import Link from 'next/link';
import { ChevronRight, Mic, Search, ListFilter, CheckCircle2, Box, ArrowRight, LayoutDashboard, ShoppingBag, MessageSquare, Terminal } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      
      {/* 6. MAIN CONTENT HEADER */}
      <section id="introduction" className="flex flex-col gap-4 scroll-mt-24">
        <div className="flex items-center text-sm font-medium text-[var(--text-muted)] gap-2 mb-2">
          <Link href="/docs" className="hover:text-[var(--foreground)] transition-colors">Documentation</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--accent)]">Introduction</span>
        </div>
        
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Introduction</span>
        
        <h1 className="text-5xl md:text-[64px] leading-[1.05] font-[700] tracking-tight text-[var(--foreground)] max-w-2xl">
          VCKart: <br/>
          <span className="text-[var(--text-secondary)]">The Future of <br/>Conversational Commerce</span>
        </h1>
      </section>

      {/* 7. HERO SECTION */}
      <section id="vision" className="flex flex-col gap-8 mt-4">
        <h2 className="text-3xl font-bold tracking-tight">Shopping should feel like a conversation.</h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed">
          VCKart transforms product discovery from endless searching into a natural conversation between people and technology.
        </p>
        
        <div className="flex items-center gap-4">
          <Link href="/app" className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--foreground)]/90 transition-all">
            Explore the platform
          </Link>
          <Link href="#architecture" className="bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)] px-6 py-2.5 rounded-full text-sm font-semibold hover:border-[var(--accent)]/50 transition-all">
            View architecture
          </Link>
        </div>

        {/* Hero Visual */}
        <div className="mt-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-3xl overflow-hidden shadow-2xl shadow-[var(--accent)]/5">
          <div className="flex items-center gap-3 text-sm text-[var(--foreground)] bg-[var(--surface-2)] p-3 rounded-lg border border-[var(--border)] w-fit mb-6">
            <Mic className="w-4 h-4 text-[var(--accent)]" /> 
            <span>"I need 2kg of brown sugar under ₹250"</span>
          </div>
          
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">AI found 3 matches</p>
          
          <div className="flex flex-col gap-2">
            {[
              { n: 'Healthy Choice Brown Sugar', p: '₹219', r: '4.6' },
              { n: 'Organic Farms Sugar', p: '₹229', r: '4.5' },
              { n: '24 Mantra Brown Sugar', p: '₹239', r: '4.7' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-3)] border border-[var(--border)] text-sm">
                <span className="font-medium">{item.n}</span>
                <div className="flex items-center gap-8">
                  <span className="text-[var(--accent)] font-semibold">{item.p}</span>
                  <span className="text-[var(--text-secondary)] text-xs flex items-center gap-1">★ {item.r}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. VISION SECTION */}
      <section className="flex flex-col gap-8 mt-12 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">01 — The Vision</span>
        <h2 className="text-3xl font-bold tracking-tight">Shopping should feel human.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-4">
            <span className="text-2xl font-light text-[var(--text-muted)]">01</span>
            <h3 className="text-lg font-semibold">Natural Conversations</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Talk to VCKart exactly like you would talk to a human assistant in a physical store.</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-4">
            <span className="text-2xl font-light text-[var(--text-muted)]">02</span>
            <h3 className="text-lg font-semibold">Intelligent Discovery</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Search is no longer a static box. It becomes a dynamic, contextual conversation.</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col gap-4">
            <span className="text-2xl font-light text-[var(--text-muted)]">03</span>
            <h3 className="text-lg font-semibold">Personal Shopping</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Recommendations finally become relevant, based on deep conversational context.</p>
          </div>
        </div>
      </section>

      {/* 10. HOW IT WORKS */}
      <section id="how-it-works" className="flex flex-col gap-8 mt-12 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">02 — Architecture</span>
        <h2 className="text-3xl font-bold tracking-tight">From voice to product in seconds.</h2>
        
        <div className="flex flex-col md:flex-row items-start gap-4 overflow-x-auto pb-8 pt-4 w-full">
          {[
            { id: '01', title: 'Speak', desc: '"I need a black cotton shirt."', icon: Mic },
            { id: '02', title: 'Understand', desc: 'Extracts: Color · Material', icon: MessageSquare },
            { id: '03', title: 'Search', desc: 'Queries unified catalog.', icon: Search },
            { id: '04', title: 'Refine', desc: '"Medium under ₹1,500."', icon: ListFilter },
            { id: '05', title: 'Select', desc: 'User chooses a product.', icon: CheckCircle2 },
            { id: '06', title: 'Add', desc: 'Added to shopping list.', icon: ShoppingBag }
          ].map((step, i) => (
            <div key={i} className="flex items-center shrink-0">
              <div className="flex flex-col gap-3 w-40">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <step.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{step.id} — {step.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 pr-4">{step.desc}</p>
                </div>
              </div>
              {i < 5 && <ArrowRight className="w-4 h-4 text-[var(--border)] shrink-0 mx-2" />}
            </div>
          ))}
        </div>
      </section>

      {/* 11. REAL CONVERSATION EXAMPLE */}
      <section id="voice" className="flex flex-col gap-8 mt-12 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">03 — Interaction</span>
        <h2 className="text-3xl font-bold tracking-tight">A conversation, not a search box.</h2>
        
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 max-w-2xl flex flex-col gap-6">
          <div className="flex justify-end">
            <div className="bg-[var(--accent)] text-[var(--background)] px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium max-w-[80%]">
              I need 2kg of sugar.
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-[var(--surface-3)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-none text-sm text-[var(--foreground)] max-w-[80%] flex flex-col gap-3">
              <p>I found 8 options for 2kg sugar.</p>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-[var(--surface-2)] rounded border border-[var(--border)]"></div>
                <div className="w-12 h-12 bg-[var(--surface-2)] rounded border border-[var(--border)]"></div>
                <div className="w-12 h-12 bg-[var(--surface-2)] rounded border border-[var(--border)]"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-[var(--accent)] text-[var(--background)] px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium max-w-[80%]">
              Show brown sugar.
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-[var(--surface-3)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-none text-sm text-[var(--foreground)] max-w-[80%]">
              <p>Here are 3 brown sugar options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. INVENTORY & ADMIN VISUAL */}
      <section id="inventory" className="flex flex-col gap-8 mt-12 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">04 — Platform Tools</span>
        <h2 className="text-3xl font-bold tracking-tight">One normalized catalog.</h2>
        <p className="text-[var(--text-secondary)] text-sm max-w-2xl">
          Everything your commerce operation needs, managed from a single unified admin dashboard.
        </p>
        
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden mt-4 shadow-xl shadow-black/50">
          <div className="bg-[var(--surface-2)] px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Product Catalog</span>
            <span className="ml-auto text-xs text-[var(--text-secondary)]">12,482 products</span>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-3)] text-[var(--text-secondary)] border-b border-[var(--border)] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Source</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
              <tr className="hover:bg-[var(--surface-hover)]">
                <td className="px-6 py-4 font-medium">Organic Brown Sugar</td>
                <td className="px-6 py-4">₹219</td>
                <td className="px-6 py-4 text-[var(--text-secondary)]">Source A</td>
                <td className="px-6 py-4 text-right"><span className="text-[var(--success)] flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span> Active</span></td>
              </tr>
              <tr className="hover:bg-[var(--surface-hover)]">
                <td className="px-6 py-4 font-medium">Cotton Shirt</td>
                <td className="px-6 py-4">₹999</td>
                <td className="px-6 py-4 text-[var(--text-secondary)]">Source B</td>
                <td className="px-6 py-4 text-right"><span className="text-[var(--success)] flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span> Active</span></td>
              </tr>
              <tr className="hover:bg-[var(--surface-hover)]">
                <td className="px-6 py-4 font-medium">Noise Cancelling Headphones</td>
                <td className="px-6 py-4">₹4,499</td>
                <td className="px-6 py-4 text-[var(--text-secondary)]">Source A</td>
                <td className="px-6 py-4 text-right"><span className="text-[var(--success)] flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span> Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 16. TECHNICAL API DOCS */}
      <section id="api" className="flex flex-col gap-8 mt-12 border-t border-[var(--border)] pt-16">
        <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">05 — Developer API</span>
        <h2 className="text-3xl font-bold tracking-tight">Built for scale.</h2>
        
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden mt-4 font-mono text-sm shadow-xl shadow-black/50">
          <div className="bg-[var(--surface-2)] px-4 py-2.5 border-b border-[var(--border)] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)]">POST /api/assistant/message</span>
          </div>
          <div className="p-6 text-[var(--text-secondary)]">
            <pre>
<code className="text-[#F5F7FA]">{"{"}</code><br/>
<code className="text-[var(--accent)]">  "message"</code><code className="text-[#F5F7FA]">: </code><code className="text-[var(--success)]">"Find brown sugar under 250"</code><code className="text-[#F5F7FA]">,</code><br/>
<code className="text-[var(--accent)]">  "sessionId"</code><code className="text-[#F5F7FA]">: </code><code className="text-[var(--success)]">"session_123"</code><br/>
<code className="text-[#F5F7FA]">{"}"}</code>
            </pre>
          </div>
        </div>
      </section>

    </div>
  );
}
