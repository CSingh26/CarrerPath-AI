// components/processing-indicator.tsx
"use client";

import { motion } from "framer-motion";

export interface ProcessingStage {
  key: string;
  label: string;
}

interface ProcessingIndicatorProps {
  stages: ProcessingStage[];
  currentStage: number;
  isComplete?: boolean;
}

export default function ProcessingIndicator({
  stages,
  currentStage,
  isComplete,
}: ProcessingIndicatorProps) {
  return (
    <div className="space-y-8">
      {stages.map((stage, idx) => {
        const isActive = idx === currentStage;
        const isCompleted = idx < currentStage || isComplete;

        return (
          <motion.div
            key={stage.key}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {/* Status indicator */}
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
              <div
                className={`absolute h-10 w-10 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500"
                    : isActive
                    ? "bg-blue-500"
                    : "bg-slate-200"
                }`}
              />

              {isCompleted ? (
                <svg
                  className="relative z-10 h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : isActive ? (
                <motion.div
                  className="relative z-10 h-2 w-2 rounded-full bg-white"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ) : (
                <div className="relative z-10 h-2 w-2 rounded-full bg-slate-400" />
              )}
            </div>

            {/* Stage label */}
            <div className="flex-1">
              <p
                className={`text-sm font-medium transition-colors ${
                  isActive || isCompleted
                    ? "text-slate-900"
                    : "text-slate-400"
                }`}
              >
                {stage.label}
              </p>
              {isActive && (
                <motion.p
                  className="text-xs text-slate-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Processing...
                </motion.p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
