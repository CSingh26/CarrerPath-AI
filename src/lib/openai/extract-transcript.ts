// lib/openai/extract-transcript.ts
import type { TranscriptData } from "@/types/transcript";
import { client } from "./client";

interface ExtractionPromptParams {
  textContent: string;
}

export async function extractTranscriptData(
  params: ExtractionPromptParams
): Promise<TranscriptData> {
  const { textContent } = params;

  const systemPrompt = `You are an expert transcript analyzer. Extract structured data from academic transcripts.
Return a JSON object with this exact structure:
{
  "university": "University Name",
  "major": "Major or Program Name",
  "courses": [
    { "courseCode": "CS101", "courseTitle": "Intro to Computer Science", "credits": 3, "grade": "A" },
    ...
  ],
  "gpa": 3.85
}

Only include fields if they are present in the transcript. If a field is missing, omit it or set to null.`;

  const userPrompt = `Please extract structured information from this transcript:\n\n${textContent}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from OpenAI");

    const parsed = JSON.parse(content);
    return {
      ...parsed,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error extracting transcript:", error);
    throw new Error("Failed to extract transcript data");
  }
}
