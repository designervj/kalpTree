// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const { sample_dictionary, parsedTexts, lang, apiKey, model } =
//       await request.json();

//     const array = parsedTexts.map((d: any) => d.text);
//     const finalText = [...new Set(array)];

//     const prompt = `
// You are a professional translation engine.

// Generate a translation dictionary in STRICT JSON format.

// INPUT:

// parsedTexts:
// ${JSON.stringify(finalText)}

// websiteLangs:
// ${JSON.stringify(lang)}

// sample_dictionary:
// ${JSON.stringify(sample_dictionary)}

// RULES:

// 1. For EACH unique text in parsedTexts:
//    - Use the EXACT original text as the key.
//    - Value must contain ALL languages from websiteLangs.

// 2. The language where "default": true:
//    - MUST contain the original text unchanged.

// 3. Other languages:
//    - Provide accurate natural translations.
//    - Do NOT leave empty.
//    - Do NOT copy original text unless identical.

// 4. Preserve punctuation, spacing, and capitalization exactly.

// 5. Output MUST:
//    - Be valid JSON
//    - Contain ONLY the dictionary object
//    - No explanation
//    - No markdown
//    - No extra text
// `;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model,
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a strict JSON translation engine. You ONLY output valid JSON. No markdown. No explanation. No extra text.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.2,
//         max_tokens: 1000,
//         response_format: { type: "json_object" }, // 🔥 Forces valid JSON
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error?.message || "OpenAI API error");
//     }

//     const result = data;

//     return NextResponse.json({
//       success: true,
//       data: result,
//     });
//   } catch (error: any) {
//     console.error("LLM Test Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message || "An error occurred while testing the API",
//       },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

const CHUNK_SIZE = 30; // Safe chunk size

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function translateChunk({
  chunk,
  lang,
  sample_dictionary,
  apiKey,
  model,
}: any) {
  const prompt = `
You are a professional translation engine.

Generate a translation dictionary in STRICT JSON format.

parsedTexts:
${JSON.stringify(chunk)}

websiteLangs:
${JSON.stringify(lang)}

sample_dictionary:
${JSON.stringify(sample_dictionary)}

RULES:
- Use EXACT original text as key
- Include ALL languages
- Default language must remain unchanged
- No explanation
- JSON only
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON translation engine. Output valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI API error");
  }

  return JSON.parse(data.choices[0].message.content);
}

export async function POST(request: NextRequest) {
  try {
    const { sample_dictionary, parsedTexts, lang, apiKey, model } =
      await request.json();

    const uniqueTexts = [...new Set(parsedTexts.map((d: any) => d.text))];

    const chunks = chunkArray(uniqueTexts, CHUNK_SIZE);

    const finalDictionary: Record<string, any> = {};

    for (const chunk of chunks) {
      const partial = await translateChunk({
        chunk,
        lang,
        sample_dictionary,
        apiKey,
        model,
      });

      Object.assign(finalDictionary, partial);
    }

    return NextResponse.json({
      success: true,
      data: finalDictionary,
    });
  } catch (error: any) {
    console.error("Translation Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
