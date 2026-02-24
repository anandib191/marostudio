
export interface StyleOption {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
}

const overrideInstruction = "IMPORTANT STYLE OVERRIDE: The following instructions take precedence over any other stylistic directions in the prompt.";

export const STYLE_OPTIONS: StyleOption[] = [
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'Clean lines, sharp focus, neutral tones.', 
    promptModifier: `${overrideInstruction}\n- VISUAL STYLE: Modern, minimalist, and clean.\n- LIGHTING: Bright, even, and natural lighting.\n- COLORS: A neutral and sophisticated color palette.\n- COMPOSITION: Emphasize clean lines and sharp focus.`
  },
  { 
    id: 'cinematic', 
    name: 'Cinematic', 
    description: 'Dramatic lighting, rich colors, moody.', 
    promptModifier: `${overrideInstruction}\n- VISUAL STYLE: Cinematic and dramatic.\n- LIGHTING: High-contrast lighting, creating deep shadows (chiaroscuro).\n- COLORS: Rich, saturated colors.\n- COMPOSITION: Create a moody, atmospheric scene with a shallow depth of field for a film-like quality.`
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    description: 'Film grain, warm tones, nostalgic feel.', 
    promptModifier: `${overrideInstruction}\n- VISUAL STYLE: Vintage, emulating 1970s film photography.\n- LIGHTING: Soft, warm lighting (like golden hour).\n- COLORS: Use a warm, slightly faded color grading.\n- EFFECTS: Add a subtle film grain. The mood must be nostalgic.`
  },
  { 
    id: 'monochrome', 
    name: 'Monochrome', 
    description: 'Classic black and white.', 
    promptModifier: `${overrideInstruction}\n- VISUAL STYLE: The final image MUST be monochrome (black and white).\n- LIGHTING: Focus on high-contrast lighting to emphasize texture, form, and shadow.\n- COLORS: No color should be present in the final output.`
  },
  { 
    id: 'aesthetic', 
    name: 'Aesthetic', 
    description: 'Dreamy, soft focus, pastel colors.', 
    promptModifier: `${overrideInstruction}\n- VISUAL STYLE: Dreamy, ethereal, and artistic.\n- LIGHTING: Soft, diffused lighting.\n- COLORS: Use a pastel color palette.\n- EFFECTS: A slight soft-focus or bloom effect should be applied to enhance the gentle, dreamy mood.`
  },
  { 
    id: 'closeup', 
    name: 'Close-up', 
    description: 'Tightly framed, focusing on details.', 
    promptModifier: `${overrideInstruction}\n- COMPOSITION: This must be a tight close-up shot.\n- FOCUS: The frame should be cropped to emphasize the fine details, textures, and craftsmanship of the product. The background must be completely out of focus.`
  }
];
