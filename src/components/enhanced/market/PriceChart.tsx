'use client';

import React from 'react';

type DataPoint = { date: string; price: number; volume: number };

export default function PriceChart({ selectedCommodity, chartData }: { selectedCommodity: any; chartData: DataPoint[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="mb-2 font-medium">{selectedCommodity ? `${selectedCommodity.name} Price` : 'Price Trend'}</div>
      <div className="text-sm text-muted-foreground">{chartData.length} data points</div>
      <div className="h-48 mt-4 flex items-end gap-1">
        {chartData.map((d) => (
          <div key={d.date} className="bg-primary/60" style={{ height: `${Math.max(8, (d.price / Math.max(...chartData.map(x => x.price))) * 100)}%`, width: '10px' }} />
        ))}
      </div>
    </div>
  );
}


