'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle, Loader } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Password reset request failed:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to send password reset email. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      {/* Decorative gradient backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full opacity-5 blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full opacity-5 blur-3xl transform -translate-x-1/3 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md">
        <motion.div 
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/auth/login" 
              className="text-gray-400 hover:text-gray-300 flex items-center gap-1 text-sm mb-6"
            >
              <ArrowLeft size={14} />
              <span>Back to login</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/20 border border-green-900/30 text-green-300 px-4 py-3 rounded-md flex items-start gap-3"
            >
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Reset email sent</h3>
                <p className="text-sm text-green-300/80">
                  We've sent a password reset link to <span className="font-mono">{email}</span>. 
                  Please check your inbox and follow the instructions.
                </p>
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="mt-3 text-sm text-green-400 hover:text-green-300 font-medium"
                >
                  Return to login
                </button>
              </div>
            </motion.div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <motion.div 
                  className="mb-4 bg-rose-900/20 border border-rose-800/30 text-rose-300 px-3 py-2 rounded-md text-sm flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </motion.div>
              )}
              
              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                  isLoading
                    ? 'bg-blue-800/50 cursor-not-allowed text-blue-200/50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}