'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';

export default function ImageUpload({ onImageUpload, isAnalyzing, onFileSelected }: { onImageUpload: (dataUrl: string | null) => void; isAnalyzing: boolean; onFileSelected?: (file: File) => void; }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    onFileSelected?.(file);
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : null;
      setPreview(url);
      onImageUpload(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold">Upload Crop Image</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Camera className="h-4 w-4" />
          <span>Clear, well-lit, close-up</span>
        </div>
      </div>
      <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center">
        {!preview ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <ImageIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Drag and drop an image here, or click to browse</p>
            <div className="flex items-center justify-center gap-3">
              <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" />
              <Button onClick={() => inputRef.current?.click()} disabled={isAnalyzing} className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" /> Choose File
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img src={preview} alt="Uploaded" className="w-full max-h-64 rounded-lg object-contain" />
            <div className="flex gap-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setPreview(null); onImageUpload(null); }} disabled={isAnalyzing}>Remove</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


