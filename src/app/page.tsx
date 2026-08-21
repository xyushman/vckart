'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Search, Menu, ShoppingBag, X, Mic, MicOff, Loader2 } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

interface ShoppingItem {
  id: string;
  rawProductName: string;
  category: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
  product?: {
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [list, setList] = useState<ShoppingItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: session } = useSession();
  const [voiceSpeed, setVoiceSpeed] = useState(0.95);
  const [voicePitch, setVoicePitch] = useState(0.9);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed; 
      utterance.pitch = voicePitch;
      if (onEnd) {
        utterance.onend = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } else if (onEnd) {
      onEnd();
    }
  }, []);

  // Initialize session ID
  useEffect(() => {
    // Wait until session finishes loading to define the list ID
    if (session === undefined) return;

    let uid = 'guest_session';
    if (session?.user) {
      // @ts-ignore
      uid = session.user.id || 'usr_123';
    }
    
    let sid = localStorage.getItem('vckart_session');
    // If not logged in, force guest provisions. If logged in, ensure we aren't using guest.
    if (!sid || (session?.user && sid.includes('guest'))) {
      sid = `${uid}_provisions`;
      localStorage.setItem('vckart_session', sid);
    }
    setSessionId(sid);
    fetchList(sid);
  }, [session]);

  const fetchList = async (sid: string) => {
    try {
      const res = await fetch(`/api/list?sessionId=${sid}`);
      const data = await res.json();
      setList(data.list || []);
    } catch (e) {
      console.error("Failed to fetch list", e);
    }
  };

  const handleCommand = useCallback(async (text: string) => {
    if (!sessionId) return;
    setProcessing(true);
    setToastMessage('');

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: text, 
          sessionId,
          currentList: list.map(i => i.rawProductName) 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      setToastMessage(data.message);
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
      speak(data.message);
      
      if (data.action === 'CREATE_LIST' && data.listName) {
        const newListName = data.listName.toLowerCase();
        setSessionId(newListName);
        localStorage.setItem('vckart_session', newListName);
        fetchList(newListName);
      } else if (data.action === 'SEARCH_PRODUCT' && data.searchResults) {
        setSearchResults(data.searchResults);
      } else if (data.list) {
        setList(data.list);
      }
    } catch (error: any) {
      setToastMessage(`Error: ${error.message}`);
      speak(`I'm sorry, I could not hear you through the fog.`);
    } finally {
      setProcessing(false);
      setTimeout(() => setToastMessage(''), 5000);
    }
  }, [sessionId, list, speak]);

  const { isListening, transcript, startListening, stopListening, supported, error: speechError } = useSpeechRecognition(handleCommand);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      return;
    }

    if (!hasGreeted) {
      setHasGreeted(true);
      setToastMessage("Welcome to the old market. What do ye need?");
      speak("Welcome to the old market. What do ye need?", () => {
        setToastMessage('');
        startListening();
      });
    } else {
      startListening();
    }
  };

  const groupedList = list.reduce((acc, item) => {
    const cat = item.category || 'General Wares';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  if (!supported) {
    return <div className="p-8 text-center text-red-900 bg-red-100 font-serif">Your browser does not support Web Speech API. Please use Chrome.</div>;
  }

  return (
    <main className="relative min-h-screen bg-stone-50 text-stone-800 font-serif flex flex-col selection:bg-amber-600 selection:text-white">
      {/* Settings Drawer */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-stone-100 border-l border-stone-300 shadow-2xl z-50 transform transition-transform duration-500 flex flex-col ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-stone-300 flex justify-between items-center bg-white">
          <h3 className="font-bold text-stone-800 tracking-widest uppercase">Settings</h3>
          <button onClick={() => setIsSettingsOpen(false)} className="text-stone-500 hover:text-stone-800"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          {/* User Auth (NextAuth) */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 tracking-widest uppercase mb-4">Account</h4>
            {!session?.user ? (
              <button 
                onClick={() => signIn()}
                className="w-full py-3 bg-amber-700 text-white font-bold rounded shadow hover:bg-amber-800 transition-colors"
              >
                Sign In
              </button>
            ) : (
              <div className="bg-white p-4 rounded border border-stone-200 text-center shadow-sm">
                <p className="font-bold text-stone-800">{session.user.name}</p>
                <p className="text-xs text-stone-500 mb-3">{session.user.email}</p>
                <button 
                  onClick={() => signOut()}
                  className="mt-2 text-xs text-red-600 font-bold hover:underline py-2 px-4 bg-red-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 tracking-widest uppercase mb-4">Voice Controls</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-stone-700 flex justify-between mb-2"><span>Speed</span> <span>{voiceSpeed}x</span></label>
                <input type="range" min="0.5" max="1.5" step="0.05" value={voiceSpeed} onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))} className="w-full accent-amber-700" />
              </div>
              <div>
                <label className="text-sm font-bold text-stone-700 flex justify-between mb-2"><span>Pitch</span> <span>{voicePitch}</span></label>
                <input type="range" min="0.5" max="2" step="0.1" value={voicePitch} onChange={(e) => setVoicePitch(parseFloat(e.target.value))} className="w-full accent-amber-700" />
              </div>
              <button onClick={() => speak('Testing voice settings.')} className="text-xs font-bold text-amber-700 hover:underline">Test Voice</button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image & Light Overlays */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none opacity-90"
        style={{ backgroundImage: "url('/light_street_bg.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-stone-50 via-stone-50/70 to-white/30 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-amber-100/20 mix-blend-multiply pointer-events-none" />

      {/* Rustic Top Navigation (Light) */}
      <nav className="relative z-10 w-full bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto py-4 px-4 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <div className="flex items-center gap-4 group cursor-pointer bg-white/60 py-2 px-4 rounded-2xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 border-2 border-amber-800 flex items-center justify-center rounded-xl shadow-sm group-hover:bg-amber-200 transition-colors">
                <ShoppingBag className="w-5 h-5 text-amber-800" />
              </div>
              <span className="text-2xl font-black tracking-[0.2em] uppercase text-stone-800 group-hover:text-amber-700 transition-colors">VCKART</span>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-xs font-black tracking-[0.2em] uppercase text-stone-600 bg-white/60 px-8 py-3 rounded-full border border-white/50 shadow-sm">
              <button className="text-amber-800 relative after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-amber-800">The Market</button>
              <button 
                onClick={() => { 
                  // @ts-ignore
                  const uid = session?.user?.id || 'guest_session';
                  const newSid = `${uid}_apothecary`;
                  setSessionId(newSid);
                  localStorage.setItem('vckart_session', newSid);
                  fetchList(newSid);
                  speak('Navigating to the Apothecary.'); 
                }}
                className={`transition-colors ${sessionId.includes('apothecary') ? 'text-amber-800 border-b-2 border-amber-800' : 'hover:text-stone-900'}`}
              >
                Apothecary
              </button>
              <button 
                onClick={() => { 
                  // @ts-ignore
                  const uid = session?.user?.id || 'guest_session';
                  const newSid = `${uid}_provisions`;
                  setSessionId(newSid);
                  localStorage.setItem('vckart_session', newSid);
                  fetchList(newSid);
                  speak('Viewing main provisions.'); 
                }}
                className={`transition-colors ${sessionId.includes('provisions') ? 'text-amber-800 border-b-2 border-amber-800' : 'hover:text-stone-900'}`}
              >
                Provisions
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { 
                const input = document.querySelector('input[name="command"]') as HTMLInputElement;
                if (input) {
                  input.focus();
                  setToastMessage('What are you searching for?');
                }
              }}
              className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center text-stone-600 hover:bg-white hover:text-amber-800 transition-all border border-white/50 shadow-sm"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center text-stone-600 hover:bg-white hover:text-amber-800 transition-all border border-white/50 shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-12 flex-1 flex flex-col lg:flex-row items-start justify-between gap-16 py-12 pb-16">
        
        {/* Left Side: Atmosphere / Billboard */}
        <div className="hidden lg:flex flex-1 flex-col justify-center max-w-xl pt-12">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800 to-transparent" />
              <h2 className="text-xs tracking-[0.5em] text-amber-800 font-bold uppercase">Morning Specials</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-800 to-transparent" />
            </div>
            
            <h3 className="text-7xl font-black leading-[1.1] tracking-tighter text-stone-900" style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.8)' }}>
              FRESH<br/>
              <span className="text-amber-700 italic font-serif">Provisions</span>
            </h3>
            
            <p className="text-stone-700 text-xl leading-relaxed italic border-l-4 border-amber-600 pl-6 bg-white/40 p-4 rounded-r-lg">
              "Speak to the grocer to stock your pantry. We acquire only the finest goods from across the sunlit streets."
            </p>
            
            <div className="pt-8 flex gap-6">
              <button 
                onClick={() => setToastMessage('The grocer is currently busy. Please use your voice.')}
                className="px-10 py-4 bg-amber-800 border-2 border-stone-900 text-amber-50 font-bold tracking-widest uppercase hover:bg-amber-700 hover:text-white transition-all shadow-lg"
              >
                Ring Bell
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: The Bright Wooden Ledger */}
        <div className="w-full max-w-md flex-shrink-0 animate-in fade-in slide-in-from-bottom-12 duration-1000 mt-4 lg:mt-0">
          
          {/* Light Wooden Frame Wrapper */}
          <div className="bg-[#bda177] p-3 rounded-lg shadow-2xl border-4 border-[#8c7050] relative overflow-hidden">
            {/* Inner Parchment Paper */}
            <div className="bg-[#fdf6e3] rounded border border-[#d3cbb8] flex flex-col h-[650px] relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, #d3cbb8 10%, transparent 10%), radial-gradient(circle, #d3cbb8 10%, transparent 10%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px', opacity: 0.98 }}>
              
              {/* Ledger Header */}
              <div className="p-8 pb-6 border-b-2 border-dashed border-stone-300 relative z-10 bg-[#fdf6e3]">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs tracking-[0.4em] text-stone-500 uppercase font-bold">Ledger</span>
                  {list.length > 0 && (
                    <span className="text-amber-900 text-sm font-bold font-mono border border-amber-900 px-2 py-1 bg-amber-100/50">
                      No. {list.length}
                    </span>
                  )}
                </div>
                <h4 className="text-4xl font-bold tracking-wider text-stone-900 italic capitalize">
                  {sessionId.length < 30 ? `${sessionId} List` : 'Shopping List'}
                </h4>
              </div>

              {/* Ledger Content */}
              <div className="flex-1 overflow-y-auto p-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-stone-300 relative z-10 bg-transparent">
                {list.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-6">
                    <div className="w-24 h-24 border-2 border-dashed border-stone-300 rounded-full flex items-center justify-center rotate-12 bg-white/50">
                      <ShoppingBag className="w-10 h-10 opacity-40" />
                    </div>
                    <p className="text-lg font-bold tracking-widest uppercase opacity-70">Empty Ledger</p>
                  </div>
                ) : (
                  Object.entries(groupedList).map(([category, items]) => (
                    <div key={category} className="mb-8 last:mb-0 animate-in fade-in duration-700">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-px flex-1 bg-stone-300" />
                        <h5 className="text-[10px] font-black tracking-[0.3em] text-amber-800 uppercase">
                          {category}
                        </h5>
                        <div className="h-px flex-1 bg-stone-300" />
                      </div>
                      
                      <div className="space-y-1">
                        {items.map(item => (
                          <div key={item.id} className="flex items-center justify-between py-2 group hover:bg-stone-200/50 px-2 transition-colors -mx-2 rounded">
                            <div className="flex items-center gap-3 flex-1 border-b-2 border-dotted border-stone-300 pb-2">
                              {item.product?.imageUrl && (
                                <img src={item.product.imageUrl} alt={item.rawProductName} className="w-10 h-10 rounded shadow object-cover border border-stone-300" />
                              )}
                              <div>
                                <p className="font-bold text-stone-900 capitalize text-lg">{item.rawProductName}</p>
                                {item.product?.price && <p className="text-xs text-amber-700 font-bold">${item.product.price.toFixed(2)}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="text-sm text-amber-800 font-mono font-bold bg-white px-2 py-1 border border-stone-300 rounded shadow-sm">{item.quantity} {item.unit}</p>
                              <button 
                                onClick={() => handleCommand(`remove ${item.rawProductName}`)}
                                className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 transition-colors"
                                title="Strike from ledger"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area (Mic + Text) */}
              <div className="p-8 pt-6 bg-gradient-to-t from-white to-[#fdf6e3] border-t-2 border-stone-200 relative z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                
                {/* Status/Error Messages */}
                <div className="absolute -top-16 left-0 w-full flex justify-center pointer-events-none px-8">
                  {speechError ? (
                    <div className="px-6 py-3 bg-red-100 text-red-900 border-2 border-red-300 text-sm font-bold w-full text-center shadow-lg">
                      {speechError}
                    </div>
                  ) : toastMessage ? (
                    <div className="px-6 py-3 bg-white text-amber-800 border-2 border-stone-300 text-sm w-full text-center font-bold tracking-wide shadow-lg animate-in slide-in-from-bottom-2">
                      {toastMessage}
                    </div>
                  ) : transcript && isListening ? (
                    <div className="px-6 py-3 bg-amber-100 text-amber-900 border-2 border-amber-300 text-sm w-full text-center font-bold shadow-lg animate-pulse">
                      "{transcript}"
                    </div>
                  ) : null}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-stone-200 rounded-sm mb-6 overflow-hidden border border-stone-300">
                  <div className={`h-full bg-amber-600 transition-all duration-300 ${isListening ? 'w-full animate-pulse' : processing ? 'w-1/2' : 'w-0'}`} />
                </div>

                {/* Suggestion Tags (Vintage style) */}
                {suggestions.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-none">
                    {suggestions.map((sug, i) => (
                      <button 
                        key={i}
                        onClick={() => handleCommand(`Add ${sug}`)}
                        disabled={processing}
                        className="whitespace-nowrap px-3 py-1 bg-white border border-stone-300 hover:border-amber-600 hover:text-amber-800 text-[10px] font-black tracking-widest uppercase text-stone-600 transition-all disabled:opacity-50"
                        style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleMicClick}
                    disabled={processing}
                    className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-sm ${
                      isListening 
                        ? 'bg-amber-700 border-amber-900 text-white shadow-[0_0_15px_rgba(180,83,9,0.3)] scale-105' 
                        : 'bg-white border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-700 hover:bg-stone-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem('command') as HTMLInputElement;
                      if (input.value) {
                        handleCommand(input.value);
                        form.reset();
                      }
                    }} 
                    className="flex-1 relative"
                  >
                    <input 
                      name="command" 
                      type="text" 
                      placeholder="Instruct the grocer..." 
                      className="w-full h-14 bg-white text-stone-900 border-2 border-stone-300 pl-4 pr-14 text-sm font-bold focus:outline-none focus:border-amber-600 focus:bg-stone-50 placeholder-stone-400 transition-all rounded-sm shadow-inner"
                      disabled={processing}
                      autoComplete="off"
                    />
                    <button 
                      type="submit" 
                      disabled={processing}
                      className="absolute right-2 top-2 bottom-2 w-10 bg-stone-100 border border-stone-300 hover:border-amber-600 hover:text-amber-700 rounded-sm flex items-center justify-center text-stone-500 transition-colors disabled:opacity-50"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Drawer */}
      <div className={`fixed inset-x-0 bottom-0 bg-[#fdf6e3] border-t-4 border-[#8c7050] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] z-50 transform transition-transform duration-500 rounded-t-3xl ${searchResults.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto p-6 pb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-3xl text-stone-900 italic font-serif">Market Results</h3>
            <button onClick={() => setSearchResults([])} className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-300 transition-colors"><X className="w-6 h-6"/></button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-stone-300">
            {searchResults.map((prod, i) => (
              <div key={i} className="flex-shrink-0 w-64 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm group">
                {prod.imageUrl && (
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-40 object-cover border-b border-stone-200" />
                )}
                <div className="p-5">
                  <h4 className="font-bold text-xl text-stone-900 mb-1 leading-tight">{prod.name}</h4>
                  <p className="text-sm font-mono text-amber-700 font-bold mb-5">${prod.price.toFixed(2)}</p>
                  <button 
                    onClick={() => { 
                      handleCommand(`Add ${prod.name}`); 
                      setSearchResults([]); 
                    }} 
                    className="w-full py-3 bg-stone-100 hover:bg-amber-100 border border-stone-300 hover:border-amber-600 text-stone-700 hover:text-amber-800 font-bold text-[11px] tracking-widest uppercase transition-colors rounded shadow-sm"
                  >
                    Add to Ledger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
