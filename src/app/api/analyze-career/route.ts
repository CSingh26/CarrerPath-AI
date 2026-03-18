// app/api/analyze-career/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { ExtractedCourse } from "@/types/transcript";
import type { SkillProfile } from "@/types/career";
import { inferSkillProfile } from "@/lib/openai/infer-skills";
import { getTopDomains, matchTargetDomain, calculateCareerFitScore } from "@/lib/scoring/career-matching";
import { searchCourseSources } from "@/lib/course-lookup/search";

interface AnalysisRequest {
  university: string;
  courses: ExtractedCourse[];
  targetField?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalysisRequest;
    const { university, courses, targetField } = body;

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { error: "No courses provided" },
        { status: 400 }
      );
    }

    // Step 1: Search for course descriptions
    const courseDescriptions: Record<string, string> = {};
    for (const course of courses) {
      try {
        const sources = await searchCourseSources(
          university,
          course.courseCode,
          course.courseTitle
        );
        if (sources.length > 0) {
          courseDescriptions[course.courseCode] = sources[0].description || sources[0].snippet;
        }
      } catch (error) {
        console.error(`Error searching course ${course.courseCode}:`, error);
      }
    }

    // Step 2: Infer skill profile
    const skillProfile: SkillProfile = await inferSkillProfile({
      courses,
      courseDescriptions,
    });

    // Step 3: Get top matching domains
    const topDomains = getTopDomains(skillProfile, 5).map((d) => ({
      domain: d.domain,
      fitScore: d.fitScore,
      matchingCourses: courses
        .filter((c) =>
          d.requiredSkills.some((s) =>
            courseDescriptions[c.courseCode]?.toLowerCase().includes(s.toLowerCase())
          )
        )
        .map((c) => c.courseCode),
      relevantSkills: d.requiredSkills.slice(0, 5),
    }));

    // Step 4: Analyze target field if provided
    let targetFieldAnalysis = null;
    if (targetField) {
      const targetDomain = matchTargetDomain(skillProfile, targetField);
      if (targetDomain) {
        const fitScore = calculateCareerFitScore(skillProfile, targetDomain);
        const missingSkills = targetDomain.requiredSkills.filter(
          (s) =>
            !skillProfile.coreSkills.concat(skillProfile.tools).some((st) =>
              st.toLowerCase().includes(s.toLowerCase())
            )
        );

        targetFieldAnalysis = {
          field: targetField,
          fitScore,
          strengths: skillProfile.strengths
            .filter((s) =>
              targetDomain.requiredSkills.some((rs) =>
                rs.toLowerCase().includes(s.skill.toLowerCase())
              )
            )
            .map((s) => s.skill),
          missingSkills,
          nextSteps: generateNextSteps(missingSkills, skillProfile.gaps),
        };
      }
    }

    return NextResponse.json({
      topDomains,
      targetFieldAnalysis,
      skillProfile,
    });
  } catch (error) {
    console.error("Error in career analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze career fit" },
      { status: 500 }
    );
  }
}

function generateNextSteps(missingSkills: string[], currentGaps: Array<{ skill: string }>): string[] {
  const steps: string[] = [];

  if (missingSkills.length > 0) {
    steps.push(`Take courses focused on: ${missingSkills.slice(0, 2).join(", ")}`);
  }

  steps.push("Build projects showcasing your existing skills");
  steps.push("Contribute to open source projects in your target domain");
  steps.push("Pursue relevant certifications or bootcamps");
  steps.push("Seek internships in your target field");

  return steps;
}
