"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Call your login API here
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      console.log('Login successful', result);
      
      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('username', result.username);
      
      router.push('/dashboard');


    } catch (error) {
      console.error('Login error:', error);
      // You can set an error state here to display to the user
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      {/* Background blur elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>
      
      <motion.div 
        className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 text-2xl font-bold">
            MockAPI
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-neutral-400">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`w-full px-4 py-3 bg-neutral-800 border ${errors.email ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-3 bg-neutral-800 border ${errors.password ? 'border-red-500' : 'border-neutral-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : (
              <>
                Sign in <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-neutral-400 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
