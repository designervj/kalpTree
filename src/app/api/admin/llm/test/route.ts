import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { modelType, model, apiKey, prompt, componentHtml, componentCss } = await request.json();

    if (!modelType || !apiKey || !prompt) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: modelType, apiKey, and prompt are required" },
        { status: 400 }
      );
    }

    let result = "";

    // GrapesJS-specific system instructions
    const grapesJSSystemPrompt = `You are an expert HTML/CSS developer specializing in creating GrapesJS-compatible components.

CRITICAL RULES FOR HTML GENERATION:
1. Generate ONLY valid, semantic HTML5 code
2. Use INLINE styles exclusively - NO CSS classes, NO external stylesheets, NO <style> tags
3. Include ARIA labels and accessibility attributes where appropriate
4. Use semantic HTML5 elements (<section>, <header>, <article>, <nav>, <footer>, etc.)
5. Use descriptive, meaningful text - NO "Lorem ipsum" or generic placeholders
6. Ensure proper button and link usage with appropriate attributes
7. Return ONLY the HTML code wrapped in a \`\`\`html code block
8. Make components responsive using inline styles with percentage widths where appropriate
9. Use modern CSS properties in inline styles (flexbox, grid, etc.)
10. Ensure all colors have good contrast for accessibility

When modifying existing HTML:
- Preserve the original structure unless explicitly asked to change it
- Apply the requested changes while maintaining all GrapesJS compatibility rules
- Ensure all modifications use inline styles only
- Keep the component self-contained and functional

Example of proper inline styling:
<div style="display: flex; justify-content: center; align-items: center; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
  <h1 style="color: #333; font-size: 24px; margin: 0;">Title</h1>
</div>

Always wrap your response in a code block like this:
\`\`\`html
[your HTML code here]
\`\`\``;

    // Enhance prompt with component HTML and CSS context if provided
    // Build context string with both HTML and CSS
    let contextString = "";
    if (componentHtml) {
      contextString += `Here is the HTML component:\n${componentHtml}`;
    }
    if (componentCss) {
      contextString += contextString ? `\n\nHere is the CSS for this component:\n${componentCss}` : `Here is the CSS for this component:\n${componentCss}`;
    }

    // For Gemini, we include the system prompt in the user message
    const enhancedPromptForGemini = contextString
      ? `${grapesJSSystemPrompt}\n\nContext: ${contextString}\n\nUser Request: ${prompt}`
      : `${grapesJSSystemPrompt}\n\nUser Request: ${prompt}`;

    // For ChatGPT, we use the system role (already defined in the messages array)
    const enhancedPrompt = contextString
      ? `Context: ${contextString}\n\nUser Request: ${prompt}`
      : prompt;

    // Test ChatGPT API
    if (modelType === "ChatGPT") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: `You are an expert HTML/CSS developer specializing in creating GrapesJS-compatible components.

CRITICAL RULES FOR HTML GENERATION:
1. Generate ONLY valid, semantic HTML5 code
2. Use INLINE styles exclusively - NO CSS classes, NO external stylesheets, NO <style> tags
3. Include ARIA labels and accessibility attributes where appropriate
4. Use semantic HTML5 elements (<section>, <header>, <article>, <nav>, <footer>, etc.)
5. Use descriptive, meaningful text - NO "Lorem ipsum" or generic placeholders
6. Ensure proper button and link usage with appropriate attributes
7. Return ONLY the HTML code wrapped in a \`\`\`html code block
8. Make components responsive using inline styles with percentage widths where appropriate
9. Use modern CSS properties in inline styles (flexbox, grid, etc.)
10. Ensure all colors have good contrast for accessibility

When modifying existing HTML:
- Preserve the original structure unless explicitly asked to change it
- Apply the requested changes while maintaining all GrapesJS compatibility rules
- Ensure all modifications use inline styles only
- Keep the component self-contained and functional

Example of proper inline styling:
<div style="display: flex; justify-content: center; align-items: center; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
  <h1 style="color: #333; font-size: 24px; margin: 0;">Title</h1>
</div>

Always wrap your response in a code block like this:
\`\`\`html
[your HTML code here]
\`\`\``
            },
            {
              role: "user",
              content: enhancedPrompt,
            },
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: data.error?.message || "ChatGPT API request failed",
          },
          { status: response.status }
        );
      }

      result = data.choices?.[0]?.message?.content || "No response from ChatGPT";
    }
    // Test Gemini API
    else if (modelType === "Gemini") {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: enhancedPromptForGemini,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: data.error?.message || "Gemini API request failed",
          },
          { status: response.status }
        );
      }

      result =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini";
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported model type" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      result: result,
    });
  } catch (error: any) {
    console.error("LLM Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while testing the API",
      },
      { status: 500 }
    );
  }
}
