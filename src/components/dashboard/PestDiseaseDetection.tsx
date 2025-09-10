'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Camera, 
  Bug, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { sensorService } from '@/services/sensorService';
import { useLanguage } from '@/hooks/useLanguage';

export default function PestDiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Clear previous result
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    // For now, simulate by triggering file input
    fileInputRef.current?.click();
  };

  const detectPestDisease = async () => {
    if (!selectedImage) return;

    setDetecting(true);
    try {
      const detectionResult = await sensorService.uploadPestImage(selectedImage);
      setResult(detectionResult);
    } catch (error) {
      console.error('Failed to detect pest/disease:', error);
      setResult({
        hasPests: false,
        hasDisease: false,
        confidence: 0,
        error: 'Detection failed'
      });
    } finally {
      setDetecting(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          {t('pest_disease.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upload Section */}
          {!previewUrl && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Upload a photo of your crop
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Take a clear photo of affected leaves, stems, or fruits
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {t('pest_disease.upload_image')}
                  </Button>
                  <Button
                    onClick={handleCameraCapture}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    {t('pest_disease.take_photo')}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {previewUrl && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  onClick={clearSelection}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={detectPestDisease}
                  disabled={detecting}
                  className="flex-1"
                >
                  {detecting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {detecting ? 'Analyzing...' : t('pest_disease.detect')}
                </Button>
                <Button
                  onClick={clearSelection}
                  variant="outline"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Detection Progress */}
          {detecting && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing image for pests and diseases...
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Our AI is examining your crop image for signs of pests, diseases, or nutrient deficiencies
              </p>
            </div>
          )}

          {/* Detection Result */}
          {result && !detecting && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                result.error 
                  ? 'bg-red-50 border-red-200' 
                  : result.hasPests || result.hasDisease
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start gap-3">
                  {result.error ? (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  ) : result.hasPests || result.hasDisease ? (
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      {result.error 
                        ? 'Detection Failed' 
                        : result.hasPests || result.hasDisease
                          ? t('pest_disease.pests_detected') || t('pest_disease.disease_detected')
                          : t('pest_disease.no_pests')
                      }
                    </h4>
                    
                    {result.error ? (
                      <p className="text-sm text-red-700">{result.error}</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Confidence:</span>
                          <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>

                        {result.hasPests && result.pests && (
                          <div>
                            <span className="text-sm font-medium">Pests detected:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.pests.map((pest: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {pest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.hasDisease && (
                          <div>
                            <span className="text-sm font-medium">Disease detected:</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {result.disease}
                            </Badge>
                          </div>
                        )}

                        {result.treatment && (
                          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                            <span className="text-sm font-medium text-blue-800">
                              {t('pest_disease.treatment')}:
                            </span>
                            <p className="text-sm text-blue-700 mt-1">{result.treatment}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Save Report
                </Button>
                <Button variant="outline" onClick={clearSelection}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </div>
          )}

          {/* Tips Section */}
          {!previewUrl && !result && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Tips for Better Detection</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Take photos in good daylight conditions</li>
                <li>• Focus on affected areas of the plant</li>
                <li>• Include both healthy and affected parts in the frame</li>
                <li>• Ensure the image is clear and not blurry</li>
                <li>• Take multiple photos from different angles</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}