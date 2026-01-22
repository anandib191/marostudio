
// --- HOME & KITCHEN PROMPTS ---
const HOME_KITCHEN_COVER_PROMPT = `
TASK: Create a clean, aspirational product photoshoot stage for a home or kitchen item.
IMPORTANT INSTRUCTION: You will be given an image containing a product. Your primary and most critical task is to use the **exact product** from the provided image. **DO NOT ALTER THE PRODUCT IN ANY WAY.** This means no changes to its shape, design, color, material, or texture. The product must be presented **AS IS**.
SCENE: Place this unaltered product in a bright, modern home setting that complements its function. For example, a kitchen gadget on a clean marble countertop, or a home decor item on a stylish wooden shelf. The background should be softly blurred to keep focus on the product.
LIGHTING: The lighting must be soft, natural, and inviting, like daylight from a large window. It should create gentle highlights that showcase the product's form and material without harsh reflections.
GOAL: The final composition should feel clean, modern, and desirable, like a page from a high-end home goods catalog, with the original product as the untouched centerpiece.
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
  TASK: Generate a minimalist, ultra-realistic product-focused shot of the provided item against a simple background.
  CRITICAL RULE: The product from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or details. It is a fixed element.
  SCENE & STYLE: The product is placed on a simple, flat surface. The background is a solid, neutral color or has a very subtle texture (like light wood or concrete). Props are minimal, if any (e.g., a single herb sprig next to a kitchen tool).
  LIGHTING & ATMOSPHERE: Clean, even studio-style lighting that clearly illuminates the entire product and minimizes shadows.
  OUTPUT SPECIFICATIONS: A crisp, professional, and clean image perfect for e-commerce product pages where the product details are most important.
  `,
  `
  TASK: Generate an ultra-realistic top-down (flat-lay) composition featuring the provided product.
  CRITICAL RULE: You **MUST** use the product from the user's image with **ZERO ALTERATIONS**.
  SCENE & STYLE: A carefully arranged flat-lay scene. The product is the central hero, surrounded by complementary items. For a kitchen gadget, this could be ingredients. For a home decor item, it could be books and a cup of tea.
  BACKGROUND & ATMOSPHERE: A clean, textured surface like a wooden table, linen cloth, or slate board.
  OUTPUT SPECIFICATIONS: A trendy, well-composed, and visually appealing image suitable for social media and blogs.
  `,
];

// --- ELECTRONICS PROMPTS ---
const ELECTRONICS_COVER_PROMPT = `
TASK: Create a sleek, modern product photoshoot stage for an electronic device.
IMPORTANT INSTRUCTION: You will be given an image containing a device. Your primary and most critical task is to use the **exact device** from the provided image. **DO NOT ALTER THE DEVICE IN ANY WAY.** This means no changes to its design, color, screen content, buttons, or ports. The device must be presented **AS IS**.
SCENE: Place this unaltered device on a minimalist, slightly reflective surface. The background should be dark and abstract, with subtle geometric shapes or soft, colored light gradients.
LIGHTING: The lighting must be clean and dramatic, using edge lighting to define the product's silhouette and a soft key light to highlight its surface texture (e.g., brushed metal, matte plastic).
GOAL: The final composition should feel futuristic, sophisticated, and high-tech, with the original device as the untouched centerpiece.
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
];

// --- OTHER PRODUCTS PROMPTS ---
const OTHER_COVER_PROMPT = `
TASK: Create a clean and versatile product photoshoot stage for a general product.
IMPORTANT INSTRUCTION: You will be given an image of a product. Your primary task is to use the **exact product** from the image **WITHOUT ANY ALTERATION**.
SCENE: Place the unaltered product on a simple geometric pedestal or block. The background should be a clean, seamless sweep of a solid, neutral, or complementary color.
LIGHTING: Bright, clean, and even commercial studio lighting that showcases the product clearly from all angles and minimizes distracting shadows.
GOAL: The final image should be sharp, professional, and focused entirely on the original product, suitable for any e-commerce or advertising purpose.
`;

const OTHER_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic product-in-use lifestyle photo.
  CRITICAL RULE: The product must be used **EXACTLY AS IS**.
  SCENE & STYLE: Show the product in a relevant, aspirational context. A sports bottle at a stylish gym, a backpack on a hiker overlooking a view, a notebook on a creative's desk.
  BACKGROUND & ATMOSPHERE: A realistic and aesthetically pleasing environment that tells a story about the product and its user.
  OUTPUT SPECIFICATIONS: Relatable, high-quality, and context-driven.
  `,
  `
  TASK: Generate a high-end, ultra-realistic product shot with creative props.
  CRITICAL RULE: The product **MUST NOT BE CHANGED**.
  SCENE & STYLE: The product is the centerpiece, surrounded by artistic and relevant props. For example, a bottle of lotion with flower petals and water droplets, or a set of tools arranged neatly on a blueprint.
  LIGHTING & BACKGROUND: Creative and professional lighting. The background and props should enhance the product's story and aesthetic.
  OUTPUT SPECIFICATIONS: A visually rich and compelling image perfect for social media or a magazine feature.
  `,
  `
  TASK: Generate an ultra-realistic image of the product's packaging alongside the product itself.
  CRITICAL RULE: The product must be used **EXACTLY AS IS**. The packaging should be a plausible, high-quality design that complements the product.
  SCENE & STYLE: The product and its beautifully designed box or container are arranged together on a clean studio background.
  LIGHTING & BACKGROUND: Clean, commercial studio lighting.
  OUTPUT SPECIFICATIONS: A professional shot useful for e-commerce sites, showing the customer what to expect.
  `,
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
    'other': {
        coverPrompt: OTHER_COVER_PROMPT,
        photoPrompts: OTHER_PHOTO_PROMPTS
    }
};
