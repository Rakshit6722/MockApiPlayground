"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Shield, Copy, AlertTriangle, CheckCircle2, Zap, Globe,
    Code, Key, Users, LogIn, UserPlus, User, FileJson, Terminal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import ProtectedRoute from '@/app/_components/_common/ProtectedRoute';
import { getMockAuthRoute } from '@/app/_services/mock-auth';

interface Field {
    name: string;
    type: string;
    required: boolean;
}

interface MockAuth {
    _id: string;
    userId: string;
    endpoint: string;
    fields: Field[];
    createdAt: string;
    updatedAt: string;
}

type AuthTabType = 'overview' | 'signup' | 'login' | 'profile' | 'test';

export default function AuthDetailPage({ params }: { params: { endpointId: string } }) {
    const router = useRouter();
    const [authFlow, setAuthFlow] = useState<MockAuth | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<string | null>(null);
    const [testing, setTesting] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [activeTab, setActiveTab] = useState<AuthTabType>('overview');
    const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);
    const [testResponse, setTestResponse] = useState<any>(null);
    const [testPayload, setTestPayload] = useState<Record<string, any>>({});
    const [testError, setTestError] = useState<string | null>(null);

    const username = useSelector((state: RootState) => state.user.userInfo?.username) || 'defaultUser';

    useEffect(() => {
        fetchAuthFlowDetails();
    }, [params.endpointId]);

    useEffect(() => {
        // Reset test payload when changing endpoints
        if (authFlow && authFlow.fields) {
            const initialPayload: Record<string, any> = {};
            authFlow.fields.forEach(field => {
                if (field.name === 'email') initialPayload.email = 'user@example.com';
                else if (field.name === 'password') initialPayload.password = 'password123';
                else if (field.type === 'string') initialPayload[field.name] = '';
                else if (field.type === 'number') initialPayload[field.name] = 0;
                else if (field.type === 'boolean') initialPayload[field.name] = false;
            });
            setTestPayload(initialPayload);
        }
    }, [authFlow, testingEndpoint]);

    const fetchAuthFlowDetails = async () => {
        try {
            setLoading(true);
            const response = await getMockAuthRoute(params.endpointId);
            if (response.status !== 200) {
                throw new Error('Failed to fetch auth flow details');
            }
            setAuthFlow(response.data.data);
        } catch (error) {
            console.error('Error fetching auth flow:', error);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const getEndpointUrls = () => {
        if (!authFlow) return { base: '', signup: '', login: '', profile: '' };
        
        // Extract the endpoint name from the stored endpoint
        const parts = authFlow.endpoint.split('/');
        const endpointName = parts[parts.length - 1];
        
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        
        // We'll store the user ID from the mock signup/login response
        const mockUserId = localStorage.getItem('mockUserId') || '[user-id]';
        
        return {
            base: `/api/mock-auth/${endpointName}`,
            signup: `${baseUrl}/api/mock-auth/${endpointName}/signup/${username}`,
            login: `${baseUrl}/api/mock-auth/${endpointName}/login/${username}`,
            profile: `${baseUrl}/api/mock-auth/${mockUserId}` // Different URL structure for profile
        };
    };

    const handlePayloadChange = (field: string, value: any) => {
        setTestPayload(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const testEndpoint = async (endpoint: string, method: string) => {
        setTestingEndpoint(endpoint);
        setTesting(true);
        setTestError(null);
        
        try {
            const baseUrl = window.location.origin;
            const url = `${baseUrl}${endpoint}/${username}`;
            
            let response;
            
            if (method === 'GET') {
                // For GET requests (profile endpoint), include auth token in header
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('mockAuthToken') || ''}`
                    }
                });
            } else {
                // For POST requests (signup/login)
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(testPayload)
                });
            }
            
            const data = await response.json();
            
            // If this was a login or signup request and it succeeded, save the token and userId
            if ((endpoint.includes('/login') || endpoint.includes('/signup')) && data.token) {
                localStorage.setItem('mockAuthToken', data.token);
                
                // Store the user ID if it's provided in the response
                if (data.user && data.user._id) {
                    localStorage.setItem('mockUserId', data.user._id);
                } else if (data.userId) {
                    localStorage.setItem('mockUserId', data.userId);
                }
                
                // Update profile endpoint with the new user ID
                const updatedEndpoints = getEndpointUrls();
                setTestingEndpoint(updatedEndpoints.profile);
            }
            
            setTestResponse(data);
            setActiveTab('test');
        } catch (err: any) {
            console.error('Error testing endpoint:', err);
            setTestError(err.message || 'Failed to test endpoint');
        } finally {
            setTesting(false);
        }
    };

    const formatJSON = (json: any) => {
        return JSON.stringify(json, null, 2);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 animate-pulse">Loading auth flow details...</p>
                </div>
            </div>
        );
    }

    if (notFound || !authFlow) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                    <div className="max-w-lg text-center p-8 bg-gray-900 border border-gray-800 rounded-lg">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-amber-400" />
                        <h2 className="text-xl font-medium text-gray-200 mb-2">Auth Flow Not Found</h2>
                        <p className="text-gray-400 mb-6">
                            The authentication flow you're looking for doesn't exist or you may not have permission to view it.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const endpoints = getEndpointUrls();

    // Extract the flow name from the endpoint
    const flowNameParts = authFlow.endpoint.split('/');
    const flowName = flowNameParts[flowNameParts.length - 1];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200">
                {/* Background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-emerald-900/5 rounded-full blur-[100px]"></div>
                    <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-[0.02]"></div>
                </div>

                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 relative z-10">
                    {/* Header Section */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Dashboard</span>
                        </button>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="text-xs font-medium text-indigo-400 mb-1 flex items-center gap-1.5">
                                    <Shield size={12} />
                                    <span>AUTH FLOW</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {flowName}
                                </h1>
                                <p className="text-gray-400 mt-1">
                                    Created {authFlow.createdAt ? new Date(authFlow.createdAt).toLocaleDateString() : 'recently'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setTestingEndpoint(endpoints.signup);
                                        setActiveTab('signup');
                                    }}
                                    className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-md transition-colors flex items-center gap-2 text-sm shadow-lg shadow-indigo-900/20"
                                >
                                    <Zap size={16} />
                                    <span>Test Endpoints</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main URL Display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8 p-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-xl overflow-hidden"
                    >
                        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden">
                            <div className="py-3 px-5 bg-gray-800/50 border-b border-gray-700/50 flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                </div>
                                <div className="flex-1 text-center text-sm text-gray-400">Base Authentication Endpoint</div>
                            </div>

                            <div className="flex items-stretch">
                                <div className="flex-1 font-mono text-sm text-indigo-400 p-5 flex items-center overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-gray-700">
                                    <span className="px-2 py-0.5 mr-3 rounded text-xs font-medium border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                                        AUTH
                                    </span>
                                    <span>{window.location.origin}/api/mock-auth</span>
                                </div>
                                <div className="flex items-center px-3 border-l border-gray-800">
                                    <button
                                        onClick={() => copyToClipboard(endpoints.base, 'baseUrl')}
                                        className="p-2 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                    >
                                        {copied === 'baseUrl' ? (
                                            <CheckCircle2 size={18} className="text-emerald-400" />
                                        ) : (
                                            <Copy size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs Navigation */}
                    <div className="mb-6 flex border-b border-gray-800 overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'overview' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <Shield size={16} />
                            Overview
                            {activeTab === 'overview' && (
                                <motion.div
                                    layoutId="activeAuthTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'signup' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <UserPlus size={16} />
                            Signup
                            {activeTab === 'signup' && (
                                <motion.div
                                    layoutId="activeAuthTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'login' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <LogIn size={16} />
                            Login
                            {activeTab === 'login' && (
                                <motion.div
                                    layoutId="activeAuthTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'profile' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <User size={16} />
                            Profile
                            {activeTab === 'profile' && (
                                <motion.div
                                    layoutId="activeAuthTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                />
                            )}
                        </button>
                        {testResponse && (
                            <button
                                onClick={() => setActiveTab('test')}
                                className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'test' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <FileJson size={16} />
                                Test Result
                                {activeTab === 'test' && (
                                    <motion.div
                                        layoutId="activeAuthTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                    />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-4">Authentication Flow Overview</h2>
                                    <p className="text-gray-300 mb-4">
                                        This authentication flow provides endpoints for user signup, login, and profile retrieval.
                                        All endpoints share the same user model and JWT-based authentication system.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-green-900/30 rounded-lg">
                                                    <UserPlus size={20} className="text-green-400" />
                                                </div>
                                                <h3 className="font-medium text-white">Signup</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-2">
                                                Register new users with required fields and receive a JWT token.
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="px-1.5 py-0.5 bg-green-900/20 text-green-400 rounded mr-2">POST</span>
                                                <span className="font-mono">/signup</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-blue-900/30 rounded-lg">
                                                    <LogIn size={20} className="text-blue-400" />
                                                </div>
                                                <h3 className="font-medium text-white">Login</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-2">
                                                Authenticate users with email and password to receive a JWT token.
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="px-1.5 py-0.5 bg-green-900/20 text-green-400 rounded mr-2">POST</span>
                                                <span className="font-mono">/login</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-purple-900/30 rounded-lg">
                                                    <User size={20} className="text-purple-400" />
                                                </div>
                                                <h3 className="font-medium text-white">Profile</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-2">
                                                Retrieve authenticated user's profile data using JWT.
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="px-1.5 py-0.5 bg-purple-900/20 text-purple-400 rounded mr-2">GET</span>
                                                <span className="font-mono">/profile</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Schema */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                                        <Users size={18} />
                                        User Schema
                                    </h3>

                                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-700">
                                                <thead className="bg-gray-800/50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                            Field
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                            Required
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                                                    {authFlow.fields.map((field) => (
                                                        <tr key={field.name} className="hover:bg-gray-800/50">
                                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-white">
                                                                {field.name}
                                                            </td>
                                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-400 font-mono">
                                                                {field.type}
                                                            </td>
                                                            <td className="px-6 py-3 whitespace-nowrap text-sm">
                                                                {field.required ? (
                                                                    <span className="px-2 py-1 bg-indigo-900/30 text-indigo-400 rounded-full text-xs">
                                                                        Required
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                                                                        Optional
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Auth Flow Usage */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                                        <Key size={18} />
                                        Authentication Flow
                                    </h3>

                                    <ol className="space-y-4 mb-6">
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center text-sm font-medium">
                                                1
                                            </div>
                                            <div className="text-gray-300">
                                                <strong>Register a user</strong> by making a POST request to the signup endpoint with all required fields.
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center text-sm font-medium">
                                                2
                                            </div>
                                            <div className="text-gray-300">
                                                <strong>Authenticate the user</strong> by making a POST request to the login endpoint with email and password.
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center text-sm font-medium">
                                                3
                                            </div>
                                            <div className="text-gray-300">
                                                <strong>Store the JWT token and user ID</strong> received from signup or login response.
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center text-sm font-medium">
                                                4
                                            </div>
                                            <div className="text-gray-300">
                                                <strong>Access the user profile</strong> by making a GET request to <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">/api/mock-auth/[userId]</code> 
                                                with the token in the Authorization header.
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </motion.div>
                        )}

                        {/* Signup Tab */}
                        {activeTab === 'signup' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-green-900/30 rounded-lg">
                                        <UserPlus size={20} className="text-green-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Signup Endpoint</h2>
                                </div>

                                <div className="flex items-center mb-6 text-sm">
                                    <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded-md mr-3 font-medium">POST</span>
                                    <span className="font-mono text-gray-300">{endpoints.signup}</span>
                                    <button
                                        onClick={() => copyToClipboard(endpoints.signup, 'signupUrl')}
                                        className="ml-2 p-1.5 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                    >
                                        {copied === 'signupUrl' ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Test Form */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white mb-2">Test Signup</h3>

                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
                                            {authFlow.fields.map((field) => (
                                                <div key={field.name} className="space-y-1">
                                                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-300">
                                                        {field.name}
                                                        {field.required && <span className="text-red-400 ml-1">*</span>}
                                                    </label>
                                                    {field.type === 'boolean' ? (
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={field.name}
                                                                checked={!!testPayload[field.name]}
                                                                onChange={e => handlePayloadChange(field.name, e.target.checked)}
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded"
                                                            />
                                                            <label htmlFor={field.name} className="ml-2 block text-sm text-gray-400">
                                                                {field.name === 'isAdmin' ? 'Is Administrator' : field.name}
                                                            </label>
                                                        </div>
                                                    ) : field.type === 'number' ? (
                                                        <input
                                                            type="number"
                                                            id={field.name}
                                                            value={testPayload[field.name] || 0}
                                                            onChange={e => handlePayloadChange(field.name, Number(e.target.value))}
                                                            className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                    ) : (
                                                        <input
                                                            type={field.name === 'password' ? 'password' : field.name === 'email' ? 'email' : 'text'}
                                                            id={field.name}
                                                            value={testPayload[field.name] || ''}
                                                            onChange={e => handlePayloadChange(field.name, e.target.value)}
                                                            className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            placeholder={field.name === 'email' ? 'user@example.com' : ''}
                                                        />
                                                    )}
                                                </div>
                                            ))}

                                            {testError && (
                                                <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-md text-sm text-red-400">
                                                    {testError}
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                <button
                                                    onClick={() => testEndpoint(endpoints.base + '/signup', 'POST')}
                                                    disabled={testing}
                                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {testing && testingEndpoint === endpoints.signup ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                            Testing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Zap size={16} className="mr-2" />
                                                            Test Signup
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Code Examples */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                                            <Code size={18} />
                                            Code Example
                                        </h3>

                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                                <div className="text-sm font-medium text-gray-300">JavaScript</div>
                                                <button
                                                    onClick={() => copyToClipboard(`
fetch('${endpoints.signup}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${formatJSON(testPayload)})
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // Store the token
  localStorage.setItem('authToken', data.token);
})
.catch(error => {
  console.error('Error:', error);
});`, 'signupCode')}
                                                    className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                                >
                                                    {copied === 'signupCode' ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <Copy size={16} />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="p-4 font-mono text-sm bg-gray-900 text-gray-300 overflow-x-auto">
                                                <pre className="text-xs">
                                                    {`fetch('${endpoints.signup}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${formatJSON(testPayload)})
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // Store the token
  localStorage.setItem('authToken', data.token);
})
.catch(error => {
  console.error('Error:', error);
});`}
                                                </pre>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-900/20 border border-indigo-900/30 rounded-lg p-4 text-sm text-indigo-300">
                                            <h4 className="font-medium mb-2 flex items-center gap-1.5">
                                                <Terminal size={14} />
                                                Response Format
                                            </h4>
                                            <p className="mb-2">Upon successful signup, you'll receive:</p>
                                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                                <li>A success message</li>
                                                <li>The created user object</li>
                                                <li>A JWT token for authentication</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Login Tab */}
                        {activeTab === 'login' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-blue-900/30 rounded-lg">
                                        <LogIn size={20} className="text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Login Endpoint</h2>
                                </div>

                                <div className="flex items-center mb-6 text-sm">
                                    <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded-md mr-3 font-medium">POST</span>
                                    <span className="font-mono text-gray-300">{endpoints.login}</span>
                                    <button
                                        onClick={() => copyToClipboard(endpoints.login, 'loginUrl')}
                                        className="ml-2 p-1.5 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                    >
                                        {copied === 'loginUrl' ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Test Form */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white mb-2">Test Login</h3>

                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
                                            <div className="space-y-1">
                                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-300">
                                                    Email <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="login-email"
                                                    value={testPayload.email || ''}
                                                    onChange={e => handlePayloadChange('email', e.target.value)}
                                                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="user@example.com"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-300">
                                                    Password <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="login-password"
                                                    value={testPayload.password || ''}
                                                    onChange={e => handlePayloadChange('password', e.target.value)}
                                                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>

                                            {testError && (
                                                <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-md text-sm text-red-400">
                                                    {testError}
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                <button
                                                    onClick={() => testEndpoint(endpoints.base + '/login', 'POST')}
                                                    disabled={testing}
                                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {testing && testingEndpoint === endpoints.login ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                            Testing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Zap size={16} className="mr-2" />
                                                            Test Login
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Code Examples */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                                            <Code size={18} />
                                            Code Example
                                        </h3>

                                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                                <div className="text-sm font-medium text-gray-300">JavaScript</div>
                                                <button
                                                    onClick={() => copyToClipboard(`
fetch('${endpoints.login}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: '${testPayload.email || 'user@example.com'}',
    password: '${testPayload.password || 'password123'}'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // Store the token
  localStorage.setItem('authToken', data.token);
})
.catch(error => {
  console.error('Error:', error);
});`, 'loginCode')}
                                                    className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                                >
                                                    {copied === 'loginCode' ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <Copy size={16} />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="p-4 font-mono text-sm bg-gray-900 text-gray-300 overflow-x-auto">
                                                <pre className="text-xs">
                                                    {`fetch('${endpoints.login}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: '${testPayload.email || 'user@example.com'}',
    password: '${testPayload.password || 'password123'}'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // Store the token
  localStorage.setItem('authToken', data.token);
})
.catch(error => {
  console.error('Error:', error);
});`}
                                                </pre>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-900/20 border border-indigo-900/30 rounded-lg p-4 text-sm text-indigo-300">
                                            <h4 className="font-medium mb-2 flex items-center gap-1.5">
                                                <Terminal size={14} />
                                                Response Format
                                            </h4>
                                            <p className="mb-2">Upon successful login, you'll receive:</p>
                                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                                <li>A success message</li>
                                                <li>The user object</li>
                                                <li>A JWT token for authentication</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-2 bg-purple-900/30 rounded-lg">
                                        <User size={20} className="text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Profile Endpoint</h2>
                                </div>
                                
                                <div className="flex items-center mb-6 text-sm">
                                    <span className="px-2 py-1 bg-purple-900/20 text-purple-400 rounded-md mr-3 font-medium">GET</span>
                                    <span className="font-mono text-gray-300">{endpoints.profile}</span>
                                    <button
                                        onClick={() => copyToClipboard(endpoints.profile, 'profileUrl')}
                                        className="ml-2 p-1.5 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                    >
                                        {copied === 'profileUrl' ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                </div>
                                
                                <div className="bg-amber-900/20 border border-amber-900/30 rounded-lg p-4 text-sm text-amber-300 mb-6">
                                  <h4 className="font-medium mb-2 flex items-center gap-1.5">
                                    <AlertTriangle size={14} />
                                    Important Note
                                  </h4>
                                  <p>
                                    The profile endpoint uses the <strong>mock user ID</strong> returned from signup or login, 
                                    not your username. Make sure to sign up or log in first to get a valid user ID.
                                  </p>
                                </div>
                                
                                {/* Code Example */}
                                <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                    <div className="text-sm font-medium text-gray-300">JavaScript</div>
                                    <button
                                      onClick={() => copyToClipboard(`
// Get the token and user ID from storage
const token = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');

fetch('${window.location.origin}/api/mock-auth/' + userId, {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
})
.then(response => response.json())
.then(data => {
  console.log('User profile:', data);
})
.catch(error => {
  console.error('Error:', error);
});`, 'profileCode')}
                                      className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                    >
                                      {copied === 'profileCode' ? (
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                      ) : (
                                        <Copy size={16} />
                                      )}
                                    </button>
                                  </div>

                                  <div className="p-4 font-mono text-sm bg-gray-900 text-gray-300 overflow-x-auto">
                                    <pre className="text-xs">
{`// Get the token and user ID from storage
const token = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');

fetch('${window.location.origin}/api/mock-auth/' + userId, {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
})
.then(response => response.json())
.then(data => {
  console.log('User profile:', data);
})
.catch(error => {
  console.error('Error:', error);
});`}
                                    </pre>
                                  </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Test Results Tab */}
                        {activeTab === 'test' && testResponse && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-900/30 rounded-lg">
                                        <FileJson size={20} className="text-indigo-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Test Results</h2>
                                </div>

                                <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                        <div className="text-sm font-medium text-gray-300">Response</div>
                                        <button
                                            onClick={() => copyToClipboard(JSON.stringify(testResponse, null, 2), 'testResponse')}
                                            className="p-1.5 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                        >
                                            {copied === 'testResponse' ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : (
                                                <Copy size={16} />
                                            )}
                                        </button>
                                    </div>

                                    <div className="p-4 font-mono text-sm bg-gray-900 text-green-400 overflow-x-auto max-h-96">
                                        <pre className="text-xs">
                                            {JSON.stringify(testResponse, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {testResponse.token && (
                                    <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-4">
                                        <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                                            <CheckCircle2 size={18} />
                                            Authentication Successful
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            JWT token has been received and stored for testing the profile endpoint.
                                        </p>
                                    </div>
                                )}

                                {testResponse.success === false && (
                                    <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4">
                                        <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                                            <AlertTriangle size={18} />
                                            Request Failed
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            {testResponse.message || 'The request was not successful. Please check your inputs and try again.'}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
