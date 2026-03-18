// components/hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-20 sm:py-28"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6"
          variants={itemVariants}
        >
          Understand Your Future
        </motion.h1>

        <motion.p
          className="text-xl text-slate-600 max-w-2xl mx-auto mb-8"
          variants={itemVariants}
        >
          Upload your transcript. Get an AI-powered analysis of your skills,
          career fit, and personalized next steps.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Link href="#upload" className="btn btn-primary text-lg px-8 py-3 inline-block">
            Start Analysis
          </Link>
          <button className="btn btn-secondary text-lg px-8 py-3">
            Learn More
          </button>
        </motion.div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    </motion.section>
  );
}
