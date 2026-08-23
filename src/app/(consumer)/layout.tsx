'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Mic, Compass, ShoppingBag, Heart, Clock, Settings, HelpCircle, User } from 'lucide-react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || 'Guest User';
  const userEmail = session?.user?.email || 'Sign in to sync';

  const navItems = [
    { name: 'Assistant', href: '/assistant', icon: Mic },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Shopping List', href: '/shopping-list', icon: ShoppingBag },
    { name: 'Saved', href: '/saved', icon: Heart },
    { name: 'History', href: '/history', icon: Clock },
  ];

  const bottomItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  const getLinkClasses = (href: string, exact: boolean = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href) && (href !== '/assistant' || pathname === '/assistant');
    
    if (isActive) {
      return "flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-[var(--accent)]/10 text-[var(--foreground)] border-l-2 border-[var(--accent)] -ml-4 pl-[1.125rem]";
    }
    return "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-hover text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors";
  };

  const getMobileClasses = (href: string, exact: boolean = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href) && (href !== '/assistant' || pathname === '/assistant');
    return `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--foreground)]'}`;
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] hidden md:flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--foreground)]">VCKart</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link key={item.name} href={item.href} className={getLinkClasses(item.href, item.href === '/assistant')}>
              <item.icon className={`w-4 h-4 ${pathname === item.href ? 'text-[var(--accent)]' : ''}`} /> {item.name}
            </Link>
          ))}
          
          <div className="my-4 border-t border-[var(--border)]" />
          
          {bottomItems.map(item => (
            <Link key={item.name} href={item.href} className={getLinkClasses(item.href)}>
              <item.icon className={`w-4 h-4 ${pathname.startsWith(item.href) ? 'text-[var(--accent)]' : ''}`} /> {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors mb-2">
            {session?.user?.image ? (
              <img src={session.user.image} alt={userName} className="w-8 h-8 rounded-full border border-[var(--border)]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{userName}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{userEmail}</p>
            </div>
          </Link>
          <button 
            onClick={() => {
              import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/login' }))
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-around px-2 z-50">
        {navItems.slice(0,4).map(item => (
          <Link key={item.name} href={item.href} className={getMobileClasses(item.href, item.href === '/assistant')}>
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name === 'Shopping List' ? 'List' : item.name}</span>
          </Link>
        ))}
        <Link href="/profile" className={getMobileClasses('/profile')}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
