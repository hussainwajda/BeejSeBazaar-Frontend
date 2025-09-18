'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Validation schema
const loginSchema = z.object({
  aadhar: z.string()
    .min(12, 'Aadhar number must be 12 digits')
    .max(12, 'Aadhar number must be 12 digits')
    .regex(/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number'),
  password: z.string().optional(),
  otp: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [sentToPhone, setSentToPhone] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      aadhar: '',
      password: '',
      otp: '',
    }
  });

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // API functions
  const sendOTP = async (aadharNo: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadharNo }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSessionToken(result.sessionToken);
        setOtpSent(true);
        setResendCooldown(60);
        setSentToPhone(result.phone || 'your registered phone');
        toast({
          title: "OTP Sent",
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

  const verifyOTP = async (otp: string) => {
    if (!sessionToken) return { success: false, message: 'No active session' };

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken, otp }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const loginWithPassword = async (aadharNo: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadharNo, password }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const handleSendOTP = async () => {
    const aadharNo = form.getValues('aadhar');
    if (!aadharNo || aadharNo.length !== 12) {
      form.setError('aadhar', { message: 'Please enter a valid 12-digit Aadhar number' });
      return;
    }

    setIsLoading(true);
    await sendOTP(aadharNo);
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    const aadharNo = form.getValues('aadhar');
    await sendOTP(aadharNo);
    setIsLoading(false);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      if (loginMethod === 'otp') {
        if (!otpSent) {
          // Send OTP first
          await handleSendOTP();
        } else {
          // Verify OTP
          const result = await verifyOTP(data.otp || '');
          
          if (result.success) {
            toast({
              title: "Login Successful",
              description: "Welcome back to BeejSeBazaar!",
            });
            console.log('Login successful:', result.user);
            router.replace('/dashboard');
          } else {
            toast({
              title: "Login Failed",
              description: result.message,
              variant: "destructive",
            });
          }
        }
      } else {
        // Password login
        if (!data.password) {
          form.setError('password', { message: 'Password is required' });
          return;
        }

        const result = await loginWithPassword(data.aadhar, data.password);
        
        if (result.success) {
          toast({
            title: "Login Successful",
            description: "Welcome back to BeejSeBazaar!",
          });
          console.log('Login successful:', result.user);
          router.replace('/dashboard');
        } else {
          toast({
            title: "Login Failed",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Link 
              href="/" 
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your BeejSeBazaar account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              {/* Login Method Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose Login Method</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={loginMethod === 'password' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setLoginMethod('password');
                      setOtpSent(false);
                      form.setValue('otp', '');
                    }}
                    className="flex-1"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === 'otp' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setLoginMethod('otp');
                      setOtpSent(false);
                      form.setValue('password', '');
                    }}
                    className="flex-1"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    OTP
                  </Button>
                </div>
              </div>

              {/* Password Field - Only show for password method */}
              {loginMethod === 'password' && (
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
                          placeholder="Enter your password"
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
              )}

              {/* OTP Field - Only show for OTP method */}
              {loginMethod === 'otp' && (
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
                              placeholder={otpSent ? "Enter 6-digit OTP" : "Click Send OTP first"}
                              className="pl-10"
                              type="text"
                              maxLength={6}
                              disabled={!otpSent}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={otpSent ? handleResendOTP : handleSendOTP}
                            disabled={isLoading || (otpSent && resendCooldown > 0)}
                          >
                            {isLoading ? 'Sending...' : 
                             otpSent ? (resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP') : 
                             'Send OTP'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {otpSent && sentToPhone && (
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
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 
                 loginMethod === 'otp' && !otpSent ? 'Send OTP' : 
                 loginMethod === 'otp' ? 'Verify OTP' : 'Sign In'}
              </Button>

              {/* Signup Link */}
              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                  Create Account
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
