import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MODEL_MAPPING: Record<string, string> = {
  "gemini-flash": "google/gemini-3-flash-preview",
  "gemini-pro": "google/gemini-3-pro-preview",
  "gpt-5": "openai/gpt-5",
  "gpt-5-mini": "openai/gpt-5-mini",
  // Free models using smaller/efficient variants
  "llama-free": "google/gemini-2.5-flash-lite",
  "mistral-free": "google/gemini-2.5-flash-lite",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model, itemType, difficulty, numberOfItems } = await req.json();
    
    console.log(`Generating ${numberOfItems} ${itemType} items with difficulty ${difficulty} using model ${model}`);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const mappedModel = MODEL_MAPPING[model] || "google/gemini-3-flash-preview";

    const systemPrompt = `You are an expert assessment item creator. Generate high-quality assessment items based on the given topic. 

For each item, provide:
- A clear, well-written question
- 4 answer options (for MCQ) or 2 options (for True/False)
- Mark the correct answer
- Assign a score of 1 point per item

Return the response as a JSON array with this structure:
[
  {
    "question": "The question text",
    "type": "${itemType === 'mcq' ? 'Multiple Choice' : itemType === 'truefalse' ? 'True/False' : itemType === 'fillin' ? 'Fill in the Blanks' : 'Essay'}",
    "options": [
      { "text": "Option A", "isCorrect": false },
      { "text": "Option B", "isCorrect": true },
      { "text": "Option C", "isCorrect": false },
      { "text": "Option D", "isCorrect": false }
    ],
    "score": 1
  }
]

Difficulty level: ${difficulty}
Number of items to generate: ${numberOfItems}

IMPORTANT: Only return the JSON array, no additional text or markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: mappedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate items" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI Response content:", content);

    // Parse the JSON response
    let items;
    try {
      // Handle potential markdown code blocks
      let jsonContent = content.trim();
      if (jsonContent.startsWith("```json")) {
        jsonContent = jsonContent.slice(7);
      }
      if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent.slice(3);
      }
      if (jsonContent.endsWith("```")) {
        jsonContent = jsonContent.slice(0, -3);
      }
      items = JSON.parse(jsonContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI-generated items");
    }

    // Add unique IDs and codes to items
    const timestamp = Date.now();
    const generatedItems = items.map((item: any, index: number) => ({
      id: `gen-${timestamp}-${index}`,
      code: `AI-GEN-${String(index + 1).padStart(3, "0")}`,
      ...item,
    }));

    console.log(`Successfully generated ${generatedItems.length} items`);

    return new Response(JSON.stringify({ items: generatedItems }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error generating items:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
