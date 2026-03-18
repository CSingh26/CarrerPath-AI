// lib/course-lookup/search.ts
import type { CourseSource } from "@/types/course";

interface GoogleSearchResult {
  link: string;
  title: string;
  snippet: string;
}

/**
 * Search for official university course information
 * Prioritizes official university domains for course catalog and syllabus pages
 */
export async function searchCourseSources(
  university: string,
  courseCode: string,
  courseTitle: string
): Promise<CourseSource[]> {
  try {
    // Build search query prioritizing official university domain
    const universityDomain = parseUniversityDomain(university);
    const searchQuery = buildSearchQuery(university, courseCode, courseTitle, universityDomain);

    // TODO: Implement web search (would use Google Custom Search API or similar)
    // For now, return mock results
    const sources = await getMockCourseSources(university, courseCode, courseTitle);
    
    return sources;
  } catch (error) {
    console.error("Error searching course sources:", error);
    return [];
  }
}

function parseUniversityDomain(university: string): string {
  const universityMap: Record<string, string> = {
    stanford: "stanford.edu",
    "stanford university": "stanford.edu",
    berkeley: "berkeley.edu",
    "uc berkeley": "berkeley.edu",
    cornell: "cornell.edu",
    "cornell university": "cornell.edu",
    harvard: "harvard.edu",
    "harvard university": "harvard.edu",
    mit: "mit.edu",
    "massachusetts institute of technology": "mit.edu",
  };

  const normalized = university.toLowerCase();
  return universityMap[normalized] || extractDomainPattern(normalized);
}

function extractDomainPattern(university: string): string {
  // Extract first word and add .edu
  const words = university.split(" ");
  const first = words[0];
  return `${first.toLowerCase()}.edu`;
}

function buildSearchQuery(
  university: string,
  courseCode: string,
  courseTitle: string,
  domain: string
): string {
  return `site:${domain} OR site:registrar.${domain} "${courseCode}" syllabus OR catalog`;
}

async function getMockCourseSources(
  university: string,
  courseCode: string,
  courseTitle: string
): Promise<CourseSource[]> {
  // Mock data - in production, would call actual search API
  return [
    {
      url: `https://example-uni.edu/catalog/${courseCode}`,
      title: `${courseCode} - ${courseTitle}`,
      snippet: "Official course catalog description with learning outcomes.",
      sourceType: "catalog",
    },
    {
      url: `https://example-uni.edu/registrar/syllabi/${courseCode}`,
      title: `${courseCode} Syllabus`,
      snippet: "Course syllabus including topics covered and grading policy.",
      sourceType: "syllabus",
    },
  ];
}
