// components/results-dashboard.tsx
"use client";

import { motion } from "framer-motion";
import type { CareerAnalysis, SkillProfile } from "@/types/career";

interface ResultsDashboardProps {
  analysis: CareerAnalysis;
  skillProfile: SkillProfile;
}

export default function ResultsDashboard({
  analysis,
  skillProfile,
}: ResultsDashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Domains */}
      <motion.section variants={itemVariants}>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Your Top Domains
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.topDomains?.slice(0, 4).map((domain, idx) => (
            <motion.div
              key={idx}
              className="card p-6"
              variants={itemVariants}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {domain.domain}
                </h3>
                <span className="badge">
                  {Math.round(domain.fitScore * 100)}% Fit
                </span>
              </div>

              {/* Fit score visualization */}
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${domain.fitScore * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>

              <p className="text-sm text-slate-600 mb-3">
                {domain.matchingCourses.length} matching courses
              </p>
              <div className="flex flex-wrap gap-2">
                {domain.relevantSkills.slice(0, 3).map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Skills Profile */}
      <motion.section variants={itemVariants}>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Your Skill Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div className="card p-6" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Strengths
            </h3>
            <div className="space-y-3">
              {skillProfile.strengths.slice(0, 5).map((strength, idx) => (
                <div key={idx} className="text-sm border-b border-slate-100 pb-3">
                  <p className="font-medium text-slate-900">{strength.skill}</p>
                  <p className="text-xs text-slate-500">{strength.evidence}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gaps */}
          <motion.div className="card p-6" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Areas to Develop
            </h3>
            <div className="space-y-3">
              {skillProfile.gaps.slice(0, 5).map((gap, idx) => (
                <div key={idx} className="text-sm border-b border-slate-100 pb-3">
                  <p className="font-medium text-slate-900">{gap.skill}</p>
                  <p className="text-xs text-slate-500">{gap.reason}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Target Field Analysis */}
      {analysis.targetFieldAnalysis && (
        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {analysis.targetFieldAnalysis.field} Analysis
          </h2>
          <motion.div className="card p-8" variants={itemVariants}>
            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">Fit Score</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        analysis.targetFieldAnalysis.fitScore * 100
                      }%`,
                    }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    analysis.targetFieldAnalysis.fitScore * 100
                  )}%
                </span>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">
                Missing Skills
              </h4>
              <ul className="space-y-2">
                {analysis.targetFieldAnalysis.missingSkills.map(
                  (skill, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-700 flex items-start gap-2"
                    >
                      <span className="text-orange-500 mt-1">✓</span>
                      {skill}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Next Steps */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">
                Recommended Next Steps
              </h4>
              <ul className="space-y-2">
                {analysis.targetFieldAnalysis.nextSteps.map(
                  (step, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-700 flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-1">→</span>
                      {step}
                    </li>
                  )
                )}
              </ul>
            </div>
          </motion.div>
        </motion.section>
      )}
    </motion.div>
  );
}
