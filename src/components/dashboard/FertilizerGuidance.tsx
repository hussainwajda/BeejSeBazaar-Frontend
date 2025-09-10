'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Sprout, 
  Download, 
  TrendingUp, 
  Clock,
  Leaf,
  Droplets,
  Sun
} from 'lucide-react';
import { sensorService } from '@/services/sensorService';
import { useLanguage } from '@/hooks/useLanguage';

const CROPS = [
  { value: 'wheat', label: 'wheat' },
  { value: 'rice', label: 'rice' },
  { value: 'corn', label: 'corn' },
  { value: 'cotton', label: 'cotton' },
  { value: 'sugarcane', label: 'sugarcane' },
  { value: 'vegetables', label: 'vegetables' },
];

export default function FertilizerGuidance() {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentSoilData, setCurrentSoilData] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const data = await sensorService.getLatestSensor();
        setCurrentSoilData(data);
      } catch (error) {
        console.error('Failed to fetch soil data:', error);
      }
    };

    fetchSoilData();
  }, []);

  useEffect(() => {
    if (currentSoilData) {
      generateRecommendation();
    }
  }, [selectedCrop, currentSoilData]);

  const generateRecommendation = async () => {
    setLoading(true);
    try {
      // TODO: Replace with ML-based recommendation system
      // For now, using the rule-based logic from sensor service
      const rec = sensorService.getFertilizerRecommendation(selectedCrop, currentSoilData);
      
      // Enhance recommendation with soil-specific adjustments
      const enhancedRec = {
        ...rec,
        soilBasedAdjustments: getSoilBasedAdjustments(currentSoilData),
        estimatedYieldImpact: getYieldImpact(currentSoilData),
        applicationSchedule: getApplicationSchedule(selectedCrop),
      };
      
      setRecommendation(enhancedRec);
    } catch (error) {
      console.error('Failed to generate recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSoilBasedAdjustments = (soilData: any) => {
    const adjustments = [];

    if (soilData.moisture < 40) {
      adjustments.push('Increase irrigation frequency by 20%');
    }
    if (soilData.ph < 6.0) {
      adjustments.push('Add lime before fertilizer application');
    }
    if (soilData.nitrogen < 30) {
      adjustments.push('Consider additional nitrogen supplement');
    }

    return adjustments;
  };

  const getYieldImpact = (soilData: any) => {
    // Simple calculation based on soil conditions
    let baseImpact = 15; // 15% base yield increase
    
    if (soilData.moisture >= 40 && soilData.moisture <= 70) {
      baseImpact += 5;
    }
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      baseImpact += 5;
    }
    if (soilData.temperature >= 15 && soilData.temperature <= 30) {
      baseImpact += 5;
    }

    return Math.min(baseImpact, 30); // Cap at 30%
  };

  const getApplicationSchedule = (crop: string) => {
    const schedules = {
      wheat: ['Basal application (20%)', 'Tillering stage (30%)', 'Flowering stage (30%)', 'Grain filling (20%)'],
      rice: ['Basal application (25%)', 'Active tillering (25%)', 'Panicle initiation (30%)', 'Flowering (20%)'],
      corn: ['At planting (25%)', 'V4-V6 stage (25%)', 'V10-VT stage (30%)', 'Tasseling (20%)'],
      cotton: ['Pre-planting (20%)', 'Square formation (30%)', 'Flowering (30%)', 'Boll development (20%)'],
      sugarcane: ['At planting (30%)', '3 months (30%)', '6 months (25%)', '9 months (15%)'],
      vegetables: ['Before planting (40%)', '3 weeks after transplanting (30%)', 'Fruit development (30%)']
    };

    return schedules[crop as keyof typeof schedules] || schedules.vegetables;
  };

  const handleDownloadPlan = () => {
    // TODO: Implement PDF download functionality
    alert('PDF download functionality would be implemented here');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          {t('fertilizer.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Crop Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('fertilizer.select_crop')}</label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('fertilizer.select_crop')} />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map((crop) => (
                  <SelectItem key={crop.value} value={crop.value}>
                    {t(`fertilizer.crops.${crop.label}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Soil Data Summary */}
          {currentSoilData && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Current Soil Conditions
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-3 w-3 text-blue-600" />
                  <span>Moisture: {currentSoilData.moisture.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-3 w-3 text-green-600" />
                  <span>pH: {currentSoilData.ph.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-3 w-3 text-orange-600" />
                  <span>Temp: {currentSoilData.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                  <span>N: {currentSoilData.nitrogen?.toFixed(1) || 'N/A'} mg/kg</span>
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ) : recommendation && (
            <div className="space-y-4">
              {/* Main Recommendation Card */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">
                      {t('fertilizer.recommendation')}
                    </h4>
                    <p className="text-sm text-green-700">
                      Based on your soil conditions and {t(`fertilizer.crops.${selectedCrop}`)}
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{recommendation.estimatedYieldImpact}% yield
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-green-700">{t('fertilizer.type')}:</span>
                      <p className="font-semibold text-green-900">{recommendation.type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-700">{t('fertilizer.amount')}:</span>
                      <p className="font-semibold text-green-900">{recommendation.amount}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-green-700">{t('fertilizer.timing')}:</span>
                      <p className="font-semibold text-green-900">{recommendation.timing}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-700">{t('fertilizer.method')}:</span>
                      <p className="font-semibold text-green-900">{recommendation.method}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Schedule */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Application Schedule
                </h4>
                <div className="space-y-2">
                  {recommendation.applicationSchedule.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-semibold text-purple-800 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-purple-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soil-Based Adjustments */}
              {recommendation.soilBasedAdjustments.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Soil-Based Adjustments
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.soilBasedAdjustments.map((adjustment: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-amber-700">{adjustment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Download Button */}
              <Button 
                onClick={handleDownloadPlan}
                className="w-full"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('fertilizer.download_plan')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}