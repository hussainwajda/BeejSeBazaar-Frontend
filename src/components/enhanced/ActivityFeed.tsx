'use client';

import React from 'react';
import { TestTube, Bug, CloudRain, TrendingUp, Droplets, Database } from 'lucide-react';

type Activity = {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  icon: 'TestTube' | 'Bug' | 'CloudRain' | 'TrendingUp' | 'Droplets' | 'Database';
};

const IconFor: Record<Activity['icon'], React.ReactNode> = {
  TestTube: <TestTube className="h-5 w-5" />,
  Bug: <Bug className="h-5 w-5" />,
  CloudRain: <CloudRain className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />,
};

const getPriorityColor = (priority: Activity['priority']) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500 bg-red-50';
    case 'medium':
      return 'border-l-amber-500 bg-amber-50';
    case 'low':
      return 'border-l-emerald-500 bg-emerald-50';
    default:
      return 'border-l-muted bg-muted/5';
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date().getTime();
  const diffMs = now - timestamp.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export default function ActivityFeed() {
  const activities: Activity[] = [
    {
      id: 1,
      type: 'soil_test',
      title: 'Soil Test Completed - Field A',
      description: 'pH level: 6.8, Nitrogen: High, Phosphorus: Medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'medium',
      icon: 'TestTube',
    },
    {
      id: 2,
      type: 'pest_alert',
      title: 'Pest Alert - Aphids Detected',
      description: 'Field B showing signs of aphid infestation. Immediate action recommended.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'high',
      icon: 'Bug',
    },
    {
      id: 3,
      type: 'weather',
      title: 'Weather Warning Issued',
      description: 'Heavy rainfall expected tomorrow. Consider protective measures for crops.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'high',
      icon: 'CloudRain',
    },
    {
      id: 4,
      type: 'market',
      title: 'Price Update - Corn',
      description: 'Corn prices increased by 5% this week. Current rate: $4.85/bushel',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      priority: 'low',
      icon: 'TrendingUp',
    },
    {
      id: 5,
      type: 'recommendation',
      title: 'Fertilizer Application Due',
      description: 'Based on soil analysis, nitrogen fertilizer application recommended for Field C.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      priority: 'medium',
      icon: 'Droplets',
    },
    {
      id: 6,
      type: 'system',
      title: 'Data Backup Completed',
      description: 'All farm data has been successfully backed up to cloud storage.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      priority: 'low',
      icon: 'Database',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-card-foreground">Recent Activity</h2>
        <button className="font-body text-sm text-primary hover:text-primary/80 transition-colors duration-150">
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`border-l-4 pl-4 py-3 rounded-r-md transition-all duration-200 hover:shadow-sm ${getPriorityColor(activity.priority)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-background rounded-lg flex items-center justify-center mt-1">
                {IconFor[activity.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-sm text-card-foreground mb-1">
                      {activity.title}
                    </h3>
                    <p className="font-caption text-sm text-muted-foreground leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="font-caption text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


