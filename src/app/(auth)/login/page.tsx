'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Mic, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn('credentials', { email, password, callbackUrl: '/assistant' });
  };

  const handleDemoSignIn = async () => {
    await signIn('credentials', { email: 'demo@vckart.com', password: 'demo', callbackUrl: '/assistant' });
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
        </div>

        <Card className="border-[var(--border)] shadow-sm">
          <CardHeader className="text-center pb-4 pt-4">
            <div className="mx-auto w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center mb-2">
              <Mic className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <CardTitle className="text-xl text-[var(--foreground)]">Welcome back</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Sign in to continue shopping with VCKart.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            <Button 
              variant="outline" 
              className="w-full h-10 border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--foreground)]"
              onClick={() => signIn('google', { callbackUrl: '/assistant' })}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--surface)] px-2 text-[var(--text-secondary)]">Or</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Email</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-secondary)]">Password</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-10 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="text-center pt-2">
              <button className="text-sm text-[var(--accent)] hover:underline font-medium">
                Forgot password?
              </button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            New to VCKart? <Link href="/auth/signup" className="text-[var(--accent)] font-medium hover:underline">Create account</Link>
          </p>

          <div className="pt-4 border-t border-[var(--border)]">
            <Link 
              href="/admin/login"
              className="group inline-flex items-center flex-col gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              <span className="font-semibold uppercase tracking-wider text-xs">Developer / Admin access</span>
              <span className="inline-flex items-center gap-1">
                Access the VCKart Console <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
