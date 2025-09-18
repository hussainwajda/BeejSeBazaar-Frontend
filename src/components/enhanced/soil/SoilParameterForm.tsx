'use client';

import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HelpCircle, Check } from 'lucide-react';

export type SoilFormValues = {
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicMatter: string;
  moisture: string;
  temperature: string;
  salinity: string;
  landSizeSqft?: string;
  crop?: string;
  cropStage?: string;
};

export default function SoilParameterForm({
  onSubmit,
  isLoading,
  onAutoSave,
}: {
  onSubmit: (values: SoilFormValues) => void;
  isLoading?: boolean;
  onAutoSave?: (values: SoilFormValues) => void;
}) {
  const [formData, setFormData] = useState<SoilFormValues>({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
    moisture: '',
    temperature: '',
    salinity: '',
    landSizeSqft: '',
    crop: '',
    cropStage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parameterInfo = useMemo(
    () => ({
      ph: { label: 'pH Level', unit: 'pH', range: '6.0 - 7.5', tooltip: 'Soil acidity/alkalinity affects nutrient availability' },
      nitrogen: { label: 'Nitrogen (N)', unit: 'ppm', range: '20 - 50', tooltip: 'Essential for leaf growth and chlorophyll production' },
      phosphorus: { label: 'Phosphorus (P)', unit: 'ppm', range: '30 - 100', tooltip: 'Critical for root development and flowering' },
      potassium: { label: 'Potassium (K)', unit: 'ppm', range: '150 - 300', tooltip: 'Improves disease resistance and water regulation' },
      organicMatter: { label: 'Organic Matter', unit: '%', range: '3 - 6', tooltip: 'Enhances soil structure and nutrient retention' },
      moisture: { label: 'Moisture Content', unit: '%', range: '25 - 35', tooltip: 'Optimal water content for plant growth' },
      temperature: { label: 'Soil Temperature', unit: '°C', range: '16 - 24', tooltip: 'Affects root growth and microbial activity' },
      salinity: { label: 'Salinity Level', unit: 'dS/m', range: '0 - 2', tooltip: 'High salinity can inhibit plant growth' },
    }),
    []
  );

  const validateField = (name: keyof SoilFormValues, value: string) => {
    const ranges: Record<keyof SoilFormValues, { min: number; max: number } | undefined> = {
      ph: { min: 0, max: 14 },
      nitrogen: { min: 0, max: 200 },
      phosphorus: { min: 0, max: 500 },
      potassium: { min: 0, max: 1000 },
      organicMatter: { min: 0, max: 20 },
      moisture: { min: 0, max: 100 },
      temperature: { min: -20, max: 60 },
      salinity: { min: 0, max: 10 },
      landSizeSqft: { min: 0, max: 10000000 },
      crop: undefined,
      cropStage: undefined,
    };
    if (value && ranges[name]) {
      const num = Number(value);
      if (Number.isNaN(num) || num < ranges[name].min || num > ranges[name].max) {
        return `Value must be between ${ranges[name].min} and ${ranges[name].max}`;
      }
    }
    return '';
  };

  const completionPercentage = useMemo(() => {
    const filled = Object.values(formData).filter((v) => v.trim() !== '').length;
    return Math.round((filled / Object.keys(formData).length) * 100);
  }, [formData]);

  const handleChange = (name: keyof SoilFormValues, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
    const error = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: error }));
    if (onAutoSave) {
      window.clearTimeout((window as any).autoSaveTimeout);
      (window as any).autoSaveTimeout = window.setTimeout(() => onAutoSave({ ...formData, [name]: value }), 800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as (keyof SoilFormValues)[]).forEach((k) => {
      const err = validateField(k, formData[k]);
      if (err) newErrors[k] = err;
    });
    ['ph', 'nitrogen', 'phosphorus', 'potassium'].forEach((k) => {
      const key = k as keyof SoilFormValues;
      if (!formData[key]?.trim()) newErrors[key as string] = 'This field is required';
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onSubmit(formData);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Soil Parameter Input</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your soil test measurements for comprehensive analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${completionPercentage}%` }} />
          </div>
          <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(parameterInfo) as (keyof SoilFormValues)[]).map((key) => {
            const info = (parameterInfo as any)[key];
            const required = ['ph', 'nitrogen', 'phosphorus', 'potassium'].includes(key);
            return (
              <div key={key} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium">
                    {info.label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                  </label>
                  <div className="group relative">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow text-xs opacity-0 group-hover:opacity-100 transition-opacity w-64 z-10">
                      <p className="mb-1">{info.tooltip}</p>
                      <p className="text-primary font-medium">Optimal range: {info.range} {info.unit}</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    name={key}
                    value={formData[key] as any}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={`Enter ${info.label.toLowerCase()}`}
                    className="pr-12"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{info.unit}</span>
                </div>
                {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
              </div>
            );
          })}
          {/* Extra contextual inputs */}
          <div className="relative">
            <label className="text-sm font-medium mb-2 block">Land Size (sq.ft)</label>
            <Input type="number" name="landSizeSqft" value={formData.landSizeSqft}
              onChange={(e) => handleChange('landSizeSqft', e.target.value)} placeholder="e.g., 1000" />
            {errors.landSizeSqft && <p className="mt-1 text-xs text-red-600">{errors.landSizeSqft}</p>}
          </div>
          <div className="relative">
            <label className="text-sm font-medium mb-2 block">Planned Crop</label>
            <Input name="crop" value={formData.crop} onChange={(e) => handleChange('crop', e.target.value)} placeholder="e.g., Tomato" />
          </div>
          <div className="relative">
            <label className="text-sm font-medium mb-2 block">Stage of Crop</label>
            <select
              className="w-full border border-border rounded-md bg-input px-3 py-2 text-sm"
              value={formData.cropStage}
              onChange={(e) => handleChange('cropStage', e.target.value)}
            >
              <option value="">Select stage</option>
              <option value="sowing">Sowing</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="fruiting">Fruiting</option>
              <option value="harvest">Harvest</option>
            </select>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button type="submit" disabled={!!isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Analyzing Soil...' : 'Analyze Soil Health'}
          </Button>
          <Button type="button" variant="outline" onClick={() => onAutoSave?.(formData)} className="w-full sm:w-auto">
            <Check className="h-4 w-4 mr-2" /> Save Draft
          </Button>
        </div>
      </form>
    </div>
  );
}


