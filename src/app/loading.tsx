'use client';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}


