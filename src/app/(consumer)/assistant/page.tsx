'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Mic, Search, Settings, X, Plus, ShoppingBag, Loader2, Sparkles, Filter, Info, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
  attributes?: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  results?: Product[];
}

export default function AssistantWorkspace() {
  const { data: session } = useSession();
  const [sessionId] = useState(`session-${Math.random().toString(36).substring(7)}`);
  
  // Extract just the first name for the greeting, fallback to an empty string
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : '';

  // Core States
  const [list, setList] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  // UI States
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [transcript, setTranscript] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceState]);

  const fetchList = async () => {
    const res = await fetch(`/api/list?sessionId=${sessionId}`);
    const data = await res.json();
    if (data.items) setList(data.items);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-IN'; 

    recognitionRef.current.onstart = () => setVoiceState('listening');
    
    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((res: any) => res[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognitionRef.current.onend = () => {
      if (transcript.trim()) {
        processTranscript(transcript.trim());
      } else {
        setVoiceState('idle');
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (!transcript.trim()) setVoiceState('idle');
  };

  const processTranscript = async (text: string) => {
    setVoiceState('processing');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setTranscript('');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, sessionId }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: data.message,
        results: data.results || undefined
      }]);
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(data.message);
        utterance.lang = recognitionRef.current?.lang || 'en-US';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
      
      if (data.state) {
        const filters = { query: data.state.searchQuery, ...data.state.filters };
        setActiveFilters(filters);
      }

      if (data.action === 'ADD_TO_LIST' || data.action === 'SELECT_PRODUCT') {
        fetchList();
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'I encountered an issue processing that. Could you try again?' }]);
    } finally {
      setVoiceState('idle');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) processTranscript(transcript.trim());
  };

  const isEmptyState = messages.length === 0;

  return (
    <div className="flex h-full w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden relative">
      
      {/* Center Workspace */}
      <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300">
        
        {/* TOP BAR */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
              </span>
              Ready to help
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer transition-colors">English</span>
            <div className="w-px h-4 bg-[var(--border)] mx-1"></div>
            <ThemeToggle />
            <button 
              onClick={() => setIsListOpen(!isListOpen)}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 transition-colors text-sm font-medium"
            >
              <ShoppingBag className="w-4 h-4 text-[var(--text-secondary)]" />
              List
              {list.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {list.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* CONTEXT BAR (Active Filters) */}
        {!isEmptyState && Object.keys(activeFilters).length > 0 && activeFilters.query && (
          <div className="bg-[var(--surface)] border-b border-[var(--border)] px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 shadow-sm z-20">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mr-2 shrink-0">Context</span>
            
            <div className="flex items-center text-xs font-medium px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full border border-[var(--accent)]/20 shrink-0">
              {activeFilters.query}
              <button onClick={() => setActiveFilters({})} className="ml-2 hover:bg-[var(--accent)]/20 rounded-full p-0.5"><X className="w-3 h-3"/></button>
            </div>
            
            {activeFilters.maxPrice && (
              <div className="flex items-center text-xs px-3 py-1 bg-[var(--surface-3)] rounded-full border border-[var(--border)] shrink-0">
                ≤ ₹{activeFilters.maxPrice}
              </div>
            )}
            {activeFilters.type && (
              <div className="flex items-center text-xs px-3 py-1 bg-[var(--surface-3)] rounded-full border border-[var(--border)] shrink-0">
                {activeFilters.type}
              </div>
            )}
            {activeFilters.brand?.map((b: string) => (
              <div key={b} className="flex items-center text-xs px-3 py-1 bg-[var(--surface-3)] rounded-full border border-[var(--border)] shrink-0">
                {b}
              </div>
            ))}
          </div>
        )}

        {/* MAIN CHAT AREA */}
        <div className="flex-1 overflow-y-auto w-full relative">
          
          {isEmptyState ? (
            // EMPTY STATE (Centered)
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pb-32 animate-in fade-in duration-700">
              <Sparkles className="w-6 h-6 text-[var(--accent)] mb-6 opacity-80" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-center">
                Good evening{firstName ? `, ${firstName}` : ''}.
              </h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base text-center mb-10">What can I help you find today?</p>
              
              {/* Hero Voice Button */}
              <div className="relative mb-12 flex flex-col items-center group">
                <div className={`absolute inset-0 rounded-full bg-[var(--accent)]/20 blur-xl transition-all duration-700 ${voiceState === 'listening' ? 'scale-150 opacity-100 animate-pulse' : 'scale-100 opacity-0 group-hover:opacity-100'}`}></div>
                <button 
                  onClick={voiceState === 'listening' ? stopListening : startListening}
                  className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center border transition-all duration-300 shadow-xl ${
                    voiceState === 'listening' 
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white scale-110 shadow-[var(--accent)]/20' 
                      : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--accent)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  {voiceState === 'processing' ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
                  ) : (
                    <Mic className={`w-8 h-8 ${voiceState === 'listening' ? 'animate-bounce' : ''}`} />
                  )}
                </button>
                <p className="absolute -bottom-8 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                  {voiceState === 'idle' && 'Tap to speak naturally'}
                  {voiceState === 'listening' && <span className="text-[var(--accent)]">Listening...</span>}
                  {voiceState === 'processing' && 'Understanding...'}
                </p>
              </div>

              {/* Suggested Prompts */}
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-1">Try Saying</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => processTranscript("Find 2kg brown sugar")} className="bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2 rounded-full text-xs font-medium hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)] transition-all text-[var(--text-secondary)] hover:text-[var(--foreground)]">
                    "Find 2kg brown sugar"
                  </button>
                  <button onClick={() => processTranscript("Show black shirts under ₹1500")} className="bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2 rounded-full text-xs font-medium hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)] transition-all text-[var(--text-secondary)] hover:text-[var(--foreground)]">
                    "Black shirts under ₹1500"
                  </button>
                  <button onClick={() => processTranscript("Add milk to my list")} className="bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2 rounded-full text-xs font-medium hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)] transition-all text-[var(--text-secondary)] hover:text-[var(--foreground)]">
                    "Add milk to my list"
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // CONVERSATIONAL STATE
            <div className="max-w-3xl mx-auto p-6 space-y-8 pb-32">
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Chat Bubble */}
                  <div className={`px-5 py-3.5 max-w-[85%] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--accent)] text-white rounded-2xl rounded-tr-sm shadow-md' 
                      : 'bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)] rounded-2xl rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Inline Product Results */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="w-full flex flex-col gap-3 mt-2 pl-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {msg.results.map((prod) => (
                          <div key={prod.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden group hover:border-[var(--accent)]/50 transition-all shadow-sm flex flex-col">
                            <div className="relative h-32 bg-[var(--surface-3)] overflow-hidden">
                              <img 
                                src={prod.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.name + ' minimal product')}?width=300&height=300&nologo=true&seed=${prod.id}`} 
                                alt={prod.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                              {prod.price === Math.min(...msg.results!.map(p => p.price)) && (
                                <div className="absolute top-2 left-2 bg-[var(--success)] text-[var(--background)] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Best Value
                                </div>
                              )}
                            </div>
                            <div className="p-3 flex flex-col flex-1 gap-1.5">
                              <h4 className="font-semibold text-sm leading-tight text-[var(--foreground)] line-clamp-2">{prod.name}</h4>
                              
                              <div className="flex flex-wrap gap-1 mt-auto">
                                {prod.attributes?.brand && <span className="text-[10px] text-[var(--text-muted)] border border-[var(--border)] px-1.5 rounded">{prod.attributes.brand}</span>}
                                {prod.attributes?.size && <span className="text-[10px] text-[var(--text-muted)] border border-[var(--border)] px-1.5 rounded">{prod.attributes.size}</span>}
                              </div>
                              
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]">
                                <span className="font-bold text-[var(--accent)]">₹{prod.price}</span>
                                <button className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Add</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {voiceState === 'processing' && (
                <div className="flex justify-start">
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-3 shadow-sm animate-in fade-in">
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Finding the best matches...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* BOTTOM INPUT BAR */}
        <div className="absolute bottom-6 left-0 right-0 px-6 z-30 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <form onSubmit={handleManualSubmit} className="relative flex items-center bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl shadow-xl shadow-black/20 overflow-hidden transition-all duration-300 focus-within:border-[var(--accent)]/50 focus-within:ring-2 focus-within:ring-[var(--accent)]/10">
              
              <div className="flex items-center justify-center w-12 shrink-0">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              </div>
              
              <input
                ref={inputRef}
                type="text"
                placeholder={voiceState === 'listening' ? "Listening..." : "Ask VCKart anything..."}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full bg-transparent py-4 text-sm focus:outline-none placeholder:text-[var(--text-muted)] text-[var(--foreground)]"
                disabled={voiceState !== 'idle'}
              />
              
              <div className="flex items-center justify-center pr-2 shrink-0 gap-2">
                {transcript.trim() && voiceState === 'idle' && (
                  <button type="submit" className="bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors animate-in fade-in zoom-in">
                    Send
                  </button>
                )}
                <button 
                  type="button"
                  onClick={voiceState === 'listening' ? stopListening : startListening}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    voiceState === 'listening'
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      : 'bg-[var(--surface-3)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {voiceState === 'listening' ? <XCircle className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR / CONTEXTUAL SHOPPING LIST DRAWER */}
      <div 
        className={`absolute inset-y-0 right-0 z-40 w-80 bg-[var(--surface-2)] border-l border-[var(--border)] shadow-2xl transform transition-transform duration-500 ease-in-out ${isListOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--surface-2)]">
            <h2 className="font-bold text-sm tracking-wide uppercase text-[var(--foreground)]">Your List</h2>
            <button onClick={() => setIsListOpen(false)} className="w-8 h-8 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-70">
                <ShoppingBag className="w-12 h-12 text-[var(--border)] mb-4" />
                <h3 className="text-sm font-semibold mb-1">Your list is waiting.</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Products you add will appear here.</p>
                <div className="bg-[var(--surface-3)] border border-[var(--border)] rounded-lg p-3 w-full">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Try saying</p>
                  <p className="text-xs font-medium italic text-[var(--accent)]">"Add milk to my list"</p>
                </div>
              </div>
            ) : (
              list.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[var(--surface-3)] overflow-hidden shrink-0 border border-[var(--border)]">
                    <img 
                      src={item.product?.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(item.rawProductName + ' minimal grocery isolated')}?width=100&height=100&nologo=true&seed=${item.id}`} 
                      alt={item.rawProductName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm capitalize truncate">{item.rawProductName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.quantity} {item.unit}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {list.length > 0 && (
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)]">
              <Button className="w-full bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 rounded-xl h-10 text-xs font-semibold">
                Checkout {list.length} Items
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Drawer Overlay */}
      {isListOpen && (
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsListOpen(false)}
        />
      )}

    </div>
  );
}
