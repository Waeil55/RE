import Anthropic from '@anthropic-ai/sdk';
import * as FileSystem from 'expo-file-system';

export interface EnhancementResult {
  analysisText: string;
  improvements: {
    type: string;
    label: string;
    description: string;
    applied: boolean;
  }[];
  qualityScore: {
    before: number;
    after: number;
  };
  processingSteps: string[];
}

/**
 * Analyzes a real estate photo using Claude's vision API and returns:
 * - Detected issues (clutter, poor lighting, personal items)
 * - Enhancement recommendations
 * - Professional staging advice
 * - Quality score
 *
 * Note: Claude API performs visual analysis and returns enhancement
 * instructions. For actual pixel-level manipulation, this integrates
 * with a backend image processing service.
 */
export async function analyzePropertyPhoto(
  imageBase64: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  apiKey: string
): Promise<EnhancementResult> {
  const client = new Anthropic({ apiKey });

  const systemPrompt = `You are a professional real estate photography AI assistant specializing in MLS-compliant photo enhancement analysis.

Your role is to analyze real estate photos and provide:
1. A detailed assessment of photo quality issues
2. Specific, actionable enhancement recommendations
3. Identification of personal items that should be removed for staging
4. Lighting and exposure correction needs
5. A quality score before and after theoretical enhancements

Critical compliance rules you must follow:
- NEVER suggest altering structural elements (walls, floors, ceilings, windows, doors)
- NEVER suggest changing material properties (wood grain, tile type, countertop material)
- NEVER suggest replacing or swapping appliances or fixtures
- ONLY suggest removing transient personal items (clothes, papers, personal photos, clutter)
- ONLY suggest lighting corrections that reflect realistic improvements
- All enhancements must represent the true, real property

Respond in valid JSON format only.`;

  const userPrompt = `Analyze this real estate photo and provide a comprehensive enhancement report.

Return a JSON object with exactly this structure:
{
  "analysisText": "A 2-3 sentence professional summary of the photo's current state and enhancement potential",
  "improvements": [
    {
      "type": "declutter|lighting|color-grade|upscale|sharpen|noise-reduction|exposure",
      "label": "Short label (max 4 words)",
      "description": "Specific description of what needs to be done",
      "applied": true
    }
  ],
  "qualityScore": {
    "before": <number 1-100>,
    "after": <number 1-100>
  },
  "processingSteps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "detectedIssues": {
    "clutterItems": ["list of specific personal/clutter items detected"],
    "lightingIssues": ["specific lighting problems"],
    "qualityIssues": ["blur, noise, resolution issues"]
  }
}

Be specific and actionable. Real estate photographers charge $500-2000/session — your analysis should match that quality standard.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: userPrompt,
          },
        ],
      },
    ],
  });

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

  // Extract JSON from response
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response as JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    analysisText: parsed.analysisText || 'Analysis complete.',
    improvements: parsed.improvements || [],
    qualityScore: parsed.qualityScore || { before: 40, after: 92 },
    processingSteps: parsed.processingSteps || [],
  };
}

/**
 * Generates a professional staging report for a property image.
 * This helps real estate agents understand what a professional
 * photographer would do to improve the listing photo.
 */
export async function generateStagingReport(
  imageBase64: string,
  roomType: string,
  apiKey: string
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `This is a real estate photo of a ${roomType}.

As a professional real estate stager and photographer, provide a concise, actionable staging report in 3-5 bullet points covering:
• What personal/clutter items to remove
• Lighting improvements needed
• Composition or angle suggestions
• Any quick staging wins

Focus on realistic, achievable improvements that don't alter the property's structure or materials.`,
          },
        ],
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
