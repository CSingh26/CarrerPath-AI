// app/analyze/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProcessingIndicator from "@/components/processing-indicator";
import type { ProcessingStage } from "@/components/processing-indicator";
import type { TranscriptData, ExtractedCourse } from "@/types/transcript";
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
  const [error, setError] = useState<string | null>(null);

  const analyzeTranscript = useCallback(async (data: TranscriptData) => {
    try {
      // Progress through stages
      for (let i = 0; i < PROCESSING_STAGES.length; i++) {
        setProcessingStage(i);
        
        // Add delay between stages for UX
        if (i < PROCESSING_STAGES.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }

      // Call the analysis API
      const response = await fetch("/api/analyze-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: data.university,
          courses: data.courses,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis API failed");
      }

      const result = await response.json();
      
      // Store results in sessionStorage
      sessionStorage.setItem("careerAnalysis", JSON.stringify(result.topDomains ? result : { topDomains: result.topDomains }));
      sessionStorage.setItem("skillProfile", JSON.stringify(result.skillProfile || {}));
      
      // Mark as complete
      setAnalysis(result);
      setSkillProfile(result.skillProfile);
      setProcessingStage(PROCESSING_STAGES.length);

      // Redirect to results after a brief pause
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/results");
    } catch (err) {
      console.error("Error analyzing transcript:", err);
      setError(`Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      setProcessingStage(-1);
    }
  }, [router]);

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        // Get transcript data from sessionStorage
        const stored = sessionStorage.getItem("transcriptData");
        if (!stored) {
          setError("No transcript data found. Please upload a transcript first.");
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        const data = JSON.parse(stored) as TranscriptData;
        setTranscriptData(data);

        // Start the analysis process
        setProcessingStage(0);
        
        // Begin transcript analysis
        await analyzeTranscript(data);
      } catch (err) {
        console.error("Error starting analysis:", err);
        setError("Failed to start analysis. Please try again.");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    startAnalysis();
  }, [analyzeTranscript, router]);

  const isProcessing = processingStage >= 0 && processingStage < PROCESSING_STAGES.length;
  const isComplete = processingStage === PROCESSING_STAGES.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 card p-6 bg-red-50 border border-red-200">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!isProcessing && !isComplete && !error && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-6">
              <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Preparing Analysis...
            </h1>
            <p className="text-lg text-slate-600">
              Loading your transcript data.
            </p>
          </div>
        )}

        {isProcessing && (
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 text-center">
              Analyzing Your Transcript
            </h1>
            <p className="text-center text-slate-600 mb-12">
              This may take a moment as we process your coursework and match career domains.
            </p>
            <div className="card p-12">
              <ProcessingIndicator
                stages={PROCESSING_STAGES}
                currentStage={processingStage}
              />
            </div>
          </div>
        )}

        {isComplete && (
          <div className="card p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Analysis Complete!
            </h2>
            <p className="text-slate-600 mb-8">
              Your transcript has been successfully analyzed. Redirecting to your results...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
