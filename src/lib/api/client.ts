const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return 'http://localhost:5000';
  }
  return 'http://localhost:5000';
};

export const apiClient = {
  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`GET ${path} failed: ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
  },
};



