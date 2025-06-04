"use client";
import { getMockRoute } from '@/app/_services/mockApi';
import React, { use, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Server, Code, Play, Copy, ExternalLink, Database,
    List, AlertTriangle, Filter, Clock, HelpCircle, Terminal,
    Info, CheckCircle2, Zap, Globe, ChevronRight, Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type PageProps = {
    params: {
        routeName: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

// Updated RouteDetails to match simplified Mock model
type RouteDetails = {
    route: string;
    method: string;
    status: number;
    response: any;
    isArray: boolean;
    keyField: string;
    createdAt?: string;
};

function Page({ params, searchParams }: PageProps) {
    const router = useRouter();
    const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<string | null>(null);
    const [testResponse, setTestResponse] = useState<any>(null);
    const [testing, setTesting] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [visibleSection, setVisibleSection] = useState<string | null>(null);

    const unwrappedSearchParmas: {
        id?: string;
    } = use(searchParams as any)
    const id = unwrappedSearchParmas.id

    useEffect(() => {
        findMockDetails();
    }, [id]);

    const findMockDetails = async () => {
        if (id) {
            try {
                setLoading(true);
                const data = await getMockRoute(id);
                console.log("Got mock data:", data);
                if (data) {
                    setRouteDetails(data);
                } else {
                    setNotFound(true);
                }
            } catch (err: any) {
                console.error('Error fetching mock details:', err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        } else {
            setNotFound(true);
            setLoading(false);
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        if (status >= 300 && status < 400) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        if (status >= 400 && status < 500) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        if (status >= 500) return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const testEndpoint = async () => {
        if (!routeDetails) return;

        setTesting(true);
        try {
            const baseUrl = window.location.origin;
            const url = `${baseUrl}/api/mocks/${localStorage.getItem('username')}/${routeDetails.route}`;

            const response = await fetch(url);
            const data = await response.json();
            setTestResponse(data);
            setActiveTab('test');
        } catch (err) {
            console.error('Error testing endpoint:', err);
        } finally {
            setTesting(false);
        }
    };

    // Format JSON for display
    const formatJson = (data: any) => {
        return JSON.stringify(data, null, 2);
    };

    const toggleSection = (section: string) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 animate-pulse">Loading endpoint details...</p>
                </div>
            </div>
        );
    }

    if (notFound || !routeDetails) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="max-w-lg text-center p-8 bg-gray-900 border border-gray-800 rounded-lg">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-amber-400" />
                    <h2 className="text-xl font-medium text-gray-200 mb-2">Endpoint Not Found</h2>
                    <p className="text-gray-400 mb-6">
                        The endpoint you're looking for doesn't exist or you may not have permission to view it.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Build the full API URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const username = localStorage.getItem('username') || '';
    const fullApiUrl = `${baseUrl}/api/mocks/${username}/${routeDetails.route}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
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
                            <div className="text-xs font-medium text-blue-400 mb-1 flex items-center gap-1.5">
                                <Server size={12} />
                                <span>API ENDPOINT</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                /{routeDetails.route}
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Created {routeDetails.createdAt ? new Date(routeDetails.createdAt).toLocaleDateString() : 'recently'}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href={fullApiUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm shadow-lg shadow-black/10"
                            >
                                <Globe size={16} />
                                <span>Open API</span>
                            </a>
                            <button
                                onClick={testEndpoint}
                                disabled={testing}
                                className="px-4 py-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2 text-sm shadow-lg shadow-blue-900/20"
                            >
                                {testing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Testing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} />
                                        <span>Test Endpoint</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Main URL Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8 p-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-xl overflow-hidden"
                >
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden">
                        <div className="py-3 px-5 bg-gray-800/50 border-b border-gray-700/50 flex items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="flex-1 text-center text-sm text-gray-400">API Endpoint URL</div>
                        </div>

                        <div className="flex items-stretch">
                            <div className="flex-1 font-mono text-sm text-blue-400 p-5 flex items-center overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-gray-700">
                                <span className={`px-2 py-0.5 mr-3 rounded text-xs font-medium border ${routeDetails.method === 'GET'
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                    {routeDetails.method}
                                </span>
                                <span>{fullApiUrl}</span>
                            </div>
                            <div className="flex items-center px-3 border-l border-gray-800">
                                <button
                                    onClick={() => copyToClipboard(fullApiUrl, 'url')}
                                    className="p-2 text-gray-400 hover:text-gray-200 rounded-md transition-colors"
                                >
                                    {copied === 'url' ? (
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
                <div className="mb-6 flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'overview'
                                ? 'text-blue-400'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        Overview
                        {activeTab === 'overview' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('guide')}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'guide'
                                ? 'text-blue-400'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        Usage Guide
                        {activeTab === 'guide' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('response')}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'response'
                                ? 'text-blue-400'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        Response
                        {activeTab === 'response' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                            />
                        )}
                    </button>
                    {testResponse && (
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'test'
                                    ? 'text-blue-400'
                                    : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            Test Result
                            {activeTab === 'test' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Main Stats */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Status Code */}
                                        <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex flex-col">
                                            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                                                <Terminal size={12} />
                                                <span>STATUS CODE</span>
                                            </div>
                                            <div className="mt-auto">
                                                <div className={`inline-flex items-center px-2.5 py-1 rounded border ${getStatusColor(routeDetails.status)}`}>
                                                    <span className="text-lg font-mono font-semibold">{routeDetails.status}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {routeDetails.status >= 200 && routeDetails.status < 300 && 'Success response'}
                                                    {routeDetails.status >= 400 && routeDetails.status < 500 && 'Client error response'}
                                                    {routeDetails.status >= 500 && 'Server error response'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Response Type */}
                                        <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex flex-col">
                                            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                                                <Layers size={12} />
                                                <span>RESPONSE TYPE</span>
                                            </div>
                                            <div className="mt-auto">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${routeDetails.isArray
                                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                                    }`}>
                                                    {routeDetails.isArray ? <List size={16} /> : <Database size={16} />}
                                                    <span className="text-base font-medium">{routeDetails.isArray ? 'Array' : 'Object'}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {routeDetails.isArray
                                                        ? 'Returns multiple items in an array'
                                                        : 'Returns a single object'
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Key Field */}
                                        <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex flex-col">
                                            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                                                <Filter size={12} />
                                                <span>KEY FIELD</span>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="inline-flex items-center px-2.5 py-1 rounded border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                    <span className="text-base font-mono">{routeDetails.keyField || 'id'}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Used for filtering via query params
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Commands */}
                                    <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                                        <div className="p-5 border-b border-gray-800">
                                            <h3 className="text-base font-medium text-gray-200 flex items-center gap-2">
                                                <Terminal size={16} className="text-blue-400" />
                                                <span>Quick Commands</span>
                                            </h3>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-400 mb-1.5">cURL</div>
                                                <div className="group relative">
                                                    <div className="bg-gray-800/70 rounded-lg p-3 font-mono text-xs text-gray-300 overflow-x-auto">
                                                        <span className="text-blue-400">curl</span> -X {routeDetails.method} {fullApiUrl}
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(`curl -X ${routeDetails.method} ${fullApiUrl}`, 'curl')}
                                                        className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/80 text-gray-400 hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        {copied === 'curl' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs text-gray-400 mb-1.5">JavaScript Fetch</div>
                                                <div className="group relative">
                                                    <div className="bg-gray-800/70 rounded-lg p-3 font-mono text-xs text-gray-300 overflow-x-auto">
                                                        <span className="text-amber-400">fetch</span>(<span className="text-emerald-400">'{fullApiUrl}'</span>)<br />
                                                        {'  '}<span className="text-amber-400">.then</span>(response =&gt; response.<span className="text-amber-400">json</span>())<br />
                                                        {'  '}<span className="text-amber-400">.then</span>(data =&gt; <span className="text-amber-400">console</span>.<span className="text-blue-400">log</span>(data));
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(`fetch('${fullApiUrl}')\n  .then(response => response.json())\n  .then(data => console.log(data));`, 'fetch')}
                                                        className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/80 text-gray-400 hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        {copied === 'fetch' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Reference */}
                                <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-fit">
                                    <div className="p-5 border-b border-gray-800">
                                        <h3 className="text-base font-medium text-gray-200 flex items-center gap-2">
                                            <HelpCircle size={16} className="text-blue-400" />
                                            <span>Quick Reference</span>
                                        </h3>
                                    </div>

                                    <div className="divide-y divide-gray-800/60">
                                        {/* Filtering */}
                                        <div className="p-4 hover:bg-gray-800/30 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <Filter size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-200 mb-1">Filtering</h4>
                                                    <div className="text-xs text-gray-400 mb-2">Filter array results by key field</div>
                                                    <code className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-amber-400">
                                                        ?{routeDetails.keyField}=123
                                                    </code>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pagination */}
                                        <div className="p-4 hover:bg-gray-800/30 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    <List size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-200 mb-1">Pagination</h4>
                                                    <div className="text-xs text-gray-400 mb-2">Paginate array results</div>
                                                    <code className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-amber-400">
                                                        ?page=1&limit=10
                                                    </code>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Error Simulation */}
                                        <div className="p-4 hover:bg-gray-800/30 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-200 mb-1">Error Simulation</h4>
                                                    <div className="text-xs text-gray-400 mb-2">Force an error response</div>
                                                    <code className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-amber-400">
                                                        ?error=true
                                                    </code>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delay */}
                                        <div className="p-4 hover:bg-gray-800/30 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-200 mb-1">Response Delay</h4>
                                                    <div className="text-xs text-gray-400 mb-2">Add a custom delay</div>
                                                    <code className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-amber-400">
                                                        ?delay=2000
                                                    </code>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-500/5 border-t border-blue-500/10">
                                        <div className="flex items-start gap-2">
                                            <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-gray-300">
                                                All parameters can be combined using the <code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-amber-400">&</code> character.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Usage Guide Tab */}
                    {activeTab === 'guide' && (
                        <motion.div
                            key="guide"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
                        >
                            <div className="border-b border-gray-800 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5">
                                <div className="max-w-3xl mx-auto py-6 px-6 md:px-8">
                                    <h2 className="text-xl font-medium text-gray-100 mb-2">Endpoint Usage Guide</h2>
                                    <p className="text-gray-400">
                                        Learn how to use query parameters to customize your API responses.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
                                {/* Introduction */}
                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-400">
                                            <Info size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-gray-200 mb-1">API Parameters</h3>
                                            <p className="text-sm text-gray-300">
                                                This API endpoint supports various query parameters that you can use to customize
                                                the response. Parameters are added to the URL after a <code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-amber-400">?</code> character,
                                                and multiple parameters can be combined with <code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-amber-400">&</code>.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Parameter Sections */}
                                <div className="space-y-6">
                                    {/* Filtering */}
                                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('filtering')}
                                            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-800/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <Filter size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Filtering</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Filter array results by the key field
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className={`text-gray-400 transition-transform ${visibleSection === 'filtering' ? 'rotate-90' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {visibleSection === 'filtering' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-gray-800 space-y-4">
                                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Terminal size={14} className="text-gray-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Usage</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col">
                                                                    <code className="px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-sm mb-1">
                                                                        {fullApiUrl}?{routeDetails.keyField}=123
                                                                    </code>
                                                                </div>
                                                                <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-5">
                                                                    <li>When used with array responses, returns items where <code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-blue-400">{routeDetails.keyField}</code> matches the value</li>
                                                                    <li>If only one result is found, returns the object directly</li>
                                                                    <li>If no matches are found, returns an empty array</li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="bg-blue-500/5 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Code size={14} className="text-blue-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Example</h4>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <div className="text-xs text-gray-500 mb-1">Request:</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-xs">
                                                                        {fullApiUrl}?{routeDetails.keyField}=123
                                                                    </code>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-500 mb-1">Response:</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-green-400 font-mono text-xs">
                                                                        {`{\n  "${routeDetails.keyField}": "123",\n  ...\n}`}
                                                                    </code>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Pagination */}
                                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('pagination')}
                                            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-800/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    <List size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Pagination</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Limit and paginate array results
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className={`text-gray-400 transition-transform ${visibleSection === 'pagination' ? 'rotate-90' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {visibleSection === 'pagination' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-gray-800 space-y-4">
                                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Terminal size={14} className="text-gray-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Usage</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col">
                                                                    <code className="px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-sm mb-1">
                                                                        {fullApiUrl}?page=1&limit=10
                                                                    </code>
                                                                </div>
                                                                <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-5">
                                                                    <li>Only works with array responses</li>
                                                                    <li><code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-blue-400">page</code> (default: 1) - Page number to return</li>
                                                                    <li><code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-blue-400">limit</code> (default: 10) - Number of items per page</li>
                                                                    <li><code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-blue-400">_meta=true</code> - Add pagination metadata to response</li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="bg-blue-500/5 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Code size={14} className="text-blue-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Example with Metadata</h4>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <div className="text-xs text-gray-500 mb-1">Request:</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-xs">
                                                                        {fullApiUrl}?page=1&limit=10&_meta=true
                                                                    </code>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-500 mb-1">Response:</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-green-400 font-mono text-xs">
                                                                        {`{\n  "data": [...],\n  "meta": {\n    "total": 42,\n    "page": 1,\n    "limit": 10,\n    "totalPages": 5\n  }\n}`}
                                                                    </code>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Error Simulation */}
                                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('error')}
                                            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-800/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Error Simulation</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Force an error response for testing
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className={`text-gray-400 transition-transform ${visibleSection === 'error' ? 'rotate-90' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {visibleSection === 'error' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-gray-800 space-y-4">
                                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Terminal size={14} className="text-gray-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Usage</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col">
                                                                    <code className="px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-sm mb-1">
                                                                        {fullApiUrl}?error=true
                                                                    </code>
                                                                </div>
                                                                <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-5">
                                                                    <li>Returns an error response with the status code defined in your endpoint settings</li>
                                                                    <li>Useful for testing error handling in your client applications</li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="bg-blue-500/5 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Code size={14} className="text-blue-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Example</h4>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <div className="text-xs text-gray-500 mb-1">Request:</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-xs">
                                                                        {fullApiUrl}?error=true
                                                                    </code>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-500 mb-1">Response:</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-rose-400 font-mono text-xs">
                                                                        {`{\n  "error": "Simulated error response"\n}`}
                                                                    </code>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Delay */}
                                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('delay')}
                                            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-800/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Response Delay</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Add a controlled delay to responses
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className={`text-gray-400 transition-transform ${visibleSection === 'delay' ? 'rotate-90' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {visibleSection === 'delay' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-gray-800 space-y-4">
                                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Terminal size={14} className="text-gray-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Usage</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col">
                                                                    <code className="px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-sm mb-1">
                                                                        {fullApiUrl}?delay=2000
                                                                    </code>
                                                                </div>
                                                                <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-5">
                                                                    <li>Adds a delay to the response (in milliseconds)</li>
                                                                    <li>Useful for simulating slow network conditions or testing loading states</li>
                                                                    <li>Maximum delay is 10000ms (10 seconds)</li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="bg-blue-500/5 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Code size={14} className="text-blue-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Example</h4>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500 mb-1">Request with 3 second delay:</div>
                                                                <code className="block px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-xs">
                                                                    {fullApiUrl}?delay=3000
                                                                </code>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Combined Parameters */}
                                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('combined')}
                                            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-800/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <Code size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Combining Parameters</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Use multiple parameters together
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className={`text-gray-400 transition-transform ${visibleSection === 'combined' ? 'rotate-90' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {visibleSection === 'combined' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-gray-800 space-y-4">
                                                        <div className="bg-gray-800/50 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Terminal size={14} className="text-gray-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Usage</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col">
                                                                    <code className="px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-sm mb-1 overflow-x-auto whitespace-nowrap">
                                                                        {fullApiUrl}?{routeDetails.keyField}=123&page=1&limit=10&delay=1000&_meta=true
                                                                    </code>
                                                                </div>
                                                                <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-5">
                                                                    <li>Use <code className="text-xs bg-gray-800/70 px-1 py-0.5 rounded text-blue-400">&</code> to combine multiple parameters</li>
                                                                    <li>Parameters are processed in a specific order: Error → Delay → Filter → Pagination</li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="bg-blue-500/5 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Code size={14} className="text-blue-400" />
                                                                <h4 className="text-sm font-medium text-gray-300">Example Scenarios</h4>
                                                            </div>
                                                            <div className="space-y-3 text-sm text-gray-300">
                                                                <div>
                                                                    <div className="font-medium mb-1">Filtered pagination with metadata:</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-xs">
                                                                        {fullApiUrl}?{routeDetails.keyField}=active&page=1&limit=10&_meta=true
                                                                    </code>
                                                                </div>

                                                                <div>
                                                                    <div className="font-medium mb-1">Delayed error response (for testing):</div>
                                                                    <code className="block px-3 py-2 bg-gray-800 rounded-lg text-amber-400 font-mono text-xs">
                                                                        {fullApiUrl}?delay=2000&error=true
                                                                    </code>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Response Tab */}
                    {activeTab === 'response' && (
                        <motion.div
                            key="response"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
                        >
                            <div className="py-3 px-5 bg-gray-800/50 border-b border-gray-700/50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Code size={16} className="text-blue-400" />
                                    <h3 className="text-base font-medium text-gray-200">Response Preview</h3>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(formatJson(routeDetails.response), 'response')}
                                    className="text-gray-400 hover:text-gray-200 p-1.5 rounded flex items-center gap-1.5 text-xs"
                                >
                                    {copied === 'response' ? (
                                        <>
                                            <CheckCircle2 size={14} className="text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy JSON</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-0 max-h-[500px] overflow-auto
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-gray-800/20
                [&::-webkit-scrollbar-thumb]:bg-gray-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-gray-700"
                            >
                                <SyntaxHighlighter
                                    language="json"
                                    style={atomOneDark}
                                    customStyle={{
                                        background: 'transparent',
                                        margin: 0,
                                        padding: '1.5rem',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {formatJson(routeDetails.response)}
                                </SyntaxHighlighter>
                            </div>
                        </motion.div>
                    )}

                    {/* Test Result Tab */}
                    {activeTab === 'test' && testResponse && (
                        <motion.div
                            key="test"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
                        >
                            <div className="py-3 px-5 bg-gray-800/50 border-b border-gray-700/50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="text-emerald-400" />
                                    <h3 className="text-base font-medium text-gray-200">Test Result</h3>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(formatJson(testResponse), 'testResponse')}
                                    className="text-gray-400 hover:text-gray-200 p-1.5 rounded flex items-center gap-1.5 text-xs"
                                >
                                    {copied === 'testResponse' ? (
                                        <>
                                            <CheckCircle2 size={14} className="text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy JSON</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-0 max-h-[500px] overflow-auto
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-gray-800/20
                [&::-webkit-scrollbar-thumb]:bg-gray-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-gray-700"
                            >
                                <SyntaxHighlighter
                                    language="json"
                                    style={atomOneDark}
                                    customStyle={{
                                        background: 'transparent',
                                        margin: 0,
                                        padding: '1.5rem',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {formatJson(testResponse)}
                                </SyntaxHighlighter>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Page;
