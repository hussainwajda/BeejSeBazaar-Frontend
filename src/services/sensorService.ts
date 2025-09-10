// Mock sensor service for BeejSeBazaar
// TODO: Replace with real sensor API/backend integration

export interface SensorData {
  moisture: number;
  ph: number;
  temperature: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  timestamp: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  forecast: Array<{
    date: string;
    temperature: number;
    condition: string;
  }>;
}

export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface PestDetectionResult {
  hasPests: boolean;
  hasDisease: boolean;
  pests?: string[];
  disease?: string;
  confidence: number;
  treatment?: string;
}

export interface Alert {
  id: string;
  type: 'weather' | 'soil' | 'pest' | 'market';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

// Mock sensor data thresholds
export const SENSOR_THRESHOLDS = {
  moisture: {
    good: { min: 40, max: 70 },
    warning: { min: 30, max: 80 },
    critical: { min: 0, max: 100 }
  },
  ph: {
    good: { min: 6.0, max: 7.5 },
    warning: { min: 5.5, max: 8.0 },
    critical: { min: 0, max: 14 }
  },
  temperature: {
    good: { min: 15, max: 30 },
    warning: { min: 10, max: 35 },
    critical: { min: 0, max: 50 }
  }
};

class SensorService {
  private listeners: Array<(data: SensorData) => void> = [];
  private mockInterval: NodeJS.Timeout | null = null;

  // Get latest sensor data
  async getLatestSensor(): Promise<SensorData> {
    // TODO: Replace with real API call
    // const response = await fetch('/api/sensor/latest');
    // return response.json();
    
    // Mock data for development
    return {
      moisture: Math.random() * 100,
      ph: 5 + Math.random() * 4,
      temperature: 10 + Math.random() * 30,
      nitrogen: Math.random() * 100,
      phosphorus: Math.random() * 100,
      potassium: Math.random() * 100,
      timestamp: new Date().toISOString()
    };
  }

  // Subscribe to real-time sensor data (mock implementation)
  subscribeSensor(onData: (data: SensorData) => void): () => void {
    this.listeners.push(onData);
    
    if (!this.mockInterval) {
      this.mockInterval = setInterval(async () => {
        const data = await this.getLatestSensor();
        this.listeners.forEach(listener => listener(data));
      }, 5000); // Update every 5 seconds
    }

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== onData);
      if (this.listeners.length === 0 && this.mockInterval) {
        clearInterval(this.mockInterval);
        this.mockInterval = null;
      }
    };
  }

  // Get weather data
  async getWeatherData(): Promise<WeatherData> {
    // TODO: Replace with real weather API call
    // const response = await fetch('/api/weather/current');
    // return response.json();
    
    // Mock weather data
    return {
      temperature: 25 + Math.random() * 10,
      humidity: 40 + Math.random() * 40,
      rainfall: Math.random() * 50,
      windSpeed: Math.random() * 20,
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: 20 + Math.random() * 15,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
      }))
    };
  }

  // Get market prices
  async getMarketPrices(): Promise<MarketPrice[]> {
    // TODO: Replace with real market API call
    // const response = await fetch('/api/market/prices');
    // return response.json();
    
    const crops = ['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Tomatoes'];
    const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
    
    return crops.map(crop => ({
      crop,
      price: 1000 + Math.random() * 5000,
      unit: 'quintal',
      trend: trends[Math.floor(Math.random() * trends.length)],
      change: (Math.random() - 0.5) * 200
    }));
  }

  // Upload pest/disease image for detection
  async uploadPestImage(imageFile: File): Promise<PestDetectionResult> {
    // TODO: Replace with real pest detection API call
    // const formData = new FormData();
    // formData.append('image', imageFile);
    // const response = await fetch('/api/pest/upload', {
    //   method: 'POST',
    //   body: formData
    // });
    // return response.json();
    
    // Mock detection result
    const hasPests = Math.random() > 0.5;
    const hasDisease = Math.random() > 0.5;
    
    return {
      hasPests,
      hasDisease,
      pests: hasPests ? ['Aphids', 'Whiteflies'] : undefined,
      disease: hasDisease ? 'Leaf Blight' : undefined,
      confidence: 0.7 + Math.random() * 0.3,
      treatment: hasPests || hasDisease ? 'Apply organic pesticide and ensure proper irrigation' : undefined
    };
  }

  // Submit feedback
  async submitFeedback(feedback: { name: string; email: string; message: string }): Promise<void> {
    // TODO: Replace with real feedback API call
    // await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(feedback)
    // });
    
    // Mock submission - just log for now
    console.log('Feedback submitted:', feedback);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Get recent alerts
  async getAlerts(): Promise<Alert[]> {
    // TODO: Replace with real alerts API call
    // const response = await fetch('/api/alerts');
    // return response.json();
    
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'weather',
        title: 'Heavy Rain Expected',
        message: 'Heavy rainfall expected in the next 48 hours. Ensure proper drainage.',
        severity: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'soil',
        title: 'Low Soil Moisture',
        message: 'Soil moisture levels are below optimal. Consider irrigation.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'market',
        title: 'Price Increase',
        message: 'Wheat prices have increased by 5% in the local market.',
        severity: 'low',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return mockAlerts;
  }

  // Get fertilizer recommendation based on crop and soil data
  getFertilizerRecommendation(crop: string, soilData: SensorData) {
    // TODO: Replace with ML-based recommendation system
    // For now, using simple rule-based logic
    
    const recommendations = {
      wheat: {
        type: 'NPK 15:15:15',
        amount: '50 kg/acre',
        timing: 'Before sowing',
        method: 'Broadcast and incorporate into soil'
      },
      rice: {
        type: 'NPK 20:20:20',
        amount: '60 kg/acre',
        timing: 'Basal application',
        method: 'Flood irrigation method'
      },
      corn: {
        type: 'NPK 16:8:8',
        amount: '75 kg/acre',
        timing: 'Split application',
        method: 'Side dressing'
      },
      cotton: {
        type: 'NPK 20:10:10',
        amount: '80 kg/acre',
        timing: 'Pre-planting',
        method: 'Band placement'
      },
      sugarcane: {
        type: 'NPK 25:10:10',
        amount: '100 kg/acre',
        timing: 'At planting',
        method: 'Furrow application'
      },
      vegetables: {
        type: 'NPK 10:10:10',
        amount: '40 kg/acre',
        timing: 'Before planting',
        method: 'Basal application'
      }
    };

    return recommendations[crop.toLowerCase()] || recommendations.vegetables;
  }
}

// Export singleton instance
export const sensorService = new SensorService();