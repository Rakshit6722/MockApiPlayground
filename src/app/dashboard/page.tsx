"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EndpointTable from '../_components/_dashboard/EndpointTable';
import CreateEndpoint from '../_components/_dashboard/CreateEndpoint';
import AuthRoutesTable from '../_components/_mock-auth/AuthRoutesTable';
import {
  Plus, Server, Code, Zap, Settings, RefreshCw, Copy, ExternalLink, 
  Command, LogOut, Check, Trash2, ChevronRight, Database, Key, Home, 
  Activity, BookOpen, Bell, Bookmark, HelpCircle, Shield, Menu, X,
  Trash,
  ChevronLeft,
  Loader2
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
import { createMockAuthRoute, getMockAuthRoutes } from '../_services/mock-auth';


type FieldType = {
  name: string;
  type: string;
  required: boolean;
};

const FIELD_TEMPLATES = [
  {
    name: "Basic Profile",
    fields: [
      { name: "name", type: "string", required: true },
      { name: "avatar", type: "string", required: false }
    ]
  },
  {
    name: "Contact Details",
    fields: [
      { name: "firstName", type: "string", required: true },
      { name: "lastName", type: "string", required: true },
      { name: "phoneNumber", type: "string", required: false }
    ]
  }
];


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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalApiEndpoints: 0,
    totalAuthEndpoints: 0
  });

  // Check if we're on a mobile screen
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Page load effects
  useEffect(() => {
    if (localStorage.getItem('createEndpointOpen') === 'true') {
      setIsCreateModalOpen(true);
    }
    findAllMocks();
    findAllAuthMocks();
  }, []);

  // Data fetching
  const findAllMocks = async () => {
    try {
      setIsLoading(true);
      const response = await getAllMockRoutes();
      setUserMocks(response);
      setStats(prev => ({
        ...prev,
        totalApiEndpoints: response?.length || 0
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
        totalAuthEndpoints: response?.data?.data?.length || 0 
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
        localStorage.removeItem('mockFlow-token');
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

   const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<FieldType[]>([
    { name: "email", type: "string", required: true },
    { name: "password", type: "string", required: true },
  ]);
  const [newField, setNewField] = useState<FieldType>({ name: "", type: "string", required: false });
  const [endpointName, setEndpointName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

    const [mockAuths, setMockAuths] = useState<any[]>([]);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

        const fetchMockAuths = async () => {
      try {
        setAuthLoading(true);
        const response = await getMockAuthRoutes();
        const data = response.data;
        setMockAuths(data.data || []);
      } catch (err: any) {
        setAuthError(err.message || "Failed to fetch authentication routes");
      } finally {
        setAuthLoading(false);
      }
    };

  
  // Create refs for inputs to maintain focus
  const endpointInputRef = useRef<HTMLInputElement>(null);
  const newFieldInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Focus the endpoint input when the modal opens
  useEffect(() => {
    if (open && endpointInputRef.current) {
      setTimeout(() => {
        endpointInputRef.current?.focus();
      }, 100);
    }
  }, [open]);
  
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setEndpointName("");
        setFields([
          { name: "email", type: "string", required: true },
          { name: "password", type: "string", required: true },
        ]);
        setSuccess(false);
        setError("");
      }, 200);
    }
  }, [open]);

  // Handle clicking outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handleAddField = () => {
    if (!newField.name) return;
    if (fields.some(f => f.name === newField.name)) {
      setError("Field name already exists");
      return;
    }
    
    setFields([...fields, newField]);
    setNewField({ name: "", type: "string", required: false });
    setError("");
    
    // Focus back on the field input after adding
    setTimeout(() => {
      if (newFieldInputRef.current) {
        newFieldInputRef.current.focus();
      }
    }, 0);
  };

  const handleRemoveField = (index: number) => {
    if (index < 2) return; // Don't remove email/password
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const addTemplate = (templateIndex: number) => {
    const template = FIELD_TEMPLATES[templateIndex];
    const newFields = template.fields.filter(
      t => !fields.some(f => f.name === t.name)
    );
    setFields([...fields, ...newFields]);
  };

  const handleSubmit = async () => {
    if (!endpointName) {
      setError("Endpoint name is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await createMockAuthRoute({endpoint: endpointName, fields})
      if(response?.status !== 201) {
        throw new Error(response?.data?.message || 'Failed to create auth flow');
      }
      setSuccess(true);
      fetchMockAuths()
      toast.success("Authentication flow created successfully!");
      setTimeout(() => setOpen(false), 2000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create authentication flow');
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
    { id: 'api-endpoints', label: 'API Endpoints', icon: <Database size={18} /> },
    { id: 'auth-endpoints', label: 'Auth Endpoints', icon: <Shield size={18} /> },
    { id: 'documentation', label: 'Documentation', icon: <BookOpen size={18} />, link: '/documentation' }
  ];

  // Handle mobile navigation
  const handleNavigation = (item: any) => {
    if (item.link) {
      router.push(item.link);
    } else {
      setActiveSection(item.id);
    }
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex relative">
        {/* Decorative gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Sidebar - Desktop only, hidden on mobile */}
        <motion.div 
          className={`h-screen bg-gray-900 border-r border-gray-800 py-6 transition-all duration-300 ease-in-out 
            ${sidebarOpen ? 'w-64' : 'w-20'} fixed top-0 left-0 z-30
            hidden md:block
            overflow-y-auto`}
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
              {sidebarOpen && !isMobile && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="ml-auto text-gray-400 hover:text-gray-300 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
            {!sidebarOpen && !isMobile && (
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
              <div
                key={item.id}
                onClick={() => handleNavigation(item)}
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
              </div>
            ))}
          </div>

          {/* User profile and logout - Only on desktop */}
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

        {/* Main content with responsive margin */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300
          ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}
          ml-0 pb-16 md:pb-0
          w-full`}>

          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 
            p-4 md:px-6 md:py-4 flex justify-between items-center w-full">
            <div className="flex items-center">
              {/* Mobile logo - show only on mobile */}
              <div className="md:hidden flex items-center bg-gradient-to-r from-gray-800 to-black py-1.5 px-3 rounded-md border border-neutral-700 shadow-sm mr-3">
                <img src="/favicon.ico" alt="MockFlow Logo" className="w-5 h-5 mr-2" />
                <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                  MockFlow
                </span>
              </div>
              
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {activeSection === 'overview' && 'Overview'}
                  {activeSection === 'api-endpoints' && 'API Endpoints'}
                  {activeSection === 'auth-endpoints' && 'Auth Endpoints'}
                  {activeSection === 'documentation' && 'Documentation'}
                </h1>
                <p className="text-sm text-gray-400 hidden sm:block">
                  {activeSection === 'overview' && 'Monitor and manage your mock APIs'}
                  {activeSection === 'api-endpoints' && 'Create and manage your API endpoints'}
                  {activeSection === 'auth-endpoints' && 'Create and manage your Auth endpoints'}
                  {activeSection === 'documentation' && 'Learn how to use MockFlow'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
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
                  className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-1 md:gap-2 text-sm shadow-lg shadow-blue-900/20 cursor-pointer"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">New API Endpoint</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}
              {activeSection === 'auth-endpoints' && (
                <div className="hidden sm:block">
                  <MockAuthFlowButton setOpen={setOpen} />
                </div>
              )}
              {activeSection === 'auth-endpoints' && (
                <button
                  onClick={() => {/* Action for mobile auth button */}}
                  className="sm:hidden px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Main content area */}
          <div className="px-4 md:px-6 py-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base md:text-lg font-medium text-gray-200">API Endpoints</h3>
                        <div className="p-2 bg-blue-600/10 text-blue-400 rounded-md">
                          <Database size={18} />
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl md:text-3xl font-bold text-white">{stats.totalApiEndpoints}</div>
                        <div className="text-xs md:text-sm text-gray-400 mb-1">active endpoints</div>
                      </div>
                      <button 
                        onClick={() => setActiveSection('api-endpoints')}
                        className="mt-4 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-md text-sm transition-colors text-center cursor-pointer"
                      >
                        Manage Endpoints
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base md:text-lg font-medium text-gray-200">Auth Endpoints</h3>
                        <div className="p-2 bg-purple-600/10 text-purple-400 rounded-md">
                          <Shield size={18} />
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl md:text-3xl font-bold text-white">{stats.totalAuthEndpoints}</div>
                        <div className="text-xs md:text-sm text-gray-400 mb-1">auth flows</div>
                      </div>
                      <button 
                        onClick={() => setActiveSection('auth-endpoints')}
                        className="mt-4 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-md text-sm transition-colors text-center cursor-pointer"
                      >
                        Manage Auth Flows
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl sm:col-span-2 lg:col-span-1">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base md:text-lg font-medium text-gray-200">Documentation</h3>
                        <div className="p-2 bg-emerald-600/10 text-emerald-400 rounded-md">
                          <BookOpen size={18} />
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 mb-6">Learn how to use and integrate your mock APIs</p>
                      <button 
                        onClick={() => router.push('/documentation')}
                        className="mt-4 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-md text-sm transition-colors text-center cursor-pointer"
                      >
                        View Documentation
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-4 md:p-6 shadow-xl">
                    <h2 className="text-base md:text-lg font-medium mb-4 flex items-center gap-2 text-white">
                      <Zap size={18} className="text-yellow-400" />
                      Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <p className="text-xs text-gray-400 mb-2">Copy your API base URL</p>
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
                  <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-4 md:p-6 shadow-xl">
                    <h2 className="text-base md:text-lg font-medium mb-4 flex items-center gap-2 text-white">
                      <HelpCircle size={18} className="text-emerald-400" />
                      Resources & Help
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-blue-900/20 text-blue-400 py-1 px-3 rounded-full text-xs font-medium">
                              {userMocks.length} {userMocks.length === 1 ? 'Endpoint' : 'Endpoints'}
                            </div>
                            
                            <button
                              onClick={handleCopyBaseUrl}
                              className="flex items-center gap-1.5 py-1 px-3 bg-gray-800 hover:bg-gray-700 rounded-full text-xs font-medium text-gray-300 transition-colors cursor-pointer"
                            >
                              {copiedBaseUrl ? <Check size={12} /> : <Copy size={12} />}
                              <span className="hidden sm:inline">{copiedBaseUrl ? 'Copied!' : 'Copy Base URL'}</span>
                              <span className="sm:hidden">URL</span>
                            </button>
                          </div>
                          
                          {userMocks.length > 0 && (
                            <button
                              onClick={() => setShowDeleteAllDialog(true)}
                              className="flex items-center gap-1.5 py-1 px-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-full text-xs font-medium transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span className="hidden sm:inline">Delete All</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Endpoint Table */}
                      <div className="overflow-x-auto">
                        <EndpointTable 
                          userMocks={userMocks} 
                          openCreateModal={openCreateModal} 
                          handleChange={handleChange} 
                        />
                      </div>
                      
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
                  {/* Show MockAuthFlowButton on mobile */}
                  <div className="block sm:hidden mb-4">
                    <MockAuthFlowButton fullWidth={true} />
                  </div>
                  <div className="overflow-x-auto">
                    <AuthRoutesTable fetchMockAuths={fetchMockAuths} authError={authError} mockAuths={mockAuths} setMockAuths={setMockAuths} authLoading={authLoading} />
                  </div>
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
          
          {/* Mobile footer navigation - Updated with logout button */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center py-2 z-20">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`p-2 rounded-md ${activeSection === item.id ? 'text-indigo-400' : 'text-gray-400'}`}
              >
                {item.icon}
              </button>
            ))}
            {/* Logout Button for mobile */}
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="p-2 rounded-md text-rose-400"
            >
              {logoutLoading ? (
                <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogOut size={18} />
              )}
            </button>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 max-w-md w-full shadow-2xl"
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
              <p className="text-gray-300 mb-6 text-center text-sm md:text-base">
                Are you sure you want to delete all your API endpoints? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteAllDialog(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors cursor-pointer"
                  disabled={deleteAllLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllEndpoints}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 text-white cursor-pointer"
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
            {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div 
            ref={modalRef}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl flex flex-col relative overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 40px)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-0">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                <Shield size={22} className="text-indigo-500" />
                Create Authentication Flow
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                Set up authentication endpoints for your API in a few simple steps.
              </p>
            </div>

            {/* Steps Indicator */}
            <div className="px-8 pt-6">
              <div className="flex items-center w-full max-w-md mx-auto">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                    1
                  </div>
                  <div className={`absolute w-5 h-5 rounded-full flex items-center justify-center ${step > 1 ? 'bg-indigo-500 text-white' : 'hidden'} -top-1 -right-1 text-xs shadow-sm`}>
                    <Check size={12} />
                  </div>
                </div>

                <div className={`h-0.5 flex-1 ${step > 1 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

                <div className="relative flex items-center justify-center w-10 h-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                    2
                  </div>
                  <div className={`absolute w-5 h-5 rounded-full flex items-center justify-center ${step > 2 ? 'bg-indigo-500 text-white' : 'hidden'} -top-1 -right-1 text-xs shadow-sm`}>
                    <Check size={12} />
                  </div>
                </div>

                <div className={`h-0.5 flex-1 ${step > 2 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

                <div className="flex items-center justify-center w-10 h-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                    3
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="overflow-y-auto py-6 px-8 flex-1 mt-2">
              {/* Step 1: Configure Endpoint */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Endpoint Configuration
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Endpoint Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                            /api/mock-auth/
                          </span>
                          <input
                            ref={endpointInputRef}
                            type="text"
                            value={endpointName}
                            onChange={(e) => setEndpointName(e.target.value)}
                            placeholder="my-auth"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Use lowercase letters, numbers, hyphens, and underscores
                        </p>
                      </div>
                      
                      {endpointName && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your authentication endpoints will be:
                          </h4>
                          <ul className="space-y-2 text-sm font-mono">
                            <li className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs">POST</span>
                              <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/signup</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">POST</span>
                              <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/login</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">POST</span>
                              <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/logout</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs">GET</span>
                              <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/:userId</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Configure Fields */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      User Fields
                    </h3>
                    
                    <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-md text-sm text-blue-800 dark:text-blue-300">
                      Email and password fields are required and cannot be removed.
                    </div>
                    
                    {/* Templates */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add field templates
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {FIELD_TEMPLATES.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => addTemplate(index)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm transition-colors"
                          >
                            + {template.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Field List */}
                    <div className="space-y-2 mb-6">
                      {fields.map((field, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center gap-2 p-3 rounded-md ${
                            index < 2 
                              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30' 
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex-1 flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{field.name}</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 text-xs">
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-700 dark:text-indigo-300 text-xs">
                                required
                              </span>
                            )}
                          </div>
                          
                          {index >= 2 && (
                            <button 
                              onClick={() => handleRemoveField(index)}
                              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Trash size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Add New Field */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Add New Field
                      </h4>
                      
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input
                          ref={newFieldInputRef}
                          type="text"
                          placeholder="Field name"
                          value={newField.name}
                          onChange={(e) => setNewField({...newField, name: e.target.value})}
                          className="col-span-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        
                        <select
                          value={newField.type}
                          onChange={(e) => setNewField({...newField, type: e.target.value})}
                          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="string">string</option>
                          <option value="number">number</option>
                          <option value="boolean">boolean</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newField.required}
                            onChange={(e) => setNewField({...newField, required: e.target.checked})}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          Required field
                        </label>
                      </div>
                      
                      {error && (
                        <div className="mb-3 text-sm text-red-600 dark:text-red-400">
                          {error}
                        </div>
                      )}
                      
                      <button
                        onClick={handleAddField}
                        className="w-full flex items-center justify-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <Plus size={16} />
                        Add Field
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Create */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Review Your Auth Flow
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Endpoint Summary */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Endpoints</h4>
                        <ul className="space-y-2 text-sm font-mono">
                          <li className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs">POST</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/signup</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">POST</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/login</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs">GET</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/profile</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Fields Summary */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          User Fields ({fields.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {fields.map((field, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <span className="text-gray-800 dark:text-gray-200 text-sm">{field.name}:</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">{field.type}</span>
                              {field.required && (
                                <span className="text-xs px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-700 dark:text-indigo-300">req</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-md text-sm text-red-800 dark:text-red-300">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-md text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                      <Check size={16} className="flex-shrink-0" />
                      <span>Auth flow created successfully!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                {step > 1 && (
                  <button
                    onClick={() => {
                      setStep(step - 1);
                      // When going back to step 1, focus the endpoint input
                      if (step === 2 && endpointInputRef.current) {
                        setTimeout(() => {
                          endpointInputRef.current?.focus();
                        }, 100);
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <ChevronLeft size={16} className="mr-1.5" />
                    Back
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                
                {step < 3 ? (
                  <button
                    onClick={() => {
                      setStep(step + 1);
                      // Focus the appropriate input when moving to step 2
                      if (step === 1 && newFieldInputRef.current) {
                        setTimeout(() => {
                          newFieldInputRef.current?.focus();
                        }, 100);
                      }
                    }}
                    disabled={step === 1 && !endpointName}
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                      step === 1 && !endpointName 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || success || !endpointName}
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                      loading || success || !endpointName
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="mr-1.5 animate-spin" />
                        Creating...
                      </>
                    ) : success ? (
                      <>
                        <Check size={16} className="mr-1.5" />
                        Created!
                      </>
                    ) : (
                      "Create Auth Flow"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

export default DashboardPage;