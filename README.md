# 🌾 BeejSeBazaar - Farmer's Dashboard

A comprehensive mobile-first responsive web application for farmers, built with React + Next.js, Vite, and Tailwind CSS. BeejSeBazaar provides real-time soil health monitoring, weather alerts, market prices, and agricultural guidance in multiple Indian languages.

## 🌱 Features

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with progressive enhancement for tablet & desktop
- **Touch-Friendly Interface**: Large touch targets and intuitive navigation
- **Clean UI**: Rounded cards, soft shadows, and green & white color palette
- **Accessible**: High-contrast text and clear icons for users with minimal digital literacy

### 🌍 Multi-Language Support
- **5 Languages**: English, Hindi, Marathi, Telugu, Malayalam
- **Dynamic Translation**: Real-time language switching throughout the app
- **Localized Content**: All UI text and agricultural terms translated

### 📊 Dashboard Components
- **Weather Alerts**: Current weather, 5-day forecast, and weather warnings
- **Soil Health**: Real-time sensor data (moisture, pH, temperature, NPK) with color-coded status
- **Fertilizer Guidance**: Crop-specific recommendations based on soil analysis
- **Pest & Disease Detection**: Image upload with AI-powered detection (placeholder)
- **Market Prices**: Real-time crop prices with trend analysis
- **Recent Alerts**: Time-stamped notifications and warnings
- **Feedback System**: User feedback collection with rating system
- **Voice Assistant**: Voice command interface (placeholder)

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library

### Additional Libraries
- **Lucide React** for icons
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Zustand** for state management

### Development Tools
- **ESLint** for code quality
- **PostCSS** for processing
- **TypeScript** for type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd beejse-bazaar

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:generate  # Generate Prisma client
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with language provider
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── common/            # Shared components
│   │   └── LanguageSwitcher.tsx
│   ├── dashboard/         # Dashboard components
│   │   ├── WeatherAlerts.tsx
│   │   ├── SoilHealth.tsx
│   │   ├── FertilizerGuidance.tsx
│   │   ├── PestDiseaseDetection.tsx
│   │   ├── MarketPrices.tsx
│   │   ├── RecentAlerts.tsx
│   │   ├── FeedbackForm.tsx
│   │   └── VoiceAssistant.tsx
│   └── ui/               # shadcn/ui components
├── hooks/
│   ├── useLanguage.tsx   # Language context hook
│   ├── useToast.ts       # Toast notifications
│   └── use-mobile.ts     # Mobile detection hook
├── languages/            # Translation files
│   ├── en.json          # English
│   ├── hi.json          # Hindi
│   ├── mr.json          # Marathi
│   ├── te.json          # Telugu
│   └── ml.json          # Malayalam
├── services/
│   └── sensorService.ts  # Mock API service
└── lib/
    ├── db.ts            # Database client
    ├── utils.ts         # Utility functions
    └── socket.ts        # WebSocket setup
```

## 🔌 Sensor & API Integration

### Current Implementation
The application uses mock data in `src/services/sensorService.ts` with placeholder functions that simulate real sensor data and API responses.

### Integration Points

#### 1. Soil Sensor Data
**File**: `src/services/sensorService.ts`
**Function**: `getLatestSensor()`
**Returns**: `SensorData` with moisture, pH, temperature, NPK values

```typescript
// TODO: Replace with real sensor endpoint
// const response = await fetch('/api/sensor/latest');
// return response.json();
```

**Real Integration**:
```typescript
async function getLatestSensor(): Promise<SensorData> {
  const response = await fetch('/api/sensor/latest');
  return response.json();
}
```

#### 2. Weather Data
**File**: `src/services/sensorService.ts`
**Function**: `getWeatherData()`
**Returns**: `WeatherData` with current conditions and forecast

```typescript
// TODO: Replace with real weather API
// const response = await fetch('/api/weather/current');
// return response.json();
```

#### 3. Pest & Disease Detection
**File**: `src/services/sensorService.ts`
**Function**: `uploadPestImage(imageFile: File)`
**Returns**: `PestDetectionResult` with analysis results

```typescript
// TODO: Replace with real pest detection API
// const formData = new FormData();
// formData.append('image', imageFile);
// const response = await fetch('/api/pest/upload', {
//   method: 'POST',
//   body: formData
// });
// return response.json();
```

#### 4. Market Prices
**File**: `src/services/sensorService.ts`
**Function**: `getMarketPrices()`
**Returns**: `MarketPrice[]` with crop prices and trends

```typescript
// TODO: Replace with real market API
// const response = await fetch('/api/market/prices');
// return response.json();
```

#### 5. Real-time Updates
**File**: `src/services/sensorService.ts`
**Function**: `subscribeSensor(onData: (data: SensorData) => void)`
**Purpose**: Subscribe to real-time sensor data updates

```typescript
// TODO: Replace with WebSocket/MQTT implementation
// For now using mock interval-based updates
```

### Sensor Data Thresholds
The application uses predefined thresholds for soil health status:

```typescript
export const SENSOR_THRESHOLDS = {
  moisture: {
    good: { min: 40, max: 70 },    // Optimal moisture range
    warning: { min: 30, max: 80 },  // Warning range
    critical: { min: 0, max: 100 }  // Critical range
  },
  ph: {
    good: { min: 6.0, max: 7.5 },   // Optimal pH range
    warning: { min: 5.5, max: 8.0 }, // Warning range
    critical: { min: 0, max: 14 }  // Critical range
  },
  temperature: {
    good: { min: 15, max: 30 },    // Optimal temperature range
    warning: { min: 10, max: 35 },  // Warning range
    critical: { min: 0, max: 50 }  // Critical range
  }
};
```

## 🎨 Design System

### Color Palette
- **Primary**: Green shades (#059669, #10b981, #34d399)
- **Background**: White with green accents
- **Status Colors**: Green (good), Yellow (warning), Red (critical)
- **Text**: High contrast for readability

### Typography
- **Large Fonts**: Easy-to-read text for farmers with minimal digital literacy
- **Clear Hierarchy**: Distinct heading levels and body text
- **Mobile-Optimized**: Responsive font sizes

### Components
- **Cards**: Rounded corners with soft shadows
- **Buttons**: Large touch targets (minimum 44px)
- **Icons**: Lucide React icons for consistency
- **Badges**: Color-coded status indicators

## 🌐 Language System

### Adding New Languages
1. Create a new JSON file in `src/languages/` (e.g., `gu.json` for Gujarati)
2. Copy the structure from `en.json`
3. Translate all values while keeping keys the same
4. Add the language to the `languages` array in `LanguageSwitcher.tsx`

### Translation Structure
```json
{
  "app": {
    "title": "App Title",
    "welcome": "Welcome message"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "soil_health": "Soil Health"
  }
}
```

### Usage in Components
```typescript
const { t } = useLanguage();
return <h1>{t('app.title')}</h1>;
```

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile**: < 768px (bottom navigation, slide-over sidebar)
- **Tablet**: 768px - 1024px (adjusted layouts)
- **Desktop**: > 1024px (full sidebar, expanded layouts)

### Navigation
- **Mobile**: Bottom navigation bar + hamburger menu
- **Desktop**: Sidebar navigation + top header
- **Touch Targets**: Minimum 44px for all interactive elements

## 🔧 Customization

### Adding New Dashboard Sections
1. Create component in `src/components/dashboard/`
2. Add to navigation items in `src/app/page.tsx`
3. Add translation keys to language files
4. Update the `renderActiveSection` function

### Modifying Sensor Data
Edit `SENSOR_THRESHOLDS` in `sensorService.ts` to adjust:
- Optimal ranges for different crops
- Warning and critical thresholds
- Status color logic

### Styling Customization
- Modify colors in `tailwind.config.ts`
- Update component styles using Tailwind classes
- Customize shadcn/ui components if needed

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Create `.env.local` for environment-specific configuration:
```env
NEXT_PUBLIC_API_URL=your-api-endpoint
NEXT_PUBLIC_WS_URL=your-websocket-endpoint
DATABASE_URL=your-database-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Designed for Indian farmers with focus on usability
- Multi-language support for regional accessibility
- Mobile-first approach for rural internet connectivity
- Built with modern web technologies for scalability

---

Built with ❤️ for the farming community 🌾
