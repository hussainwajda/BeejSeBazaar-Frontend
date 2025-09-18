'use client';

import React from 'react';

export default function MarketFilters({ filters, onFiltersChange, onReset }: { filters: any; onFiltersChange: (f: any) => void; onReset: () => void }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input className="px-3 py-2 border rounded" placeholder="Search commodity" value={filters.search} onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })} />
        <select className="px-3 py-2 border rounded" value={filters.commodity} onChange={(e) => onFiltersChange({ ...filters, commodity: e.target.value })}>
          <option value="all">All Commodities</option>
          <option value="corn">Corn</option>
          <option value="wheat">Wheat</option>
          <option value="soybeans">Soybeans</option>
        </select>
        <select className="px-3 py-2 border rounded" value={filters.region} onChange={(e) => onFiltersChange({ ...filters, region: e.target.value })}>
          <option value="all">All Regions</option>
          <option value="north">North</option>
          <option value="south">South</option>
        </select>
        <button className="px-3 py-2 border rounded" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}


