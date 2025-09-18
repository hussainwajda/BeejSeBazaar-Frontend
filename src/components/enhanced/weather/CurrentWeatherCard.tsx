'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from 'lucide-react';

export default function CurrentWeatherCard({ currentWeather, units }: { currentWeather: any; units: 'metric' | 'imperial' }) {
  const getIcon = (condition: string) => {
    const lower = (condition || '').toLowerCase();
    if (lower.includes('sun') || lower.includes('clear')) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (lower.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-500" />;
    if (lower.includes('snow')) return <CloudSnow className="h-8 w-8 text-blue-300" />;
    return <Cloud className="h-8 w-8 text-gray-500" />;
  };

  const unitTemp = units === 'metric' ? '°C' : '°F';
  const unitWind = units === 'metric' ? 'km/h' : 'mph';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon(currentWeather?.condition || '')}
          Current Weather {currentWeather?.location ? `- ${currentWeather.location}` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <Thermometer className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="font-semibold">{currentWeather?.temperature}{unitTemp}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg">
            <Droplets className="h-8 w-8 text-cyan-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-semibold">{currentWeather?.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <Wind className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="font-semibold">{currentWeather?.windSpeed} {unitWind}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <div className="h-8 w-8" />
            <div>
              <p className="text-sm text-muted-foreground">Pressure</p>
              <p className="font-semibold">{currentWeather?.pressure} hPa</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


