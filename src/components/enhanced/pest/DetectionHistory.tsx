'use client';

import React from 'react';

export default function DetectionHistory() {
  const items = [
    { id: 1, title: 'Aphid Infestation', when: '2 hours ago', field: 'Field A' },
    { id: 2, title: 'Leaf Miner Damage', when: '1 day ago', field: 'Field B' },
    { id: 3, title: 'Weekly scan completed', when: '3 days ago', field: 'All fields' },
  ];
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-lg mb-4">Detection History</h3>
      <div className="space-y-3 text-sm">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between p-2 rounded">
            <div className="flex-1">
              <div className="font-medium">{it.title}</div>
              <div className="text-muted-foreground text-xs">{it.field} - {it.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


