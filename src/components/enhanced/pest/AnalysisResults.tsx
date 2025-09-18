'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Treatment = {
  type: 'immediate' | 'preventive' | 'organic';
  title: string;
  description: string;
  steps?: string[];
  products?: { name: string; price: string; description: string }[];
  safety?: string;
};

type Result = {
  name: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  type: 'Pest' | 'Disease' | 'Deficiency';
  description: string;
  symptoms: string[];
  treatments: Treatment[];
};

export default function AnalysisResults({ results, uploadedImage, onRetry }: { results: Result[]; uploadedImage: string | null; onRetry: () => void }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        {uploadedImage && (
          <img src={uploadedImage} alt="Uploaded" className="w-40 h-40 rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold">Analysis Results</h2>
            <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={onRetry}>Try Another Image</Button>
          </div>
          <div className="space-y-6">
            {results.map((r, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{r.name}</h3>
                    <Badge>{r.type}</Badge>
                    <Badge variant="secondary">{r.severity} Severity</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence: {r.confidence}%</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Symptoms</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {r.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Treatments</h4>
                    <div className="space-y-3">
                      {r.treatments.map((t, i) => (
                        <div key={i} className="p-3 rounded-md border border-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium capitalize">{t.type} - {t.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{t.description}</p>
                          {t.steps && (
                            <ul className="list-decimal list-inside text-xs space-y-1">
                              {t.steps.map((s, k) => <li key={k}>{s}</li>)}
                            </ul>
                          )}
                          {t.products && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {t.products.map((p, k) => (
                                <div key={k} className="text-xs p-2 rounded border">
                                  <div className="font-medium">{p.name} - ${p.price}</div>
                                  <div className="text-muted-foreground">{p.description}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {t.safety && <div className="mt-2 text-xs text-amber-600">Safety: {t.safety}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


