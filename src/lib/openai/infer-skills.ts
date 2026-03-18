// lib/openai/infer-skills.ts
import type { ExtractedCourse } from "@/types/transcript";
import type { SkillProfile } from "@/types/career";
import { client } from "./client";

interface InferSkillsParams {
  courses: ExtractedCourse[];
  courseDescriptions: Record<string, string>;
}

export async function inferSkillProfile(
  params: InferSkillsParams
): Promise<SkillProfile> {
  const { courses, courseDescriptions } = params;

  const courseInfo = courses
    .map((course) => {
      const description = courseDescriptions[course.courseCode] || "No description available";
      return `${course.courseCode}: ${course.courseTitle} (Grade: ${
        course.grade || "N/A"
      })\nDescription: ${description}`;
    })
    .join("\n\n");

  const systemPrompt = `You are an expert career advisor and skill analyst. Analyze a student's coursework and infer their skill profile.
Return a JSON object with this exact structure:
{
  "coreSkills": ["skill1", "skill2", ...],
  "tools": ["tool1", "tool2", ...],
  "concepts": ["concept1", "concept2", ...],
  "strengths": [
    { "skill": "Python", "evidence": "CS201, CS301", "confidence": 0.9 },
    ...
  ],
  "gaps": [
    { "skill": "DevOps", "reason": "Not covered in available coursework" },
    ...
  ]
}`;

  const userPrompt = `Analyze these courses and infer the student's skills:\n\n${courseInfo}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from OpenAI");

    return JSON.parse(content);
  } catch (error) {
    console.error("Error inferring skills:", error);
    throw new Error("Failed to infer skill profile");
  }
}
