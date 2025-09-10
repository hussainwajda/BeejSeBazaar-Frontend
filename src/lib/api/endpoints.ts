export const API_ENDPOINTS = {
  weather: (lat: number, lon: number) => `/api/weather?lat=${lat}&lon=${lon}`,
} as const;



