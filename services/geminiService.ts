
import { GoogleGenAI, Modality, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { ParsedContent, GroundingSource, NewsletterData } from '../types';

// In production, API_KEY will be "PLACEHOLDER" — route through backend proxy
const apiKey = process.env.API_KEY || '';
const isProduction = !apiKey || apiKey === 'PLACEHOLDER';
const proxyBaseUrl = typeof window !== 'undefined' ? `${window.location.origin}/api-proxy` : '/api-proxy';

const ai = new GoogleGenAI({
  apiKey: isProduction ? 'PLACEHOLDER' : apiKey,
  ...(isProduction && { httpOptions: { baseUrl: proxyBaseUrl } }),
});

function parseNewsletterMarkdown(markdown: string): ParsedContent {
  const lines = markdown.split('\n').filter(line => line.trim() !== '');

  let title = "Generated Newsletter";
  let intro = "";
  const keyPoints: string[] = [];

  let isIntroSection = false;
  let isKeyPointsSection = false;

  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.substring(2).trim();
      isIntroSection = true;
      isKeyPointsSection = false;
      continue;
    }
    if (line.startsWith('## ')) {
      isKeyPointsSection = true;
      isIntroSection = false;
      continue;
    }

    if (isKeyPointsSection && line.startsWith('- ')) {
      keyPoints.push(line.substring(2).trim());
    } else if (isIntroSection) {
      intro += line + '\n';
    }
  }

  return {
    title,
    intro: intro.trim(),
    keyPoints,
  };
}

// FIX: Updated the return type to Promise<NewsletterData> to correctly include the `image` property, aligning with the function's return value and fixing type errors in consuming components.
export const generateNewsletter = async (topic: string, language: string, domains?: string): Promise<NewsletterData> => {
  const langMap: { [key: string]: string } = {
    en: 'English',
    cs: 'Czech',
    sk: 'Slovak',
  };
  const languageName = langMap[language] || 'English';

  const domainRestriction = domains && domains.trim()
    ? `\nIMPORTANT: Focus your research EXCLUSIVELY on the following domains: ${domains.trim()}. Only cite and use sources from these domains. Do not use any other sources.\n`
    : '';

  const today = new Date().toISOString().split('T')[0]; // e.g. "2026-04-15"

  const textPrompt = `You are an expert executive search and leadership consulting analyst working for Stanton Chase. Your task is to generate a professional newsletter about the topic: "${topic}". The entire response must be in ${languageName}.
Today's date is ${today}. Use your deep search capabilities to find the most relevant and up-to-date information. Prioritize sources published within the last 30 days.${domainRestriction}

CRITICAL RULES:
- Report ONLY on confirmed facts, events that have already happened, published data, and verified information.
- DO NOT make predictions, forecasts, or speculate about future developments.
- Every key point must be grounded in a specific, verifiable source (news article, report, study, official statement).
- Use past tense or present tense for things that are true NOW. Never use phrases like "is expected to", "will likely", "is predicted to", "could potentially", "may lead to", "in the coming years".
- If a statistic or claim is mentioned, it must come from an actual published source found in your search.
- Focus on WHAT HAPPENED, WHO said/did WHAT, and WHAT the current situation IS — not what might happen next.

Structure your response *strictly* in the following Markdown format. Do not add any other text or explanations before or after this structure.

# [A compelling and professional title for the newsletter]

[A detailed introductory paragraph summarizing the key findings based on verified facts and recent events.]

## Key points

- [First key point — based on a specific fact, event, or data point]
- [Second key point — based on a specific fact, event, or data point]
- [Third key point — based on a specific fact, event, or data point]
- [Fourth key point — based on a specific fact, event, or data point]
- [Fifth key point — based on a specific fact, event, or data point]
`;

  const imagePrompt = `Generate a professional, high-quality, and thematic stock photo style image for a business newsletter about "${topic}". The image should be clean, modern, and visually appealing. Avoid text and logos.`;

  try {
    // Generate text content (required)
    console.log("Starting text generation with gemini-2.5-pro...");
    console.log("API Key present:", !!process.env.API_KEY, "length:", (process.env.API_KEY || '').length);
    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: textPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    console.log("Text generation successful!");

    const content = parseNewsletterMarkdown(textResponse.text);
    const sources = (textResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || []).filter(c => c.web) as GroundingSource[];

    // Generate image (optional — newsletter works without it)
    let imageUrl = '';
    try {
      console.log("Starting image generation with gemini-3.1-flash-image-preview...");
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts: [{ text: imagePrompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      console.log("Image generation successful!");

      const imagePart = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      const imageBase64 = imagePart?.inlineData?.data || '';
      if (imageBase64) {
        imageUrl = `data:image/png;base64,${imageBase64}`;
      }
    } catch (imageError: any) {
      console.warn("Image generation failed (continuing without image):", imageError?.message || imageError);
    }

    return {
      content,
      sources,
      image: imageUrl
    };
  } catch (error: any) {
    console.error("Error generating newsletter:", error?.message || error);
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw new Error("Failed to generate newsletter content.");
  }
};
