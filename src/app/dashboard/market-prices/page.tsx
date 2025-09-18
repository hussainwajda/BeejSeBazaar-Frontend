"use client";

import React, { useState } from 'react';
import MarketFilters from '@/components/enhanced/market/MarketFilters';
import PriceTable from '@/components/enhanced/market/PriceTable';
import PriceChart from '@/components/enhanced/market/PriceChart';
import { Button } from '@/components/ui/button';

export default function MarketPricesPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'alerts'>('overview');
  const [filters, setFilters] = useState({ commodity: 'all', region: 'all', timeRange: '30d', search: '', startDate: '', endDate: '' });

  const commodities = [
    { id: 'corn', name: 'Corn', unit: 'per bushel', currentPrice: 6.45, change: 2.3, volume: 125000, volatility: 8.2 },
    { id: 'wheat', name: 'Wheat', unit: 'per bushel', currentPrice: 8.12, change: -1.8, volume: 98000, volatility: 12.5 },
    { id: 'soybeans', name: 'Soybeans', unit: 'per bushel', currentPrice: 14.25, change: 0.5, volume: 87000, volatility: 9.8 },
  ];

  const chartData = [
    { date: '2025-01-01', price: 6.2, volume: 120000 },
    { date: '2025-01-02', price: 6.15, volume: 115000 },
    { date: '2025-01-03', price: 6.25, volume: 130000 },
    { date: '2025-01-04', price: 6.3, volume: 125000 },
    { date: '2025-01-05', price: 6.18, volume: 110000 },
    { date: '2025-01-06', price: 6.35, volume: 140000 },
  ];

  return (
    <div className="min-h-screen">
      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-bold text-3xl mb-2">Market Analysis</h1>
              <p className="text-muted-foreground">Commodity pricing, trends, and market insights</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Export Report</Button>
              <Button>Refresh Data</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4"><span>Total Market Value</span><span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded">+12.5%</span></div>
              <div className="text-2xl font-semibold">$2.4M</div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4"><span>Trading Volume</span><span className="text-primary text-xs bg-primary/10 px-2 py-1 rounded">Active</span></div>
              <div className="text-2xl font-semibold">543K</div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4"><span>Price Alerts</span><span className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">3 Active</span></div>
              <div className="text-2xl font-semibold">8</div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4"><span>Commodities Tracked</span><span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Updated</span></div>
              <div className="text-2xl font-semibold">6</div>
            </div>
          </div>

          <div className="mb-8">
            <MarketFilters filters={filters} onFiltersChange={setFilters} onReset={() => setFilters({ commodity: 'all', region: 'all', timeRange: '30d', search: '', startDate: '', endDate: '' })} />
          </div>

          <div className="border-b mb-8">
            <nav className="flex gap-8">
              {[
                { id: 'overview', label: 'Market Overview' },
                { id: 'comparison', label: 'Compare' },
                { id: 'alerts', label: 'Alerts' },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-4 px-1 border-b-2 text-sm ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PriceTable commodities={commodities as any} onCommoditySelect={setSelectedCommodity} />
                <PriceChart selectedCommodity={selectedCommodity} chartData={chartData} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
