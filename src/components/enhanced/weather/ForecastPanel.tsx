'use client';

import React from 'react';
import { Sun, Cloud, CloudRain, Cloudy, Zap } from 'lucide-react';

type Day = { date: string; condition: string; high: number; low: number; precipitationChance: number; growingDegreeDays?: number };

export default function ForecastPanel({ forecast, units }: { forecast: { daily: Day[] }; units: 'metric' | 'imperial' }) {
  const iconFor = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('storm')) return <Zap className="h-5 w-5" />;
    if (c.includes('rain')) return <CloudRain className="h-5 w-5" />;
    if (c.includes('cloud')) return <Cloud className="h-5 w-5" />;
    return <Sun className="h-5 w-5" />;
  };

  const unitTemp = units === 'metric' ? '°C' : '°F';

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-heading font-semibold mb-4">7-day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecast.daily.map((d) => (
          <div key={d.date} className="border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              <div className="text-sm text-muted-foreground capitalize">{d.condition.replace('-', ' ')}</div>
              <div className="text-xs text-muted-foreground">Rain: {d.precipitationChance}%</div>
            </div>
            <div className="flex items-center gap-3">
              {iconFor(d.condition)}
              <div className="text-right">
                <div className="text-sm font-semibold">{d.high}{unitTemp}</div>
                <div className="text-xs text-muted-foreground">{d.low}{unitTemp}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


