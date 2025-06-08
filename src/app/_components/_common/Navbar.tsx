'use client'

import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (
      <nav className="border-b border-neutral-800 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-semibold text-xl">MockAPI</div>
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
