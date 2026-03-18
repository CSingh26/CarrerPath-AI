// components/transcript-upload.tsx
"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";

interface UploadProps {
  onUploadStart?: () => void;
}

export default function TranscriptUpload({ onUploadStart }: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or image (PNG/JPG)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB");
      return;
    }

    onUploadStart?.();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/extract-transcript", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      console.log("Transcript extracted:", data);
      // Store in session and redirect
      sessionStorage.setItem("transcriptData", JSON.stringify(data));
      window.location.href = "/analyze";
    } catch (error) {
      console.error("Error uploading transcript:", error);
      alert(`Failed to process transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputClick = () => {
    const input = document.getElementById("file-input") as HTMLInputElement;
    if (input) input.click();
  };

  return (
    <motion.section
      id="upload"
      className="py-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="mx-auto max-w-2xl">
        <div
          className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 bg-slate-50 hover:border-slate-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.png,.jpg,.jpeg"
            disabled={isLoading}
          />

          <div className="cursor-pointer" onClick={handleInputClick}>
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {isLoading ? "Processing..." : "Upload Your Transcript"}
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              Drag and drop your transcript (PDF, PNG, or JPG) or click to browse
            </p>

            <button
              type="button"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Select File"}
            </button>

            <p className="mt-4 text-xs text-slate-400">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
