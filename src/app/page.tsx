'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Mic, MicOff, Loader2, Search, Menu, ShoppingBag, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ShoppingItem {
  id: string;
  rawProductName: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [list, setList] = useState<ShoppingItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initialize session ID
  useEffect(() => {
    let sid = localStorage.getItem('vckart_session');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('vckart_session', sid);
    }
    setSessionId(sid);
    fetchList(sid);
  }, []);

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
        body: JSON.stringify({ transcript: text, sessionId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      setToastMessage(data.message);
      if (data.list) setList(data.list);
    } catch (error: any) {
      setToastMessage(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
      setTimeout(() => setToastMessage(''), 5000);
    }
  }, [sessionId]);

  const { isListening, transcript, startListening, stopListening, supported, error: speechError } = useSpeechRecognition(handleCommand);

  if (!supported) {
    return <div className="p-8 text-center text-red-500">Your browser does not support Web Speech API. Please use Chrome.</div>;
  }

  return (
    <main className="relative min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
      {/* Background Image & Overlays */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105 pointer-events-none"
        style={{ backgroundImage: "url('/ikea_bg.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-neutral-950/70 via-neutral-900/40 to-neutral-950/90 pointer-events-none" />
      
      {/* Huge Background Typography (Depth Effect) */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none mix-blend-overlay">
        <h1 className="text-[15vw] font-black tracking-tighter text-white/5 select-none uppercase leading-none">
          VCKART
        </h1>
      </div>

      {/* Top Navigation Bar (Glassmorphism) */}
      <nav className="relative z-10 w-full max-w-[1400px] mx-auto pt-6 px-4 lg:px-12 flex-shrink-0">
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] px-8 py-5 shadow-2xl">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-600/30">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] uppercase">VCKART</span>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide text-neutral-300">
              <button className="text-white relative after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-pink-500">Products</button>
              <button className="hover:text-white transition-colors">Rooms</button>
              <button className="hover:text-white transition-colors">Deals</button>
              <button className="hover:text-white transition-colors">Design</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 lg:px-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 py-8 pb-12">
        
        {/* Left Side: 3D Showcase Text */}
        <div className="hidden lg:flex flex-1 flex-col justify-center max-w-xl">
          <div className="space-y-6">
            <h2 className="text-sm tracking-[0.4em] text-pink-500 font-bold uppercase flex items-center gap-4">
              <span className="w-12 h-[2px] bg-pink-500" />
              Featured Piece
            </h2>
            <h3 className="text-7xl font-black leading-[1.1] tracking-tight">
              STRANDMON<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500">
                Armchair
              </span>
            </h3>
            <p className="text-neutral-300 text-lg leading-relaxed pt-2">
              A timeless classic updated for modern comfort. Experience immersive voice shopping. Just tap the microphone and ask to add it to your cart.
            </p>
            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => setToastMessage('Product details feature coming in Phase 2!')}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={() => handleCommand('add strandmon armchair')}
                disabled={processing}
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur-md transition-colors disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: The Shopping Assistant Floating Glass Card */}
        <div className="w-full max-w-md flex-shrink-0 animate-in slide-in-from-right-8 duration-700">
          <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[600px] max-h-[85vh] relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none">
            
            {/* Card Header */}
            <div className="p-10 pb-6 border-b border-white/10 relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-bold">Your Cart</span>
                {list.length > 0 && (
                  <span className="bg-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg shadow-pink-600/30">
                    {list.length} Items
                  </span>
                )}
              </div>
              <h4 className="text-3xl font-extrabold tracking-tight">Shopping List</h4>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-10 py-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 relative z-10">
              {list.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <p className="text-sm font-medium tracking-wide">Your cart is empty.</p>
                </div>
              ) : (
                list.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/5 hover:border-white/15 transition-all group">
                    <div>
                      <p className="font-bold text-white capitalize text-lg">{item.rawProductName}</p>
                      <p className="text-sm text-neutral-400 mt-1 font-medium">{item.quantity} {item.unit}</p>
                    </div>
                    <button 
                      onClick={() => handleCommand(`remove ${item.rawProductName}`)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white hover:bg-pink-600 transition-all shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Input Area (Mic + Text) */}
            <div className="p-10 pt-6 bg-black/40 border-t border-white/10 relative z-10">
              
              {/* Error/Status Toast */}
              <div className="absolute -top-14 left-0 w-full flex justify-center pointer-events-none px-10">
                {speechError ? (
                  <div className="px-5 py-3 bg-red-500/90 text-white rounded-full text-sm shadow-2xl backdrop-blur-xl w-full truncate font-medium border border-red-400/30 text-center">
                    {speechError}
                  </div>
                ) : toastMessage ? (
                  <div className="px-5 py-3 bg-pink-600/90 text-white rounded-full text-sm shadow-2xl backdrop-blur-xl w-full text-center font-medium border border-pink-400/30 animate-in slide-in-from-bottom-2">
                    {toastMessage}
                  </div>
                ) : transcript && isListening ? (
                  <div className="px-5 py-3 bg-white text-black rounded-full text-sm shadow-2xl w-full text-center font-bold">
                    "{transcript}"
                  </div>
                ) : null}
              </div>

              {/* Progress Track (Dribbble style) */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
                <div className={`h-full bg-pink-600 transition-all duration-300 ${isListening ? 'w-full animate-pulse shadow-[0_0_10px_rgba(209,44,106,0.8)]' : processing ? 'w-1/2' : 'w-0'}`} />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={processing}
                  className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                    isListening 
                      ? 'bg-pink-600 text-white scale-110 shadow-pink-600/50 rotate-12' 
                      : 'bg-white text-black hover:bg-neutral-200 hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processing ? (
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                  ) : isListening ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
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
                    placeholder="Ask assistant..." 
                    className="w-full h-16 bg-white/5 text-white rounded-full pl-6 pr-16 text-sm font-medium focus:outline-none border border-white/10 focus:border-pink-500/50 focus:bg-white/10 placeholder-neutral-500 transition-all backdrop-blur-md"
                    disabled={processing}
                    autoComplete="off"
                  />
                  <button 
                    type="submit" 
                    disabled={processing}
                    className="absolute right-2 top-2 bottom-2 w-12 bg-pink-600 hover:bg-pink-500 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 shadow-lg shadow-pink-600/20"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
