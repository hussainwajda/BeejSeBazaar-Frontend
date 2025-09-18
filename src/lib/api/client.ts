import axios, { AxiosInstance } from 'axios';

const getBaseUrl = () => {
  const envUrl =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
    (typeof window !== 'undefined' && (window as any).ENV_API_URL);
  if (envUrl) return envUrl;
  return 'http://localhost:5000';
};

const instance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

export const apiClient = {
  async get<T>(path: string, config?: any): Promise<T> {
    const res = await instance.get<T>(path, config);
    return res.data as T;
  },
  async post<T>(path: string, body?: unknown, config?: any): Promise<T> {
    const res = await instance.post<T>(path, body, config);
    return res.data as T;
  },
};



