'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, Bug, Sun, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type Trend = { direction: 'up' | 'down' | 'stable'; value: string };

export type MetricCardProps = {
  title: string;
  value: string | number;
  status: 'excellent' | 'good' | 'warning' | 'moderate' | 'critical' | 'poor';
  icon: 'TestTube' | 'Bug' | 'Sun' | 'TrendingUp';
  color?: string;
  trend?: Trend;
  actionLabel?: string;
  onClick?: () => void;
};

const getStatusColor = (status: MetricCardProps['status']) => {
  switch (status) {
    case 'excellent':
    case 'good':
      return 'text-emerald-600';
    case 'warning':
    case 'moderate':
      return 'text-amber-600';
    case 'critical':
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
};

const getStatusBg = (status: MetricCardProps['status']) => {
  switch (status) {
    case 'excellent':
    case 'good':
      return 'bg-emerald-50';
    case 'warning':
    case 'moderate':
      return 'bg-amber-50';
    case 'critical':
    case 'poor':
      return 'bg-red-50';
    default:
      return 'bg-muted';
  }
};

const renderIcon = (icon: MetricCardProps['icon']) => {
  switch (icon) {
    case 'TestTube':
      return <TestTube className="h-5 w-5" />;
    case 'Bug':
      return <Bug className="h-5 w-5" />;
    case 'Sun':
      return <Sun className="h-5 w-5" />;
    case 'TrendingUp':
      return <TrendingUp className="h-5 w-5" />;
    default:
      return <Minus className="h-5 w-5" />;
  }
};

export default function MetricCard(props: MetricCardProps) {
  const { title, value, status, icon, trend, actionLabel, onClick } = props;
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="flex items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBg(status)}`}>
            {renderIcon(icon)}
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <span className={`text-xs capitalize ${getStatusColor(status)}`}>{status}</span>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${
            trend.direction === 'up' ? 'text-emerald-600' : trend.direction === 'down' ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {trend.direction === 'up' && <TrendingUp className="h-4 w-4" />}
            {trend.direction === 'down' && <TrendingDown className="h-4 w-4" />}
            {trend.direction === 'stable' && <Minus className="h-4 w-4" />}
            <span>{trend.value}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-3 text-2xl font-bold">{value}</div>
        {actionLabel && (
          <Button variant="outline" className="w-full" onClick={onClick}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}


