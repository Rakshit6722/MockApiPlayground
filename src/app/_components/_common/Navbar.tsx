'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="border-b border-neutral-800 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Same on all screen sizes */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center bg-gradient-to-r from-gray-800 to-black py-1.5 sm:py-2 px-3 sm:px-4 rounded-md border border-neutral-700 shadow-lg transition-all duration-300 hover:shadow-cyan-900/20 hover:border-cyan-800/40 hover:-translate-y-0.5 relative">
              <div className="absolute inset-0 bg-cyan-500/5 rounded-md blur-xl -z-10"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-md animate-pulse-slow"></div>
                <img src="/favicon.ico" alt="MockFlow Logo" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-2.5 relative z-10" />
              </div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 group-hover:from-white group-hover:to-cyan-200 transition-colors">
                MockFlow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile Menu Button - Only shown on mobile */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu - Slides down when open */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-60 opacity-100 pt-4 pb-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4">
            <Link 
              href="/documentation" 
              className="text-neutral-400 hover:text-white transition-colors py-1 px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link 
              href="/auth/login" 
              className="text-neutral-400 hover:text-white transition-colors py-1 px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-neutral-200 transition-colors font-medium w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
