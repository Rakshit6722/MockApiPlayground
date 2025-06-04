"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EndpointTable from '../_components/_dashboard/EndpointTable';
import CreateEndpoint from '../_components/_dashboard/CreateEndpoint';
import {
  Plus, Server, Code, Zap,
  RefreshCw, Copy, ExternalLink, Command
} from 'lucide-react';
import { createMockRoute, getAllMockRoutes } from '../_services/mockApi';

function DashboardPage() {
  const [userMocks, setUserMocks] = useState<any>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEndpoints: 0
  });
  const [refreshing, setRefreshing] = useState(false);

  // Restore CreateEndpoint modal open state from localStorage
  useEffect(() => {
    if (localStorage.getItem('createEndpointOpen') === 'true') {
      setIsCreateModalOpen(true);
    }
  }, []);

  useEffect(() => {
    findAllMocks();
  }, []);

  const findAllMocks = async () => {
    try {
      setIsLoading(true);

      const response = await getAllMockRoutes()

      setUserMocks(response);

      setStats({
        totalEndpoints: response.length
      });
    } catch (err) {
      console.error('Error fetching mocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (action: string, data: any) => {
    if (action === 'delete') {
      setUserMocks((prevMocks: any) => prevMocks.filter((mock: any) => mock._id !== data._id));
      setStats(prevStats => ({
        ...prevStats,
        totalEndpoints: prevStats.totalEndpoints - 1
      }));
    } else if (action === 'update') {
      setUserMocks((prevMocks: any) => prevMocks.map((mock: any) =>
        mock._id === data._id ? { ...mock, ...data } : mock
      ));
      setStats(prevStats => ({
        ...prevStats,
        totalEndpoints: prevStats.totalEndpoints 
      }));
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await findAllMocks();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleCreateEndpoint = async (endpoint: any) => {
    try {
      const payload = {
        ...endpoint,
      };

      const data = await createMockRoute(payload)
      if (data?.status !== 201) {
        throw new Error('Failed to create mock route');
      }
      findAllMocks();
    } catch (err) {
      console.error('Error creating endpoint:', err);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const handleCopyBaseUrl = () => {
    navigator.clipboard.writeText(window.location.origin + '/api/mock');
  };

  // When opening/closing the CreateEndpoint modal, persist state in localStorage
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    localStorage.setItem('createEndpointOpen', 'true');
  };
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    localStorage.removeItem('createEndpointOpen');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Decorative gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Header Section */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Mock API Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage your mock API endpoints and monitor usage</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 border border-gray-700 transition-all"
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 text-sm shadow-lg shadow-blue-900/20"
            >
              <Plus size={16} />
              <span>New Endpoint</span>
            </button>
          </div>
        </motion.div>

        {/* Only Total Endpoints Card */}
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl shadow-black/5"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Endpoints</p>
                <h3 className="text-2xl font-bold">{stats.totalEndpoints}</h3>
              </div>
              <div className="p-2 bg-blue-600/10 text-blue-400 rounded-md">
                <Server size={18} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last updated just now
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions - without Analytics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl shadow-black/5"
          >
            <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-gray-800 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-900/30 text-blue-400 rounded-md">
                    <Copy size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Copy Base URL</h3>
                    <p className="text-xs text-gray-400 mb-2">Copy your API base URL to clipboard</p>
                    <button
                      onClick={handleCopyBaseUrl}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <span>Copy URL</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 border border-gray-800 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-900/30 text-emerald-400 rounded-md">
                    <Code size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">API Documentation</h3>
                    <p className="text-xs text-gray-400 mb-2">View the documentation for your API</p>
                    <button
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                    >
                      <span>View Docs</span>
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Endpoints Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl shadow-black/5 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Server size={18} className="text-blue-400" />
                Your Endpoints
              </h2>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Keyboard Shortcut:</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-300 shadow">
                    <Command size={10} />
                  </kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-300 shadow">K</kbd>
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 animate-pulse">Loading endpoints...</p>
              </div>
            ) : (
              <div className="p-4">
                <EndpointTable userMocks={userMocks} openCreateModal={openCreateModal} handleChange={handleChange} />
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-800/50 rounded-lg p-4 shadow-xl shadow-black/5"
          >
            <h2 className="text-lg font-medium mb-2">💡 Pro Tip</h2>
            <p className="text-sm text-gray-300">
              Use <span className="font-mono bg-gray-800 text-blue-400 px-1 rounded">?delay=500</span> query parameter to simulate network latency for any endpoint.
              Try adding <span className="font-mono bg-gray-800 text-blue-400 px-1 rounded">?error=true</span> to test error states.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <CreateEndpoint
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSave={handleCreateEndpoint}
      />
    </div>
  );
}

export default DashboardPage;
