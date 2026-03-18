// types/course.ts
export interface CourseSource {
  url: string;
  title: string;
  snippet: string;
  description?: string;
  sourceType: 'catalog' | 'syllabus' | 'department';
}

export interface CourseDetail {
  courseCode: string;
  courseTitle: string;
  university: string;
  sources: CourseSource[];
  extractedSkills: string[];
  confidence: number;
}
