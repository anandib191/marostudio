// --- PROFESSIONAL APPAREL PROMPTS (E-commerce/Studio Style) ---

const PROFESSIONAL_APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, high-fashion, full-body editorial photo of a model wearing the provided clothing item for a brand's hero image.
CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the clothing. This includes its design, color, pattern, texture, and fit. It is a fixed, unchangeable element placed onto the model.
MODEL & STYLE: A graceful and confident fashion model. Their pose should be strong, elegant, and suitable for a magazine cover or website banner. Hair and makeup should be clean, professional, and high-fashion, complementing the garment without being distracting.
BACKGROUND & LIGHTING: The background must be a clean, professional studio setting. The specific color and mood should be determined by the style modifier provided at the end of the prompt. Lighting must be professional studio quality, creating soft, flattering shadows and highlighting the texture and drape of the fabric.
OUTPUT SPECIFICATIONS: High-resolution, sharp, editorial quality. The clothing is the absolute star of the image.
`;

const PROFESSIONAL_APPAREL_PHOTO_PROMPTS = [
  // 1. Front View
  `
  TASK: Generate an ultra-realistic, full-body studio photo of a model wearing the provided garment, seen from the front.
  CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**, without any alterations.
  MODEL & POSE: The model should have a neutral, professional pose, standing straight and facing forward to clearly display the garment's design and fit from the front.
  BACKGROUND & LIGHTING: The background must be a simple, clean studio environment. Adhere to the following based on the style modifier: For "Modern" or "Aesthetic" styles, use a seamless, pure white background (#FFFFFF). For "Cinematic" style, use a dark grey or black background. For "Vintage" style, use a warm, off-white or light yellowish cream-colored background. For "Monochrome", use a neutral grey background. The lighting should be even and professional, minimizing harsh shadows to clearly show the product.
  OUTPUT: A clean, high-quality e-commerce style image.
  `,
  // 2. Three-Quarter View
  `
  TASK: Generate an ultra-realistic, full-body studio photo of a model wearing the provided garment, seen from a three-quarter angle.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS**.
  MODEL & POSE: The model should be posed at a three-quarter turn to the camera, showcasing the garment's silhouette and fit from the side and front simultaneously. The pose should be natural and elegant.
  BACKGROUND & LIGHTING: The background must be a simple, clean studio environment. Adhere to the following based on the style modifier: For "Modern" or "Aesthetic" styles, use a seamless, pure white background (#FFFFFF). For "Cinematic" style, use a dark grey or black background. For "Vintage" style, use a warm, off-white or light yellowish cream-colored background. For "Monochrome", use a neutral grey background. Professional lighting is required.
  OUTPUT: A standard, professional e-commerce style image.
  `,
  // 3. Detail Shot
  `
  TASK: Generate a dramatic, ultra-realistic medium-close-up shot focusing on the specific details and texture of the provided clothing item.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**. Its original fabric texture, pattern, and details (buttons, seams, etc.) must be preserved with perfect accuracy.
  MODEL & POSE: The shot should be tightly cropped on the garment, worn by a model in a simple pose that highlights a key feature (e.g., neckline, cuff, fabric pattern). The model's face may be partially or completely out of frame.
  BACKGROUND & LIGHTING: The background must be a simple, clean studio environment. Adhere to the following based on the style modifier: For "Modern" or "Aesthetic" styles, use a seamless, pure white background (#FFFFFF). For "Cinematic" style, use a dark grey or black background. For "Vintage" style, use a warm, off-white or light yellowish cream-colored background. For "Monochrome", use a neutral grey background. Lighting should be specifically directed to emphasize the material's texture.
  OUTPUT: A high-fashion, sharp focus shot perfect for showcasing product quality.
  `,
  // 4. Dynamic/Posed Shot
  `
  TASK: Generate an ultra-realistic, full-body studio photo of a model in a more dynamic or expressive pose wearing the provided garment.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
  MODEL & POSE: The model should be in a pose that conveys personality or movement, such as hands on hips, a slight lean, or a walking motion, while still clearly presenting the garment. For the "Aesthetic" style, the poses should be more artistic and varied.
  BACKGROUND & LIGHTING: The background must be a simple, clean studio environment. Adhere to the following based on the style modifier: For "Modern" or "Aesthetic" styles, use a seamless, pure white background (#FFFFFF). For "Cinematic" style, use a dark grey or black background. For "Vintage" style, use a warm, off-white or light yellowish cream-colored background. For "Monochrome", use a neutral grey background. Lighting can be slightly more dramatic to match the pose.
  OUTPUT: An engaging, editorial-style studio shot.
  `,
  // 5. Back View
  `
  TASK: Generate an ultra-realistic, full-body studio photo showing the back view of a model wearing the provided garment. (If a back view image is provided, use it; otherwise, infer the back from the front view).
  CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. It is critical to accurately represent how the garment fits and is constructed from the back.
  MODEL & POSE: The model should be standing with their back to the camera, or in a slight turn looking over their shoulder, to clearly display the garment's design from the back.
  BACKGROUND & LIGHTING: The background must be a simple, clean studio environment. Adhere to the following based on the style modifier: For "Modern" or "Aesthetic" styles, use a seamless, pure white background (#FFFFFF). For "Cinematic" style, use a dark grey or black background. For "Vintage" style, use a warm, off-white or light yellowish cream-colored background. For "Monochrome", use a neutral grey background. The lighting must be clean and even.
  OUTPUT: A clear, informative product shot for e-commerce.
  `
];

export const PROFESSIONAL_APPAREL_PROMPTS = {
    coverPrompt: PROFESSIONAL_APPAREL_COVER_PROMPT,
    photoPrompts: PROFESSIONAL_APPAREL_PHOTO_PROMPTS
};
