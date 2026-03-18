// lib/openai/client.ts
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

const client = new OpenAI({ apiKey });

export { client };
