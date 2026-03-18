// app/results/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ResultsDashboard from "@/components/results-dashboard";
import type { CareerAnalysis, SkillProfile } from "@/types/career";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [targetField, setTargetField] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Load analysis data from session storage or URL params
    const stored = sessionStorage.getItem("careerAnalysis");
    const skills = sessionStorage.getItem("skillProfile");
    if (stored && skills) {
      setAnalysis(JSON.parse(stored));
      setSkillProfile(JSON.parse(skills));
    } else {
      router.push("/");
    }
  }, [router]);

  const handleSearchField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillProfile || !targetField.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/search-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldName: targetField,
          skillProfile,
        }),
      });

      if (!response.ok) {
        alert("Field not found. Try another domain.");
        setIsSearching(false);
        return;
      }

      const result = await response.json();
      setAnalysis({
        ...analysis,
        targetFieldAnalysis: result,
      } as CareerAnalysis);
    } catch (error) {
      console.error("Error searching field:", error);
      alert("Failed to analyze field");
    } finally {
      setIsSearching(false);
    }
  };

  if (!analysis || !skillProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Your Career Analysis
          </h1>
          <p className="text-lg text-slate-600">
            Based on your academic profile and coursework
          </p>
        </div>

        {/* Target Field Search */}
        <div className="card p-6 mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Search a Specific Field
          </h2>
          <form onSubmit={handleSearchField} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Software Engineering, Data Science, Web Development..."
              value={targetField}
              onChange={(e) => setTargetField(e.target.value)}
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="btn btn-primary"
            >
              {isSearching ? "Analyzing..." : "Analyze"}
            </button>
          </form>
          <p className="text-sm text-slate-500 mt-2">
            Supported fields: Software Engineering, Data Science, Web Development, DevOps,
            Machine Learning, Cybersecurity
          </p>
        </div>

        {/* Results Dashboard */}
        {analysis && skillProfile && (
          <ResultsDashboard analysis={analysis} skillProfile={skillProfile} />
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-12 justify-center">
          <button onClick={() => router.push("/")} className="btn btn-secondary">
            Start Over
          </button>
          <button className="btn btn-primary">
            Export as PDF
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
