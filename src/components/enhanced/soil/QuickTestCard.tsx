'use client';

import React from 'react';
import { FlaskConical, Microscope, Zap, Clock, Check, Plus, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QuickTest = {
  id: 'basic' | 'comprehensive' | 'quick';
  title: string;
  description: string;
  duration: string;
  icon: 'FlaskConical' | 'Microscope' | 'Zap';
  color: string;
  parameters: string[];
};

export default function QuickTestCard({ onQuickTest }: { onQuickTest?: (test: QuickTest) => void }) {
  const quickTests: QuickTest[] = [
    { id: 'basic', title: 'Basic Soil Test', description: 'pH, NPK levels, and organic matter', duration: '5 minutes', icon: 'FlaskConical', color: 'bg-primary/10 text-primary', parameters: ['pH Level', 'Nitrogen', 'Phosphorus', 'Potassium', 'Organic Matter'] },
    { id: 'comprehensive', title: 'Comprehensive Analysis', description: 'Complete soil health assessment', duration: '10 minutes', icon: 'Microscope', color: 'bg-secondary/10 text-secondary', parameters: ['All Basic Parameters', 'Moisture Content', 'Temperature', 'Salinity', 'Micronutrients'] },
    { id: 'quick', title: 'Quick Check', description: 'Essential parameters only', duration: '2 minutes', icon: 'Zap', color: 'bg-warning/10 text-warning', parameters: ['pH Level', 'Nitrogen', 'Moisture'] },
  ];

  const IconFor = {
    FlaskConical: <FlaskConical className="h-5 w-5" />,
    Microscope: <Microscope className="h-5 w-5" />,
    Zap: <Zap className="h-5 w-5" />,
  } as const;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Quick Test Options</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose a pre-configured test template to get started quickly</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickTests.map((test) => (
          <div key={test.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group" onClick={() => onQuickTest?.(test)}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${test.color}`}>{IconFor[test.icon]}</div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">{test.duration}</span>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{test.title}</h3>
              <p className="text-sm text-muted-foreground">{test.description}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Includes:</p>
              <div className="space-y-1">
                {test.parameters.slice(0, 3).map((p) => (
                  <div key={p} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs">{p}</span>
                  </div>
                ))}
                {test.parameters.length > 3 && (
                  <div className="flex items-center gap-2">
                    <Plus className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">+{test.parameters.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
              Start Test
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">New to soil testing?</p>
            <p className="text-xs text-muted-foreground">Start with the Quick Check to get familiar with the process, then move to more comprehensive tests as you gain experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


