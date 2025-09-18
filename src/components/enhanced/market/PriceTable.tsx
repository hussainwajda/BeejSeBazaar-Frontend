'use client';

import React from 'react';

type Commodity = { id: string; name: string; unit: string; currentPrice: number; change: number; volume: number; volatility: number };

export default function PriceTable({ commodities, onCommoditySelect }: { commodities: Commodity[]; onCommoditySelect: (c: Commodity) => void }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-2">Commodity</th>
            <th>Price</th>
            <th>Change</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {commodities.map((c) => (
            <tr key={c.id} className="border-t hover:bg-muted/40 cursor-pointer" onClick={() => onCommoditySelect(c)}>
              <td className="py-2 font-medium">{c.name}</td>
              <td>${c.currentPrice.toFixed(2)} {c.unit}</td>
              <td className={c.change >= 0 ? 'text-emerald-600' : 'text-red-600'}>{c.change >= 0 ? '+' : ''}{c.change}%</td>
              <td>{c.volume.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


