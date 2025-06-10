'use client'

import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (
      <nav className="border-b border-neutral-800 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center bg-gradient-to-r from-gray-800 to-black py-2 px-4 rounded-md border border-neutral-700 shadow-lg transition-all duration-300 hover:shadow-cyan-900/20 hover:border-cyan-800/40 hover:-translate-y-0.5 relative">
              <div className="absolute inset-0 bg-cyan-500/5 rounded-md blur-xl -z-10"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-md animate-pulse-slow"></div>
                <img src="/favicon.ico" alt="MockFlow Logo" className="w-6 h-6 mr-2.5 relative z-10" />
              </div>
              <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 group-hover:from-white group-hover:to-cyan-200 transition-colors">
                MockFlow
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/documentation" className="text-neutral-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/auth/login" className="text-neutral-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="bg-white text-black px-4 py-2 rounded-md hover:bg-neutral-200 transition-colors font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </nav>
  )
}

export default Navbar
