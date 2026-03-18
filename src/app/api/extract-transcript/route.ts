// app/api/extract-transcript/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as pdfParse from "pdf-parse";
import { extractTranscriptData } from "@/lib/openai/extract-transcript";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and images are supported." },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    let textContent = "";

    if (file.type === "application/pdf") {
      // Extract text from PDF
      try {
        const data = await pdfParse(Buffer.from(buffer));
        textContent = data.text;
      } catch {
        return NextResponse.json(
          { error: "Failed to parse PDF" },
          { status: 400 }
        );
      }
    } else {
      // For images, send to OpenAI with vision
      // TODO: Implement vision API for OCR
      return NextResponse.json(
        { error: "Image processing not yet implemented" },
        { status: 501 }
      );
    }

    // Extract transcript data using OpenAI
    const transcriptData = await extractTranscriptData({
      textContent,
    });

    return NextResponse.json(transcriptData);
  } catch (error) {
    console.error("Error in extract-transcript:", error);
    return NextResponse.json(
      { error: "Failed to process transcript" },
      { status: 500 }
    );
  }
}
