'use client';

import WeatherAlerts from '@/components/dashboard/WeatherAlerts';
import SoilHealth from '@/components/dashboard/SoilHealth';
import FertilizerGuidance from '@/components/dashboard/FertilizerGuidance';
import PestDiseaseDetection from '@/components/dashboard/PestDiseaseDetection';
import MarketPrices from '@/components/dashboard/MarketPrices';
import RecentAlerts from '@/components/dashboard/RecentAlerts';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WeatherAlerts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoilHealth />
        <FertilizerGuidance />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PestDiseaseDetection />
        <MarketPrices />
      </div>
      <RecentAlerts />
    </div>
  );
}
