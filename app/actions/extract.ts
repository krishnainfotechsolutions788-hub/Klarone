"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const schema = {
  type: "object",
  properties: {
    productName: { type: "string", description: "The full product name (e.g. Lenovo ThinkPad T14 Gen 4)" },
    brandName: { type: "string", description: "The brand of the laptop (e.g. Apple, Lenovo)" },
    model: { type: "string", description: "The primary model name (e.g. MacBook Air M3)" },
    series: { type: "string", description: "The series name if applicable (e.g. ThinkPad, ROG)" },
    releaseYear: { type: "integer", description: "The release year, typically 4 digits" },
    cpu: { type: "string", description: "Processor details" },
    gpu: { type: "string", description: "Graphics card details" },
    ram: { type: "string", description: "Memory details" },
    storage: { type: "string", description: "Storage details" },
    display: { type: "string", description: "Display details" },
    battery: { type: "string", description: "Battery capacity" },
    weight: { type: "number", description: "Weight in kg as a decimal" },
    msrp: { type: "number", description: "Approximate price in INR" },
    description: { type: "string", description: "A detailed HTML formatted master description of the product." },
    images: { 
      type: "array", 
      items: { type: "string" },
      description: "Array of absolute image URLs found in the content. CRITICAL: Extract EVERY SINGLE product image URL you can find. Do NOT limit or truncate the list. There may be 10+ images, please find and include all of them."
    },
    dynamicSpecs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          group: { type: "string", description: "Category/Group like Dimensions, Ports, Connectivity, etc." },
          attribute: { type: "string", description: "Specific spec name like 'Wireless', 'USB Ports'" },
          value: { type: "string", description: "The value of the spec" }
        }
      },
      description: "Any extra specifications that don't fit into the main fields."
    }
  },
  required: ["brandName", "model", "cpu", "gpu", "ram", "storage", "display", "battery", "weight"]
};

export async function extractSpecsWithAI(inputText: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { success: false, error: "GEMINI_API_KEY is not configured in .env.local" };
  }

  try {
    let contentToProcess = inputText;

    // Check if the input is a URL
    if (inputText.trim().startsWith("http://") || inputText.trim().startsWith("https://")) {
      try {
        const response = await fetch(inputText.trim(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
        if (response.ok) {
          const html = await response.text();
          // Remove noisy tags but KEEP scripts (Flipkart uses window.__INITIAL_STATE__) and images
          contentToProcess = html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/\s+/g, ' ');
        }
      } catch (fetchError) {
        console.warn("Failed to fetch URL directly, falling back to treating as text", fetchError);
      }
    }

    const prompt = `Extract the technical specifications from the following text (which might be raw HTML) and format them according to the JSON schema. Pay close attention to extracting high-resolution absolute image URLs from <img> tags or JSON/Scripts data. If a value is missing, use an empty string or 0 as appropriate.\n\nText/HTML to process:\n${contentToProcess.substring(0, 300000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);

    return { success: true, data: parsed };
  } catch (error: any) {
    console.error("Failed to extract specs with AI:", error);
    return { success: false, error: error.message || "Failed to process text" };
  }
}
