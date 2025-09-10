'use client';

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Leaf,
  Cloud,
  Bug,
  TrendingUp,
  MessageSquare,
  Menu,
  Bell,
  User,
} from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import VoiceAssistant from '@/components/dashboard/VoiceAssistant';
import { useLanguage } from '@/hooks/useLanguage';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  const navigationItems = [
    { href: '/dashboard', icon: Home, label: t('navigation.dashboard') },
    { href: '/dashboard/soil-health', icon: Leaf, label: t('navigation.soil_health') },
    { href: '/dashboard/weather-alerts', icon: Cloud, label: t('navigation.weather') },
    { href: '/dashboard/pest-disease-detection', icon: Bug, label: t('navigation.pest_disease') },
    { href: '/dashboard/market-prices', icon: TrendingUp, label: t('navigation.market_prices') },
    { href: '/dashboard/feedback', icon: MessageSquare, label: t('navigation.feedback') },
  ];

  const bottomNavItems = [
    { href: '/dashboard', icon: Home, label: t('navigation.home') },
    { href: '/dashboard/market-prices', icon: TrendingUp, label: t('navigation.market') },
    { href: '/dashboard/weather-alerts', icon: Cloud, label: t('navigation.weather') },
    { href: '/dashboard/pest-disease-detection', icon: Bug, label: t('navigation.advisory') },
    { href: '#', icon: User, label: t('navigation.profile') }, // Assuming profile is not a page yet
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent
                  navigationItems={navigationItems}
                  pathname={pathname}
                  setSidebarOpen={setSidebarOpen}
                />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-green-800">{t('app.title')}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <VoiceAssistant />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-64 bg-white border-r border-green-100 min-h-screen">
          <SidebarContent navigationItems={navigationItems} pathname={pathname} />
        </aside>

        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 z-40">
        <div className="flex justify-around items-center py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
                pathname === item.href ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function SidebarContent({
  navigationItems,
  pathname,
  setSidebarOpen,
}: {
  navigationItems: any[];
  pathname: string;
  setSidebarOpen?: (open: boolean) => void;
}) {
  return (
    <div className="p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen?.(false)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              pathname === item.href
                ? 'bg-green-100 text-green-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
