"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Code, Plus, Zap, Star, ChevronRight, Users, Clock4, GitMerge, FileCode2, Check, X } from "lucide-react";
import Footer from "./_components/_common/Footer";
import Navbar from "./_components/_common/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useRouter } from "next/navigation";
import AuthRoute from "./_components/_common/AuthRoute";
import CodeBlock from "./_components/_common/CodeBlock";
import {
  HERO_CONTENT,
  BEFORE_CODE,
  AFTER_CODE,
  PROBLEM_SECTION,
  HOW_IT_WORKS,
  KEY_BENEFITS,
  TESTIMONIAL,
  FINAL_CTA,
  API_RESPONSE_EXAMPLE
} from "./_constants/home";

// Map string icon names to actual Lucide icon components
const getIconComponent = (iconName: string, size: number = 24) => {
  const icons: Record<string, JSX.Element> = {
    Plus: <Plus size={size} />,
    Code: <Code size={size} />,
    Zap: <Zap size={size} />,
    Clock4: <Clock4 size={size} />,
    Users: <Users size={size} />,
    GitMerge: <GitMerge size={size} />,
    FileCode2: <FileCode2 size={size} />,
  };
  return icons[iconName] || null;
};

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const solutionRef = useRef(null);
  const featureRef = useRef(null);

  // InView hooks for scroll-based animations
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const solutionInView = useInView(solutionRef, { once: true, amount: 0.3 });
  const featureInView = useInView(featureRef, { once: true, amount: 0.3 });

  // Scroll-based parallax effect
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <AuthRoute>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen py-16 sm:py-24 flex items-center relative" ref={heroRef}>
          <motion.div className="absolute inset-0 pointer-events-none" style={{ y }}>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] bg-blue-500/20 rounded-full blur-[120px]"></div>
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
                {HERO_CONTENT.badge}
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-center pb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-heading"
                initial={{ opacity: 0, y: 10 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.3 }}
              >
                {HERO_CONTENT.heading.split('. ')[0]}<span className="text-blue-500">.</span><br />
                {HERO_CONTENT.heading.split('. ')[1]}<span className="text-blue-500">.</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed text-center text-neutral-400 font-body px-2 sm:px-0"
                initial={{ opacity: 0, y: 10 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.4 }}
              >
                {HERO_CONTENT.description}
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

            {/* API Response Demo */}
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
                  <pre className="whitespace-pre-wrap break-words">{API_RESPONSE_EXAMPLE}</pre>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem-Solution Section */}
        <section className="py-16 sm:py-32 relative overflow-hidden" ref={solutionRef}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -top-[30vw] -right-[30vw] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-[30vw] -left-[30vw] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              className="text-center mb-10 sm:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight font-heading">
                {PROBLEM_SECTION.heading}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed px-2">
                {PROBLEM_SECTION.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start max-w-6xl mx-auto">
              {/* Left Column - Without Mock API */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-8 mb-6 sm:mb-10 shadow-xl relative h-full">
                  <div className="absolute -top-3 -left-3 px-2 sm:px-4 py-1 sm:py-2 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                    <X size={16} className="text-red-400" />
                    <h3 className="text-sm sm:text-xl font-semibold text-red-300">
                      {PROBLEM_SECTION.without.title}
                    </h3>
                  </div>
                  <div className="bg-neutral-800/70 rounded-lg p-3 sm:p-6 mt-6 sm:mt-8 backdrop-blur-sm border border-neutral-700/50 font-mono">
                    <div className="overflow-x-auto">
                      <CodeBlock code={BEFORE_CODE} language="javascript" />
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {PROBLEM_SECTION.without.problems.map((problem, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                        <div className="min-w-5 pt-0.5"><X size={16} className="text-red-400" /></div>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Right Column - With Mock API */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-8 mb-6 sm:mb-10 shadow-xl relative h-full">
                  <div className="absolute -top-3 -left-3 px-2 sm:px-4 py-1 sm:py-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                    <Check size={16} className="text-green-400" />
                    <h3 className="text-sm sm:text-xl font-semibold text-green-300">
                      {PROBLEM_SECTION.with.title}
                    </h3>
                  </div>
                  <div className="bg-neutral-800/70 rounded-lg p-3 sm:p-6 mt-6 sm:mt-8 backdrop-blur-sm border border-neutral-700/50 font-mono">
                    <div className="overflow-x-auto">
                      <CodeBlock code={AFTER_CODE} language="javascript" />
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {PROBLEM_SECTION.with.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                        <div className="min-w-5 pt-0.5"><Check size={16} className="text-green-400" /></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-black to-gray-950">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-blue-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                <Star size={16} className="text-yellow-400" />
                {HOW_IT_WORKS.badge}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight font-heading">
                <span className="text-white">{HOW_IT_WORKS.heading.split('to ')[0]}to</span>
                <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  {HOW_IT_WORKS.heading.split('to ')[1]}
                </span>
              </h2>
            </motion.div>

            {/* 3-Step Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {HOW_IT_WORKS.steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${step.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {step.number}
                      </div>
                      <div className="ml-4 bg-green-500/20 text-green-300 text-xs font-medium py-1 px-2 rounded-full">
                        {step.time}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                    <div className="mb-3 p-2 rounded-md bg-gray-800/50 border border-gray-700/50 text-xs font-mono text-blue-300">
                      {step.example}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Clock4 size={12} className="mr-1" />
                      <span>Without mocks: <span className="text-red-400">{step.traditional}</span></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-950 to-black" ref={featureRef}>
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featureInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{KEY_BENEFITS.heading}</h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto px-2">
                {KEY_BENEFITS.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KEY_BENEFITS.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className={`w-12 h-12 rounded-full ${benefit.color} flex items-center justify-center mb-4`}>
                    {getIconComponent(benefit.iconName)}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-lg p-5 border border-blue-900/30 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <blockquote className="text-lg font-medium text-gray-300 italic">
                "{TESTIMONIAL.quote}"
              </blockquote>
              <div className="mt-4 text-gray-400 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mr-3"></div>
                <div>
                  <div className="text-sm font-medium">{TESTIMONIAL.name}</div>
                  <div className="text-xs">{TESTIMONIAL.role}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-black to-gray-950">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">{FINAL_CTA.heading}</h2>
              <p className="text-neutral-400 mb-8">{FINAL_CTA.description}</p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 rounded-full font-medium text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
              >
                {FINAL_CTA.buttonText} <ChevronRight size={20} />
              </Link>
              <div className="mt-6 flex items-center justify-center gap-6">
                {FINAL_CTA.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-gray-500 text-sm">
                    <Check size={16} className="text-green-400 mr-2" />
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </AuthRoute>
  );
}