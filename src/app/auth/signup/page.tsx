'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, User, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReCAPTCHA } from 'react-google-recaptcha';
import { useToast } from '@/hooks/use-toast';

// States data (for future expansion)
const states = [
  { value: 'punjab', label: 'Punjab' }
];

// Punjab districts data
const punjabDistricts = [
  'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 
  'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 
  'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 
  'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar', 
  'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran'
];

// Reverse geocoding function to get state and district from coordinates
const reverseGeocode = async (lat: number, lon: number): Promise<{state: string, district: string} | null> => {
  try {
    // Using a free reverse geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await response.json();

    console.log(data);
    
    if (data && data.principalSubdivision) {
      // Map the response to our state and district
      const state = data.principalSubdivision.toLowerCase();
      const district = data.locality || data.city || 'Unknown';
      
      // Check if it's Punjab
      if (state.includes('punjab')) {
        return { state: 'punjab', district };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Validation schema
const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  aadhar: z.string()
    .min(12, 'Aadhar number must be 12 digits')
    .max(12, 'Aadhar number must be 12 digits')
    .regex(/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number'),
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  state: z.string().min(1, 'Please select your state'),
  district: z.string().min(1, 'Please select your district'),
  locationType: z.enum(['current', 'manual']),
  captcha: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [locationType, setLocationType] = useState<'current' | 'manual'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('');
  const [isNonPunjabLocation, setIsNonPunjabLocation] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [sentToPhone, setSentToPhone] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'form' | 'otp'>('form');

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      aadhar: '',
      otp: '',
      password: '',
      confirmPassword: '',
      state: '',
      district: '',
      locationType: 'manual',
      captcha: '',
    }
  });

  const handleLocationTypeChange = (type: 'current' | 'manual') => {
    setLocationType(type);
    form.setValue('locationType', type);
    setIsNonPunjabLocation(false);
    
    if (type === 'current') {
      setIsGettingLocation(true);
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const locationData = await reverseGeocode(latitude, longitude);
              console.log(locationData);
              if (locationData && locationData.state === 'punjab') {
                form.setValue('state', locationData.state);
                form.setValue('district', locationData.district);
                setSelectedState(locationData.state);
                setIsNonPunjabLocation(false);
              } else {
                // Location is not Punjab
                setIsNonPunjabLocation(true);
                form.setValue('state', '');
                form.setValue('district', '');
                setSelectedState('');
              }
            } catch (error) {
              console.error('Error in reverse geocoding:', error);
              setIsNonPunjabLocation(true);
              form.setValue('state', '');
              form.setValue('district', '');
              setSelectedState('');
            }
            setIsGettingLocation(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setIsNonPunjabLocation(true);
            form.setValue('state', '');
            form.setValue('district', '');
            setSelectedState('');
            setIsGettingLocation(false);
          }
        );
      } else {
        setIsNonPunjabLocation(true);
        form.setValue('state', '');
        form.setValue('district', '');
        setSelectedState('');
        setIsGettingLocation(false);
      }
    } else {
      form.setValue('state', '');
      form.setValue('district', '');
      setSelectedState('');
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    form.setValue('state', state);
    form.setValue('district', ''); // Reset district when state changes
  };

  // API functions
  const createUserAndSendOTP = async (data: SignupFormData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/create-user-send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadharNo: data.aadhar,
          fullName: data.name,
          password: data.password,
          state: data.state,
          district: data.district,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSessionToken(result.sessionToken);
        setIsOtpSent(true);
        setResendCooldown(60); // 60 seconds cooldown
        setSentToPhone(result.phone || 'your registered phone');
        setCurrentStep('otp');
        toast({
          title: "User Created & OTP Sent",
          description: result.message,
        });
        return { success: true, message: result.message };
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const resendOTP = async () => {
    if (!sessionToken) return { success: false, message: 'No active session' };
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });

      const result = await response.json();
      
      if (result.success) {
        setResendCooldown(60); // Reset cooldown
        toast({
          title: "OTP Resent",
          description: result.message,
        });
        return { success: true, message: result.message };
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const verifyOTPAndSignup = async (data: SignupFormData) => {
    if (!sessionToken) return { success: false, message: 'No active session' };

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken,
          otp: data.otp,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const handleNext = async () => {
    // Get all form values
    const formData = form.getValues();
    
    // Validate all required fields
    if (!formData.name || formData.name.length < 2) {
      form.setError('name', { message: 'Please enter your full name' });
      return;
    }
    
    if (!formData.aadhar || formData.aadhar.length !== 12) {
      form.setError('aadhar', { message: 'Please enter a valid 12-digit Aadhar number' });
      return;
    }
    
    if (!formData.password || formData.password.length < 8) {
      form.setError('password', { message: 'Password must be at least 8 characters' });
      return;
    }
    
    if (!formData.state || !formData.district) {
      form.setError('state', { message: 'Please select your location' });
      return;
    }

    setOtpLoading(true);
    await createUserAndSendOTP(formData);
    setOtpLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setOtpLoading(true);
    await resendOTP();
    setOtpLoading(false);
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const result = await verifyOTPAndSignup(data);
      
      if (result.success) {
        // Handle successful signup
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
        console.log('Signup successful:', result.user);
        // Redirect to dashboard
        router.replace('/dashboard');
      } else {
        // Handle signup error
        toast({
          title: "Signup Failed",
          description: result.message,
          variant: "destructive",
        });
        console.error('Signup failed:', result.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-800">
            {currentStep === 'form' ? 'Join BeejSeBazaar' : 'Verify Your Account'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'form' 
              ? 'Create your account to access farmer\'s dashboard'
              : 'Enter the OTP sent to your phone to complete registration'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 'form' && (
                <>
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Enter your full name"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Aadhar Field */}
                  <FormField
                    control={form.control}
                    name="aadhar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Enter your 12-digit Aadhar number"
                              className="pl-10"
                              type="text"
                              maxLength={12}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

              {/* Location Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={locationType === 'manual' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLocationTypeChange('manual')}
                    className="flex-1"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Manual Selection
                  </Button>
                  <Button
                    type="button"
                    variant={locationType === 'current' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLocationTypeChange('current')}
                    className="flex-1"
                    disabled={isGettingLocation}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {isGettingLocation ? 'Detecting...' : 'Current Location'}
                  </Button>
                </div>
              </div>

              {/* State and District Selection - Inline for Manual */}
              {locationType === 'manual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* State Selection */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={handleStateChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* District Selection */}
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>District</FormLabel>
                          {!selectedState && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Please select a state first</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!selectedState}
                        >
                          <FormControl>
                            <SelectTrigger className={!selectedState ? 'opacity-50 cursor-not-allowed' : ''}>
                              <SelectValue placeholder={selectedState ? "Select your district" : "Select state first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {punjabDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Current Location Display */}
              {locationType === 'current' && !isGettingLocation && !isNonPunjabLocation && (form.watch('state') || form.watch('district')) && (
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Detected Location:</strong> {form.watch('district')}, {states.find(s => s.value === form.watch('state'))?.label}
                  </p>
                </div>
              )}

              {/* Non-Punjab Location Message */}
              {locationType === 'current' && isNonPunjabLocation && !isGettingLocation && (
                <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Service Not Available in Your State
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Sorry, we will be coming soon in your state. For now, BeejSeBazaar is only running in Punjab.
                      </p>
                      <p className="text-sm text-amber-600 mt-2">
                        Please switch to manual selection to continue with Punjab.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Create a strong password"
                          className="pl-10 pr-10"
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Captcha - Optional for demo */}
              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="text-sm text-gray-500">
                        <p>🔒 Security verification (optional for demo)</p>
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                  {/* Next Button for Form Step */}
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={otpLoading || !form.watch('name') || !form.watch('aadhar') || !form.watch('password') || !form.watch('state') || !form.watch('district')}
                  >
                    {otpLoading ? 'Creating Account...' : 'Next'}
                  </Button>
                </>
              )}

              {currentStep === 'otp' && (
                <>
                  {/* OTP Field */}
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <div className="relative w-full">
                              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                placeholder="Enter 6-digit OTP"
                                className="pl-10"
                                type="text"
                                maxLength={6}
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={handleResendOTP}
                              disabled={otpLoading || resendCooldown > 0}
                            >
                              {otpLoading ? 'Sending...' : 
                               resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        {sentToPhone && (
                          <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm text-blue-700">
                              <strong>OTP sent to:</strong> {sentToPhone}
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                              <strong>Demo OTP:</strong> 123456
                            </p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Verify Button for OTP Step */}
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Complete'}
                  </Button>
                </>
              )}

              {/* Login Link */}
              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                  Sign In
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}
