// --- APPAREL PROMPTS ---
const APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, joyful, full-body editorial photo of a child model wearing the provided clothing item.
CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the clothing. This includes its design, color, pattern, texture, and fit. It is a fixed, unchangeable element placed onto the model.
MODEL & STYLE: A happy, expressive child model. Their pose should be playful and natural, like a candid moment of fun.
BACKGROUND & ATMOSPHERE: A clean, well-lit, and colorful studio background with fun, simple props like oversized colorful blocks, balloons, or a paper moon.
LIGHTING: Professional, clear, and soft studio lighting that makes the scene feel cheerful and vibrant.
OUTPUT SPECIFICATIONS: High-resolution, sharp, editorial quality suitable for a children's fashion catalogue. The clothing is the star.
`;

const APPAREL_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment, playing outdoors.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS**.
  MODEL & STYLE: A child running through a beautiful green park on a clear day, captured in a moment of pure joy. The pose is candid and full of motion.
  BACKGROUND & ATMOSPHERE: A beautiful, safe outdoor setting. The lighting is clear and natural daylight, creating a happy and energetic mood.
  OUTPUT SPECIFICATIONS: High-resolution, heartwarming, and full of life.
  `,
  `
  TASK: Generate an ultra-realistic lifestyle photo of children playing together, wearing items from the collection including the provided garment.
  CRITICAL RULE: The main child model's garment must be used with **ZERO ALTERATIONS**.
  MODEL & STYLE: A small group of diverse children laughing and playing together with simple toys (like a ball or building blocks) in a cheerful playroom or backyard.
  BACKGROUND & ATMOSPHERE: A cheerful and clean play environment. The focus is on the interaction and friendship between the children.
  OUTPUT SPECIFICATIONS: A wholesome, relatable shot that shows the clothes are perfect for play.
  `,
  `
  TASK: Generate an ultra-realistic, close-up shot focusing on a cute detail of the provided clothing item.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**. Its original fabric texture, pattern, and details must be preserved.
  MODEL & STYLE: The shot is tightly cropped on a specific part of the garment as worn by a child, for example, an embroidered animal on a pocket, a unique button, or a fun pattern on a sleeve.
  LIGHTING & BACKGROUND: Soft, natural light. The background is simple and blurred.
  OUTPUT SPECIFICATIONS: A charming, detail-oriented shot that highlights the quality and design of the clothing.
  `,
  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment in a relaxed, cozy setting.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: A child sitting in a cozy armchair or a window nook, reading a picture book. Their expression is calm and engaged.
  BACKGROUND & ATMOSPHERE: A warm and inviting indoor setting, like a well-lit children's bedroom or library corner.
  OUTPUT SPECIFICATIONS: A sweet, peaceful image showing the comfort of the clothing.
  `,
  `
  TASK: Generate an ultra-realistic photo of a child on a playground swing or slide, wearing the provided garment.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**.
  MODEL & STYLE: A child in mid-swing or about to go down a slide, with a big smile or laughing. The shot captures the delight of outdoor play.
  BACKGROUND & ATMOSPHERE: A clean, modern playground. The image is dynamic and captures a feeling of freedom.
  OUTPUT SPECIFICATIONS: Fun, energetic, and joyful.
  `
];

// --- TOYS PROMPTS ---
const TOYS_COVER_PROMPT = `
TASK: Create a magical, enchanting product photoshoot stage for a toy.
IMPORTANT INSTRUCTION: You will be given an image containing a toy. Your primary and most critical task is to use the **exact toy** from the provided image. **DO NOT ALTER THE TOY IN ANY WAY.** This includes its design, colors, or features.
SCENE: Place this unaltered toy in a magical, miniature world that relates to its theme. For example, a toy car on a race track made of candy, or a doll in a fairy-tale forest. The background should be dreamy and out-of-focus.
LIGHTING: Soft, whimsical, and clear, with soft bokeh effects to create a sense of wonder.
GOAL: The final composition should feel imaginative and enchanting, making the original toy the hero of its own little story.
`;

const TOYS_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, close-up shot of a child's face lit with joy as they play with the provided toy.
  CRITICAL RULE: The toy from the user's image must be used **EXACTLY AS IS**.
  MODEL & STYLE: A tightly cropped shot on a child's happy, wondrous expression as they interact with the toy. The toy is held close to them and is also in sharp focus.
  BACKGROUND & ATMOSPHERE: The background is simple and softly blurred, keeping all attention on the child and the toy.
  OUTPUT SPECIFICATIONS: High-resolution, emotional, and heartwarming.
  `,
  `
  TASK: Generate an ultra-realistic photo from the toy's perspective, looking up at a happy child.
  CRITICAL RULE: The toy must be used **EXACTLY AS IS**.
  SCENE & STYLE: A low-angle shot, as if taken from the toy's point of view. The toy is in the foreground, and the child's smiling face is looking down at it from above.
  LIGHTING & ATMOSPHERE: Clear, cheerful lighting. The mood is playful and imaginative.
  OUTPUT SPECIFICATIONS: A creative, unique, and engaging shot.
  `,
  `
  TASK: Generate an ultra-realistic lifestyle photo of a child's hands actively playing with the provided toy.
  CRITICAL RULE: You **MUST** use the toy from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A close-up, top-down shot of a child's hands and the toy on a clean floor or playmat. The child is actively engaged in building, arranging, or interacting with the toy.
  BACKGROUND & ATMOSPHERE: A clean and simple play area.
  OUTPUT SPECIFICATIONS: A detailed, candid shot that clearly shows how the toy is used.
  `,
  `
  TASK: Generate an ultra-realistic photo of the provided toy in a "real-life" adventure setting.
  CRITICAL RULE: The toy **MUST NOT BE CHANGED**.
  SCENE: The toy is placed in an imaginative outdoor setting. For example, a toy dinosaur partially hidden among ferns in a garden, or a toy boat floating in a clear, shallow stream.
  LIGHTING & BACKGROUND: Clear, natural daylight that makes the scene look like a real adventure.
  OUTPUT SPECIFICATIONS: Creative, imaginative, and story-driven.
  `,
  `
  TASK: Generate an ultra-realistic photo of a child showing the provided toy to a smiling parent or friend.
  CRITICAL RULE: The toy must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: A child excitedly holding up the toy to show it to an adult (only their hands and torso are visible) or another child. The focus is on the shared moment of joy.
  BACKGROUND & ATMOSPHERE: A warm, happy home environment.
  OUTPUT SPECIFICATIONS: A heartwarming image that highlights social play and connection.
  `
];

export const KIDS_PROMPTS = {
    apparel: {
        coverPrompt: APPAREL_COVER_PROMPT,
        photoPrompts: APPAREL_PHOTO_PROMPTS
    },
    toys: {
        coverPrompt: TOYS_COVER_PROMPT,
        photoPrompts: TOYS_PHOTO_PROMPTS
    }
};