"use client";

import React, { useEffect, useState } from 'react';
import CurrentWeatherCard from '@/components/enhanced/weather/CurrentWeatherCard';
import ForecastPanel from '@/components/enhanced/weather/ForecastPanel';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

type Units = 'metric' | 'imperial';

export default function WeatherAlertsPage() {
  const [units, setUnits] = useState<Units>('metric');
  const [currentWeather, setCurrentWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<{ daily: any[] }>({ daily: [] });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUnits = localStorage.getItem('weatherUnits') as Units | null;
    if (savedUnits) setUnits(savedUnits);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => setError('Location access denied')
      );
    } else {
      setError('Geolocation not supported');
    }
  }, []);

  useEffect(() => {
    if (!location) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<any>(API_ENDPOINTS.weather(location.latitude, location.longitude));
        // Expecting OpenWeather schema; adapt as needed
        setCurrentWeather({
          location: data?.name,
          temperature: data?.main?.temp,
          condition: data?.weather?.[0]?.description,
          humidity: data?.main?.humidity,
          windSpeed: data?.wind?.speed,
          pressure: data?.main?.pressure,
        });
        // Fallback mock for forecast for now
        setForecast({
          daily: [
            { date: new Date().toISOString(), condition: 'sunny', high: 28, low: 16, precipitationChance: 10 },
            { date: new Date(Date.now() + 86400000).toISOString(), condition: 'partly-cloudy', high: 26, low: 14, precipitationChance: 20 },
            { date: new Date(Date.now() + 2*86400000).toISOString(), condition: 'rainy', high: 22, low: 12, precipitationChance: 80 },
          ],
        });
        setError(null);
      } catch (e) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [location]);

  useEffect(() => {
    localStorage.setItem('weatherUnits', units);
  }, [units]);

  return (
    <div className="min-h-screen">
      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">Weather Monitoring</h1>
              <p className="text-muted-foreground">Real-time weather data, forecasts, and agricultural alerts</p>
            </div>
            <div className="flex items-center gap-2 mt-4 lg:mt-0">
              <Button variant={units === 'metric' ? 'default' : 'outline'} size="sm" onClick={() => setUnits('metric')}>Metric</Button>
              <Button variant={units === 'imperial' ? 'default' : 'outline'} size="sm" onClick={() => setUnits('imperial')}>Imperial</Button>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          {loading || !currentWeather ? (
            <div className="p-6 border rounded-lg animate-pulse h-40" />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <CurrentWeatherCard currentWeather={currentWeather} units={units} />
              </div>
              <div className="space-y-8">
                <ForecastPanel forecast={forecast} units={units} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
