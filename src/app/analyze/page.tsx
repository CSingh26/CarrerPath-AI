// app/analyze/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProcessingIndicator from "@/components/processing-indicator";
import type { ProcessingStage } from "@/components/processing-indicator";
import type { TranscriptData } from "@/types/transcript";
import type { CareerAnalysis, SkillProfile } from "@/types/career";

const PROCESSING_STAGES: ProcessingStage[] = [
  { key: "reading", label: "Reading transcript" },
  { key: "extracting", label: "Extracting courses and grades" },
  { key: "lookup", label: "Finding official course details" },
  { key: "skills", label: "Building your skill profile" },
  { key: "matching", label: "Matching career domains" },
  { key: "generating", label: "Generating recommendations" },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [processingStage, setProcessingStage] = useState<number>(-1);
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);

  // TODO: Initialize with data from sessionStorage or API
  const isProcessing = processingStage >= 0 && processingStage < PROCESSING_STAGES.length;
  const isComplete = processingStage === PROCESSING_STAGES.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {!isProcessing && !isComplete && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Ready to analyze your transcript?
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Upload a transcript to get started with your career analysis.
            </p>
            <button onClick={() => router.push("/")} className="btn btn-primary text-lg">
              Go Back
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="card p-12">
            <ProcessingIndicator
              stages={PROCESSING_STAGES}
              currentStage={processingStage}
            />
          </div>
        )}

        {isComplete && (
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Analysis Complete!
            </h2>
            <p className="text-slate-600 mb-8">
              Your transcript has been successfully analyzed. Redirecting to results...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
