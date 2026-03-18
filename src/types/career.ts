// types/career.ts
export interface SkillProfile {
  coreSkills: string[];
  tools: string[];
  concepts: string[];
  strengths: { skill: string; evidence: string; confidence: number }[];
  gaps: { skill: string; reason: string }[];
}

export interface CareerDomain {
  domain: string;
  fitScore: number;
  matchingCourses: string[];
  relevantSkills: string[];
}

export interface CareerAnalysis {
  topDomains: CareerDomain[];
  targetFieldAnalysis?: {
    field: string;
    fitScore: number;
    strengths: string[];
    missingSkills: string[];
    nextSteps: string[];
  };
}
