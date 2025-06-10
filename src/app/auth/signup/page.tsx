"use client";
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { registerUser } from '@/app/_services/authApi';
import { useRouter } from 'next/navigation';
import AuthRoute from '@/app/_components/_common/AuthRoute';
import { toast } from 'react-toastify';

const signupSchema = z.object({
    username: z.string().min(5, 'Username must be at least 5 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        try {
            const response = await registerUser(data);
            if (response?.status !== 201) {
                throw new Error(response?.data?.message || "Signup failed");
            }
            toast.success("Account created successfully! Please sign in.");
            router.push('/auth/login');
        } catch (error: any) {
            toast.error(error?.message || "An error occurred during signup. Please try again later.");
        } finally {
            setIsLoading(false);
            reset();
        }
    };

    return (
        <AuthRoute>
            <div className="min-h-screen bg-gray-950 flex flex-col">
                {/* Simple header with logo */}
                <header className="border-b border-gray-800 py-4">
                    <div className="container mx-auto px-4 sm:px-6">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/favicon.ico" alt="MockFlow" className="w-6 h-6" />
                            <span className="font-semibold text-white">MockFlow</span>
                        </Link>
                    </div>
                </header>

                {/* Signup content */}
                <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-sm space-y-8">
                        <div>
                            <h2 className="text-center text-2xl font-bold tracking-tight text-white">
                                Create your account
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-400">
                                Sign up to start building your mock APIs
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-6 rounded-md">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                        Username
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="username"
                                            type="text"
                                            autoComplete="username"
                                            {...register('username')}
                                            className={`block w-full appearance-none rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-700'} bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                                            placeholder="johndoe"
                                            disabled={isLoading}
                                        />
                                        {errors.username && (
                                            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            {...register('email')}
                                            className={`block w-full appearance-none rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-700'} bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                                            placeholder="you@example.com"
                                            disabled={isLoading}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        Password
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            {...register('password')}
                                            className={`block w-full appearance-none rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-700'} bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:hover:bg-blue-600"
                                >
                                    {isLoading ? 'Creating account...' : (
                                        <>Create account <ArrowRight size={16} /></>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthRoute>
    );
}
