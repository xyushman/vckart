'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('The email or password you entered is incorrect.');
      setLoading(false);
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#F7F8FA' }}>
      
      {/* Soft radial accent background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle at 50% 30%, rgba(238, 240, 255, 0.4) 0%, transparent 70%)' 
        }} 
      />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10 flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
          <span className="text-[#6475F5]">✦</span> VCKart
        </h1>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#6B7280] uppercase">Admin Console</p>
      </div>

      {/* Login Card */}
      <div 
        className="w-full relative z-10 bg-white"
        style={{ 
          maxWidth: '440px',
          border: '1px solid #E2E6EC',
          borderRadius: '18px',
          boxShadow: '0 12px 40px rgba(17,24,39,0.08)'
        }}
      >
        <div className="p-8 md:p-10 flex flex-col gap-8">
          
          <header className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EEF0FF' }}>
              <Lock className="w-6 h-6" style={{ color: '#6475F5' }} />
            </div>
            <div>
              <h2 className="text-[22px] font-semibold text-[#111827] mb-2">Admin Console</h2>
              <p className="text-[15px] text-[#6B7280] leading-relaxed">
                Sign in to manage products, inventory, users and shopping data.
              </p>
            </div>
          </header>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center text-center gap-1">
              <h3 className="text-sm font-semibold text-red-800">Unable to sign in</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#374151]">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="h-[48px] px-4 w-full rounded-[10px] border border-[#D1D5DB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6475F5]/20 focus:border-[#6475F5] transition-all"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#374151]">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-[48px] px-4 w-full rounded-[10px] border border-[#D1D5DB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6475F5]/20 focus:border-[#6475F5] transition-all"
                required
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-[13px] font-medium" style={{ color: '#6475F5' }}>Forgot password?</a>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-[50px] flex items-center justify-center gap-2 rounded-[12px] text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              style={{ backgroundColor: loading ? '#5565E8' : '#6475F5' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign in to Admin Console'
              )}
            </button>
          </form>

        </div>
        
        {/* Card Footer */}
        <div className="px-8 py-5 border-t border-[#E2E6EC] bg-[#F9FAFB] rounded-b-[18px] text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#667085] hover:text-[#111827] transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to VCKart
          </Link>
        </div>
      </div>

      {/* Security Indicator */}
      <div className="mt-10 text-center relative z-10 flex flex-col items-center gap-1.5 opacity-80">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#4B5563]">
          <span>🔒</span> Secure administrator access
        </div>
        <p className="text-[12px] text-[#6B7280]">Your administrator session is protected.</p>
      </div>

    </main>
  );
}
