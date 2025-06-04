"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "./_components/_common/Footer";
import Navbar from "./_components/_common/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-1 bg-neutral-800 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Launching Beta v1.0
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Mock APIs for frontend developers
              <span className="text-blue-500">.</span>
            </motion.h1>

            <motion.p
              className="text-neutral-400 text-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Build, test, and iterate on your frontend without waiting for backend APIs.
              Create realistic mock responses with just a few clicks.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                Get started <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                className="bg-neutral-800 hover:bg-neutral-700 px-6 py-3 rounded-lg font-medium transition-all"
              >
                View demo
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-24 grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Mock APIs</h3>
              <p className="text-neutral-400">Create custom API endpoints in seconds with JSON responses that match your needs.</p>
            </div>

            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simulate Real Conditions</h3>
              <p className="text-neutral-400">Add network delays, error states, and conditional responses to test all scenarios.</p>
            </div>

            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
              <p className="text-neutral-400">Organize and version your mock APIs with an intuitive dashboard interface.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-neutral-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold mb-2">Trusted by developers worldwide</h2>
            <p className="text-neutral-400">Join thousands of developers who use MockAPI to speed up their workflow</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}