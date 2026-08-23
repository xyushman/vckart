import Link from 'next/link';
import { Mic, Check, ArrowRight, Zap, Cloud, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      
      {/* Sleek Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Mic className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight">VCKART</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link href="/api/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/app">
              <Button size="sm" className="h-8 rounded-full px-4">
                Open App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        <div className="container mx-auto max-w-6xl px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
            VCKart 2.0 is now available
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-6 text-primary">
            The intelligent voice ledger <br className="hidden sm:block" /> for modern teams.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Stop manually typing shopping lists. VCKart uses advanced voice AI to instantly categorize, price, and sync your inventory in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/app">
              <Button size="lg" className="rounded-full h-12 px-8 text-base">
                Start for free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Built for speed and precision.
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to manage complex inventories without ever touching a keyboard.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Instant Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Commands are parsed and categorized in milliseconds using edge-optimized AI models.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center shadow-sm">
                <Cloud className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Real-time Sync</h3>
              <p className="text-muted-foreground leading-relaxed">
                Changes propagate instantly across all your devices via our globally distributed Postgres infrastructure.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center shadow-sm">
                <Smartphone className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Cross Platform</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access your ledgers from any device with a modern browser. No installations required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Hobby</h3>
              <p className="text-muted-foreground text-sm mb-6">For individuals and small projects.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground"/> 1 Active Ledger</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground"/> 10 Voice Commands / mo</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground"/> Community Support</li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-border bg-primary text-primary-foreground p-8 shadow-xl flex flex-col relative">
              <div className="absolute top-0 right-6 translate-y-[-50%] bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-foreground">Pro</h3>
              <p className="text-primary-foreground/70 text-sm mb-6">For professionals and teams.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-primary-foreground/70">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-primary-foreground/80">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-accent"/> Unlimited Ledgers</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-accent"/> Unlimited Voice AI</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-accent"/> Live Database Pricing</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-accent"/> Priority Support</li>
              </ul>
              <Button className="w-full bg-white text-black hover:bg-white/90">Upgrade to Pro</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-auto">
        <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>© 2026 VCKart Inc.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
