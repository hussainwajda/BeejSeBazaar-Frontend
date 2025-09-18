"use client";

import React, { useEffect, useState } from 'react';
import SoilParameterForm, { SoilFormValues } from '@/components/enhanced/soil/SoilParameterForm';
import TestingHistory from '@/components/enhanced/soil/TestingHistory';
import FileUploadSection from '@/components/enhanced/soil/FileUploadSection';
import QuickTestCard from '@/components/enhanced/soil/QuickTestCard';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export default function SoilHealthPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'upload' | 'quick'>('manual');
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [uploadExtras, setUploadExtras] = useState<{ landSizeSqft?: string; crop?: string; cropStage?: string }>({});
  const [analysisResults, setAnalysisResults] = useState<null | {
    overallScore: number;
    status: 'good' | 'excellent' | 'moderate' | 'poor';
    recommendations: string[];
    parameters: SoilFormValues;
    irrigationLiters?: number;
    irrigationNote?: string;
  }>(null);

  useEffect(() => {
    if (autoSaveStatus) {
      const t = setTimeout(() => setAutoSaveStatus(''), 3000);
      return () => clearTimeout(t);
    }
  }, [autoSaveStatus]);

  const handleFormSubmit = async (formData: SoilFormValues) => {
    setIsAnalyzing(true);
    try {
      const numeric = new Set(['ph','nitrogen','phosphorus','potassium','organicMatter','moisture','temperature','salinity','landSizeSqft']);
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v === '' ? undefined : (numeric.has(k) ? parseFloat(v as string) : v)])
      );
      const result = await apiClient.post<{
        overallScore: number;
        status: 'good' | 'excellent' | 'moderate' | 'poor';
        recommendations: string[];
        parameters: SoilFormValues;
      }>(API_ENDPOINTS.soilAnalyze, payload);
      setAnalysisResults(result as any);
    } catch (e) {
      console.error('Soil analyze failed', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoSave = (formData: SoilFormValues) => {
    localStorage.setItem('soilTestDraft', JSON.stringify(formData));
    setAutoSaveStatus('Draft saved automatically');
  };

  return (
    <div className="min-h-screen">
      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold">Soil Health Testing</h1>
                <p className="text-muted-foreground mt-2">Analyze your soil parameters and get personalized recommendations</p>
              </div>
              {autoSaveStatus && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm text-emerald-700">{autoSaveStatus}</span>
                </div>
              )}
            </div>
          </div>

          {analysisResults && (
            <div className="mb-8 p-6 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold">Analysis Complete</h2>
                <Button variant="outline" size="sm">Export Report</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-primary">{analysisResults.overallScore}</span>
                  </div>
                  <p className="font-semibold">Overall Score</p>
                  <p className="text-sm text-muted-foreground capitalize">{analysisResults.status} Health</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-3">Key Recommendations</h3>
                  <div className="space-y-2">
                    {analysisResults.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  {analysisResults.irrigationNote && (
                    <div className="p-3 rounded border border-blue-200 bg-blue-50 text-blue-800 text-sm">
                      {analysisResults.irrigationNote}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-1">
                <div className="flex space-x-1">
                  {[
                    { id: 'manual', label: 'Manual Entry' },
                    { id: 'upload', label: 'Upload Reports' },
                    { id: 'quick', label: 'Quick Tests' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center justify-center flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'manual' && (
                <SoilParameterForm onSubmit={handleFormSubmit} isLoading={isAnalyzing} onAutoSave={handleAutoSave} />
              )}
              {activeTab === 'upload' && (
                <FileUploadSection
                  extraFields={uploadExtras}
                  onExtraChange={setUploadExtras}
                  onFileUpload={async (file) => {
                    setIsAnalyzing(true);
                    try {
                      const form = new FormData();
                      form.append('file', file.file);
                      if (uploadExtras.landSizeSqft) form.append('landSizeSqft', uploadExtras.landSizeSqft);
                      if (uploadExtras.crop) form.append('crop', uploadExtras.crop);
                      if (uploadExtras.cropStage) form.append('cropStage', uploadExtras.cropStage);
                      const res = await apiClient.post<any>(API_ENDPOINTS.soilAnalyzeUpload, form, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      setAnalysisResults(res);
                    } catch (e) {
                      console.error('Upload analyze failed', e);
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                  isProcessing={isAnalyzing}
                />
              )}
              {activeTab === 'quick' && <QuickTestCard onQuickTest={() => setActiveTab('manual')} />}
            </div>
            <div className="space-y-6">
              <TestingHistory onSelectTest={() => {}} />
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold">Need Help?</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>Testing Guide - Learn how to collect soil samples</div>
                  <div>Expert Support - Get help from agricultural experts</div>
                  <div>Video Tutorials - Watch step-by-step instructions</div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">View All Resources</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
