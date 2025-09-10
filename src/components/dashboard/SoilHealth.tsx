'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Droplets, 
  Thermometer, 
  FlaskConical, 
  Leaf,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { sensorService, SensorData, SENSOR_THRESHOLDS } from '@/services/sensorService';
import { useLanguage } from '@/hooks/useLanguage';

export default function SoilHealth() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const data = await sensorService.getLatestSensor();
        setSensorData(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();

    // Subscribe to real-time updates
    const unsubscribe = sensorService.subscribeSensor((data: SensorData) => {
      setSensorData(data);
      setLastUpdated(new Date());
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (value: number, type: keyof typeof SENSOR_THRESHOLDS) => {
    const thresholds = SENSOR_THRESHOLDS[type];
    if (value >= thresholds.good.min && value <= thresholds.good.max) {
      return 'text-green-600 bg-green-100 border-green-200';
    } else if (value >= thresholds.warning.min && value <= thresholds.warning.max) {
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    } else {
      return 'text-red-600 bg-red-100 border-red-200';
    }
  };

  const getStatusText = (value: number, type: keyof typeof SENSOR_THRESHOLDS) => {
    const thresholds = SENSOR_THRESHOLDS[type];
    if (value >= thresholds.good.min && value <= thresholds.good.max) {
      return t('soil_health.good');
    } else if (value >= thresholds.warning.min && value <= thresholds.warning.max) {
      return t('soil_health.warning');
    } else {
      return t('soil_health.critical');
    }
  };

  const getStatusIcon = (value: number, type: keyof typeof SENSOR_THRESHOLDS) => {
    const thresholds = SENSOR_THRESHOLDS[type];
    if (value >= thresholds.good.min && value <= thresholds.good.max) {
      return <TrendingUp className="h-4 w-4" />;
    } else if (value >= thresholds.warning.min && value <= thresholds.warning.max) {
      return <Minus className="h-4 w-4" />;
    } else {
      return <TrendingDown className="h-4 w-4" />;
    }
  };

  const getRecommendations = (data: SensorData) => {
    const recommendations = [];

    if (data.moisture < SENSOR_THRESHOLDS.moisture.good.min) {
      recommendations.push(t('soil_health.irrigation_needed'));
    }
    if (data.ph < SENSOR_THRESHOLDS.ph.good.min) {
      recommendations.push(t('soil_health.add_lime'));
    }
    if (data.temperature < SENSOR_THRESHOLDS.temperature.good.min || data.temperature > SENSOR_THRESHOLDS.temperature.good.max) {
      recommendations.push(t('soil_health.optimal_temperature'));
    }
    if (data.nitrogen !== undefined && data.nitrogen < 30) {
      recommendations.push(t('soil_health.add_nitrogen'));
    }
    if (data.phosphorus !== undefined && data.phosphorus < 30) {
      recommendations.push(t('soil_health.add_phosphorus'));
    }
    if (data.potassium !== undefined && data.potassium < 30) {
      recommendations.push(t('soil_health.add_potassium'));
    }

    return recommendations;
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await sensorService.getLatestSensor();
      setSensorData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh sensor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            {t('soil_health.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sensorData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {t('common.error')} loading soil health data
          </div>
        </CardContent>
      </Card>
    );
  }

  const recommendations = getRecommendations(sensorData);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            {t('soil_health.title')}
          </div>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sensor Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Moisture */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">{t('soil_health.moisture')}</span>
                </div>
                <Badge className={getStatusColor(sensorData.moisture, 'moisture')}>
                  {getStatusIcon(sensorData.moisture, 'moisture')}
                  <span className="ml-1">{getStatusText(sensorData.moisture, 'moisture')}</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-2">
                {sensorData.moisture.toFixed(1)}%
              </div>
              <Progress value={sensorData.moisture} className="h-2" />
              <div className="text-xs text-blue-700 mt-2">
                Optimal: {SENSOR_THRESHOLDS.moisture.good.min}% - {SENSOR_THRESHOLDS.moisture.good.max}%
              </div>
            </div>

            {/* pH Level */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">{t('soil_health.ph')}</span>
                </div>
                <Badge className={getStatusColor(sensorData.ph, 'ph')}>
                  {getStatusIcon(sensorData.ph, 'ph')}
                  <span className="ml-1">{getStatusText(sensorData.ph, 'ph')}</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-900 mb-2">
                {sensorData.ph.toFixed(1)}
              </div>
              <Progress value={(sensorData.ph / 14) * 100} className="h-2" />
              <div className="text-xs text-green-700 mt-2">
                Optimal: {SENSOR_THRESHOLDS.ph.good.min} - {SENSOR_THRESHOLDS.ph.good.max}
              </div>
            </div>

            {/* Temperature */}
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">{t('soil_health.temperature')}</span>
                </div>
                <Badge className={getStatusColor(sensorData.temperature, 'temperature')}>
                  {getStatusIcon(sensorData.temperature, 'temperature')}
                  <span className="ml-1">{getStatusText(sensorData.temperature, 'temperature')}</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold text-orange-900 mb-2">
                {sensorData.temperature.toFixed(1)}°C
              </div>
              <Progress value={(sensorData.temperature / 50) * 100} className="h-2" />
              <div className="text-xs text-orange-700 mt-2">
                Optimal: {SENSOR_THRESHOLDS.temperature.good.min}°C - {SENSOR_THRESHOLDS.temperature.good.max}°C
              </div>
            </div>
          </div>

          {/* NPK Values (if available) */}
          {(sensorData.nitrogen !== undefined || sensorData.phosphorus !== undefined || sensorData.potassium !== undefined) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sensorData.nitrogen !== undefined && (
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-semibold text-purple-800">{t('soil_health.nitrogen')}</span>
                  </div>
                  <div className="text-xl font-bold text-purple-900">
                    {sensorData.nitrogen.toFixed(1)} mg/kg
                  </div>
                </div>
              )}
              
              {sensorData.phosphorus !== undefined && (
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-semibold text-yellow-800">{t('soil_health.phosphorus')}</span>
                  </div>
                  <div className="text-xl font-bold text-yellow-900">
                    {sensorData.phosphorus.toFixed(1)} mg/kg
                  </div>
                </div>
              )}
              
              {sensorData.potassium !== undefined && (
                <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="font-semibold text-pink-800">{t('soil_health.potassium')}</span>
                  </div>
                  <div className="text-xl font-bold text-pink-900">
                    {sensorData.potassium.toFixed(1)} mg/kg
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                {t('soil_health.recommendations')}
              </h4>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {t('soil_health.last_updated')}: {lastUpdated.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}