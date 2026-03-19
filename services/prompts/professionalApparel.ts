// --- PROFESSIONAL APPAREL PROMPTS (E-commerce/Studio Style) ---

const PROFESSIONAL_APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, high-fashion flagship editorial of a model wearing the provided garment.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact garment** from the provided image **WITHOUT A SINGLE ALTERATION**. Design, color, pattern, texture, and fit must be perfectly preserved.
DYNAMIC DIRECTION: Study the garment's character. Select a model archetype, styling, and pose that creates a world-class, aspirational image. The background should be a sophisticated, blurred architectural or high-end setting that makes the product pop. 
LIGHTING: Breathtaking, volumetric illumination tailored to the fabric. Sculpt the drape and texture with non-technical, cinematic light.
QUALITY CONTROL: NO visible camera gear, light stands, paper rolls, or studio artifacts. Pure luxury excellence.
`;

const PROFESSIONAL_APPAREL_PHOTO_PROMPTS = [
  // 1. Front View
  `
  TASK: Generate an ultra-realistic, high-fashion "Statuesque" portrait of a model wearing the provided garment, seen from the front.
  CRITICAL RULE: The garment MUST NOT BE CHANGED.
  DYNAMIC DIRECTION: Create a clean, powerful composition. The background is a sophisticated solid (like raw plaster, matte metal, or deep charcoal) that makes the garment the absolute hero. The pose is strong and editorial.
  LIGHTING: Precise, volumetric illumination that defines the product's structure without any visible gear.
  QUALITY CONTROL: Zero visible studio equipment or artifacts. Pure minimalist excellence.
  `,
  // 2. Three-Quarter View
  `
  TASK: Generate an ultra-realistic, three-quarter view editorial of a model wearing the provided garment.
  CRITICAL RULE: Use the garment **EXACTLY AS IS**.
  DYNAMIC DIRECTION: "The Side-Profile Silhouette". Position the model at an elegant three-quarter turn to showcase the drape and fit from multiple angles. Choose a sophisticated, slightly blurred interior or architectural setting.
  LIGHTING: Cinematic, non-technical illumination that defines the silhouette beautifully.
  QUALITY CONTROL: Zero visible cameras, light stands, or technical artifacts. Pure high-fashion result.
  `,
  // 3. Detail Shot
  `
  TASK: Generate a dramatic, ultra-realistic "Material Soul" macro shot focusing on the provided garment.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Choose an artistic crop and angle that best reveals the product's texture, pattern, and construction. Use a thin depth of field to make the detail explode against a soft, mood-rich background.
  LIGHTING: Directional, volumetric light that grazes the surface to reveal every micro-texture.
  QUALITY CONTROL: NO visible technical gear or light stands. Pure tactile luxury.
  `,
  // 4. Dynamic/Posed Shot
  `
  TASK: Generate an ultra-realistic, dynamic "Kinetic" editorial of a model wearing the provided garment.
  CRITICAL RULE: Use the garment **WITHOUT ANY MODIFICATION**.
  DYNAMIC DIRECTION: "Life in Motion". Choose a pose that conveys energy — a stride, a turn, or a leaning gesture. The background should be a vivid, high-end location (e.g., a gallery staircase, a sunlit terrace, or a modern corridor) captured with a professional depth of field. 
  LIGHTING: Volumetric, atmospheric light that tracks the movement.
  QUALITY CONTROL: NO visible technical gear or light stands. Pure creative excellence.
  `,
  // 5. Back View
  `
  TASK: Generate an ultra-realistic, three-quarter back view editorial of a model wearing the provided garment.
  CRITICAL RULE: Use the garment **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Focus on the back construction and fit. Choose an elegant, looking-over-the-shoulder pose. The background is a sophisticated, blurred depth of field in a high-end environment.
  LIGHTING: Soft, volumetric illumination.
  QUALITY CONTROL: Absolutely no technical equipment or camera gear visible.
  `,
];

export const PROFESSIONAL_APPAREL_PROMPTS = {
    coverPrompt: PROFESSIONAL_APPAREL_COVER_PROMPT,
    photoPrompts: PROFESSIONAL_APPAREL_PHOTO_PROMPTS
};
