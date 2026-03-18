// components/feature-highlights.tsx
"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Fast Extraction",
    description: "Instantly extract courses, grades, and university info from your transcript",
    icon: "⚡",
  },
  {
    title: "Official Course Details",
    description: "Find official university course descriptions and syllabi",
    icon: "📚",
  },
  {
    title: "Skill Analysis",
    description: "Get a comprehensive skill profile inferred from your coursework",
    icon: "🎯",
  },
  {
    title: "Career Matching",
    description: "Receive personalized career domain recommendations and fit scores",
    icon: "💼",
  },
];

export default function FeatureHighlights() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-3xl font-bold text-center text-slate-900 mb-12"
          variants={itemVariants}
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="card p-6"
              variants={itemVariants}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
