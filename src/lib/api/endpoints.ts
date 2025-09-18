export const API_ENDPOINTS = {
  weather: (lat: number, lon: number) => `/api/weather?lat=${lat}&lon=${lon}`,
  translate: `/api/translate`,
  translateTexts: `/api/translate-texts`,
  soilAnalyze: `/api/soil/analyze`,
  soilAnalyzeUpload: `/api/soil/analyze-upload`,
  pestAnalyzeUpload: `/api/pest/analyze-upload`,
} as const;



