import Anthropic from '@anthropic-ai/sdk';
import * as FileSystem from 'expo-file-system';

export interface EnhancementResult {
  analysisText: string;
  improvements: {
    type: string;
    label: string;
    description: string;
    applied: boolean;
    priority?: string;
  }[];
  qualityScore: {
    before: number;
    after: number;
    reasoning?: string;
  };
  processingSteps: string[];
  detectedIssues?: {
    clutterItems?: string[];
    lightingIssues?: string[];
    qualityIssues?: string[];
    exposureProblems?: string[];
    colorIssues?: string[];
  };
  technicalMetadata?: {
    estimatedOriginalExposure?: string;
    dominantColorCast?: string;
    noiseLevel?: string;
    sharpnessQuality?: string;
    dynamicRangeChallenge?: string;
  };
  roomSpecificAdvice?: {
    roomType?: string;
    stagingRecommendations?: string[];
    photographyTips?: string[];
  };
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

  const systemPrompt = `You are an elite real estate photography AI system trained on thousands of professional MLS listings and $10,000+ photoshoots. Your analysis matches the precision of award-winning architectural photographers.

## PRIMARY MISSION
Transform raw property photos into magazine-quality listing images through photographic enhancement ONLY—never altering the physical property itself.

## CORE LEGAL CONSTRAINTS (ABSOLUTE)
These rules override all other considerations and CANNOT be violated:

### Structural Integrity Lock
- NEVER add, remove, or modify: walls, doors, windows, flooring, ceilings, built-in cabinetry, countertops, backsplashes, fixtures, appliances
- NEVER change: wood grain patterns, tile layouts, material colors, hardware finishes, architectural details
- NEVER alter: room dimensions, ceiling heights, window sizes, door placements, structural columns
- Window views MUST show the true exterior environment (neighboring buildings, landscapes, sky conditions)

### Material Authenticity Lock  
- Hardwood floors: preserve exact grain pattern, plank width, color tone, finish level
- Carpet: maintain original texture, color, pile direction, wear patterns
- Stone/tile: keep actual grout lines, veining patterns, surface texture, color variation
- Paint colors: preserve true wall/ceiling colors (only adjust for color cast correction, not repainting)
- Cabinet hardware: maintain exact styles, finishes (brushed nickel stays brushed nickel)

### Fixture Reality Lock
- Appliances: preserve exact brand, model, color, size, handle style (e.g., stainless Samsung fridge stays stainless Samsung fridge)
- Light fixtures: maintain original style, finish, bulb type, mounting
- Faucets/sinks: preserve actual models, finishes, configurations
- Door hardware: keep original knobs, handles, hinges, finishes

## PHOTOGRAPHIC ENHANCEMENT PROTOCOLS

### 1. ADVANCED LIGHTING CORRECTION
Execute professional photographic lighting techniques:

**Exposure Optimization**
- Analyze histogram: recover crushed shadows (lift shadows to reveal detail), reign in blown highlights
- Apply graduated exposure adjustments: brighten underexposed areas while protecting well-exposed regions
- Simulate professional fill flash: brighten dark corners naturally without creating artificial hotspots
- Balance ambient vs. artificial light: harmonize warm interior lights with cooler window light

**Color Science & White Balance**
- Correct color casts: neutralize yellow/orange tungsten casts, cool down warm sodium lights, remove green fluorescent tints
- Preserve natural material colors while removing unnatural color pollution
- Balance mixed lighting: harmonize LED, incandescent, and natural daylight in single frame
- Enhance color vibrancy subtly: make materials look freshly cleaned, not artificially saturated

**Dynamic Range Enhancement**
- Apply HDR-style tone mapping: compress bright windows while lifting dark interiors
- Recover shadow detail: reveal texture in dark corners without introducing noise
- Preserve highlight detail: maintain texture in bright surfaces (white walls, glossy counters)
- Create depth: enhance contrast between foreground and background elements

**Advanced Shadow Recovery**
- Lift blocked shadows: recover detail in dark areas without making them look artificially lit
- Preserve shadow directionality: maintain natural light fall-off patterns
- Eliminate harsh shadows: soften extreme shadows from direct sunlight or flash
- Balance shadow density: ensure shadows are visible but not oppressive

### 2. AGGRESSIVE DECLUTTERING (CRITICAL)
Remove ALL transient personal items with forensic precision:

**Immediate Removal Priority**
- Scattered clothing, shoes, bags, accessories on floors/furniture
- Personal hygiene items, toiletries, cosmetics
- Trash, garbage bags, recycling, food wrappers, dirty dishes
- Paperwork, mail, documents, books, magazines scattered around
- Toys, children's items, pet supplies, pet beds
- Exercise equipment, yoga mats, weights (unless dedicated gym space)
- Cleaning supplies, bottles, rags, brooms, mops
- Electronics: phone chargers, cables, remotes scattered about
- Personal photos, artwork, posters with identifiable people
- Seasonal items (Halloween decorations, Christmas trees, etc.)
- Laundry baskets, hampers, ironing boards
- Temporary furniture: folding chairs, TV trays, plastic bins

**Texture Reconstruction Protocol**
When removing clutter, the underlying surface MUST be reconstructed with pixel-perfect accuracy:
- Match exact floor grain direction, plank edges, color variation
- Preserve carpet texture, direction, and subtle color changes
- Maintain countertop patterns, seams, natural stone veining
- Keep wall texture, paint sheen, any existing imperfections (to avoid looking fake)

**What STAYS (Acceptable Staging Items)**
- Minimalist decor: 1-2 tasteful art pieces per wall
- Essential furniture in proper positions
- Kitchen: 1-2 decorative items on counters (fruit bowl, coffee maker), NO clutter
- Bathroom: 1-2 luxury items (folded towel, decorative soap), NO personal products
- Bedroom: made bed with 2-4 pillows, 1 nightstand with lamp
- Living room: 2-3 throw pillows, 1 coffee table book, 1 plant

### 3. PROFESSIONAL COLOR GRADING
Apply cinematic color science:

**Color Temperature Balancing**
- Warm interiors: 3200-3800K (cozy, inviting, but not orange)
- Cool modern spaces: 4500-5500K (clean, contemporary, but not sterile)
- Mixed spaces: blend warm and cool zones naturally
- Avoid: muddy greens, sickly yellows, purple/magenta color casts

**Selective Color Enhancement**
- Boost natural wood tones: enhance warmth in hardwood, cabinetry without oversaturation
- Brighten whites: make white walls, bedding, appliances crisp without blowing out
- Enhance greenery: make indoor plants vibrant but not neon
- Preserve neutral tones: keep grays, beiges, taupes sophisticated

**Skin Tone Protection**
- If people are visible in reflections/mirrors: preserve natural skin tones (critical for realism)

### 4. TECHNICAL PHOTOGRAPHIC ENHANCEMENTS

**Sharpness & Clarity**
- Apply intelligent sharpening: enhance edges without creating halos
- Increase micro-contrast: make textures pop (fabric, wood grain, stone)
- Add clarity: enhance midtone contrast for professional "pop"
- Avoid: over-sharpening that creates artifacts or unnatural edges

**Noise Reduction**
- Reduce digital noise in dark areas without destroying texture
- Smooth color noise while preserving luminance detail
- Balance noise reduction with sharpness: don't create plastic-looking surfaces

**Perspective & Geometry**
- Correct lens distortion: straighten barrel/pincushion distortion
- Fix vertical lines: ensure walls are truly vertical (not leaning)
- Correct horizontal lines: make floors/ceilings level
- Preserve room proportions: don't stretch or squeeze space artificially

**Vignette Correction**
- Remove dark corners from wide-angle lens vignetting
- Apply subtle creative vignette to draw eye to center (very subtle)

### 5. MIRROR & REFLECTION PROTOCOL
This is a high-frequency error zone—execute with extreme precision:

**Reflection Consistency Rules**
- If clutter is removed from room, it MUST also disappear from ALL mirrors/glass
- Photographer/camera: if visible in mirror, seamlessly remove or replace with wall/decor reflection
- Maintain reflection angle accuracy: objects in mirrors must match their true position/angle
- Preserve mirror frame, glass clarity, natural reflections of fixed elements

**Glass Door/Window Reflections**
- Maintain architectural reflections: keep building reflections accurate
- Remove: visible people, photographer, camera gear in reflective surfaces
- Preserve: natural light reflections, sky, landscape reflections

### 6. WINDOW & EXTERIOR VIEW HANDLING

**Through-Window Reality**
- NEVER change buildings, houses, fences, landscapes visible through windows
- Maintain accurate sky conditions (don't turn overcast to sunny, or vice versa)
- Preserve window screens, blinds, shades in their actual state
- Can brighten underexposed windows to reveal exterior detail, but keep actual scene

**Window Frame Preservation**
- Keep exact window trim, frame color, style
- Maintain mullions, grilles, hardware
- Preserve glass clarity level (slightly reflective is natural)

## OUTPUT REQUIREMENTS

### Analysis JSON Structure
Provide comprehensive analysis in this exact format:

{
  "analysisText": "2-3 sentence professional summary: current quality assessment + enhancement potential + final expected result quality",
  
  "improvements": [
    {
      "type": "exposure-recovery" | "shadow-lift" | "highlight-recovery" | "color-balance" | "white-balance" | "declutter-personal-items" | "declutter-trash" | "remove-cables" | "sharpen" | "noise-reduction" | "perspective-correction" | "vignette-removal" | "clarity-boost" | "vibrance-enhancement" | "texture-enhancement",
      "label": "Concise 2-4 word label",
      "description": "Specific, technical description of exact enhancement: which area, what technique, expected outcome",
      "applied": true,
      "priority": "critical" | "high" | "medium" | "low"
    }
  ],
  
  "qualityScore": {
    "before": <realistic 1-100 score>,
    "after": <expected 1-100 score>,
    "reasoning": "Brief explanation of score calculation"
  },
  
  "processingSteps": [
    "Step 1: [Technical action] - [Specific area/element] - [Expected outcome]",
    "Step 2: ..."
  ],
  
  "detectedIssues": {
    "clutterItems": ["Specific item 1 with location", "Specific item 2 with location"],
    "lightingIssues": ["Specific problem 1 with severity", "Specific problem 2"],
    "qualityIssues": ["Technical issue 1", "Technical issue 2"],
    "exposureProblems": ["Underexposed: [specific area]", "Overexposed: [specific area]"],
    "colorIssues": ["Color cast: [type + area]", "White balance: [problem]"]
  },
  
  "technicalMetadata": {
    "estimatedOriginalExposure": "-1.5 EV" | "correct" | "+2.0 EV",
    "dominantColorCast": "tungsten yellow" | "fluorescent green" | "none" | "cool blue",
    "noiseLevel": "minimal" | "moderate" | "significant",
    "sharpnessQuality": "soft" | "acceptable" | "sharp",
    "dynamicRangeChallenge": "extreme backlight" | "mixed lighting" | "low light" | "normal"
  },
  
  "roomSpecificAdvice": {
    "roomType": "bedroom" | "kitchen" | "bathroom" | "living_room" | "dining_room" | "exterior",
    "stagingRecommendations": ["Specific staging tip 1", "Specific staging tip 2"],
    "photographyTips": ["Pro photography advice 1", "Pro photography advice 2"]
  }
}

## QUALITY BENCHMARKS
Your analysis must achieve professional photographer standards:
- Before Score: Be honest about actual quality (30-70 typical for amateur photos)
- After Score: 85-98 for professional results (90+ is magazine-quality)
- Improvements: List 5-12 specific enhancements (more for challenging photos)
- Processing Steps: 8-15 detailed technical steps
- Detected Issues: Identify 3-10 specific problems with precise locations

## RESPONSE DISCIPLINE
- Output ONLY valid JSON (no markdown, no preamble, no explanations outside JSON)
- Be technically specific: "Lift shadows in bottom-left corner by +2.5 EV" not "brighten image"
- Use professional photography terminology: EV, stops, color temperature, clarity, vibrance
- Prioritize critical issues: major exposure problems before minor dust spots
- Balance honesty with optimism: realistic before scores, achievable after scores`;

  const userPrompt = `Analyze this real estate photo and provide a comprehensive enhancement report.

Return a JSON object with exactly this structure:
{
  "analysisText": "A 2-3 sentence professional summary of the photo's current state and enhancement potential",
  "improvements": [
    {
      "type": "declutter|lighting|color-grade|upscale|sharpen|noise-reduction|exposure|white-balance|shadow-lift|highlight-recovery|perspective-correction|clarity-boost|vibrance-enhancement",
      "label": "Short label (max 4 words)",
      "description": "Specific description of what needs to be done",
      "applied": true,
      "priority": "critical|high|medium|low"
    }
  ],
  "qualityScore": {
    "before": <number 1-100>,
    "after": <number 1-100>,
    "reasoning": "Brief explanation"
  },
  "processingSteps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "detectedIssues": {
    "clutterItems": ["list of specific personal/clutter items detected"],
    "lightingIssues": ["specific lighting problems"],
    "qualityIssues": ["blur, noise, resolution issues"],
    "exposureProblems": ["underexposed areas", "overexposed areas"],
    "colorIssues": ["color cast problems", "white balance issues"]
  },
  "technicalMetadata": {
    "estimatedOriginalExposure": "-1.5 EV",
    "dominantColorCast": "tungsten yellow",
    "noiseLevel": "moderate",
    "sharpnessQuality": "soft",
    "dynamicRangeChallenge": "extreme backlight"
  },
  "roomSpecificAdvice": {
    "roomType": "bedroom",
    "stagingRecommendations": ["tip 1", "tip 2"],
    "photographyTips": ["tip 1", "tip 2"]
  }
}

Be specific and actionable. Real estate photographers charge $500-2000/session — your analysis should match that quality standard.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
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
    detectedIssues: parsed.detectedIssues,
    technicalMetadata: parsed.technicalMetadata,
    roomSpecificAdvice: parsed.roomSpecificAdvice,
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
    model: 'claude-sonnet-4-20250514',
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
