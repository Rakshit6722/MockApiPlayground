"use client"

import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="border-t border-neutral-800 py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-8 md:mb-0">
                        <div className="font-semibold text-xl mb-4">MockAPI</div>
                        <p className="text-neutral-400 max-w-xs">Powerful mock API service for frontend developers.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-medium mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-neutral-400 hover:text-white">Features</Link></li>
                                <li><Link href="#" className="text-neutral-400 hover:text-white">Pricing</Link></li>
                                <li><Link href="#" className="text-neutral-400 hover:text-white">Documentation</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-neutral-400 hover:text-white">About</Link></li>
                                <li><Link href="#" className="text-neutral-400 hover:text-white">Blog</Link></li>
                                <li><Link href="#" className="text-neutral-400 hover:text-white">Careers</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-neutral-400 hover:text-white">Privacy</Link></li>
                                <li><Link href="#" className="text-neutral-400 hover:text-white">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-12 pt-8 text-neutral-400 text-sm">
                    © {new Date().getFullYear()} MockAPI. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
