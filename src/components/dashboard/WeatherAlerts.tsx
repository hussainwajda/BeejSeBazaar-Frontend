'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer,
  AlertTriangle,
  Calendar,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

interface Location {
  latitude: number;
  longitude: number;
}

export default function WeatherAlerts() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    handleLocation();
  }, []);

  useEffect(() => {
    if (location) {
      const fetchWeatherData = async () => {
        setLoading(true);
        try {
          const data = await apiClient.get<any>(
            API_ENDPOINTS.weather(location.latitude, location.longitude)
          );
          console.log(data);
          setWeatherData(data);
          setError(null);
        } catch (error) {
          setError('Failed to fetch weather data. Please try again later.');
          console.error('Failed to fetch weather data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchWeatherData();
    }
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    }
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    }
    if (lowerCaseCondition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    }
    if (lowerCaseCondition.includes('snow')) {
      return <CloudSnow className="h-8 w-8 text-blue-300" />;
    }
    return <Cloud className="h-8 w-8 text-gray-500" />;
  };

  if (locationError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Location Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{locationError}</p>
          <Button onClick={handleLocation} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!location && !locationError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Accessing Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please allow location access to see the weather forecast.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {t('weather.current_weather')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No weather data available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              {t('weather.current_weather')} in {weatherData.name}
            </div>
            <Button variant="ghost" size="icon" onClick={() => location && handleLocation()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              {getWeatherIcon(weatherData.weather[0].description)}
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="font-semibold">{weatherData.weather[0].description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('weather.temperature')}</p>
                <p className="font-semibold">{weatherData.main.temp.toFixed(1)}°C</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg">
              <Droplets className="h-8 w-8 text-cyan-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('weather.humidity')}</p>
                <p className="font-semibold">{weatherData.main.humidity.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <Wind className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('weather.wind_speed')}</p>
                <p className="font-semibold">{weatherData.wind.speed.toFixed(1)} km/h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
