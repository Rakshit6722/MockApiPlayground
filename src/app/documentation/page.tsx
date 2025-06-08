'use client';

import React, { useState } from "react";
import { Sparkles, Search, Zap, ArrowRight, Code, Terminal, Info, Copy, Check, ExternalLink, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const basicCode = `fetch('https://mockapi.yourusername.com/products')
  .then(res => res.json())
  .then(data => console.log(data));`;

  const complexCode = `// Get page 1 with 5 items per page and include metadata
fetch('https://mockapi.yourusername.com/products?page=1&limit=5&_meta=true')
  .then(res => res.json())
  .then(data => {
    console.log(data.meta);  // { total: 20, page: 1, limit: 5, totalPages: 4 }
    console.log(data.data);  // Array of 5 items
  });`;

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 hidden md:block border-r border-gray-800 h-screen sticky top-0">
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles size={20} className="text-blue-500" />
              <span className="font-bold text-white">Mock API Playground</span>
            </Link>
          </div>

          <div className="p-5 border-b border-gray-800">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">Documentation</h3>
            <nav className="space-y-1">
              <a href="#overview" className="flex items-center text-blue-400 px-3 py-2 rounded-md bg-blue-900/20">
                <BookOpen size={16} className="mr-2" />
                Overview
              </a>
              <a href="#basic-usage" className="flex items-center text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-900/50">
                <ChevronRight size={16} className="mr-2" />
                Basic Usage
              </a>
              <a href="#query-parameters" className="flex items-center text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-900/50">
                <ChevronRight size={16} className="mr-2" />
                Query Parameters
              </a>
              <a href="#examples" className="flex items-center text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-900/50">
                <ChevronRight size={16} className="mr-2" />
                Examples
              </a>
            </nav>
          </div>

          <div className="mt-auto p-5 border-t border-gray-800">
            <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-blue-400 px-3 py-2 text-sm">
              <ArrowRight size={16} className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <ChevronRight size={14} />
          <span className="text-gray-300">Documentation</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" id="overview">
            API Documentation
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Learn how to use your mock API endpoints with this comprehensive guide.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-5 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-gray-300 flex items-center gap-2 mb-1">
                <Zap className="text-yellow-500" size={18} />
                <span className="font-medium">Current Status:</span> Only <b>GET</b> requests are available right now
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-2">
                <Info size={14} />
                More HTTP methods coming in future updates
              </div>
            </div>

            <div className="rounded-md bg-gray-800 border border-gray-700 px-3 py-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-medium">API Online</span>
              </div>
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
            The Mock API Playground makes it simple to create and use mock endpoints for your frontend development.
          </p>

          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm mb-6">
            <div className="border-b border-gray-800 px-4 py-3 bg-gray-900/70 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-300">Making a GET Request</div>
              <button
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded"
                onClick={() => handleCopy(basicCode, 'basic')}
              >
                {copiedCode === 'basic' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{basicCode}</code>
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
            Enhance your mock API requests with these supported query parameters:
          </p>

          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-medium">Available Parameters</h3>
            </div>
            <div className="divide-y divide-gray-800">
              <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2">
                <div className="w-16 md:w-24 flex-shrink-0">
                  <code className="font-mono text-pink-400 text-sm">id</code>
                </div>
                <div className="flex-1 text-gray-400 text-sm">
                  Filter by a specific item ID (requires setting a keyField on your endpoint)
                </div>
                <div className="md:text-right md:w-40">
                  <code className="bg-gray-800 px-2 py-1 rounded text-blue-300 text-xs">?id=1</code>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2">
                <div className="w-16 md:w-24 flex-shrink-0">
                  <code className="font-mono text-pink-400 text-sm">page</code>
                </div>
                <div className="flex-1 text-gray-400 text-sm">
                  Paginate array responses (use with <code className="text-pink-400">limit</code>)
                </div>
                <div className="md:text-right md:w-40">
                  <code className="bg-gray-800 px-2 py-1 rounded text-blue-300 text-xs">?page=1&limit=10</code>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2">
                <div className="w-16 md:w-24 flex-shrink-0">
                  <code className="font-mono text-pink-400 text-sm">_meta</code>
                </div>
                <div className="flex-1 text-gray-400 text-sm">
                  Include pagination metadata with response
                </div>
                <div className="md:text-right md:w-40">
                  <code className="bg-gray-800 px-2 py-1 rounded text-blue-300 text-xs">?_meta=true</code>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2">
                <div className="w-16 md:w-24 flex-shrink-0">
                  <code className="font-mono text-pink-400 text-sm">delay</code>
                </div>
                <div className="flex-1 text-gray-400 text-sm">
                  Simulate network delay in milliseconds
                </div>
                <div className="md:text-right md:w-40">
                  <code className="bg-gray-800 px-2 py-1 rounded text-blue-300 text-xs">?delay=2000</code>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-2">
                <div className="w-16 md:w-24 flex-shrink-0">
                  <code className="font-mono text-pink-400 text-sm">error</code>
                </div>
                <div className="flex-1 text-gray-400 text-sm">
                  Force an error response to test error handling
                </div>
                <div className="md:text-right md:w-40">
                  <code className="bg-gray-800 px-2 py-1 rounded text-blue-300 text-xs">?error=true</code>
                </div>
              </div>
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
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded"
                onClick={() => handleCopy(complexCode, 'complex')}
              >
                {copiedCode === 'complex' ?
                  <span className="flex items-center text-green-500 text-xs"><Check size={14} className="mr-1" /> Copied!</span> :
                  <span className="flex items-center text-xs"><Copy size={14} className="mr-1" /> Copy code</span>
                }
              </button>
            </div>
            <div className="bg-gray-950 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="font-mono text-blue-100">{complexCode}</code>
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

        {/* Coming Soon */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 text-center">
          <h2 className="text-lg font-semibold text-white mb-4">Coming Soon</h2>

          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-md text-gray-300 text-sm">
              POST Requests
            </span>
            <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-md text-gray-300 text-sm">
              PUT Requests
            </span>
            <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-md text-gray-300 text-sm">
              DELETE Requests
            </span>
            <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-md text-gray-300 text-sm">
              PATCH Requests
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Sparkles size={16} />
            <span>Stay tuned for updates!</span>
          </div>
        </div>

        {/* Bottom navigation for mobile */}
        <div className="md:hidden mt-12 pt-6 border-t border-gray-800">
          <Link href="/dashboard" className="block text-center text-gray-400 hover:text-blue-400 py-3">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}