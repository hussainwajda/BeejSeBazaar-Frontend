'use client';

import React, { useEffect } from 'react';

export default function AnalysisProgress({ isAnalyzing, onComplete }: { isAnalyzing: boolean; onComplete: () => void }) {
  useEffect(() => {
    if (isAnalyzing) {
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }
  }, [isAnalyzing, onComplete]);

  if (!isAnalyzing) return null;

  return (
    <div className="border border-border rounded-lg p-6 bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Analyzing image with AI model...</p>
      </div>
    </div>
  );
}


