'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign,
  RefreshCw,
  Clock,
  BarChart3,
  Wheat,
  Candy,
  Carrot
} from 'lucide-react';
import { sensorService } from '@/services/sensorService';
import { useLanguage } from '@/hooks/useLanguage';

const CROP_ICONS = {
  'Wheat': Wheat,
  'Rice': BarChart3,
  'Corn': BarChart3,
  'Cotton': BarChart3,
  'Sugarcane': Candy,
  'Tomatoes': Carrot,
  'Vegetables': Carrot,
};

export default function MarketPrices() {
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { t } = useLanguage();

  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        const prices = await sensorService.getMarketPrices();
        setMarketPrices(prices);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch market prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketPrices();
  }, []);

  const refreshPrices = async () => {
    setLoading(true);
    try {
      const prices = await sensorService.getMarketPrices();
      setMarketPrices(prices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh market prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up':
        return t('market.up');
      case 'down':
        return t('market.down');
      default:
        return t('market.stable');
    }
  };

  const getCropIcon = (crop: string) => {
    const Icon = CROP_ICONS[crop as keyof typeof CROP_ICONS] || BarChart3;
    return <Icon className="h-5 w-5" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('market.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
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
            <BarChart3 className="h-5 w-5" />
            {t('market.title')}
          </div>
          <Button variant="outline" size="sm" onClick={refreshPrices}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Market Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Highest</span>
              </div>
              <p className="text-lg font-bold text-green-900 mt-1">
                {marketPrices.length > 0 ? formatPrice(Math.max(...marketPrices.map(p => p.price))) : '₹0'}
              </p>
              <p className="text-xs text-green-700">
                {marketPrices.find(p => p.price === Math.max(...marketPrices.map(p => p.price)))?.crop || 'N/A'}
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Average</span>
              </div>
              <p className="text-lg font-bold text-blue-900 mt-1">
                {marketPrices.length > 0 ? formatPrice(marketPrices.reduce((sum, p) => sum + p.price, 0) / marketPrices.length) : '₹0'}
              </p>
              <p className="text-xs text-blue-700">All crops</p>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-800">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Lowest</span>
              </div>
              <p className="text-lg font-bold text-orange-900 mt-1">
                {marketPrices.length > 0 ? formatPrice(Math.min(...marketPrices.map(p => p.price))) : '₹0'}
              </p>
              <p className="text-xs text-orange-700">
                {marketPrices.find(p => p.price === Math.min(...marketPrices.map(p => p.price)))?.crop || 'N/A'}
              </p>
            </div>
          </div>

          {/* Price List */}
          <div className="space-y-3">
            {marketPrices.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getCropIcon(item.crop)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.crop}</h4>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-1">
                      {item.change > 0 && (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      )}
                      {item.change < 0 && (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Badge className={getTrendColor(item.trend)}>
                    {getTrendIcon(item.trend)}
                    <span className="ml-1">{getTrendText(item.trend)}</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Market Insights */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Market Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-purple-700 mb-1">Price Trends</h5>
                <p className="text-purple-600">
                  {marketPrices.filter(p => p.trend === 'up').length} crops increasing, 
                  {marketPrices.filter(p => p.trend === 'down').length} decreasing
                </p>
              </div>
              <div>
                <h5 className="font-medium text-purple-700 mb-1">Best Performer</h5>
                <p className="text-purple-600">
                  {marketPrices.length > 0 
                    ? marketPrices.reduce((best, current) => 
                        current.change > best.change ? current : best
                      ).crop
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {t('market.last_updated')}: {lastUpdated.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}