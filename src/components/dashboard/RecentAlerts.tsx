'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Cloud, 
  Leaf, 
  Bug, 
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';
import { sensorService } from '@/services/sensorService';
import { useLanguage } from '@/hooks/useLanguage';

export default function RecentAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsData = await sensorService.getAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <Cloud className="h-5 w-5" />;
      case 'soil':
        return <Leaf className="h-5 w-5" />;
      case 'pest':
        return <Bug className="h-5 w-5" />;
      case 'market':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string, severity: string) => {
    const severityColors = {
      high: 'border-red-200 bg-red-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-blue-200 bg-blue-50'
    };

    const typeColors = {
      weather: 'text-blue-600',
      soil: 'text-green-600',
      pest: 'text-orange-600',
      market: 'text-purple-600'
    };

    return {
      border: severityColors[severity as keyof typeof severityColors] || severityColors.low,
      icon: typeColors[type as keyof typeof typeColors] || 'text-gray-600'
    };
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: 'bg-red-600 text-white',
      medium: 'bg-yellow-600 text-white',
      low: 'bg-blue-600 text-white'
    };

    return (
      <Badge className={variants[severity as keyof typeof variants] || variants.low}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const refreshAlerts = async () => {
    setLoading(true);
    try {
      const alertsData = await sensorService.getAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to refresh alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('alerts.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('alerts.title')}
            {alerts.length > 0 && (
              <Badge className="ml-2">{alerts.length}</Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={refreshAlerts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">{t('alerts.no_alerts')}</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const colors = getAlertColor(alert.type, alert.severity);
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${colors.border} relative group`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colors.icon} bg-white`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(alert.timestamp)}
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          {t(`alerts.${alert.type}_alert`)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Alert Summary */}
          {alerts.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Alert Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.severity === 'high').length}
                  </div>
                  <div className="text-xs text-gray-600">High Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {alerts.filter(a => a.severity === 'medium').length}
                  </div>
                  <div className="text-xs text-gray-600">Medium Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {alerts.filter(a => a.severity === 'low').length}
                  </div>
                  <div className="text-xs text-gray-600">Low Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {alerts.length}
                  </div>
                  <div className="text-xs text-gray-600">Total Alerts</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}