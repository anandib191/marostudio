
// --- HOME & KITCHEN PROMPTS ---
const HOME_KITCHEN_COVER_PROMPT = `
TASK: Create a masterful, high-end editorial product stage for a home or kitchen item.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact product** from the provided image **WITHOUT A SINGLE ALTERATION**. Design, color, material, and texture must remain pristine.
SCENE & ATMOSPHERE: Study the product's character (minimalist, rustic, luxury, tech). Build a sophisticated, aspirational world that THIS specific item belongs to — avoid generic setups. The background should be a deeply blurred, high-fashion home environment.
LIGHTING: Natural, volumetric illumination that creates soft highlights and makes the materials look premium and inviting.
QUALITY CONTROL: NO visible camera gear, light stands, or technical artifacts. Pure flagship architectural campaign result.
`;

const HOME_KITCHEN_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic lifestyle photo of the provided product in a real-world home setting.
  CRITICAL RULE: The product from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw it. It is a fixed, unchangeable element.
  SCENE & STYLE: The product is being used naturally in a scene. A coffee maker brewing coffee on a kitchen counter with a hand reaching for a cup; a decorative vase on a living room mantlepiece; a set of knives on a wooden cutting board with fresh vegetables.
  BACKGROUND & ATMOSPHERE: A warm, inviting, and slightly 'lived-in' home environment. The background should be aesthetically pleasing but out-of-focus to draw attention to the product.
  OUTPUT SPECIFICATIONS: High-resolution, authentic, and relatable, showing the product as part of an aspirational daily life.
  `,
  `
  TASK: Generate a minimalist, ultra-realistic "Product Portrait" against a sophisticated solid background.
  CRITICAL RULE: Use the product **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Place the item on a complementary, textured surface (e.g., raw concrete, dark linen, or light oak). The background is a clean, solid architectural wall. Use a composition that highlights the product's silhouette and form.
  LIGHTING: Soft, volumetric illumination that provides clear, undistracted focus.
  QUALITY CONTROL: Zero visible cameras or light stands. Pure minimalist perfection.
  `,
  `
  TASK: Generate an ultra-realistic top-down (flat-lay) composition featuring the provided product.
  CRITICAL RULE: You **MUST** use the product from the user's image with **ZERO ALTERATIONS**.
  SCENE & STYLE: A carefully arranged flat-lay scene. The product is the central hero, surrounded by complementary items. For a kitchen gadget, this could be ingredients. For a home decor item, it could be books and a cup of tea.
  BACKGROUND & ATMOSPHERE: A clean, textured surface like a wooden table, linen cloth, or slate board.
  OUTPUT SPECIFICATIONS: A trendy, well-composed, and visually appealing image suitable for social media and blogs.
  `,
  `
  TASK: Generate a high-end, ultra-realistic product-only shot of the provided product with an interesting shadow play.
  CRITICAL RULE: The product from the user's image must be used **EXACTLY AS IS**.
  SCENE & STYLE: The product sits alone on a clean, solid-colored surface. The lighting comes from the side, casting a long, dramatic, or architecturally interesting shadow (e.g., like light through a window blind).
  LIGHTING & ATMOSPHERE: High-contrast, artistic lighting. The focus is on the interplay between the product and its shadow.
  OUTPUT SPECIFICATIONS: A sophisticated, artistic, and minimalist shot perfect for a hero image on a website.
  `,
  `
  TASK: Generate an ultra-realistic, close-up shot focusing on the texture and material of the provided product.
  CRITICAL RULE: The product **MUST NOT BE CHANGED**.
  SCENE & STYLE: A macro-style shot that fills the frame with a specific detail of the product—the texture of a ceramic bowl, the grain of a wooden spoon, the weave of a linen napkin.
  LIGHTING & BACKGROUND: Soft, directional lighting that grazes the surface to highlight its texture. Background is completely out of focus.
  OUTPUT SPECIFICATIONS: A beautiful, tactile image that communicates the quality of the product's materials.
  `
];

// --- ELECTRONICS PROMPTS ---
const ELECTRONICS_COVER_PROMPT = `
TASK: Create a sleek, modern product photoshoot stage for an electronic device.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact device** from the provided image **WITHOUT A SINGLE ALTERATION**. This includes design, colors, buttons, and screen content.
SCENE & ATMOSPHERE: Build a minimalistic, high-tech world around the device. Use premium materials like brushed metal, dark glass, or carbon fiber. The background should be a deeply blurred, futuristic environment with subtle geometric light plays.
LIGHTING: Sharp, volumetric edge lighting to define the silhouette, combined with soft, non-technical surface illumination.
QUALITY CONTROL: NO visible camera equipment, light stands, or studio artifacts. Pure iconic tech advertisement.
`;

const ELECTRONICS_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic lifestyle photo of the provided electronic device being used.
  CRITICAL RULE: The device from the user's image must be used **EXACTLY AS IS**.
  SCENE & STYLE: A person's hands interacting with the device. Someone typing on a keyboard, holding a games console, or adjusting headphones. The shot should be tightly cropped to focus on the interaction.
  BACKGROUND & ATMOSPHERE: A modern, clean environment like a minimalist office, a creative studio, or a comfortable living room. The background is softly blurred.
  OUTPUT SPECIFICATIONS: High-resolution and context-rich, showing the device's functionality and user experience.
  `,
  `
  TASK: Generate an ultra-realistic, exploded-view or internal-components-style image of the provided device.
  CRITICAL RULE: The external casing and visible parts of the device must be used **EXACTLY AS IS**.
  SCENE & STYLE: A technical, artistic representation where the device's components are shown floating in a deconstructed arrangement around the main body.
  LIGHTING & ATMOSPHERE: Clean, technical lighting on a neutral grey or white background, highlighting the complexity and craftsmanship of the internal workings.
  OUTPUT SPECIFICATIONS: A visually impressive and informative image that speaks to the product's technology and quality build. This is a creative interpretation; accuracy of internal components is not required, but the aesthetic should be technical.
  `,
  `
  TASK: Generate a dramatic, ultra-realistic close-up shot focusing on a key detail of the provided device.
  CRITICAL RULE: The device **MUST NOT BE CHANGED**.
  SCENE & STYLE: A macro-style shot focusing on a specific part of the device, like a textured knob, a speaker grille, a charging port with a cable connecting, or a glowing indicator light.
  LIGHTING & BACKGROUND: Dark, moody, and cinematic lighting that sculpts the product's details with light and shadow.
  OUTPUT SPECIFICATIONS: A sophisticated, high-end image that highlights the design and material quality of the device.
  `,
  `
  TASK: Generate an ultra-realistic shot of the device in a high-end "Creative Workspace".
  CRITICAL RULE: The device must be used **WITHOUT ANY MODIFICATION**.
  DYNAMIC DIRECTION: "The Modern Setup". Place the device as the heart of an inspiring workspace — use accessories like architectural lighting, a minimalist notebook, or a piece of abstract art. The environment should feel high-end, clean, and technologically advanced.
  LIGHTING: Bright, clean, and airy illumination. 
  QUALITY CONTROL: NO technical equipment, light stands, or camera artifacts visible.
  `,
  `
  TASK: Generate a high-end, ultra-realistic product shot of the device against a contrasting natural element.
  CRITICAL RULE: The device must be used **EXACTLY AS IS**.
  SCENE & STYLE: The sleek, man-made device is placed on a rough, natural texture, such as a large piece of stone, mossy wood, or black sand, creating a powerful visual contrast.
  LIGHTING & BACKGROUND: Dramatic, directional lighting that highlights the textures of both the device and the natural element.
  OUTPUT SPECIFICATIONS: An artistic, high-impact shot suitable for a major ad campaign.
  `
];

// --- FURNITURE PROMPTS ---
const FURNITURE_COVER_PROMPT = `
TASK: Create an elegant, high-end architectural product stage for a piece of furniture.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact furniture** from the provided image **WITHOUT A SINGLE ALTERATION**.
SCENE & ATMOSPHERE: Place the furniture in a spacious, light-drenched minimalist loft or a high-end architectural space. The background should be a masterpiece of depth and composition — use clean lines, premium textures, and a sophisticated, blurred depth of field.
LIGHTING: Breathtaking, soft natural-feeling illumination that creates a sense of airy luxury and highlights the grain and fabric perfectly.
QUALITY CONTROL: NO visible technical equipment, light stands, or camera artifacts. A flagship magazine cover result.
`;

const FURNITURE_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic lifestyle photo of the provided furniture in a beautifully decorated room.
  CRITICAL RULE: The furniture from the user's image must be used **EXACTLY AS IS**. It is the focal point of the room.
  SCENE & STYLE: The furniture is placed within a complete, tastefully styled room (e.g., a sofa in a living room with a rug, coffee table, and plants; a bed in a bedroom with nightstands and art). The overall style should be cohesive and modern.
  BACKGROUND & ATMOSPHERE: A bright, inviting, and well-designed interior space. The focus is sharp on the main furniture piece, with other elements creating a sense of a real, aspirational home.
  OUTPUT SPECIFICATIONS: High-resolution, a "shot for a catalog" look that is both beautiful and realistic.
  `,
  `
  TASK: Generate an ultra-realistic, close-up detail shot of the provided furniture.
  CRITICAL RULE: The furniture must be used **EXACTLY AS IS**.
  SCENE & STYLE: A macro-style shot that focuses on a specific aspect of the furniture, such as the texture of the fabric, the grain of the wood, the detail of a leg, or the stitching on a cushion.
  LIGHTING & ATMOSPHERE: Soft, directional light that grazes the surface to bring out the texture and craftsmanship. The rest of the furniture and background should be softly out of focus.
  OUTPUT SPECIFICATIONS: A tactile, high-quality image that communicates the quality of the materials and construction.
  `,
  `
  TASK: Generate a dramatic, artistic, ultra-realistic shot of the provided furniture in an abstract setting.
  CRITICAL RULE: The furniture **MUST NOT BE CHANGED**.
  SCENE & STYLE: The piece of furniture is placed in a non-traditional, artistic setting, such as a room with a single, bold color, or on a large, reflective surface. Strong, long shadows are cast from an unseen window.
  LIGHTING & ATMOSPHERE: High-contrast, moody lighting. The focus is on the furniture's form and silhouette, creating an image that is more art than a simple product shot.
  OUTPUT SPECIFICATIONS: A sophisticated, high-fashion image suitable for a brand's hero campaign.
  `
];

// --- OTHER PRODUCTS PROMPTS (DYNAMIC) ---
const DYNAMIC_OTHER_COVER_PROMPT = (productName: string) => `
TASK: Create a clean and versatile product photoshoot stage for a ${productName}.
IMPORTANT INSTRUCTION: You will be given an image of a ${productName}. Your primary task is to use the **exact product** from the image **WITHOUT ANY ALTERATION**.
SCENE: Place the unaltered product on a simple geometric pedestal or block. The background should be a clean, seamless sweep of a solid, neutral, or complementary color.
LIGHTING: Bright, clean, and even commercial studio lighting that showcases the product clearly and minimizes distracting shadows.
GOAL: The final image should be sharp, professional, and focused entirely on the original product.
`;

const DYNAMIC_OTHER_PHOTO_PROMPTS = [
  (productName: string) => `
  TASK: Generate an ultra-realistic, customer-focused lifestyle photo showcasing the provided ${productName} in a key use-case.
  CRITICAL RULE: The product from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw it.
  SCENE & CONCEPT: Create a scene that highlights the human connection to the ${productName}. The focus should be on how a person interacts with the product, showing the benefit, joy, or satisfaction it brings. For example, a close-up of hands using the product with a joyful expression in the background, or a shot capturing the moment the product solves a problem or enhances an experience.
  MODEL & STYLE: The model's interaction should be authentic and engaging. Capture a candid, emotional moment.
  LIGHTING & ATMOSPHERE: Use warm, natural lighting to create an inviting and relatable mood. The background should be a relevant, softly blurred environment that supports the story without distracting from the main interaction.
  OUTPUT SPECIFICATIONS: An emotionally resonant and highly engaging image that makes the viewer imagine themselves using the ${productName}.
  `,
  (productName: string) => `
  TASK: Generate a high-end, ultra-realistic product shot of the provided ${productName} with creative, complementary props.
  CRITICAL RULE: The product **MUST NOT BE CHANGED**.
  SCENE & STYLE: The ${productName} is the centerpiece, surrounded by artistic and relevant props that enhance its story and aesthetic. The arrangement should look professional and intentional.
  LIGHTING & BACKGROUND: Creative and professional lighting that creates a specific mood (e.g., dramatic, soft, or vibrant).
  OUTPUT SPECIFICATIONS: A visually rich and compelling image perfect for a magazine feature or social media.
  `,
  (productName: string) => `
  TASK: Generate a dramatic, ultra-realistic close-up shot focusing on the intricate details and texture of the provided ${productName}.
  CRITICAL RULE: The product must be used **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Create an "Extreme Macro" composition that reveals the soul of the product — the fine grain of wood, the weave of fabric, the machining of metal, or the crystallization of glass. Use a thin depth of field to make the detail pop against a creamy, blurred background.
  LIGHTING: Directional, volumetric light that grazes the surface to reveal every microscopic texture.
  QUALITY CONTROL: NO visible technical artifacts, camera gear, or light stands. Pure tactile excellence.
  `,
  (productName: string) => `
  TASK: As a world-class creative director, generate a high-concept, artistic advertisement photo for the provided ${productName}.
  CRITICAL RULE: The product from the user's image must be used **EXACTLY AS IS**. Do not alter its shape, color, or texture. It is the perfect, unchangeable hero of the shot.
  
  YOUR CREATIVE PROCESS:
  1.  **Analyze the Product:** First, silently analyze the provided image of the ${productName}. Consider its form, texture, implied function, and overall aesthetic (e.g., is it minimalist, rugged, luxurious, playful?).
  2.  **Devise a Concept:** Based on your analysis, devise a single, powerful, and metaphorical visual concept. The concept should use abstract or natural elements to evoke an emotion or highlight a key quality of the product. Examples of concepts: 'A sleek gadget emerging from still, dark water to show its precision and water resistance.' 'A rugged leather wallet resting on cracked, dry earth to emphasize durability.' 'A delicate ceramic mug with steam gracefully forming abstract shapes around it to suggest warmth and comfort.'
  3.  **Execute the Vision:** Generate the final image based on the concept you devised. The composition must be artistic and compelling, the lighting dramatic and professional, and the overall quality suitable for a high-end marketing campaign. The goal is to create an unforgettable image that tells a story about the ${productName}.

  DO NOT just place the product on a simple background. Your task is to think creatively and produce a unique, conceptual piece of art starring the product.
  `
];

export const ECOMMERCE_PROMPTS = {
    'home-and-kitchen': {
        coverPrompt: HOME_KITCHEN_COVER_PROMPT,
        photoPrompts: HOME_KITCHEN_PHOTO_PROMPTS
    },
    'electronics': {
        coverPrompt: ELECTRONICS_COVER_PROMPT,
        photoPrompts: ELECTRONICS_PHOTO_PROMPTS
    },
    'furniture': {
        coverPrompt: FURNITURE_COVER_PROMPT,
        photoPrompts: FURNITURE_PHOTO_PROMPTS
    },
    'other': {
        coverPrompt: DYNAMIC_OTHER_COVER_PROMPT,
        photoPrompts: DYNAMIC_OTHER_PHOTO_PROMPTS
    }
};