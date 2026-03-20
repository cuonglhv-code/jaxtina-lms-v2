'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X,
  LayoutDashboard, BookOpen, Users, GraduationCap, UserCheck,
  BarChart2, Settings, FileText, FolderOpen, PenLine, TrendingUp,
  MessageSquare, BookPlus,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { LangToggle } from '@/components/ui/LangToggle';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { useLang } from '@/hooks/useLang';
import { ROLE_LABELS } from '@/lib/i18n/translations';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard, BookOpen, Users, GraduationCap, UserCheck,
  BarChart2, Settings, FileText, FolderOpen, PenLine, TrendingUp,
  MessageSquare, BookPlus,
};

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface UserProfile {
  full_name: string;
  role: string;
  email: string;
  avatar_url?: string | null;
}

interface DashboardShellProps {
  navItems: NavItem[];
  userProfile: UserProfile;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ navItems, userProfile, children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang } = useLang();
  const roleLabel = ROLE_LABELS[lang][userProfile.role] ?? userProfile.role;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--midnight)] text-white p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-full bg-[var(--jade)] flex items-center justify-center text-white font-display text-xl">
          J
        </div>
        <span className="font-display text-2xl tracking-wide">Jaxtina</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-sans text-[14px] transition-colors ${
                isActive 
                  ? 'border-l-4 border-[var(--jade)] bg-[var(--jade-light)] text-[var(--jade)]' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {ICON_MAP[item.icon] ? React.createElement(ICON_MAP[item.icon], { size: 18 }) : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/10 mt-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={userProfile.full_name} size="md" imageUrl={userProfile.avatar_url} />
            <div className="flex flex-col">
              <span className="font-sans text-sm font-medium line-clamp-1">{userProfile.full_name}</span>
              <span className="font-sans text-xs text-[var(--mist)] uppercase tracking-wider">{roleLabel}</span>
            </div>
          </div>
          <LogoutButton />
        </div>
        <LangToggle />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--sand)] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 h-screen w-[var(--sidebar-width)] z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--midnight)] text-white flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--jade)] flex items-center justify-center text-white font-display text-xl">J</div>
          <span className="font-display text-xl">Jaxtina</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 pt-16 bg-[var(--midnight)]">
          <SidebarContent />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-[var(--sidebar-width)] pt-16 md:pt-0 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
