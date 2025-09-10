'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(true);
        
        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false);
          toast({
            title: "Voice Command Received",
            description: "I understood your request about soil moisture levels.",
          });
        }, 2000);
      }, 3000);
    } else {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={isListening ? stopListening : startListening}
        className={`relative ${isListening ? 'animate-pulse bg-red-50 text-red-600' : ''}`}
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {/* Voice Assistant Popup */}
      {(isListening || isProcessing) && (
        <Card className="absolute top-full right-0 mt-2 w-80 shadow-lg border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
              }`}>
                {isListening ? (
                  <Mic className="h-5 w-5 text-red-600" />
                ) : (
                  <Volume2 className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  {isListening ? t('voice.listening') : t('voice.processing')}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isListening ? t('voice.tap_to_speak') : t('voice.processing')}
                </p>
              </div>
            </div>
            
            {isListening && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-green-400 rounded animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-6 bg-green-500 rounded animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-4 bg-green-400 rounded animate-bounce" style={{ animationDelay: '300ms' }} />
                  <div className="w-1 h-8 bg-green-600 rounded animate-bounce" style={{ animationDelay: '450ms' }} />
                  <div className="w-1 h-4 bg-green-400 rounded animate-bounce" style={{ animationDelay: '600ms' }} />
                </div>
                <p className="text-xs text-muted-foreground">Listening for your command...</p>
              </div>
            )}
            
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-xs text-muted-foreground">Processing your request...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}