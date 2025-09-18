'use client';

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, FileText, FileSpreadsheet, File, CheckCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UploadedFile = {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'ready' | 'processing';
  progress: number;
};

export default function FileUploadSection({
  onFileUpload,
  isProcessing,
  extraFields,
  onExtraChange,
}: {
  onFileUpload?: (file: UploadedFile) => void;
  isProcessing?: boolean;
  extraFields?: { landSizeSqft?: string; crop?: string; cropStage?: string };
  onExtraChange?: (fields: { landSizeSqft?: string; crop?: string; cropStage?: string }) => void;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const acceptedFileTypes: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/jpg': 'JPG',
    'text/csv': 'CSV',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if ((e as any).dataTransfer?.files?.length) {
      handleFiles(Array.from((e as any).dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (!Object.keys(acceptedFileTypes).includes(file.type)) {
        alert(`File type ${file.type} is not supported`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready',
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => onFileUpload?.(f));
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (fileType.includes('image')) return <ImageIcon className="h-4 w-4" />;
    if (fileType.includes('csv') || fileType.includes('excel') || fileType.includes('sheet')) return <FileSpreadsheet className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Laboratory Reports</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload soil test reports for enhanced accuracy</p>
      </div>
      {/* Additional info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Land Size (sq.ft)</label>
          <input className="w-full border border-border rounded-md bg-input px-3 py-2 text-sm" type="number" value={extraFields?.landSizeSqft || ''} onChange={(e) => onExtraChange?.({ ...extraFields, landSizeSqft: e.target.value })} placeholder="e.g., 1000" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Planned Crop</label>
          <input className="w-full border border-border rounded-md bg-input px-3 py-2 text-sm" value={extraFields?.crop || ''} onChange={(e) => onExtraChange?.({ ...extraFields, crop: e.target.value })} placeholder="e.g., Tomato" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Stage</label>
          <select className="w-full border border-border rounded-md bg-input px-3 py-2 text-sm" value={extraFields?.cropStage || ''} onChange={(e) => onExtraChange?.({ ...extraFields, cropStage: e.target.value })}>
            <option value="">Select stage</option>
            <option value="sowing">Sowing</option>
            <option value="vegetative">Vegetative</option>
            <option value="flowering">Flowering</option>
            <option value="fruiting">Fruiting</option>
            <option value="harvest">Harvest</option>
          </select>
        </div>
      </div>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.keys(acceptedFileTypes).join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Drop files here or click to browse</h3>
            <p className="text-sm text-muted-foreground">Support for PDF, images, CSV, and Excel files up to 10MB</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {Object.values(acceptedFileTypes).map((type) => (
              <span key={type} className="px-2 py-1 bg-muted rounded">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">Uploaded Files</h3>
          {uploadedFiles.map((f) => (
            <div key={f.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getFileIcon(f.type)}
                </div>
                <div>
                  <p className="font-medium truncate max-w-[240px]">{f.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(f.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {f.status === 'processing' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-primary">Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Ready</span>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => removeFile(f.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Enhanced Analysis Available</p>
              <p className="text-xs text-muted-foreground">Laboratory reports will be processed to extract precise measurements and provide more accurate recommendations.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


