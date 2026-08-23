/* eslint-disable react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
import { Package, TrendingUp, Search, Activity, Box, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Product Intelligence</h1>
          <p className="text-[var(--text-secondary)] mt-1">Overview of your AI conversational commerce engine.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-sm px-3 py-1.5 bg-[var(--surface-3)] border border-[var(--border)] rounded-full text-[var(--text-secondary)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
            </span>
            System Healthy
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[var(--border)] shadow-sm bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Products</CardTitle>
            <Box className="w-4 h-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,482</div>
            <p className="text-xs text-[var(--success)] flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +1,240 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Active Inventory</CardTitle>
            <Package className="w-4 h-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,904</div>
            <p className="text-xs text-[var(--warning)] flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3 h-3" /> 184 low availability
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">AI Search Accuracy</CardTitle>
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-[var(--success)] flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +2.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Price Changes</CardTitle>
            <RefreshCw className="w-4 h-4 text-[var(--text-muted)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">327</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Synced in last 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-[var(--border)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)] flex items-center gap-2">
              <Search className="w-4 h-4" /> Top Voice Queries
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">Most common user intents mapped by NLP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { query: "Find milk under ₹100", count: 482 },
                { query: "I need black running shoes", count: 391 },
                { query: "Buy organic rice", count: 342 },
                { query: "Show cheap headphones", count: 291 },
                { query: "Add 2kg sugar", count: 215 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded bg-[var(--surface-3)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)]">{i+1}</span>
                    <span className="font-medium text-[var(--foreground)]">"{item.query}"</span>
                  </div>
                  <span className="text-[var(--text-secondary)]">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)] flex items-center gap-2 text-[var(--warning)]">
              <AlertCircle className="w-4 h-4" /> Unresolved Queries
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">Queries where NLP confidence fell below 60%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Find something like my usual...",
                "Get my usual weekly order",
                "Cheapest healthy breakfast option",
                "I want a gift for a 5 year old",
              ].map((q, i) => (
                <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-[var(--surface-3)] border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] italic">"{q}"</span>
                </div>
              ))}
              <button className="w-full mt-4 text-xs font-semibold text-[var(--accent)] hover:underline">View 184 more missing intents →</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
