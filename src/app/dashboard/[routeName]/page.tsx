"use client";
import { getMockRoute } from '@/app/_services/mockApi';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Server, Clock, Code, Play, Copy, ExternalLink, Database, List, AlertTriangle, Filter } from 'lucide-react';
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

type RouteDetails = {
  route: string;
  method: string;
  status: number;
  response: any;
  delay: number;
  isArray: boolean;
  error?: boolean;
  filterEnabled?: boolean;
  paginationEnabled?: boolean;
  keyField?: string;
  defaultLimit?: number;
  createdAt?: string;
};

function Page({ params, searchParams }: PageProps) {
  const router = useRouter();
  const [routeDetails, setRouteDetails] = useState<RouteDetails[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { routeName } = params;
  const id = searchParams.id as string;

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
    if (status >= 200 && status < 300) return 'bg-emerald-500/20 text-emerald-400';
    if (status >= 400 && status < 500) return 'bg-amber-500/20 text-amber-400';
    if (status >= 500) return 'bg-rose-500/20 text-rose-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testEndpoint = async () => {
    if (!routeDetails) return;
    
    setTesting(true);
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/mocks/${localStorage.getItem('username')}/${routeDetails[0].route}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setTestResponse(data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        {/* Loading UI */}
      </div>
    );
  }

  if (notFound || !routeDetails) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        {/* Not found UI */}
      </div>
    );
  }

  // Build the full API URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const username = localStorage.getItem('username') || '';
  const fullApiUrl = `${baseUrl}/api/mocks/${username}/${routeDetails[0].route}`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Decorative gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Back Button & Header */}
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
          
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Endpoint Details
            </h1>
            
            <button
              onClick={testEndpoint}
              disabled={testing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 text-sm shadow-lg shadow-blue-900/20"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Test Endpoint</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
        
        {/* Endpoint Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Server size={18} className="text-blue-400" />
              Endpoint Overview
            </h2>
          </div>
          
          <div className="p-6">
            {/* URL and Method */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">API URL</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800/60 border border-gray-700 rounded-lg p-3 font-mono text-sm text-blue-400 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 ${routeDetails[0].method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'} rounded mr-3 text-xs font-medium`}>
                      {routeDetails[0].method}
                    </span>
                    <span>{fullApiUrl}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(fullApiUrl)}
                    className="text-gray-400 hover:text-gray-200 p-1 rounded"
                  >
                    {copied ? 'Copied!' : <Copy size={16} />}
                  </button>
                </div>
                <a
                  href={fullApiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Query Parameter Examples */}
              <div className="mt-3 bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
                <h4 className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                  <Code size={12} className="text-blue-400" />
                  Query Parameter Examples
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  {routeDetails[0].keyField && (
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-blue-900/30 text-blue-400 rounded text-xs mt-0.5">
                        <Filter size={10} />
                      </div>
                      <div>
                        <code className="text-xs text-amber-400 font-mono">
                          ?{routeDetails[0].keyField}=value
                        </code>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Filter by {routeDetails[0].keyField} field
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {routeDetails[0].paginationEnabled && (
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-purple-900/30 text-purple-400 rounded text-xs mt-0.5">
                        <List size={10} />
                      </div>
                      <div>
                        <code className="text-xs text-amber-400 font-mono">
                          ?page=1&limit=10
                        </code>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Paginate results
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-rose-900/30 text-rose-400 rounded text-xs mt-0.5">
                      <AlertTriangle size={10} />
                    </div>
                    <div>
                      <code className="text-xs text-amber-400 font-mono">
                        ?error=true
                      </code>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Simulate error response
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-emerald-900/30 text-emerald-400 rounded text-xs mt-0.5">
                      <Clock size={10} />
                    </div>
                    <div>
                      <code className="text-xs text-amber-400 font-mono">
                        ?delay=2000
                      </code>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Custom delay in milliseconds
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Status Code</h3>
                </div>
                <div className={`text-lg font-medium ${getStatusColor(routeDetails[0].status)} inline-block px-2 py-0.5 rounded`}>
                  {routeDetails[0].status}
                </div>
              </div>
              
              {/* Delay */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Response Delay</h3>
                  <Clock size={14} className="text-gray-500" />
                </div>
                <div className="text-lg font-medium">
                  {routeDetails[0].delay} <span className="text-sm text-gray-500">ms</span>
                </div>
              </div>
              
              {/* Error Mode */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Error Simulation</h3>
                  <AlertTriangle size={14} className="text-gray-500" />
                </div>
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full mr-2 ${routeDetails[0].error ? 'bg-rose-500' : 'bg-gray-600'}`}></div>
                  <span className={`text-sm font-medium ${routeDetails[0].error ? 'text-rose-400' : 'text-gray-400'}`}>
                    {routeDetails[0].error ? 'Enabled' : 'Disabled'}
                  </span>
                  {routeDetails[0].error && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded">
                      Returns error by default
                    </span>
                  )}
                </div>
              </div>
              
              {/* Response Type - moved to a new row */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-400">Response Type</h3>
                  {routeDetails[0].isArray ? (
                    <List size={14} className="text-gray-500" />
                  ) : (
                    <Database size={14} className="text-gray-500" />
                  )}
                </div>
                <div className="text-lg font-medium">
                  {routeDetails[0].isArray ? 'Array' : 'Object'}
                </div>
              </div>
            </div>
            
            {/* Advanced Features */}
            {(routeDetails[0].filterEnabled || routeDetails[0].paginationEnabled) && (
              <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Advanced Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {routeDetails[0].filterEnabled && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-400">Filtering enabled</span>
                    </div>
                  )}
                  {routeDetails[0].paginationEnabled && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-sm text-gray-400">Pagination enabled</span>
                      {routeDetails[0].defaultLimit && (
                        <span className="text-xs text-gray-500">
                          (Default limit: {routeDetails[0].defaultLimit})
                        </span>
                      )}
                    </div>
                  )}
                  {routeDetails[0].keyField && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <span className="text-sm text-gray-400">Key field: </span>
                      <code className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                        {routeDetails[0].keyField}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Response Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Code size={18} className="text-blue-400" />
              Response Preview
            </h2>
            <button
              onClick={() => copyToClipboard(formatJson(routeDetails[0].response))}
              className="text-gray-400 hover:text-gray-200 p-1 rounded flex items-center gap-1.5 text-sm"
            >
              <Copy size={14} />
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>
          
          <div className="p-1 max-h-[500px] overflow-auto
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
              {formatJson(routeDetails[0].response)}
            </SyntaxHighlighter>
          </div>
        </motion.div>
        
        {/* Test Response (if available) */}
        {testResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Play size={18} className="text-emerald-400" />
                Test Result
              </h2>
              <button
                onClick={() => copyToClipboard(formatJson(testResponse))}
                className="text-gray-400 hover:text-gray-200 p-1 rounded flex items-center gap-1.5 text-sm"
              >
                <Copy size={14} />
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
            
            <div className="p-1 max-h-[300px] overflow-auto
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
        
        {/* Creation Info */}
        {routeDetails[0].createdAt && (
          <div className="text-center text-xs text-gray-500 mt-8">
            Endpoint created {new Date(routeDetails[0].createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
