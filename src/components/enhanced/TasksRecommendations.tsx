'use client';

import React, { useState } from 'react';
import { Droplets, Search, Settings, Calendar, TestTube, RotateCcw, CloudRain, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  category: string;
  icon: 'Droplets' | 'Search' | 'Settings' | 'Calendar';
  completed: boolean;
};

type Recommendation = {
  id: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  icon: 'TestTube' | 'RotateCcw' | 'CloudRain' | 'TrendingUp';
  actionRequired: boolean;
};

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-amber-600';
    case 'low':
      return 'text-emerald-600';
    default:
      return 'text-muted-foreground';
  }
};

const getImpactColor = (impact: Recommendation['impact']) => {
  switch (impact) {
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'medium':
      return 'text-amber-600 bg-amber-50';
    case 'low':
      return 'text-emerald-600 bg-emerald-50';
    default:
      return 'text-muted-foreground bg-muted/10';
  }
};

const formatDueDate = (date: Date) => {
  const now = new Date().getTime();
  const diff = date.getTime() - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days < 7) return `Due in ${days} days`;
  return date.toLocaleDateString();
};

export default function TasksRecommendations() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'recommendations'>('tasks');

  const upcomingTasks: Task[] = [
    {
      id: 1,
      title: 'Apply Nitrogen Fertilizer',
      description: 'Field A requires nitrogen application based on recent soil test',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'high',
      category: 'fertilization',
      icon: 'Droplets',
      completed: false,
    },
    {
      id: 2,
      title: 'Pest Inspection - Field B',
      description: 'Weekly inspection due for aphid monitoring',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'inspection',
      icon: 'Search',
      completed: false,
    },
    {
      id: 3,
      title: 'Irrigation System Check',
      description: 'Monthly maintenance of irrigation equipment',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'maintenance',
      icon: 'Settings',
      completed: false,
    },
    {
      id: 4,
      title: 'Harvest Planning - Corn',
      description: 'Prepare harvest schedule for corn crop in Field C',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      priority: 'low',
      category: 'harvest',
      icon: 'Calendar',
      completed: false,
    },
  ];

  const recommendations: Recommendation[] = [
    {
      id: 1,
      title: 'Soil pH Adjustment',
      description:
        'Field A soil pH is slightly acidic (6.2). Consider lime application to reach optimal 6.5-7.0 range.',
      impact: 'high',
      category: 'soil_health',
      icon: 'TestTube',
      actionRequired: true,
    },
    {
      id: 2,
      title: 'Crop Rotation Planning',
      description:
        'Consider rotating soybeans in Field B next season to improve nitrogen levels naturally.',
      impact: 'medium',
      category: 'planning',
      icon: 'RotateCcw',
      actionRequired: false,
    },
    {
      id: 3,
      title: 'Weather-Based Irrigation',
      description:
        'With upcoming rainfall, reduce irrigation by 30% this week to prevent overwatering.',
      impact: 'medium',
      category: 'irrigation',
      icon: 'CloudRain',
      actionRequired: true,
    },
    {
      id: 4,
      title: 'Market Timing Opportunity',
      description:
        'Corn prices are trending upward. Consider holding harvest for 2-3 weeks if storage permits.',
      impact: 'high',
      category: 'market',
      icon: 'TrendingUp',
      actionRequired: false,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-1 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 font-body font-medium text-sm rounded-t-md transition-colors duration-150 ${
            activeTab === 'tasks' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Upcoming Tasks ({upcomingTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 font-body font-medium text-sm rounded-t-md transition-colors duration-150 ${
            activeTab === 'recommendations'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Recommendations ({recommendations.length})
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-card rounded-lg flex items-center justify-center">
                  {task.icon === 'Droplets' && <Droplets className="h-5 w-5" />}
                  {task.icon === 'Search' && <Search className="h-5 w-5" />}
                  {task.icon === 'Settings' && <Settings className="h-5 w-5" />}
                  {task.icon === 'Calendar' && <Calendar className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-body font-semibold text-sm text-card-foreground">{task.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="font-caption text-sm text-muted-foreground mb-2 leading-relaxed">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-caption text-xs text-muted-foreground">{formatDueDate(task.dueDate)}</span>
                    <Button variant="outline" size="sm">
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-card rounded-lg flex items-center justify-center">
                  {rec.icon === 'TestTube' && <TestTube className="h-5 w-5" />}
                  {rec.icon === 'RotateCcw' && <RotateCcw className="h-5 w-5" />}
                  {rec.icon === 'CloudRain' && <CloudRain className="h-5 w-5" />}
                  {rec.icon === 'TrendingUp' && <TrendingUp className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-body font-semibold text-sm text-card-foreground">{rec.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(rec.impact)}`}>
                        {rec.impact} impact
                      </span>
                    </div>
                  </div>
                  <p className="font-caption text-sm text-muted-foreground mb-3 leading-relaxed">{rec.description}</p>
                  {rec.actionRequired && (
                    <Button variant="secondary" size="sm">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


