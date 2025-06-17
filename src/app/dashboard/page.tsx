"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EndpointTable from '../_components/_dashboard/EndpointTable';
import CreateEndpoint from '../_components/_dashboard/CreateEndpoint';
import AuthRoutesTable from '../_components/_mock-auth/AuthRoutesTable';
import {
  Plus, Server, Code, Zap, Settings, RefreshCw, Copy, ExternalLink, 
  Command, LogOut, Check, Trash2, ChevronRight, Database, Key, Home, 
  Activity, BookOpen, Bell, Bookmark, HelpCircle, Shield
} from 'lucide-react';
import { createMockRoute, getAllMockRoutes, deleteAllMocks } from '../_services/mockApi';
import { logout } from '../_services/authApi';
import { useRouter } from 'next/navigation';
import { persistor, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/userSlice';
import ProtectedRoute from '../_components/_common/ProtectedRoute';
import { toast } from 'react-toastify';
import MockAuthFlowButton from '../_components/_mock-auth/MockAuthFlowButton';
import Link from 'next/link';
import { getMockAuthRoutes } from '../_services/mock-auth';

function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state:RootState) => state.user.userInfo);

  // State
  const [userMocks, setUserMocks] = useState<any>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalApiEndpoints: 0,
    totalAuthEndpoints: 0
  });

  // Page load effects
  useEffect(() => {
    if (localStorage.getItem('createEndpointOpen') === 'true') {
      setIsCreateModalOpen(true);
    }
    findAllMocks();
    findAllAuthMocks()
  }, []);

  // Data fetching
  const findAllMocks = async () => {
    try {
      setIsLoading(true);
      const response = await getAllMockRoutes();
      setUserMocks(response);
      setStats(prev => ({
        ...prev,
        totalApiEndpoints: response.length
      }));
    } catch (err) {
      console.error('Error fetching mocks:', err);
      toast.error('Failed to load endpoints');
    } finally {
      setIsLoading(false);
    }
  };

  //find All Auth mocks
  const findAllAuthMocks = async () => {
    try {
      setIsLoading(true);
      const response = await getMockAuthRoutes(); 
      setStats(prev => ({
        ...prev,
        totalAuthEndpoints: response.data.data.length 
      }));
    } catch (err) {
      console.error('Error fetching auth mocks:', err);
      toast.error('Failed to load auth endpoints');
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers
  const handleChange = (action: string, data: any) => {
    if (action === 'delete') {
      setUserMocks((prevMocks: any) => prevMocks.filter((mock: any) => mock._id !== data._id));
      setStats(prev => ({
        ...prev,
        totalApiEndpoints: prev.totalApiEndpoints - 1
      }));
    } else if (action === 'update') {
      setUserMocks((prevMocks: any) => prevMocks.map((mock: any) =>
        mock._id === data._id ? { ...mock, ...data } : mock
      ));
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await findAllMocks();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleCreateEndpoint = async (endpoint: any) => {
    try {
      const data = await createMockRoute(endpoint);
      if (data?.status !== 201) {
        throw new Error('Failed to create mock route');
      }
      findAllMocks();
      toast.success('Endpoint created successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create mock route');
    }
  };

  const handleDeleteAllEndpoints = async () => {
    try {
      setDeleteAllLoading(true);
      const response = await deleteAllMocks();
      if (response) {
        toast.success('All endpoints deleted successfully');
        setUserMocks([]);
        setStats(prev => ({
          ...prev,
          totalApiEndpoints: 0
        }));
        setShowDeleteAllDialog(false);
      }
    } catch (error) {
      toast.error('Failed to delete all endpoints');
      console.error('Error deleting all endpoints:', error);
    } finally {
      setDeleteAllLoading(false);
    }
  };

  const handleCopyBaseUrl = () => {
    navigator.clipboard.writeText(window.location.origin + '/api/mock');
    setCopiedBaseUrl(true);
    setTimeout(() => setCopiedBaseUrl(false), 5000);
    toast.success('Base URL copied to clipboard');
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    localStorage.setItem('createEndpointOpen', 'true');
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    localStorage.removeItem('createEndpointOpen');
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const data = await logout();
      if (data?.message === 'Logout successful') {
        localStorage.removeItem('token');
        dispatch(logoutUser());
        await persistor.purge();
        router.push('/');
      }
    } catch (err) {
      console.error('Error during logout:', err);
      toast.error('Logout failed');
    } finally {
      setLogoutLoading(false);
    }
  };

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
    { id: 'api-endpoints', label: 'API Endpoints', icon: <Database size={18} /> },
    { id: 'auth-endpoints', label: 'Auth Endpoints', icon: <Shield size={18} /> },
    { id: 'documentation', label: 'Documentation', icon: <BookOpen size={18} />, link: '/documentation' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex">
        {/* Decorative gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Sidebar */}
        <motion.div 
          className={`h-screen flex-shrink-0 bg-gray-900 border-r border-gray-800 py-6 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'} fixed top-0 left-0 z-20 overflow-y-auto`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center mb-8 px-4">
            {/* Logo */}
            <div className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} w-full`}>
              <div className="flex items-center bg-gradient-to-r from-gray-800 to-black py-1.5 px-3 rounded-md border border-neutral-700 shadow-sm">
                <img src="/favicon.ico" alt="MockFlow Logo" className="w-5 h-5 mr-2" />
                {sidebarOpen && (
                  <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                    MockFlow
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="ml-auto text-gray-400 hover:text-gray-300 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
            )}
          </div>

          {/* Navigation links */}
          <div className="px-3 space-y-1">
            {navItems.map(item => (
              <Link 
                href={item.link || "#"}
                key={item.id}
                onClick={(e) => {
                  if (!item.link) {
                    e.preventDefault();
                    setActiveSection(item.id);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  activeSection === item.id 
                    ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500' 
                    : 'text-gray-400 hover:bg-gray-800/70 hover:text-gray-200'
                }`}
              >
                <div className={`${activeSection === item.id ? 'text-indigo-400' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* User profile and logout */}
          {sidebarOpen && (
            <div className="mt-auto px-3 pt-6 border-t border-gray-800 mx-3">
              <div className="flex items-center px-3 py-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center text-white font-medium">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-200">{user?.username || 'User'}</p>
                  <p className="text-xs text-gray-400">Free Account</p>
                </div>
              </div>
              <button
                disabled={logoutLoading}
                onClick={handleLogout}
                className="w-full mt-2 p-2 rounded-md flex items-center justify-center gap-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 transition-all text-rose-400 hover:text-rose-300 hover:border-rose-700/50 cursor-pointer"
              >
                {logoutLoading ? (
                  <span className="animate-pulse text-sm">Logging out...</span>
                ) : (
                  <>
                    <LogOut size={16} />
                    <p className='text-sm font-medium'>Logout</p>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Main content */}
        <div className="flex-1  overflow-y-auto ml-58 pl-6 pr-4">
          {/* Top bar */}
          <div className="fixed w-screen top-0 z-10 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {activeSection === 'overview' && 'Overview'}
                {activeSection === 'api-endpoints' && 'API Endpoints'}
                {activeSection === 'auth-endpoints' && 'Auth Endpoints'}
                {activeSection === 'documentation' && 'Documentation'}
              </h1>
              <p className="text-sm text-gray-400">
                {activeSection === 'overview' && 'Monitor and manage your mock APIs'}
                {activeSection === 'api-endpoints' && 'Create and manage your API endpoints'}
                {activeSection === 'auth-endpoints' && 'Create and manage your Auth endpoints'}
                {activeSection === 'documentation' && 'Learn how to use MockFlow'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 border border-gray-700 transition-all cursor-pointer"
                disabled={refreshing}
                title="Refresh"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              </button>
              {activeSection === 'api-endpoints' && (
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 text-sm shadow-lg shadow-blue-900/20 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>New API Endpoint</span>
                </button>
              )}
              {activeSection === 'auth-endpoints' && (
                <MockAuthFlowButton />
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="px-6 py-6 mt-20">
            <AnimatePresence mode="wait">
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-200">API Endpoints</h3>
                        <div className="p-2 bg-blue-600/10 text-blue-400 rounded-md">
                          <Database size={18} />
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold text-white">{stats.totalApiEndpoints}</div>
                        <div className="text-sm text-gray-400 mb-1">active endpoints</div>
                      </div>
                      <button 
                        onClick={() => setActiveSection('api-endpoints')}
                        className="mt-4 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-md text-sm transition-colors text-center cursor-pointer"
                      >
                        Manage Endpoints
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-200">Auth Endpoints</h3>
                        <div className="p-2 bg-purple-600/10 text-purple-400 rounded-md">
                          <Shield size={18} />
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold text-white">{stats.totalAuthEndpoints}</div>
                        <div className="text-sm text-gray-400 mb-1">auth flows</div>
                      </div>
                      <button 
                        onClick={() => setActiveSection('auth-endpoints')}
                        className="mt-4 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-md text-sm transition-colors text-center cursor-pointer"
                      >
                        Manage Auth Flows
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-200">Documentation</h3>
                        <div className="p-2 bg-emerald-600/10 text-emerald-400 rounded-md">
                          <BookOpen size={18} />
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-6">Learn how to use and integrate your mock APIs</p>
                      <button 
                        onClick={() => router.push('/documentation')}
                        className="mt-4 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-md text-sm transition-colors text-center cursor-pointer"
                      >
                        View Documentation
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
                      <Zap size={18} className="text-yellow-400" />
                      Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Create API Endpoint */}
                      <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-900/30 text-blue-400 rounded-md">
                            <Plus size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1 text-white">Create API Endpoint</h3>
                            <p className="text-xs text-gray-400 mb-2">Add a new RESTful API endpoint</p>
                            <button
                              onClick={() => {
                                setActiveSection('api-endpoints');
                                setTimeout(() => openCreateModal(), 100);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>Create Endpoint</span>
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Create Auth Flow */}
                      <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-900/30 text-purple-400 rounded-md">
                            <Shield size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1 text-white">Create Auth Flow</h3>
                            <p className="text-xs text-gray-400 mb-2">Add authentication to your API</p>
                            <button
                              onClick={() => {
                                setActiveSection('auth-endpoints');
                                // You can add logic to open the auth flow creation modal here
                              }}
                              className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>Create Auth Flow</span>
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Copy Base URL */}
                      <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${copiedBaseUrl ? 'bg-green-900/30 text-green-400' : 'bg-cyan-900/30 text-cyan-400'} rounded-md transition-colors`}>
                            {copiedBaseUrl ? <Check size={16} /> : <Copy size={16} />}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1 text-white">Copy Base URL</h3>
                            <p className="text-xs text-gray-400 mb-2">Copy your API base URL to clipboard</p>
                            <button
                              onClick={handleCopyBaseUrl}
                              className={`text-xs ${copiedBaseUrl
                                ? 'text-green-400 hover:text-green-300'
                                : 'text-cyan-400 hover:text-cyan-300'} transition-colors flex items-center gap-1 cursor-pointer`}
                            >
                              <span>{copiedBaseUrl ? 'Copied!' : 'Copy URL'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resources & Help */}
                  <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
                      <HelpCircle size={18} className="text-emerald-400" />
                      Resources & Help
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-emerald-900/30 text-emerald-400 rounded-md">
                            <BookOpen size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1 text-white">Documentation</h3>
                            <p className="text-xs text-gray-400 mb-2">Learn how to use the platform</p>
                            <button
                              onClick={() => router.push('/documentation')}
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Docs</span>
                              <ExternalLink size={10} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-amber-900/30 text-amber-400 rounded-md">
                            <Code size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1 text-white">API Examples</h3>
                            <p className="text-xs text-gray-400 mb-2">Code samples for integration</p>
                            <button
                              onClick={() => router.push('/examples')}
                              className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Examples</span>
                              <ExternalLink size={10} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-900/30 text-blue-400 rounded-md">
                            <Activity size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1 text-white">API Status</h3>
                            <p className="text-xs text-gray-400 mb-2">Check service status</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-xs text-gray-300">All systems operational</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* API Endpoints Section */}
              {activeSection === 'api-endpoints' && (
                <motion.div
                  key="api-endpoints"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400 animate-pulse">Loading endpoints...</p>
                    </div>
                  ) : (
                    <>
                      {/* Tools and Actions */}
                      {userMocks.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-900/20 text-blue-400 py-1 px-3 rounded-full text-xs font-medium">
                              {userMocks.length} {userMocks.length === 1 ? 'Endpoint' : 'Endpoints'}
                            </div>
                            
                            <button
                              onClick={handleCopyBaseUrl}
                              className="flex items-center gap-1.5 py-1 px-3 bg-gray-800 hover:bg-gray-700 rounded-full text-xs font-medium text-gray-300 transition-colors cursor-pointer"
                            >
                              {copiedBaseUrl ? <Check size={12} /> : <Copy size={12} />}
                              {copiedBaseUrl ? 'Copied!' : 'Copy Base URL'}
                            </button>
                          </div>
                          
                          {userMocks.length > 0 && (
                            <button
                              onClick={() => setShowDeleteAllDialog(true)}
                              className="flex items-center gap-1.5 py-1 px-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-full text-xs font-medium transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                              Delete All
                            </button>
                          )}
                        </div>
                      )}

                      {/* Endpoint Table */}
                      <EndpointTable 
                        userMocks={userMocks} 
                        openCreateModal={openCreateModal} 
                        handleChange={handleChange} 
                      />
                      
                      {/* Empty state */}
                      {userMocks.length === 0 && !isLoading && (
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center mt-6">
                          <div className="inline-flex items-center justify-center p-3 bg-blue-900/20 text-blue-400 rounded-full mb-4">
                            <Database size={24} />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">No API Endpoints Yet</h3>
                          <p className="text-gray-400 max-w-md mx-auto mb-6">
                            Create your first API endpoint to get started with mocking data for your applications.
                          </p>
                          <button
                            onClick={openCreateModal}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                          >
                            <Plus size={18} />
                            <span>Create Your First Endpoint</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {/* Auth Endpoints Section */}
              {activeSection === 'auth-endpoints' && (
                <motion.div
                  key="auth-endpoints"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthRoutesTable />
                </motion.div>
              )}

              {/* Documentation Section */}
              {activeSection === 'documentation' && (
                <motion.div
                  key="documentation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-10"
                >
                  <p className="text-gray-400">Redirecting to documentation...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Endpoint Modal */}
      <CreateEndpoint
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSave={handleCreateEndpoint}
      />

      {/* Delete All Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteAllDialog && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-3 bg-red-900/20 text-red-400 rounded-full mb-4">
                  <Trash2 size={24} />
                </div>
                <h2 className="text-xl font-semibold text-white">Delete All Endpoints</h2>
              </div>
              <p className="text-gray-300 mb-6 text-center">
                Are you sure you want to delete all your API endpoints? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteAllDialog(false)}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors cursor-pointer"
                  disabled={deleteAllLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllEndpoints}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 text-white cursor-pointer"
                  disabled={deleteAllLoading}
                >
                  {deleteAllLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Delete All</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}

export default DashboardPage;