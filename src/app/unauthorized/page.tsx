import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Unauthorized() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <Card className="border-[var(--border)] shadow-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-[var(--foreground)]">Access restricted</CardTitle>
            <CardDescription className="text-base text-[var(--text-secondary)] mt-2">
              You don't have permission to access the VCKart Admin Console.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Link
              href="/login"
              className="w-full h-11 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white flex items-center justify-center rounded-lg font-medium transition-colors"
            >
              Return to VCKart
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
