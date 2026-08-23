'use client';

import { useState } from 'react';
import { Settings, Volume2, Globe, CreditCard, ChevronRight, Check, Plus, X } from 'lucide-react';

type SettingsTab = 'overview' | 'general' | 'voice' | 'stores' | 'billing';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('overview');

  // Simple state for demonstration
  const [voiceSpeed, setVoiceSpeed] = useState('Normal');
  const [currency, setCurrency] = useState('INR (₹)');
  const [readAloud, setReadAloud] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<{type: string, last4: string}[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentMethods([...paymentMethods, { type: 'Visa', last4: '4242' }]);
    setIsAddingCard(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">General Settings</h2>
            
            <div className="flex flex-col gap-4">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
                <label className="text-sm font-semibold mb-2 block">Currency</label>
                <div className="flex gap-2">
                  {['INR (₹)', 'USD ($)', 'EUR (€)'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${currency === c ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
                <label className="text-sm font-semibold mb-2 block">Language</label>
                <select className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]">
                  <option>English (India)</option>
                  <option>English (US)</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'voice':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">Voice Preferences</h2>
            
            <div className="flex flex-col gap-4">
              <div 
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between cursor-pointer group hover:border-[var(--accent)]/50 transition-colors"
                onClick={() => setReadAloud(!readAloud)}
              >
                <div>
                  <h4 className="font-semibold text-sm">Read results aloud</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Assistant will speak search results automatically.</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${readAloud ? 'bg-[var(--accent)]' : 'bg-[var(--surface-3)] border border-[var(--border)]'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${readAloud ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
                <label className="text-sm font-semibold mb-2 block">Voice Speed</label>
                <div className="flex gap-2">
                  {['Slow', 'Normal', 'Fast'].map(s => (
                    <button 
                      key={s}
                      onClick={() => setVoiceSpeed(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${voiceSpeed === s ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'stores':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">Connected Stores</h2>
            
            <div className="flex flex-col gap-3">
              <div className="bg-[var(--surface)] border border-[var(--accent)] rounded-xl p-5 flex items-center justify-between shadow-[var(--accent)]/10 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">A</div>
                  <div>
                    <h4 className="font-semibold text-sm">Amazon India</h4>
                    <p className="text-xs text-[var(--success)] mt-0.5">Connected & Syncing</p>
                  </div>
                </div>
                <Check className="w-5 h-5 text-[var(--success)]" />
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">F</div>
                  <div>
                    <h4 className="font-semibold text-sm">Flipkart</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">Not connected</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-[var(--accent)] hover:underline">Connect</button>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">Billing & Payment</h2>
            
            {paymentMethods.length === 0 ? (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center flex flex-col items-center gap-3">
                <CreditCard className="w-10 h-10 text-[var(--border)]" />
                <h4 className="font-semibold">No Payment Methods</h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs">Add a credit card or UPI to enable one-click conversational checkout.</p>
                <button 
                  onClick={() => setIsAddingCard(true)}
                  className="mt-2 bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--foreground)]/90 transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paymentMethods.map((method, idx) => (
                  <div key={idx} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-[var(--surface-3)] border border-[var(--border)] rounded flex items-center justify-center font-bold text-xs italic text-[var(--foreground)]">
                        {method.type}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">•••• •••• •••• {method.last4}</h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Expires 12/28</p>
                      </div>
                    </div>
                    <button className="text-xs text-[var(--error)] font-medium hover:underline">Remove</button>
                  </div>
                ))}
                
                <button 
                  onClick={() => setIsAddingCard(true)}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[var(--border)] rounded-xl p-4 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface)] transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Another Method
                </button>
              </div>
            )}

            {/* Add Card Modal */}
            {isAddingCard && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                    <h3 className="font-bold text-lg">Add Payment Method</h3>
                    <button onClick={() => setIsAddingCard(false)} className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center hover:bg-[var(--surface-hover)]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddCard} className="p-6 flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-[var(--text-secondary)]">Card Number</label>
                      <input type="text" required placeholder="4242 4242 4242 4242" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block text-[var(--text-secondary)]">Expiry</label>
                        <input type="text" required placeholder="MM/YY" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block text-[var(--text-secondary)]">CVC</label>
                        <input type="text" required placeholder="123" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]" />
                      </div>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-[var(--accent)] text-white font-semibold py-2.5 rounded-xl hover:bg-[var(--accent-hover)] transition-colors">
                      Save Card
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div onClick={() => setActiveTab('general')} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 transition-colors group cursor-pointer">
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[var(--foreground)]">General</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Language, currency, and primary delivery address.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
            </div>
            
            <div onClick={() => setActiveTab('voice')} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 transition-colors group cursor-pointer">
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[var(--foreground)]">Voice Preferences</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Configure text-to-speech output, voice speed, and accents.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
            </div>

            <div onClick={() => setActiveTab('stores')} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 transition-colors group cursor-pointer">
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[var(--foreground)]">Connected Stores</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Manage which retail catalogs your assistant can search from.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
            </div>

            <div onClick={() => setActiveTab('billing')} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/50 transition-colors group cursor-pointer">
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[var(--foreground)]">Billing & Payment</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Your payment methods for one-click conversational checkout.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl mx-auto h-full w-full">
      <header className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2">
          {activeTab !== 'overview' && (
            <button onClick={() => setActiveTab('overview')} className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors mr-2">
              <span className="text-xs font-semibold uppercase tracking-wider">← Back</span>
            </button>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Settings</h1>
        </div>
        <p className="text-[var(--text-secondary)]">Manage your preferences, account details, and AI configurations.</p>
      </header>

      {renderContent()}
    </div>
  );
}
