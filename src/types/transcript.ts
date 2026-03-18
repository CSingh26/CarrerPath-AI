// types/transcript.ts
export interface ExtractedCourse {
  courseCode: string;
  courseTitle: string;
  credits?: number;
  grade?: string;
  semester?: string;
}

export interface TranscriptData {
  university: string;
  major?: string;
  courses: ExtractedCourse[];
  gpa?: number;
  extractedAt: string;
}

export interface ProcessingState {
  stage: 'reading' | 'extracting' | 'looking-up' | 'analyzing-skills' | 'matching
-domains' | 'generating-recommendations' | 'complete';
  progress: number;
  message: string;
}
