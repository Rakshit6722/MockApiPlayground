'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Loader, Lock } from 'lucide-react';
import { resetPassword, verifyResetToken } from '@/app/_services/authApi';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get token and email from URL
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    if (!urlToken || !urlEmail) {
      setIsTokenValid(false);
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    setToken(urlToken);
    setEmail(urlEmail);

    const verifyToken = async () => {
      try {
        const response = await verifyResetToken(urlToken, urlEmail);
        if (response.status !== 200) {
          throw new Error('Invalid token');
        }
      } catch (err) {
        setIsTokenValid(false);
        setError('This password reset link has expired or is invalid. Please request a new one.');
      }
    };

    verifyToken();
  }, [searchParams]);

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(token, email, password);

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err: any) {
      toast.error('Password reset failed:', err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to reset password. Please try again or request a new reset link.');
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
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400 text-sm">
              {isTokenValid
                ? `Enter a new password for ${email}`
                : 'There was an issue with your reset link'}
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
                <h3 className="font-medium mb-1">Password reset successful!</h3>
                <p className="text-sm text-green-300/80">
                  Your password has been updated. You will be redirected to the login page.
                </p>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="mt-3 text-sm text-green-400 hover:text-green-300 font-medium"
                >
                  Go to login
                </button>
              </div>
            </motion.div>
          ) : !isTokenValid ? (
            // Invalid token state
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-900/20 border border-rose-800/30 text-rose-300 px-4 py-3 rounded-md flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Invalid reset link</h3>
                <p className="text-sm text-rose-300/80">
                  {error}
                </p>
                <Link
                  href="/auth/forgot-password"
                  className="mt-3 text-sm text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                >
                  <span>Request a new reset link</span>
                </Link>
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

              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${isLoading
                  ? 'bg-blue-800/50 cursor-not-allowed text-blue-200/50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}