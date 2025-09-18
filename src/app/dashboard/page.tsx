'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MetricCard from '@/components/enhanced/MetricCard';
import QuickActions from '@/components/enhanced/QuickActions';
import ActivityFeed from '@/components/enhanced/ActivityFeed';
import TasksRecommendations from '@/components/enhanced/TasksRecommendations';

export default function DashboardPage() {
  const router = useRouter();

  const metricsData = [
    {
      title: "Soil Health",
      value: "7.2 pH",
      status: "good",
      icon: "TestTube" as const,
      color: "var(--color-primary)",
      trend: { direction: "up" as const, value: "+0.3" },
      actionLabel: "View Details",
      onClick: () => router.push('/dashboard/soil-health')
    },
    {
      title: "Pest Alerts",
      value: "3 Active",
      status: "warning",
      icon: "Bug" as const,
      color: "var(--color-warning)",
      trend: { direction: "up" as const, value: "+1" },
      actionLabel: "Check Alerts",
      onClick: () => router.push('/dashboard/pest-disease-detection')
    },
    {
      title: "Weather",
      value: "72°F",
      status: "excellent",
      icon: "Sun" as const,
      color: "var(--color-accent)",
      trend: { direction: "stable" as const, value: "0°F" },
      actionLabel: "View Forecast",
      onClick: () => router.push('/dashboard/weather-alerts')
    },
    {
      title: "Market Price",
      value: "$4.85",
      status: "good",
      icon: "TrendingUp" as const,
      color: "var(--color-success)",
      trend: { direction: "up" as const, value: "+5%" },
      actionLabel: "View Trends",
      onClick: () => router.push('/dashboard/market-prices')
    }
  ];

  return (
    <div className="min-h-screen">
      <main>
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Welcome back, John!</h1>
            <p className="font-body text-lg text-muted-foreground">
              {"Here's what's happening on your farm today - "}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                status={metric.status as any}
                icon={metric.icon}
                color={metric.color}
                trend={metric.trend}
                actionLabel={metric.actionLabel}
                onClick={metric.onClick}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            <div className="lg:col-span-1">
              <TasksRecommendations />
            </div>
          </div>

          {/* Farm Overview Stats */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h2 className="font-heading font-bold text-xl text-card-foreground mb-6">Farm Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-background rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="font-heading font-bold text-2xl text-primary">3</span>
                </div>
                <h3 className="font-body font-semibold text-sm text-card-foreground mb-1">Active Fields</h3>
                <p className="font-caption text-xs text-muted-foreground">125 acres total</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="font-heading font-bold text-2xl text-secondary">5</span>
                </div>
                <h3 className="font-body font-semibold text-sm text-card-foreground mb-1">Crop Types</h3>
                <p className="font-caption text-xs text-muted-foreground">Corn, Soy, Wheat</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="font-heading font-bold text-2xl text-success">92%</span>
                </div>
                <h3 className="font-body font-semibold text-sm text-card-foreground mb-1">Health Score</h3>
                <p className="font-caption text-xs text-muted-foreground">Above average</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}