"use client"
import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="border-t border-neutral-800 py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-8 md:mb-0">
                        {/* Branded logo section */}
                        <Link href="/" className="inline-flex items-center group mb-5">
                            <div className="flex items-center bg-gradient-to-r from-gray-800 to-black py-2 px-3 rounded-md border border-neutral-700 shadow-md">
                                <img src="/favicon.ico" alt="MockFlow Logo" className="w-5 h-5 mr-2" />
                                <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                                    MockFlow
                                </span>
                            </div>
                        </Link>
                        <p className="text-neutral-400 max-w-xs">Create, test and share mock APIs with ease. Build frontends without waiting for backend teams.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-medium mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><Link href="/documentation" className="text-neutral-400 hover:text-white transition-colors">Documentation</Link></li>
                                <li><Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium mb-4">Account</h3>
                            <ul className="space-y-2">
                                <li><Link href="/auth/login" className="text-neutral-400 hover:text-white transition-colors">Login</Link></li>
                                <li><Link href="/auth/signup" className="text-neutral-400 hover:text-white transition-colors">Sign up</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-neutral-400 text-sm">
                        © {new Date().getFullYear()} MockFlow. All rights reserved.
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/terms" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
