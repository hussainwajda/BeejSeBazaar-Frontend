'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  CheckCircle,
  Star,
  User,
  Mail
} from 'lucide-react';
import { sensorService } from '@/services/sensorService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name and message.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await sensorService.submitFeedback({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      setSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: t('feedback.thank_you'),
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
        rating: 0
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange('rating', star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-6 w-6 ${
                star <= formData.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            {t('feedback.thank_you')}
          </h3>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
          <Button onClick={() => setSubmitted(false)}>
            Submit Another Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('feedback.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('feedback.name')} *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
                className="text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('feedback.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className="text-base"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              How would you rate your experience?
            </Label>
            <div className="flex items-center gap-3">
              {renderStars()}
              {formData.rating > 0 && (
                <Badge variant="outline">
                  {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('feedback.message')} *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Share your feedback, suggestions, or report any issues you've encountered..."
              rows={6}
              required
              className="text-base resize-none"
            />
            <div className="text-xs text-muted-foreground">
              {formData.message.length}/500 characters
            </div>
          </div>

          {/* Quick Feedback Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Feedback (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {[
                'Easy to use',
                'Helpful information',
                'Good design',
                'Fast performance',
                'Need more features',
                'Technical issues'
              ].map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentMessage = formData.message;
                    const newMessage = currentMessage 
                      ? `${currentMessage}\n\n${option}`
                      : option;
                    handleInputChange('message', newMessage);
                  }}
                  className="text-xs"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={submitting || !formData.name.trim() || !formData.message.trim()}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t('feedback.submit')}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  message: '',
                  rating: 0
                });
              }}
            >
              Clear
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Privacy Note:</strong> Your feedback is valuable to us and helps improve BeejSeBazaar. 
              We may use your feedback to enhance our services, but we'll never share your personal information 
              without your consent.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}