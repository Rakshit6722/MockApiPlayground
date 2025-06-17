'use client';

import Link from "next/link";

export default function ExamplesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-4">
          Quick Examples Coming Soon
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          This page will soon provide ready-to-use code snippets for all major features of MockFlow.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Stay tuned for updates!
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}