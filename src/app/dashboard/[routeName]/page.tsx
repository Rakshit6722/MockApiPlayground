"use client";
import { getMockRoute } from '@/app/_services/mockApi';
import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Server, Copy, AlertTriangle, CheckCircle2, Zap, Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TabMenu from '@/app/_components/_dashboard/details/TabMenu';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

type PageProps = {
    params: {
        routeName: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

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

    const username = useSelector((state: RootState) => state.user.userInfo.username) || 'defaultUser';


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
            const url = `${baseUrl}/api/mocks/${username}/${routeDetails.route}`;

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

                <TabMenu
                    activeTab={activeTab}
                    routeDetails={routeDetails}
                    fullApiUrl={fullApiUrl}
                    toggleSection={toggleSection}
                    visibleSection={visibleSection}
                    testResponse={testResponse}
                    copied={copied}
                    setCopied={setCopied}
                    copyToClipboard={copyToClipboard}
                />

            </div>
        </div>
    );
}

export default Page;
