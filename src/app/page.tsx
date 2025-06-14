"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { ArrowRight, Clock, X, Check, Code, PlayCircle, PauseCircle, RefreshCw } from "lucide-react";
import Footer from "./_components/_common/Footer";
import Navbar from "./_components/_common/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useRouter } from "next/navigation";
import AuthRoute from "./_components/_common/AuthRoute";
import CodeBlock from "./_components/_common/CodeBlock";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const featureRef = useRef(null);
  const demoRef = useRef(null);

  // InView hooks for scroll-based animations
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const storyInView = useInView(storyRef, { once: false, amount: 0.3 });
  const featureInView = useInView(featureRef, { once: true, amount: 0.3 });
  const demoInView = useInView(demoRef, { once: true, amount: 0.3 });

  // Scroll-based parallax effect
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Sample code snippets for the story
  const beforeCode = `// Waiting for backend API to be completed...
const fetchData = async () => {
  // TODO: Implement when backend is ready
  // const response = await fetch('/api/data');
  // const data = await response.json();
  
  // Using placeholder data for now
  return [{ id: 1, name: "Placeholder" }];
};`;

  const afterCode = `// Using Mock API Playground
const fetchData = async () => {
  const response = await fetch('https://mockapi.io/yourusername/products');
  const data = await response.json();
  return data; // Real-looking data, instantly available
};`;

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  // Timeline states for animation sequence
  const timelineSteps = [
    { title: "Backend delays", description: "Your project is stuck waiting for API endpoints" },
    { title: "Create mock API", description: "Set up realistic responses in minutes" },
    { title: "Build your frontend", description: "Develop without backend dependencies" },
    { title: "Test edge cases", description: "Simulate errors and edge conditions" },
    { title: "Seamless transition", description: "Switch to real API when it's ready" }
  ];

  return (
    <AuthRoute>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navbar />

        {/* Hero Section with Dynamic Animation */}
        <section className="min-h-screen py-16 sm:py-24 flex items-center relative" ref={heroRef}>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y }}
          >
            {/* Responsive background blurs */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] bg-blue-500/20 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/3 left-1/3 w-[60vw] max-w-[400px] h-[60vw] max-h-[400px] bg-purple-500/20 rounded-full blur-[120px]"></div>
          </motion.div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="flex items-center gap-2 px-3 sm:px-4 py-1 bg-neutral-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 w-fit mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Launching Beta v1.0
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-center pb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-heading"
                initial={{ opacity: 0, y: 10 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.3 }}
              >
                Stop waiting<br />Start building<span className="text-blue-500">.</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed text-center text-neutral-400 font-body px-2 sm:px-0"
                initial={{ opacity: 0, y: 10 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.4 }}
              >
                Create realistic mock APIs in seconds. Build your frontend without
                waiting for backend APIs to be ready. It's the development superpower
                you've been waiting for.
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center sm:justify-start gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:translate-y-[-2px]"
                >
                  Get started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating API Response Demo */}
            <motion.div
              className="mt-10 sm:mt-16 mx-auto w-full max-w-full sm:max-w-4xl relative px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl"></div>
              <div className="relative bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-700 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-gray-400 text-xs font-mono px-2 py-1 bg-gray-700/50 rounded">
                    GET /api/products
                  </div>
                  <div className="hidden sm:block"></div>
                </div>
                <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-green-400 max-h-[300px] overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">{`[
  {
    "id": 1,
    "name": "Quantum X1 Headphones",
    "price": 299.99,
    "category": "Audio",
    "inStock": true,
    "rating": 4.8,
    "specs": {
      "color": "Midnight Black",
      "wireless": true,
      "batteryLife": "40 hours"
    }
  },
  {
    "id": 2,
    "name": "Stellar 4K Monitor",
    "price": 549.99,
    "category": "Display",
    "inStock": false,
    "rating": 4.6,
    "specs": {
      "size": "32 inch",
      "resolution": "3840x2160",
      "refreshRate": "144Hz"
    }
  }
]`}</pre>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator - hide on mobile */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center">
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full mt-2"
                animate={{ y: [0, 16, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
          </motion.div>
        </section>

        {/* Developer Story Section - Improved Styling */}
        <section className="py-16 sm:py-32 relative overflow-hidden" ref={storyRef}>
          {/* Background accent - responsive sizing */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -top-[30vw] -right-[30vw] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-[30vw] -left-[30vw] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div 
              className="text-center mb-10 sm:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight font-heading">The Developer's Dilemma</h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed px-2">
                Every frontend developer knows the pain of waiting for backend APIs.
                Here's how we solve it.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start max-w-6xl mx-auto">
              {/* Left Column - Without Mock API */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col h-full"
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-8 mb-6 sm:mb-10 shadow-xl relative h-full">
                  <div className="absolute -top-3 -left-3 px-2 sm:px-4 py-1 sm:py-2 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                    <X size={16} className="text-red-400" />
                    <h3 className="text-sm sm:text-xl font-semibold text-red-300">Without Mock API</h3>
                  </div>
                  <div className="bg-neutral-800/70 rounded-lg p-3 sm:p-6 mt-6 sm:mt-8 backdrop-blur-sm border border-neutral-700/50 font-mono">
                    <div className="overflow-x-auto">
                      <CodeBlock code={beforeCode} language="javascript" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 flex items-center gap-3 text-neutral-400 border-t border-neutral-800 pt-4 sm:pt-6">
                    <Clock size={16} className="sm:text-lg" />
                    <span className="text-xs sm:text-sm">Development blocked, waiting for backend</span>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Without Mock API items - more compact on mobile */}
                  <motion.div 
                    className="flex items-start gap-3 sm:gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 mt-1 shadow-lg shadow-red-500/5 flex-shrink-0">
                      <X size={18} className="sm:size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Slow Feedback Loops</h4>
                      <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">Can't iterate quickly on UI changes while waiting for backend APIs to be implemented.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3 sm:gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 mt-1 shadow-lg shadow-red-500/5 flex-shrink-0">
                      <X size={18} className="sm:size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Unrealistic Test Data</h4>
                      <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">Placeholder data doesn't match real API structure, causing refactoring later.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3 sm:gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 mt-1 shadow-lg shadow-red-500/5 flex-shrink-0">
                      <X size={18} className="sm:size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Dependency Blocking</h4>
                      <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">Your entire team is bottlenecked, slowing down the whole project timeline.</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - With Mock API */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col h-full"
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-8 mb-6 sm:mb-10 shadow-xl relative h-full">
                  <div className="absolute -top-3 -left-3 px-2 sm:px-4 py-1 sm:py-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                    <Check size={16} className="text-green-400" />
                    <h3 className="text-sm sm:text-xl font-semibold text-green-300">With Mock API</h3>
                  </div>
                  <div className="bg-neutral-800/70 rounded-lg p-3 sm:p-6 mt-6 sm:mt-8 backdrop-blur-sm border border-neutral-700/50 font-mono">
                    <div className="overflow-x-auto">
                      <CodeBlock code={afterCode} language="javascript" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 flex items-center gap-3 text-green-400 border-t border-neutral-800 pt-4 sm:pt-6">
                    <PlayCircle size={16} className="sm:text-lg" />
                    <span className="text-xs sm:text-sm">Development continues unblocked</span>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <motion.div 
                    className="flex items-start gap-3 sm:gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 mt-1 shadow-lg shadow-green-500/10">
                      <Check size={18} className="sm:size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Instant Feedback</h4>
                      <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">Iterate on UI with realistic data immediately, allowing for rapid development cycles.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3 sm:gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 mt-1 shadow-lg shadow-green-500/10">
                      <Check size={18} className="sm:size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Production-Like Data</h4>
                      <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">APIs match your exact requirements with realistic responses you can customize.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3 sm:gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 mt-1 shadow-lg shadow-green-500/10">
                      <Check size={18} className="sm:size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Team Independence</h4>
                      <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">Frontend development proceeds at full speed without backend dependencies.</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Development Timeline - Mobile Responsive */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-16 text-center">The Developer Journey</h2>

            <div className="relative">
              {/* Timeline connector - Hide on mobile, show on larger screens */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-700/30 transform -translate-x-1/2 hidden md:block"></div>

              {/* Mobile timeline - vertical with left alignment */}
              <div className="md:hidden">
                {timelineSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col mb-10 relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {/* Left timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-700/30"></div>
                    
                    {/* Circle with number */}
                    <div className="z-10 flex-shrink-0 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-black flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="ml-4">
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-neutral-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop timeline - alternating sides */}
              <div className="hidden md:block">
                {timelineSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center mb-20 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <div className={`w-1/2 px-4 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-neutral-400">{step.description}</p>
                    </div>

                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-black flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-blue-600 opacity-40 animate-ping"></div>
                    </div>

                    <div className="w-1/2 px-4"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features with Scroll Animation */}
        <section className="py-16 sm:py-24 relative" ref={featureRef}>
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featureInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Designed for Developers</h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto px-2">
                Everything you need to create realistic APIs without writing a single line of backend code
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: <Code className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />,
                  title: "Instant Mock APIs",
                  description: "Create custom API endpoints in seconds with JSON responses that match your needs.",
                  bgColor: "bg-blue-500/20" 
                },
                {
                  icon: <PauseCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
                  title: "Simulate Real Conditions",
                  description: "Add network delays, error states, and conditional responses to test all scenarios.",
                  bgColor: "bg-blue-500/20"
                },
                {
                  icon: <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />,
                  title: "Easy Management",
                  description: "Organize and version your mock APIs with an intuitive dashboard interface.",
                  bgColor: "bg-blue-500/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-neutral-900 p-6 sm:p-8 rounded-xl border border-neutral-800 group hover:border-blue-900/40 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  animate={featureInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-heading">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-neutral-400 font-body">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Mobile Responsive */}
        <section className="py-16 sm:py-32 relative overflow-hidden">
          {/* Modern animated gradient background */}
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-purple-600/10 animate-gradient-slow"></div>
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-slow animation-delay-2000"></div>
          </div>
          
          {/* Decorative elements - hidden on smallest screens */}
          <div className="absolute inset-0 opacity-30 hidden sm:block">
            <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-blue-400 rounded-full animate-ping-slow"></div>
            <div className="absolute top-[30%] right-[25%] w-2 h-2 bg-purple-400 rounded-full animate-ping-slow animation-delay-1000"></div>
            <div className="absolute bottom-[20%] left-[35%] w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping-slow animation-delay-3000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="relative max-w-5xl mx-auto">
              {/* Glass card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="backdrop-blur-xl bg-white/[0.01] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Content side */}
                  <div className="w-full md:w-2/3 p-6 sm:p-12 md:p-16">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-heading bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200"
                    >
                      Ready to accelerate your workflow?
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="text-base sm:text-lg md:text-xl text-white/70 mt-4 sm:mt-6 mb-6 sm:mb-10 leading-relaxed max-w-xl"
                    >
                      Join thousands of developers who've transformed their development process with Mock API Playground.
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex flex-wrap gap-4"
                    >
                      <Link
                        href="/auth/signup"
                        className="w-full sm:w-auto text-center group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                      >
                        <span className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
                          Start building now <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                      </Link>
                    </motion.div>
                  </div>
                  
                  {/* Visual side - hidden on mobile */}
                  <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 relative hidden md:block">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative"
                      >
                        {/* Code editor visual */}
                        <div className="w-64 h-64 rounded-2xl bg-gray-900/90 border border-gray-700/50 shadow-xl p-4 transform rotate-6 backdrop-blur-sm">
                          <div className="flex items-center gap-1.5 mb-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-blue-500/30 rounded"></div>
                            <div className="h-3 w-4/5 bg-green-500/30 rounded"></div>
                            <div className="h-3 w-3/5 bg-purple-500/30 rounded"></div>
                            <div className="h-3 w-2/3 bg-blue-500/30 rounded"></div>
                          </div>
                        </div>
                        
                        {/* Floating API response */}
                        <div className="absolute -bottom-10 -left-16 w-48 h-36 rounded-xl bg-gray-900/90 border border-gray-700/50 shadow-xl p-3 transform -rotate-3 backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-green-400 font-mono">200 OK</div>
                            <div className="text-xs text-gray-400 font-mono">48ms</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-2.5 w-full bg-indigo-500/30 rounded"></div>
                            <div className="h-2.5 w-5/6 bg-indigo-500/30 rounded"></div>
                            <div className="h-2.5 w-4/6 bg-indigo-500/30 rounded"></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Responsive logo overlay */}
        <div className="fixed top-20 left-1/2 -translate-x-1/2 transform opacity-10 pointer-events-none max-w-full">
          <img src="/favicon.ico" alt="MockFlow Logo" className="w-[40vw] max-w-[200px] h-[40vw] max-h-[200px] sm:max-w-[400px] sm:max-h-[400px]" />
        </div>

        <Footer />
      </div>
    </AuthRoute>
  );
}