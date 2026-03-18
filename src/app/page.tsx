// app/page.tsx
import Hero from "@/components/hero";
import TranscriptUpload from "@/components/transcript-upload";
import FeatureHighlights from "@/components/feature-highlights";

export default function Home() {
  return (
    <div>
      <Hero />
      <TranscriptUpload />
      <FeatureHighlights />

      {/* Trust section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-slate-600">
            ⓘ CareerPath-AI analyzes your transcript to provide guidance only.
            This tool does not make hiring decisions or replace official academic advising.
          </p>
        </div>
      </section>
    </div>
  );
}
