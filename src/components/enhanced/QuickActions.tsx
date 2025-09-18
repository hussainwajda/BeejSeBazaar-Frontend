'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TestTube, Camera, CloudRain, BarChart3 } from 'lucide-react';

type Action = {
  id: number;
  title: string;
  description: string;
  icon: 'TestTube' | 'Camera' | 'CloudRain' | 'BarChart3';
  path: string;
  variant?: 'default' | 'secondary' | 'outline' | 'success';
};

const IconFor: Record<Action['icon'], React.ReactNode> = {
  TestTube: <TestTube className="h-6 w-6" />,
  Camera: <Camera className="h-6 w-6" />,
  CloudRain: <CloudRain className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
};

export default function QuickActions() {
  const router = useRouter();

  const actions: Action[] = [
    {
      id: 1,
      title: 'Test Soil Health',
      description: 'Analyze soil parameters and get recommendations',
      icon: 'TestTube',
      path: '/dashboard/soil-health',
      variant: 'default',
    },
    {
      id: 2,
      title: 'Detect Pest/Disease',
      description: 'Upload images for AI-powered identification',
      icon: 'Camera',
      path: '/dashboard/pest-disease-detection',
      variant: 'secondary',
    },
    {
      id: 3,
      title: 'Weather Alerts',
      description: 'Set up notifications for weather changes',
      icon: 'CloudRain',
      path: '/dashboard/weather-alerts',
      variant: 'outline',
    },
    {
      id: 4,
      title: 'Market Analysis',
      description: 'View current prices and market trends',
      icon: 'BarChart3',
      path: '/dashboard/market-prices',
      variant: 'success',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-heading font-bold text-xl text-card-foreground mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <div key={action.id} className="group">
            <Button
              variant={action.variant as any}
              onClick={() => router.push(action.path)}
              className="w-full h-auto p-4 flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-200"
            >
              <div className="text-center flex flex-col items-center gap-2">
                {IconFor[action.icon]}
                <h3 className="font-body font-semibold text-sm">{action.title}</h3>
                <p className="font-caption text-xs opacity-80 leading-tight">{action.description}</p>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}


