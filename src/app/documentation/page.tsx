'use client';

import React, { useState } from "react";
import { Sparkles, Search, Zap, ArrowRight, Code, Terminal, Info, Copy, Check, ExternalLink, BookOpen, ChevronRight, Shield, LogIn, UserPlus, User } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { 
  navItems, 
  queryParameters, 
  authCards, 
  codeExamples 
} from "../_constants/documentation";

export default function DocumentationPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Map icon names to actual icon components
  const getIconComponent = (iconType: string, size = 16) => {
    switch (iconType) {
      case 'userPlus': return <UserPlus size={size} />;
      case 'logIn': return <LogIn size={size} />;
      case 'user': return <User size={size} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 hidden md:block border-r border-gray-800 h-screen sticky top-0">
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              {/* MockFlow logo and branding */}
              <div className="flex items-center bg-gradient-to-r from-gray-800 to-black py-1.5 px-3 rounded-md border border-neutral-700 shadow-md">
                <img src="/favicon.ico" alt="MockFlow Logo" className="w-5 h-5 mr-2" />
                <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                  MockFlow
                </span>
              </div>
            </Link>
          </div>

          <div className="p-5 border-b border-gray-800">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">Documentation</h3>
            <nav className="space-y-1">
              {navItems.map(item => (
                <a 
                  key={item.id}
                  href={item.href} 
                  className={`flex items-center ${item.isActive ? 'text-blue-400 bg-blue-900/20' : 'text-gray-300 hover:text-blue-400 hover:bg-gray-900/50'} px-3 py-2 rounded-md`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-5 border-t border-gray-800">
            <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-blue-400 px-3 py-2 text-sm cursor-pointer">
              <ArrowRight size={16} className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <ChevronRight size={14} />
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-gray-300">Home</Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-gray-300">Documentation</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 mb-4" id="overview">
            MockFlow Documentation
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Learn how to use your MockFlow API endpoints and authentication flows with this comprehensive guide.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 mb-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
            <div className="text-gray-300 flex items-center gap-2">
              <Zap className="text-yellow-500" size={18} />
              <span className="font-medium">Current Status:</span>
              <span>
                <b>GET</b> requests and <b>Authentication</b> flows are available
              </span>
            </div>
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <Info size={14} />
              <span>More HTTP methods coming in future updates</span>
            </div>
          </div>

          <div className="rounded-md bg-gray-800 border border-gray-700 px-3 py-1.5 flex justify-between">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-medium">API Online</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-medium">Auth Services Online</span>
            </div>
          </div>
        </div>

        {/* Basic Usage Section */}
        <section className="mb-12" id="basic-usage">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Code size={20} className="text-blue-500" />
            Basic Usage
          </h2>

          <p className="text-gray-400 mb-6">
            MockFlow makes it simple to create and use mock endpoints for your frontend development.
          </p>

          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">Making a GET Request</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                onClick={() => handleCopy(codeExamples.basic, 'basic')}
              >
                {copiedCode === 'basic' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{codeExamples.basic}</code>
              </pre>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-4 text-sm text-blue-300">
            <div className="flex items-start gap-2">
              <Terminal size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                Replace <code className="px-1.5 py-0.5 bg-blue-900/30 rounded text-xs">products</code> with your endpoint route name.
                Make sure your endpoint is created in the dashboard first.
              </div>
            </div>
          </div>
        </section>

        {/* Query Parameters Section */}
        <section className="mb-12" id="query-parameters">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Search size={20} className="text-blue-500" />
            Query Parameters
          </h2>

          <p className="text-gray-400 mb-6">
            Enhance your MockFlow API requests with these supported query parameters:
          </p>

          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-medium">Available Parameters</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {queryParameters.map((param, index) => (
                <div key={index} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2">
                  <div className="w-16 md:w-24 flex-shrink-0">
                    <code className="font-mono text-pink-400 text-sm">{param.name}</code>
                  </div>
                  <div className="flex-1 text-gray-400 text-sm">
                    {param.description}
                  </div>
                  <div className="md:text-right md:w-40">
                    <code className="bg-gray-800 px-2 py-1 rounded text-blue-300 text-xs">{param.example}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="mb-12" id="examples">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Terminal size={20} className="text-blue-500" />
            Complete Example
          </h2>

          <p className="text-gray-400 mb-6">
            Here's a more advanced example showing how to use pagination with metadata:
          </p>

          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">Pagination with Metadata</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                onClick={() => handleCopy(codeExamples.complex, 'complex')}
              >
                {copiedCode === 'complex' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 code-scroll min-w-0">
              <pre className="p-4 text-sm whitespace-pre">
                <code className="font-mono text-blue-100">{codeExamples.complex}</code>
              </pre>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-4 text-sm text-blue-300">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                The <code className="px-1.5 py-0.5 bg-blue-900/30 rounded text-xs">_meta</code> parameter adds pagination metadata to your response,
                including total count, current page, and total pages.
              </div>
            </div>
          </div>
        </section>
        
        {/* Data Modification Section */}
        <section className="mb-12" id="data-modification">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Terminal size={20} className="text-green-500" />
            Data Modification
          </h2>

          <p className="text-gray-400 mb-6">
            MockFlow allows you to modify your mock data using standard HTTP methods. Use PUT to update existing data and DELETE to remove data.
          </p>

          {/* PUT Example */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">Update Data with PUT</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                onClick={() => handleCopy(codeExamples.updateData, 'updateData')}
              >
                {copiedCode === 'updateData' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{codeExamples.updateData}</code>
              </pre>
            </div>
          </div>

          {/* DELETE Example */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">Remove Data with DELETE</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                onClick={() => handleCopy(codeExamples.deleteData, 'deleteData')}
              >
                {copiedCode === 'deleteData' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{codeExamples.deleteData}</code>
              </pre>
            </div>
          </div>

          {/* Notes about data modification */}
          <div className="bg-green-900/10 border border-green-800/30 rounded-lg p-4 text-sm text-green-300">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Important Notes:</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Use the <code className="px-1.5 py-0.5 bg-green-900/30 rounded text-xs">?id=X</code> query parameter to specify which item to update or delete</li>
                  <li>PUT requests require a JSON body with the fields you want to update</li>
                  <li>When updating, you only need to include fields you want to change</li>
                  <li>The API preserves fields not included in your update request</li>
                  <li>DELETE operations are permanent and cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication Section */}
        <section className="mb-12" id="authentication">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-purple-500" />
            Authentication
          </h2>

          <p className="text-gray-400 mb-6">
            MockFlow provides a complete authentication system that you can customize for your frontend applications.
            Create signup, login, and profile endpoints with your own field structure and validation rules.
          </p>
          
          {/* How Authentication Works */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <h3 className="text-xl font-medium text-white mb-4">How Authentication Works</h3>
            
            <p className="text-gray-400 mb-4">
              {`1. Setup your auth endpoint in the MockFlow dashboard under "Auth Endpoints".
2. Define the user data structure, required fields, and validation rules.
3. Use the provided API endpoints for signup, login, and accessing user profile.
4. Secure your frontend routes by validating JWT tokens.`}
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-medium text-white mb-2">Authentication Flow Structure</h4>
              <p className="text-gray-400 whitespace-pre-line">
                {`- User visits the login or signup page.
- Frontend sends a request to the MockFlow auth endpoint.
- Server validates the request and returns a JWT token.
- Frontend stores the token (e.g., in localStorage).
- For protected routes, frontend includes the token in the Authorization header.`}
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-medium text-white mb-2">API Endpoints</h4>
              <p className="text-gray-400 whitespace-pre-line">
                {`POST /api/auth/signup - Create a new user
POST /api/auth/login - Authenticate user and return a token
GET /api/auth/profile - Get user profile data (protected)`}
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-white mb-2">Validation</h4>
              <p className="text-gray-400 whitespace-pre-line">
                {`- Email: must be a valid email address and unique
- Password: minimum 8 characters, at least one number and one special character
- Name: required, maximum 50 characters`}
              </p>
            </div>
          </div>
          
          {/* Auth Endpoint Setup */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-white mb-4">Creating Auth Endpoints</h3>
            
            <p className="text-gray-400 mb-4">
              Before using authentication, you need to create and configure an auth endpoint in the MockFlow dashboard.
              This defines the structure of your user data and what fields are required.
            </p>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
              <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
                <div className="text-sm font-medium text-gray-300">Auth Endpoint Configuration</div>
                <button
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                  onClick={() => handleCopy(codeExamples.authSetup, 'authSetup')}
                >
                  {copiedCode === 'authSetup' ?
                    <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                    <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                  }
                </button>
              </div>
              <div className="bg-gray-950 overflow-hidden">
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="font-mono text-blue-100">{codeExamples.authSetup}</code>
                </pre>
              </div>
            </div>
            
            <div className="bg-indigo-900/10 border border-indigo-800/30 rounded-lg p-4 text-sm text-indigo-300">
              <div className="flex items-start gap-2">
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p>Create your auth endpoint in the dashboard by navigating to the "Auth Endpoints" section and clicking "Create Auth Flow".</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Available Auth Endpoints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {authCards.map((card, index) => (
              <div key={index} className="bg-gray-900 rounded-lg border border-gray-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 bg-${card.bgColor}-900/30 text-${card.bgColor}-400 rounded-md`}>
                    {getIconComponent(card.iconType)}
                  </div>
                  <h3 className="text-lg font-medium text-white">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {card.description}
                </p>
                <code className="text-xs bg-gray-800 p-1.5 rounded text-blue-300 block font-mono">
                  {card.endpoint}
                </code>
              </div>
            ))}
          </div>
          
          <h3 className="text-xl font-medium text-white mb-4">Example Code Snippets</h3>
          
          {/* Signup Example */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">User Signup</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                onClick={() => handleCopy(codeExamples.signup, 'signup')}
              >
                {copiedCode === 'signup' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{codeExamples.signup}</code>
              </pre>
            </div>
          </div>
          
          {/* Login Example */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">User Login</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                onClick={() => handleCopy(codeExamples.login, 'login')}
              >
                {copiedCode === 'login' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{codeExamples.login}</code>
              </pre>
            </div>
          </div>
          
          {/* Profile Example */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">Get User Profile</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded cursor-pointer"
                onClick={() => handleCopy(codeExamples.profile, 'profile')}
              >
                {copiedCode === 'profile' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{codeExamples.profile}</code>
              </pre>
            </div>
          </div>
          
          {/* Key points about auth */}
          <div className="bg-purple-900/10 border border-purple-800/30 rounded-lg p-4 text-sm text-purple-300">
            <div className="flex items-start gap-2">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Important Notes:</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>The authentication flow uses JWT tokens with a 1-hour expiration by default</li>
                  <li>All fields defined in your auth endpoint schema will be validated during signup</li>
                  <li>User data is stored securely and associated with your MockFlow account</li>
                  <li>The API enforces email uniqueness within each auth endpoint</li>
                  <li>You can create multiple auth endpoints for different authentication needs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 text-center">
          <h2 className="text-lg font-semibold text-white mb-4">Coming Soon to MockFlow</h2>

          {/* <div className="flex flex-wrap justify-center gap-3 mb-4">
            {comingSoonFeatures.map((feature, index) => (
              <span 
                key={index} 
                className={`${feature.special 
                  ? 'bg-purple-800/70 border border-purple-700 text-purple-200' 
                  : 'bg-gray-800 border border-gray-700 text-gray-300'} 
                  px-3 py-1 rounded-md text-sm`}
              >
                {feature.name}
              </span>
            ))}
          </div> */}

          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Sparkles size={16} />
            <span>Stay tuned for updates!</span>
          </div>
        </div>

        {/* Bottom navigation for mobile */}
        <div className="md:hidden mt-12 pt-6 border-t border-gray-800">
          <Link href="/dashboard" className="block text-center text-gray-400 hover:text-blue-400 py-3 cursor-pointer">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}