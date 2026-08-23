'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Clock, Server } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SyncIntelligence() {
  const [syncing, setSyncing] = useState<string | null>(null);
  
  const handleSync = (provider: string) => {
    setSyncing(provider);
    setTimeout(() => {
      setSyncing(null);
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Product Sources</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage cross-store inventory ingestion and sync status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Amazon Provider */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <h3 className="font-bold text-[var(--foreground)]">Amazon</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">amazon.in • Authorized API</p>
            </div>
            <Button 
              size="sm" 
              className="bg-[var(--surface-3)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              onClick={() => handleSync('amazon')}
              disabled={syncing !== null}
            >
              {syncing === 'amazon' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sync Now'}
            </Button>
          </div>
          <div className="p-6 space-y-4 bg-[var(--surface-2)]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Status</p>
                <p className="text-sm font-medium text-[var(--success)] flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Connected</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Last Sync</p>
                <p className="text-sm font-medium text-[var(--foreground)]">10:42 AM Today</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--border)] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Fetched</span>
                <span className="font-medium">8,421</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Added</span>
                <span className="font-medium text-[var(--success)]">+284</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Updated</span>
                <span className="font-medium">7,921</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Errors</span>
                <span className="font-medium text-[var(--error)]">12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flipkart Provider */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <h3 className="font-bold text-[var(--foreground)]">Flipkart</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">flipkart.com • Scraper API</p>
            </div>
            <Button 
              size="sm" 
              className="bg-[var(--surface-3)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              onClick={() => handleSync('flipkart')}
              disabled={syncing !== null}
            >
              {syncing === 'flipkart' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sync Now'}
            </Button>
          </div>
          <div className="p-6 space-y-4 bg-[var(--surface-2)]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Status</p>
                <p className="text-sm font-medium text-[var(--success)] flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Connected</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Last Sync</p>
                <p className="text-sm font-medium text-[var(--foreground)]">Yesterday, 11:30 PM</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--border)] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Fetched</span>
                <span className="font-medium">6,201</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Added</span>
                <span className="font-medium text-[var(--success)]">+42</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Updated</span>
                <span className="font-medium">5,800</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Errors</span>
                <span className="font-medium text-[var(--error)]">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Shopping Provider */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm opacity-70">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h3 className="font-bold text-[var(--foreground)]">Google Shopping</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">google.com/shopping • Partner API</p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              disabled
            >
              Configure
            </Button>
          </div>
          <div className="p-6 space-y-4 bg-[var(--surface-2)] flex flex-col items-center justify-center text-center h-[200px]">
            <Server className="w-8 h-8 text-[var(--text-muted)] mb-2" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Provider Offline</p>
            <p className="text-xs text-[var(--text-muted)]">API credentials not configured.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
