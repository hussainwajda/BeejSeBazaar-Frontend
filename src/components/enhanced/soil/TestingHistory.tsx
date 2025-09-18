'use client';

import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Circle, AlertCircle, Target, Lightbulb, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TestItem = {
  id: number;
  date: string;
  location: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement';
  recommendations: number;
};

export default function TestingHistory({ onSelectTest }: { onSelectTest?: (item: TestItem) => void }) {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '3months' | '6months' | '12months'>('all');

  const history: TestItem[] = [
    { id: 1, date: '2024-09-10', location: 'Field A - North Section', ph: 6.8, nitrogen: 35, phosphorus: 45, potassium: 220, organicMatter: 4.2, moisture: 28, score: 85, status: 'excellent', recommendations: 3 },
    { id: 2, date: '2024-08-15', location: 'Field A - South Section', ph: 6.2, nitrogen: 28, phosphorus: 38, potassium: 180, organicMatter: 3.8, moisture: 32, score: 72, status: 'good', recommendations: 5 },
    { id: 3, date: '2024-07-20', location: 'Field B - East Section', ph: 7.2, nitrogen: 42, phosphorus: 52, potassium: 250, organicMatter: 5.1, moisture: 30, score: 92, status: 'excellent', recommendations: 2 },
    { id: 4, date: '2024-06-25', location: 'Field B - West Section', ph: 5.8, nitrogen: 22, phosphorus: 30, potassium: 150, organicMatter: 2.9, moisture: 25, score: 58, status: 'needs-improvement', recommendations: 8 },
    { id: 5, date: '2024-05-30', location: 'Field C - Central Section', ph: 6.5, nitrogen: 31, phosphorus: 41, potassium: 195, organicMatter: 3.5, moisture: 29, score: 78, status: 'good', recommendations: 4 },
  ];

  const filtered = useMemo(() => {
    if (selectedPeriod === 'all') return history;
    const now = new Date();
    const months = selectedPeriod === '3months' ? 3 : selectedPeriod === '6months' ? 6 : 12;
    const cutoff = new Date(now.setMonth(now.getMonth() - months));
    return history.filter((t) => new Date(t.date) >= cutoff);
  }, [selectedPeriod]);

  const statusColor = (status: TestItem['status']) =>
    status === 'excellent' ? 'text-emerald-600 bg-emerald-50' : status === 'good' ? 'text-primary bg-primary/10' : 'text-amber-600 bg-amber-50';

  const renderTrend = (current: number, prev: number | undefined) => {
    if (prev == null) return null;
    if (current > prev) return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (current < prev) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const statusIcon = (status: TestItem['status']) =>
    status === 'excellent' ? <CheckCircle className="h-3.5 w-3.5" /> : status === 'good' ? <Circle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold">Testing History</h2>
          <p className="text-sm text-muted-foreground">Track your soil health progress over time</p>
        </div>
        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as any)} className="px-3 py-2 text-sm border border-border rounded-md bg-input">
          <option value="all">All Time</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="12months">Last Year</option>
        </select>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filtered.map((test, index) => (
          <div key={test.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onSelectTest?.(test)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{test.location}</h3>
                <p className="text-sm text-muted-foreground">{new Date(test.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-2">
                {renderTrend(test.score, filtered[index + 1]?.score)}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(test.status)}`}>
                  <div className="flex items-center gap-1">
                    {statusIcon(test.status)}
                    <span className="capitalize">{test.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">pH Level</p>
                <p className="text-sm font-semibold">{test.ph}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Nitrogen</p>
                <p className="text-sm font-semibold">{test.nitrogen} ppm</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Phosphorus</p>
                <p className="text-sm font-semibold">{test.phosphorus} ppm</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Potassium</p>
                <p className="text-sm font-semibold">{test.potassium} ppm</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm">Score: {test.score}/100</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">{test.recommendations} recommendations</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Test History</h3>
          <p className="text-sm text-muted-foreground">Complete your first soil test to start tracking your progress</p>
        </div>
      )}
    </div>
  );
}


