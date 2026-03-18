// app/api/search-field/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { SkillProfile } from "@/types/career";
import { matchTargetDomain, calculateCareerFitScore } from "@/lib/scoring/career-matching";

interface FieldSearchRequest {
  fieldName: string;
  skillProfile: SkillProfile;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FieldSearchRequest;
    const { fieldName, skillProfile } = body;

    if (!fieldName || !skillProfile) {
      return NextResponse.json(
        { error: "Missing field name or skill profile" },
        { status: 400 }
      );
    }

    // Find matching domain
    const domain = matchTargetDomain(skillProfile, fieldName);
    if (!domain) {
      return NextResponse.json(
        {
          error: `Domain "${fieldName}" not found. Try: Software Engineering, Data Science, Web Development, DevOps, Machine Learning, or Cybersecurity`,
        },
        { status: 404 }
      );
    }

    // Calculate fit score and analysis
    const fitScore = calculateCareerFitScore(skillProfile, domain);
    const missingSkills = domain.requiredSkills.filter(
      (s) =>
        !skillProfile.coreSkills.concat(skillProfile.tools).some((st) =>
          st.toLowerCase().includes(s.toLowerCase())
        )
    );

    const strengths = skillProfile.strengths
      .filter((s) =>
        domain.requiredSkills.some((rs) =>
          rs.toLowerCase().includes(s.skill.toLowerCase())
        )
      )
      .map((s) => s.skill);

    const nextSteps = generateRecommendations(missingSkills, domain.preferredTools);

    return NextResponse.json({
      field: domain.domain,
      fitScore,
      strengths,
      missingSkills,
      preferredTools: domain.preferredTools,
      nextSteps,
    });
  } catch (error) {
    console.error("Error in field search:", error);
    return NextResponse.json(
      { error: "Failed to analyze field fit" },
      { status: 500 }
    );
  }
}

function generateRecommendations(missingSkills: string[], tools: string[]): string[] {
  const recommendations: string[] = [];

  if (missingSkills.length > 0) {
    recommendations.push(
      `Focus on learning: ${missingSkills.slice(0, 2).join(", ")}`
    );
  }

  recommendations.push(
    `Develop proficiency with: ${tools.slice(0, 2).join(", ")}`
  );
  recommendations.push("Create a portfolio project demonstrating your skills");
  recommendations.push("Engage with the community through meetups and conferences");
  recommendations.push("Consider mentorship or internship opportunities");

  return recommendations;
}
