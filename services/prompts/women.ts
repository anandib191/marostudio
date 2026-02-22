// // --- JEWELRY PROMPTS ---
// const JEWELRY_COVER_PROMPT = `
// TASK: Create a luxurious product photoshoot stage for a piece of jewelry.
// IMPORTANT INSTRUCTION: You will be given an image containing a piece of jewelry. Your primary and most critical task is to use the **exact jewelry** from the provided image. **DO NOT ALTER THE JEWELRY IN ANY WAY.** This means:
// - **NO** changes to its shape, design, or structure.
// - **NO** changes to its materials, textures, or metal type.
// - **NO** changes to the color, clarity, or cut of any gemstones, including diamonds.
// The jewelry must be presented **AS IS**.
// SCENE: Place this unaltered jewelry elegantly on a dark, textured rock surface. The background should feature a subtle, out-of-focus silhouette of an ancient, grand temple under a dark, moody sky.
// LIGHTING: The lighting must be dramatic and cinematic, creating strong, clear highlights on the jewelry's intricate details and metallic shine, perfectly preserving its original form and material.
// GOAL: The final composition should feel epic, high-end, and like a commercial advertisement, with the original jewelry as the untouched centerpiece.
// `;

// const JEWELRY_PHOTO_PROMPTS = [
//   `
//   TASK: Generate an ultra-realistic close-up portrait of a woman wearing the provided jewelry.
//   CRITICAL RULE: The jewelry from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the jewelry. This includes its design, materials, and the precise color of all gemstones. It is a fixed element.
//   MODEL & STYLE: The model is an elegant woman with vintage Hollywood waves, clear contoured skin, and bold red lips. Her nails are polished in deep red.
//   BACKGROUND & ATMOSPHERE: Soft, out-of-focus lights sparkle in the blurred background, creating a red-carpet atmosphere.
//   OUTPUT SPECIFICATIONS: High-resolution, cinematic, timeless, and sophisticated.
//   `,
  
//   `
//   TASK: Generate a dramatic, black and white, ultra-realistic close-up portrait of a woman wearing the provided jewelry.
//   CRITICAL RULE: The jewelry from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or details. Even in this black and white scene, you must preserve the jewelry's original form and texture faithfully. It is a fixed element.
//   MODEL & STYLE: A mysterious woman with flawless skin, intense smoky eyes, black matte lips, and wind-swept strands across her face. Gothic elegance.
//   LIGHTING & ATMOSPHERE: Dark, moody cinematic lighting with high contrast. Luxurious and surreal.
//   OUTPUT SPECIFICATIONS: The final image must be black and white, but the jewelry should be showcased prominently and accurately.
//   `,
  
//   `
//   TASK: Generate an ultra-realistic medium-close portrait of a woman in a saree, adorned with the provided jewelry.
//   CRITICAL RULE: You **MUST** use the jewelry from the user's image with **ZERO ALTERATIONS**. Do not change its design, its materials, or the color of its gemstones. It must be presented exactly as it appears in the original photo.
//   MODEL & STYLE: A graceful woman in a soft pastel pink embroidered saree, draped beautifully. Her makeup is natural with soft rosy tones, and her hair is styled in gentle waves.
//   BACKGROUND & ATMOSPHERE: A serene garden setup with pastel flowers and a soft, clear daylight glow, creating a romantic and traditional atmosphere.
//   OUTPUT SPECIFICATIONS: The jewelry should be displayed with delicate elegance, remaining completely unchanged.
//   `,
  
//   `
//   TASK: Generate an ultra-realistic, high-fashion portrait of an Indian woman in bridal attire wearing the provided jewelry.
//   CRITICAL RULE: The jewelry from the user's image is the main subject and **MUST NOT BE CHANGED**. Its original design, materials, and gemstone colors must be preserved with perfect accuracy. Treat it as an unchangeable object placed on the model.
//   MODEL & STYLE: A graceful woman in a three-quarter pose. She wears a luxurious green and gold embroidered saree. Her makeup is bold with deep red lips, perfectly sculpted brows, and dramatic eyeliner. Her skin should have a clear, natural complexion.
//   LIGHTING & BACKGROUND: A pitch-dark background. The lighting is moody, cinematic, and silver-toned, designed to make the original jewelry sparkle and highlight its details.
//   OUTPUT SPECIFICATIONS: High-fashion editorial style. Timeless, regal, and mysterious.
//   `,
  
//   `
//   TASK: Generate an ultra-realistic, glamorous portrait of a woman in a gown wearing the provided jewelry.
//   CRITICAL RULE: It is absolutely essential that the jewelry from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it, do not change the colors of the stones, do not alter the metal. The jewelry must be an exact copy of the one in the user's image.
//   MODEL & STYLE: An elegant woman with softly curled brown hair styled in vintage Hollywood waves. She wears a deep crimson off-shoulder satin gown with voluminous sleeves. Her makeup is flawless with subtle eyeliner and nude peach lips.
//   BACKGROUND & ATMOSPHERE: A dark, luxurious setting with golden accents, evoking regal cinematic grandeur.
//   OUTPUT SPECIFICATIONS: High-resolution, glamorous, aristocratic elegance.
//   `
// ];

// // --- PURSE PROMPTS ---
// const PURSE_COVER_PROMPT = `
// TASK: Create a luxurious product photoshoot stage for a women's purse.
// IMPORTANT INSTRUCTION: You will be given an image containing a purse. Your primary and most critical task is to use the **exact purse** from the provided image. **DO NOT ALTER THE PURSE IN ANY WAY.** This means:
// - **NO** changes to its shape, design, or structure.
// - **NO** changes to its materials, textures, color, or hardware (clasps, zippers, straps).
// The purse must be presented **AS IS**.
// SCENE: Place this unaltered purse on a minimalist marble pedestal. The background should be a soft, out-of-focus high-end boutique interior with warm, ambient lighting.
// LIGHTING: The lighting must be soft yet focused, creating beautiful, clear highlights on the purse's material and metallic hardware, perfectly preserving its original form and texture.
// GOAL: The final composition should feel elegant, sophisticated, and like a luxury brand advertisement, with the original purse as the untouched centerpiece.
// `;

// const PURSE_PHOTO_PROMPTS = [
//   `
//   TASK: Generate an ultra-realistic, full-body street style photo of a fashion-forward woman carrying the provided purse.
//   CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the purse. This includes its design, materials, color, and hardware. It is a fixed, unchangeable element.
//   MODEL & STYLE: A stylish woman in an oversized beige trench coat, wide-leg jeans, and white sneakers. She is walking confidently down a chic city street (like in Paris or New York). The purse is held naturally in her hand.
//   BACKGROUND & ATMOSPHERE: A blurred city street with classic architecture. The lighting is clear and natural, like a sunny afternoon.
//   OUTPUT SPECIFICATIONS: High-resolution, candid, editorial fashion magazine style.
//   `,
//   `
//   TASK: Generate a dramatic, ultra-realistic medium shot of a woman at an elegant evening event, showcasing the provided purse.
//   CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or details. It is a fixed element.
//   MODEL & STYLE: An elegant woman in a classic black silk slip dress. Her hair is in a sleek updo, and her makeup is glamorous. She is holding the purse as a clutch or by its top handle.
//   LIGHTING & ATMOSPHERE: Dim, moody lighting inside a luxurious venue, like an art gallery opening or a high-end restaurant. A soft spotlight highlights the woman and the purse.
//   OUTPUT SPECIFICATIONS: The final image must be cinematic, sophisticated, and exude nighttime glamour, with the purse as a key accessory.
//   `,
//   `
//     TASK: Generate an ultra-realistic close-up product photo featuring the provided purse.  
//     CRITICAL RULE: You MUST use the purse from the user's image with ZERO ALTERATIONS. Do not change its design, materials, or color. It must be presented exactly as it appears in the original photo.  
//     MODEL & STYLE: The purse is the main subject, captured in a close-up, high-definition shot. Every detail of the leather, stitching, and metallic accents must be sharp and perfectly lit. The purse should dominate the frame, styled in elegant positions such as standing upright, leaning slightly on a pedestal, or angled for dramatic focus.  
//     BACKGROUND & ATMOSPHERE:  
//     - Use a **bright, highly contrasting background tone** derived from or complementing the purse’s color, selected to make the product pop without distraction.  
//     - Props should be **minimal and aesthetic**: soft fabric folds, sculptural marble blocks, curved shapes, or translucent glass pieces.  
//     - The background objects and tones must work together as a design composition — always enhancing, never overpowering the purse.  
//     - Lighting must be refined and directional, creating soft shadows and gentle highlights that elevate the purse into a luxury focal point.  
//     OUTPUT SPECIFICATIONS: A premium, aspirational close-up product image designed for luxury branding, high-fashion catalogues, and social media campaigns. The purse is the hero of the frame, perfectly highlighted by harmonious tones and minimal aesthetic objects.  
//   `,
//   `
//   TASK: Generate an ultra-realistic portrait of a professional woman on her way to a meeting, featuring the provided purse.
//   CRITICAL RULE: The purse from the user's image is a key part of her look and **MUST NOT BE CHANGED**. Its original design, materials, and hardware must be preserved with perfect accuracy. Treat it as an unchangeable object.
//   MODEL & STYLE: A confident woman in a modern, well-tailored navy blue pantsuit. She is looking slightly off-camera with a gentle smile. The purse is held in the crook of her arm.
//   LIGHTING & BACKGROUND: A modern office building lobby with clean lines and natural light streaming in. The background is blurred to keep the focus on the subject.
//   OUTPUT SPECIFICATIONS: Polished, professional, and powerful.
//   `,
//   `
//   TASK: Generate an ultra-realistic, high-fashion, colorful portrait featuring the provided purse.
//   CRITICAL RULE: It is absolutely essential that the purse from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it, do not change the colors, do not alter the hardware. The purse must be an exact copy of the one in the user's image.
//   MODEL & STYLE: A model wearing a vibrant, monochrome outfit (e.g., all electric blue or hot pink) that complements or intentionally contrasts with the purse. The pose is artistic and dynamic.
//   BACKGROUND & ATMOSPHERE: A plain, solid-colored studio background that matches the outfit's color, creating a bold, eye-catching, color-block effect.
//   OUTPUT SPECIFICATIONS: High-resolution, editorial, and visually striking.
//   `
// ];

// // --- PERFUME PROMPTS ---
// const PERFUME_COVER_PROMPT = `
// TASK: Create a luxurious, atmospheric product photoshoot stage for a perfume bottle.
// IMPORTANT INSTRUCTION: You will be given an image containing a perfume bottle. Your primary and most critical task is to use the **exact perfume bottle** from the provided image. **DO NOT ALTER THE BOTTLE IN ANY WAY.** This means:
// - **NO** changes to its shape, glass texture, or design.
// - **NO** changes to its label, branding, or typography.
// - **NO** changes to the color of the liquid, or the design of the cap/atomizer.
// The perfume bottle must be presented **AS IS**.
// SCENE: Place this unaltered bottle on a sleek, reflective surface like wet slate or a dark mirror. The background should be abstract and moody, with draped silk fabric and soft, out-of-focus bokeh lights.
// LIGHTING: Dramatic and artistic. Use soft backlighting to create a 'halo' effect around the bottle, highlighting its silhouette and making the liquid inside appear luminous.
// GOAL: The final composition should be elegant, mysterious, and high-end, suitable for a luxury fragrance campaign, with the original bottle as the untouched centerpiece.
// `;

// const PERFUME_PHOTO_PROMPTS = [
//   `
//   TASK: Generate a retro, ultra-realistic cinematic photo of a 1990s Bollywood heroine with the provided perfume bottle.
//   CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the bottle. It is a fixed, unchangeable element in the scene.
//   MODEL & STYLE: A stylish woman with the look of a 1990s Bollywood actress. She wears a vibrant chiffon saree and retro sunglasses. Her hair is styled with classic 90s volume. She is seated in the passenger seat of a vintage Ambassador car.
//   SCENE & COMPOSITION: A close-up shot focusing on the perfume bottle being held elegantly in her hand, resting on the car's windowsill. The car's interior and a hint of a sunlit, nostalgic Indian street are visible in the background.
//   LIGHTING & ATMOSPHERE: Warm, cinematic lighting with a slight film grain effect to enhance the retro 1990s feel.
//   OUTPUT SPECIFICATIONS: High-fashion, nostalgic, and cinematic, like a still from a classic 90s movie.
//   `,
//   `
//   TASK: Generate a sophisticated, ultra-realistic lifestyle photo of the perfume bottle on a woman's vanity table at night.
//   CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or label. It is a fixed element.
//   SCENE & STYLE: The bottle sits on a dark marble vanity next to a velvet jewelry box and a classic red lipstick. In the background, out-of-focus city lights are visible through a window.
//   LIGHTING & ATMOSPHERE: Warm, soft light from a single vanity lamp, creating an intimate, glamorous, and luxurious mood.
//   OUTPUT SPECIFICATIONS: Cinematic and elegant, perfect for an evening fragrance advertisement.
//   `,
//   `
//   TASK: Create a high-end, ultra-realistic fashion perfume advertisement in a single, unified frame.
//   CRITICAL RULE: The perfume bottle from the user's image must appear EXACTLY AS IS—no label, color, or shape changes. It must remain in full natural color even though the rest of the image is black & white.
//   MODEL & STYLE: A confident, stylish woman in a perfectly tailored black suit and crisp white shirt, slightly unbuttoned for effortless chic. Soft, natural yet glamorous makeup and loosely waved hair.
//   POSE & EXPRESSION: Seated casually in a modern interior, leaning back with relaxed poise. She holds the perfume bottle elegantly in one hand near her chest so that it is fully visible and perfectly lit.
//   SCENE & COMPOSITION: Tight, vertical crop focusing on her from waist up. No empty white side space—just a strong, cinematic portrait where the colored bottle stands out as the central accent.
//   LIGHTING & ATMOSPHERE: Dramatic black-and-white studio lighting with soft highlights and rich shadows, giving a timeless luxury feel. The perfume bottle remains vividly colored to create striking contrast.
//   OUTPUT SPECIFICATIONS: High-resolution, fashion-editorial quality suitable for magazine or billboard. The entire scene is monochrome except the full-color perfume bottle, which appears sharp, glossy, and photorealistic.
//   `,
//   `
//   TASK: Generate an ultra-realistic, close-up shot of a model's hands elegantly holding the provided perfume bottle.
//   CRITICAL RULE: The perfume bottle is the focus and **MUST NOT BE CHANGED**. Its original design and label must be preserved with perfect accuracy. Treat it as an unchangeable object.
//   MODEL & STYLE: A woman with flawless skin and a perfect, clean, neutral-colored manicure holds the bottle delicately. She is wearing the sleeve of a cream-colored silk blouse. The shot is tightly cropped to focus on the interaction between the hands and the bottle.
//   LIGHTING & BACKGROUND: Soft, diffused studio lighting. The background is simple, out-of-focus, and non-distracting.
//   OUTPUT SPECIFICATIONS: Graceful, sophisticated, and tactile, highlighting the product's elegance.
//   `,
//   `
//   TASK: Generate an ultra-realistic, abstract photo featuring the provided perfume bottle with fabric and light play.
//   CRITICAL RULE: It is absolutely essential that the perfume bottle from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter it in any way. The bottle must be an exact copy of the one in the user's image.
//   SCENE & STYLE: The bottle is lying on its side, partially enveloped in a swirl of translucent, flowing chiffon fabric. Rays of light cut through the scene, creating beautiful caustic reflections on and through the bottle and fabric.
//   BACKGROUND & ATMOSPHERE: Dark and moody, focusing entirely on the interplay of light, texture, and the bottle's form.
//   OUTPUT SPECIFICATIONS: High-resolution, artistic, and visually striking.
//   `,
//   `
//   TASK: Create an ultra-realistic, high-fashion beauty portrait of a woman tenderly kissing the provided perfume bottle.
//   CRITICAL RULE: The perfume bottle from the provided image must be used **WITHOUT ANY MODIFICATION**. Do not redraw it, change its label, or alter it in any way. The bottle must appear exactly as in the user’s photo.
//   MODEL & STYLE: A sophisticated, modern woman with impeccable runway-style makeup—flawless luminous skin, subtly sculpted cheekbones, soft smoky eyes, and deep matte red lips. She closes her eyes in serene bliss as she gently kisses the bottle, conveying pure love for the fragrance. Her hair is styled in a sleek low chignon or loose glossy waves for a contemporary editorial look.
//   WARDROBE & ACCESSORIES: Minimal yet luxurious—think a black silk slip dress, delicate diamond studs, or a single thin gold choker to emphasize elegance without distraction.
//   LIGHTING & ATMOSPHERE: Clean, cinematic lighting with a gentle rim light to outline her silhouette and a soft golden key light to highlight her lips and the bottle’s glass. Background is a smooth, dark gradient or blurred warm bokeh to keep the focus entirely on her and the perfume.
//   COMPOSITION & MOOD: Tight beauty framing from shoulders up. The kiss is intimate but classy, conveying modern sophistication and sensual appreciation rather than overt glamour.
//   OUTPUT SPECIFICATIONS: High-resolution, magazine-cover quality, ideal for a luxury fragrance advertising campaign—minimalist, elegant, and timeless.
//   `
// ];

// // --- APPAREL PROMPTS ---
// const APPAREL_COVER_PROMPT = `
// TASK: Generate an ultra-realistic, high-fashion, full-body editorial photo of a model wearing the provided clothing item.
// CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the clothing. This includes its design, color, pattern, texture, and fit. It is a fixed, unchangeable element placed onto the model.
// MODEL & STYLE: A graceful and confident fashion model. Her pose should be strong and elegant, like a magazine cover shot. Hair and makeup should be high-fashion but not distracting from the clothing.
// BACKGROUND & ATMOSPHERE: A clean, minimalist studio background with architectural elements (e.g., a single column, an archway, or geometric blocks). The color should be a neutral tone like light gray or beige.
// LIGHTING: Professional studio lighting that creates soft shadows and highlights the texture and drape of the fabric.
// OUTPUT SPECIFICATIONS: High-resolution, sharp, editorial quality. The clothing is the absolute star of the image.
// `;

// const APPAREL_PHOTO_PROMPTS = [
//   `
//   TASK: Generate an ultra-realistic, full-body street style photo of a fashion-forward woman wearing the provided garment and walking.
//   CRITICAL RULE: The clothing item from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter its design, color, pattern, or fit. It is a fixed, unchangeable element.
//   MODEL & STYLE: A stylish woman walking confidently towards the camera on a chic city street (e.g., Paris, Milan). The pose should be natural and in-motion. Accessorize appropriately but simply (e.g., sunglasses, a small bag) to complement the outfit without overpowering it.
//   BACKGROUND & ATMOSPHERE: A slightly blurred, picturesque city street with classic architecture. The lighting is clear and natural, like on a sunny day.
//   OUTPUT SPECIFICATIONS: High-resolution, candid, editorial fashion magazine style.
//   `,
//   `
//   TASK: Generate an ultra-realistic lifestyle photo of a woman wearing the provided garment in a relaxed, seated pose.
//   CRITICAL RULE: The garment from the user's image must be used with **ZERO ALTERATIONS**. Do not change its design, color, or texture. It must be presented exactly as it appears in the original photo.
//   MODEL & STYLE: An elegant woman sitting at an outdoor cafe, on a park bench, or on the steps of a beautiful building. Her pose is relaxed and natural.
//   BACKGROUND & ATMOSPHERE: A clear, airy, and aesthetically pleasing setting. The focus should be sharp on the model and her outfit, with the background softly blurred.
//   OUTPUT SPECIFICATIONS: A high-end, aspirational lifestyle shot, making the garment look both beautiful and wearable in a real-life context.
//   `,
//   `
//   TASK: Generate a dramatic, ultra-realistic medium-close-up shot focusing on the details of the provided clothing item.
//   CRITICAL RULE: The clothing from the user's image is the main subject and **MUST NOT BE CHANGED**. Its original fabric texture, pattern, color, and details (buttons, seams, etc.) must be preserved with perfect accuracy.
//   MODEL & STYLE: A model in a simple, elegant pose that showcases the garment's texture and cut. The crop should be from the waist-up or chest-up. Hair and makeup are clean and minimal.
//   LIGHTING & BACKGROUND: A plain studio background. The lighting is designed to specifically highlight the fabric's texture and details.
//   OUTPUT SPECIFICATIONS: High-fashion, sharp focus on the garment. Timeless and clean.
//   `,
//   `
//   TASK: Generate an ultra-realistic, dynamic photo of a model wearing the provided garment in mid-motion.
//   CRITICAL RULE: The garment from the provided image must be an exact, pixel-accurate replica with ZERO modification. Do not redraw, recolor, resize, alter the fit, fabric, seams, stitching, patterns, or silhouette.
//   MODEL & STYLE: A model captured mid-jump, confident stride, or fluid runway-style motion. The energy should feel joyful, expressive, and free with physically realistic movement.
//   BACKGROUND & ATMOSPHERE: A clean, minimal studio or soft outdoor space, uncluttered and distraction-free. 
//   OUTPUT SPECIFICATIONS: High-resolution, glamorous, editorial-quality image with realistic lighting, natural fabric physics, accurate drape, and subtle natural motion blur only where appropriate.
//   `,
//   `
//   TASK: Generate an ultra-realistic photo showing the back or a three-quarter side view of a model wearing the provided garment.
//   CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. It is critical to accurately represent how the garment fits and is constructed from a non-frontal view. Do not alter any design elements.
//   MODEL & STYLE: A model standing with her back to the camera or in a three-quarter turn, looking over her shoulder. The pose should clearly display the garment's silhouette and details from the back or side.
//   BACKGROUND & ATMOSPHERE: A clean, neutral studio background to ensure full focus on the garment's fit and form.
//   OUTPUT SPECIFICATIONS: Clear, well-lit, and informative, as one might see on a high-end e-commerce product page.
//   `
// ];

// export const WOMEN_PROMPTS = {
//     jewelry: {
//         coverPrompt: JEWELRY_COVER_PROMPT,
//         photoPrompts: JEWELRY_PHOTO_PROMPTS
//     },
//     purse: {
//         coverPrompt: PURSE_COVER_PROMPT,
//         photoPrompts: PURSE_PHOTO_PROMPTS
//     },
//     perfume: {
//         coverPrompt: PERFUME_COVER_PROMPT,
//         photoPrompts: PERFUME_PHOTO_PROMPTS
//     },
//     apparel: {
//         coverPrompt: APPAREL_COVER_PROMPT,
//         photoPrompts: APPAREL_PHOTO_PROMPTS
//     }
// };

// // --- DYNAMIC ORNAMENT PROMPTS ---
// const DYNAMIC_ORNAMENT_COVER_PROMPT = (name: string) => `
// TASK: Create a luxurious product photoshoot stage for a piece of jewelry, specifically a ${name}.
// IMPORTANT INSTRUCTION: You will be given an image containing a piece of jewelry. Your primary and most critical task is to use the **exact jewelry** from the provided image. **DO NOT ALTER THE JEWELRY IN ANY WAY.** This means:
// - **NO** changes to its shape, design, or structure.
// - **NO** changes to its materials, textures, or metal type.
// - **NO** changes to the color, clarity, or cut of any gemstones, including diamonds.
// The jewelry must be presented **AS IS**.
// SCENE: Place this unaltered jewelry elegantly on a dark, textured rock surface. The background should feature a subtle, out-of-focus silhouette of an ancient, grand temple under a dark, moody sky.
// LIGHTING: The lighting must be dramatic and cinematic, creating strong, clear highlights on the jewelry's intricate details and metallic shine, perfectly preserving its original form and material.
// GOAL: The final composition should feel epic, high-end, and like a commercial advertisement, with the original jewelry as the untouched centerpiece.
// `;

// const DYNAMIC_ORNAMENT_PHOTO_PROMPTS = [
//   (name: string) => `
//   TASK: Generate an ultra-realistic close-up portrait of a woman wearing the provided ${name}.
//   CRITICAL RULE: The ${name} from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the jewelry. This includes its design, materials, and the precise color of all gemstones. It is a fixed element.
//   MODEL & STYLE: The model is an elegant woman with vintage Hollywood waves, clear contoured skin, and bold red lips. Her nails are polished in deep red.
//   BACKGROUND & ATMOSPHERE: Soft, out-of-focus lights sparkle in the blurred background, creating a red-carpet atmosphere.
//   OUTPUT SPECIFICATIONS: High-resolution, cinematic, timeless, and sophisticated.
//   `,
//   (name: string) => `
//   TASK: Generate a dramatic, black and white, ultra-realistic close-up portrait of a woman wearing the provided ${name}.
//   CRITICAL RULE: The ${name} from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or details. Even in this black and white scene, you must preserve the jewelry's original form and texture faithfully. It is a fixed element.
//   MODEL & STYLE: A mysterious woman with flawless skin, intense smoky eyes, black matte lips, and wind-swept strands across her face. Gothic elegance.
//   LIGHTING & ATMOSPHERE: Dark, moody cinematic lighting with high contrast. Luxurious and surreal.
//   OUTPUT SPECIFICATIONS: The final image must be black and white, but the ${name} should be showcased prominently and accurately.
//   `,
//   (name: string) => `
//   TASK: Generate an ultra-realistic medium-close portrait of a woman in a saree, adorned with the provided ${name}.
//   CRITICAL RULE: You **MUST** use the ${name} from the user's image with **ZERO ALTERATIONS**. Do not change its design, its materials, or the color of its gemstones. It must be presented exactly as it appears in the original photo.
//   MODEL & STYLE: A graceful woman in a soft pastel pink embroidered saree, draped beautifully. Her makeup is natural with soft rosy tones, and her hair is styled in gentle waves.
//   BACKGROUND & ATMOSPHERE: A serene garden setup with pastel flowers and a soft, clear daylight glow, creating a romantic and traditional atmosphere.
//   OUTPUT SPECIFICATIONS: The ${name} should be displayed with delicate elegance, remaining completely unchanged.
//   `,
//   (name: string) => `
//   TASK: Generate an ultra-realistic, high-fashion portrait of an Indian woman in bridal attire wearing the provided ${name}.
//   CRITICAL RULE: The ${name} from the user's image is the main subject and **MUST NOT BE CHANGED**. Its original design, materials, and gemstone colors must be preserved with perfect accuracy. Treat it as an unchangeable object placed on the model.
//   MODEL & STYLE: A graceful woman in a three-quarter pose. She wears a luxurious green and gold embroidered saree. Her makeup is bold with deep red lips, perfectly sculpted brows, and dramatic eyeliner. Her skin should have a clear, natural complexion.
//   LIGHTING & BACKGROUND: A pitch-dark background. The lighting is moody, cinematic, and silver-toned, designed to make the original ${name} sparkle and highlight its details.
//   OUTPUT SPECIFICATIONS: High-fashion editorial style. Timeless, regal, and mysterious.
//   `,
//   (name: string) => `
//   TASK: Generate an ultra-realistic, glamorous portrait of a woman in a gown wearing the provided ${name}.
//   CRITICAL RULE: It is absolutely essential that the ${name} from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it, do not change the colors of the stones, do not alter the metal. The jewelry must be an exact copy of the one in the user's image.
//   MODEL & STYLE: An elegant woman with softly curled brown hair styled in vintage Hollywood waves. She wears a deep crimson off-shoulder satin gown with voluminous sleeves. Her makeup is flawless with subtle eyeliner and nude peach lips.
//   BACKGROUND & ATMOSPHERE: A dark, luxurious setting with golden accents, evoking regal cinematic grandeur.
//   OUTPUT SPECIFICATIONS: High-resolution, glamorous, aristocratic elegance.
//   `
// ];

// export const DYNAMIC_ORNAMENT_PROMPTS_CONFIG = {
//     coverPrompt: DYNAMIC_ORNAMENT_COVER_PROMPT,
//     photoPrompts: DYNAMIC_ORNAMENT_PHOTO_PROMPTS
// };
// --- JEWELRY PROMPTS ---
const JEWELRY_COVER_PROMPT = `
TASK: Create a luxurious product photoshoot stage for a piece of jewelry.
IMPORTANT INSTRUCTION: You will be given an image containing a piece of jewelry. Your primary and most critical task is to use the **exact jewelry** from the provided image. **DO NOT ALTER THE JEWELRY IN ANY WAY.** This means:
- **NO** changes to its shape, design, or structure.
- **NO** changes to its materials, textures, or metal type.
- **NO** changes to the color, clarity, or cut of any gemstones, including diamonds.
The jewelry must be presented **AS IS**.
SCENE: Place this unaltered jewelry elegantly on a dark, textured rock surface. The background should feature a subtle, out-of-focus silhouette of an ancient, grand temple under a dark, moody sky.
LIGHTING: The lighting must be dramatic and cinematic, creating strong, clear highlights on the jewelry's intricate details and metallic shine, perfectly preserving its original form and material.
GOAL: The final composition should feel epic, high-end, and like a commercial advertisement, with the original jewelry as the untouched centerpiece.
`;

const JEWELRY_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic close-up portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: The jewelry from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the jewelry. This includes its design, materials, and the precise color of all gemstones. It is a fixed element.
  MODEL & STYLE: The model is an elegant woman with vintage Hollywood waves, clear contoured skin, and bold red lips. Her nails are polished in deep red.
  BACKGROUND & ATMOSPHERE: Soft, out-of-focus lights sparkle in the blurred background, creating a red-carpet atmosphere.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, timeless, and sophisticated.
  `,
  
  `
  TASK: Generate a dramatic, black and white, ultra-realistic close-up portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: The jewelry from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or details. Even in this black and white scene, you must preserve the jewelry's original form and texture faithfully. It is a fixed element.
  MODEL & STYLE: A mysterious woman with flawless skin, intense smoky eyes, black matte lips, and wind-swept strands across her face. Gothic elegance.
  LIGHTING & ATMOSPHERE: Dark, moody cinematic lighting with high contrast. Luxurious and surreal.
  OUTPUT SPECIFICATIONS: The final image must be black and white, but the jewelry should be showcased prominently and accurately.
  `,
  
  `
  TASK: Generate an ultra-realistic medium-close portrait of a woman in a saree, adorned with the provided jewelry.
  CRITICAL RULE: You **MUST** use the jewelry from the user's image with **ZERO ALTERATIONS**. Do not change its design, its materials, or the color of its gemstones. It must be presented exactly as it appears in the original photo.
  MODEL & STYLE: A graceful woman in a soft pastel pink embroidered saree, draped beautifully. Her makeup is natural with soft rosy tones, and her hair is styled in gentle waves.
  BACKGROUND & ATMOSPHERE: A serene garden setup with pastel flowers and a soft, clear daylight glow, creating a romantic and traditional atmosphere.
  OUTPUT SPECIFICATIONS: The jewelry should be displayed with delicate elegance, remaining completely unchanged.
  `,
  
  `
  TASK: Generate an ultra-realistic, high-fashion portrait of an Indian woman in bridal attire wearing the provided jewelry.
  CRITICAL RULE: The jewelry from the user's image is the main subject and **MUST NOT BE CHANGED**. Its original design, materials, and gemstone colors must be preserved with perfect accuracy. Treat it as an unchangeable object placed on the model.
  MODEL & STYLE: A graceful woman in a three-quarter pose. She wears a luxurious green and gold embroidered saree. Her makeup is bold with deep red lips, perfectly sculpted brows, and dramatic eyeliner. Her skin should have a clear, natural complexion.
  LIGHTING & BACKGROUND: A pitch-dark background. The lighting is moody, cinematic, and silver-toned, designed to make the original jewelry sparkle and highlight its details.
  OUTPUT SPECIFICATIONS: High-fashion editorial style. Timeless, regal, and mysterious.
  `,
  
  `
  TASK: Generate an ultra-realistic, glamorous portrait of a woman in a gown wearing the provided jewelry.
  CRITICAL RULE: It is absolutely essential that the jewelry from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it, do not change the colors of the stones, do not alter the metal. The jewelry must be an exact copy of the one in the user's image.
  MODEL & STYLE: An elegant woman with softly curled brown hair styled in vintage Hollywood waves. She wears a deep crimson off-shoulder satin gown with voluminous sleeves. Her makeup is flawless with subtle eyeliner and nude peach lips.
  BACKGROUND & ATMOSPHERE: A dark, luxurious setting with golden accents, evoking regal cinematic grandeur.
  OUTPUT SPECIFICATIONS: High-resolution, glamorous, aristocratic elegance.
  `
];

// --- PURSE PROMPTS ---
const PURSE_COVER_PROMPT = `
TASK: Create a luxurious product photoshoot stage for a women's purse.
IMPORTANT INSTRUCTION: You will be given an image containing a purse. Your primary and most critical task is to use the **exact purse** from the provided image. **DO NOT ALTER THE PURSE IN ANY WAY.** This means:
- **NO** changes to its shape, design, or structure.
- **NO** changes to its materials, textures, color, or hardware (clasps, zippers, straps).
The purse must be presented **AS IS**.
SCENE: Place this unaltered purse on a minimalist marble pedestal. The background should be a soft, out-of-focus high-end boutique interior with warm, ambient lighting.
LIGHTING: The lighting must be soft yet focused, creating beautiful, clear highlights on the purse's material and metallic hardware, perfectly preserving its original form and texture.
GOAL: The final composition should feel elegant, sophisticated, and like a luxury brand advertisement, with the original purse as the untouched centerpiece.
`;

const PURSE_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, full-body street style photo of a fashion-forward woman carrying the provided purse.
  CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the purse. This includes its design, materials, color, and hardware. It is a fixed, unchangeable element.
  MODEL & STYLE: A stylish woman in an oversized beige trench coat, wide-leg jeans, and white sneakers. She is walking confidently down a chic city street (like in Paris or New York). The purse is held naturally in her hand.
  BACKGROUND & ATMOSPHERE: A blurred city street with classic architecture. The lighting is clear and natural, like a sunny afternoon.
  OUTPUT SPECIFICATIONS: High-resolution, candid, editorial fashion magazine style.
  `,
  `
  TASK: Generate a dramatic, ultra-realistic medium shot of a woman at an elegant evening event, showcasing the provided purse.
  CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or details. It is a fixed element.
  MODEL & STYLE: An elegant woman in a classic black silk slip dress. Her hair is in a sleek updo, and her makeup is glamorous. She is holding the purse as a clutch or by its top handle.
  LIGHTING & ATMOSPHERE: Dim, moody lighting inside a luxurious venue, like an art gallery opening or a high-end restaurant. A soft spotlight highlights the woman and the purse.
  OUTPUT SPECIFICATIONS: The final image must be cinematic, sophisticated, and exude nighttime glamour, with the purse as a key accessory.
  `,
  `
    TASK: Generate an ultra-realistic close-up product photo featuring the provided purse.  
    CRITICAL RULE: You MUST use the purse from the user's image with ZERO ALTERATIONS. Do not change its design, materials, or color. It must be presented exactly as it appears in the original photo.  
    MODEL & STYLE: The purse is the main subject, captured in a close-up, high-definition shot. Every detail of the leather, stitching, and metallic accents must be sharp and perfectly lit. The purse should dominate the frame, styled in elegant positions such as standing upright, leaning slightly on a pedestal, or angled for dramatic focus.  
    BACKGROUND & ATMOSPHERE:  
    - Use a **bright, highly contrasting background tone** derived from or complementing the purse’s color, selected to make the product pop without distraction.  
    - Props should be **minimal and aesthetic**: soft fabric folds, sculptural marble blocks, curved shapes, or translucent glass pieces.  
    - The background objects and tones must work together as a design composition — always enhancing, never overpowering the purse.  
    - Lighting must be refined and directional, creating soft shadows and gentle highlights that elevate the purse into a luxury focal point.  
    OUTPUT SPECIFICATIONS: A premium, aspirational close-up product image designed for luxury branding, high-fashion catalogues, and social media campaigns. The purse is the hero of the frame, perfectly highlighted by harmonious tones and minimal aesthetic objects.  
  `,
  `
  TASK: Generate an ultra-realistic portrait of a professional woman on her way to a meeting, featuring the provided purse.
  CRITICAL RULE: The purse from the user's image is a key part of her look and **MUST NOT BE CHANGED**. Its original design, materials, and hardware must be preserved with perfect accuracy. Treat it as an unchangeable object.
  MODEL & STYLE: A confident woman in a modern, well-tailored navy blue pantsuit. She is looking slightly off-camera with a gentle smile. The purse is held in the crook of her arm.
  LIGHTING & BACKGROUND: A modern office building lobby with clean lines and natural light streaming in. The background is blurred to keep the focus on the subject.
  OUTPUT SPECIFICATIONS: Polished, professional, and powerful.
  `,
  `
  TASK: Generate an ultra-realistic, high-fashion, colorful portrait featuring the provided purse.
  CRITICAL RULE: It is absolutely essential that the purse from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it, do not change the colors, do not alter the hardware. The purse must be an exact copy of the one in the user's image.
  MODEL & STYLE: A model wearing a vibrant, monochrome outfit (e.g., all electric blue or hot pink) that complements or intentionally contrasts with the purse. The pose is artistic and dynamic.
  BACKGROUND & ATMOSPHERE: A plain, solid-colored studio background that matches the outfit's color, creating a bold, eye-catching, color-block effect.
  OUTPUT SPECIFICATIONS: High-resolution, editorial, and visually striking.
  `
];

// --- PERFUME PROMPTS ---
const PERFUME_COVER_PROMPT = `
TASK: Create a luxurious, atmospheric product photoshoot stage for a perfume bottle.
IMPORTANT INSTRUCTION: You will be given an image containing a perfume bottle. Your primary and most critical task is to use the **exact perfume bottle** from the provided image. **DO NOT ALTER THE BOTTLE IN ANY WAY.** This means:
- **NO** changes to its shape, glass texture, or design.
- **NO** changes to its label, branding, or typography.
- **NO** changes to the color of the liquid, or the design of the cap/atomizer.
The perfume bottle must be presented **AS IS**.
SCENE: Place this unaltered bottle on a sleek, reflective surface like wet slate or a dark mirror. The background should be abstract and moody, with draped silk fabric and soft, out-of-focus bokeh lights.
LIGHTING: Dramatic and artistic. Use soft backlighting to create a 'halo' effect around the bottle, highlighting its silhouette and making the liquid inside appear luminous.
GOAL: The final composition should be elegant, mysterious, and high-end, suitable for a luxury fragrance campaign, with the original bottle as the untouched centerpiece.
`;

const PERFUME_PHOTO_PROMPTS = [
  `
  TASK: Generate a retro, ultra-realistic cinematic photo of a 1990s Bollywood heroine with the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the bottle. It is a fixed, unchangeable element in the scene.
  MODEL & STYLE: A stylish woman with the look of a 1990s Bollywood actress. She wears a vibrant chiffon saree and retro sunglasses. Her hair is styled with classic 90s volume. She is seated in the passenger seat of a vintage Ambassador car.
  SCENE & COMPOSITION: A close-up shot focusing on the perfume bottle being held elegantly in her hand, resting on the car's windowsill. The car's interior and a hint of a sunlit, nostalgic Indian street are visible in the background.
  LIGHTING & ATMOSPHERE: Warm, cinematic lighting with a slight film grain effect to enhance the retro 1990s feel.
  OUTPUT SPECIFICATIONS: High-fashion, nostalgic, and cinematic, like a still from a classic 90s movie.
  `,
  `
  TASK: Generate a sophisticated, ultra-realistic lifestyle photo of the perfume bottle on a woman's vanity table at night.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or label. It is a fixed element.
  SCENE & STYLE: The bottle sits on a dark marble vanity next to a velvet jewelry box and a classic red lipstick. In the background, out-of-focus city lights are visible through a window.
  LIGHTING & ATMOSPHERE: Warm, soft light from a single vanity lamp, creating an intimate, glamorous, and luxurious mood.
  OUTPUT SPECIFICATIONS: Cinematic and elegant, perfect for an evening fragrance advertisement.
  `,
  `
  TASK: Create a high-end, ultra-realistic fashion perfume advertisement in a single, unified frame.
  CRITICAL RULE: The perfume bottle from the user's image must appear EXACTLY AS IS—no label, color, or shape changes. It must remain in full natural color even though the rest of the image is black & white.
  MODEL & STYLE: A confident, stylish woman in a perfectly tailored black suit and crisp white shirt, slightly unbuttoned for effortless chic. Soft, natural yet glamorous makeup and loosely waved hair.
  POSE & EXPRESSION: Seated casually in a modern interior, leaning back with relaxed poise. She holds the perfume bottle elegantly in one hand near her chest so that it is fully visible and perfectly lit.
  SCENE & COMPOSITION: Tight, vertical crop focusing on her from waist up. No empty white side space—just a strong, cinematic portrait where the colored bottle stands out as the central accent.
  LIGHTING & ATMOSPHERE: Dramatic black-and-white studio lighting with soft highlights and rich shadows, giving a timeless luxury feel. The perfume bottle remains vividly colored to create striking contrast.
  OUTPUT SPECIFICATIONS: High-resolution, fashion-editorial quality suitable for magazine or billboard. The entire scene is monochrome except the full-color perfume bottle, which appears sharp, glossy, and photorealistic.
  `,
  `
  TASK: Generate an ultra-realistic, close-up shot of a model's hands elegantly holding the provided perfume bottle.
  CRITICAL RULE: The perfume bottle is the focus and **MUST NOT BE CHANGED**. Its original design and label must be preserved with perfect accuracy. Treat it as an unchangeable object.
  MODEL & STYLE: A woman with flawless skin and a perfect, clean, neutral-colored manicure holds the bottle delicately. She is wearing the sleeve of a cream-colored silk blouse. The shot is tightly cropped to focus on the interaction between the hands and the bottle.
  LIGHTING & BACKGROUND: Soft, diffused studio lighting. The background is simple, out-of-focus, and non-distracting.
  OUTPUT SPECIFICATIONS: Graceful, sophisticated, and tactile, highlighting the product's elegance.
  `,
  `
  TASK: Generate an ultra-realistic, abstract photo featuring the provided perfume bottle with fabric and light play.
  CRITICAL RULE: It is absolutely essential that the perfume bottle from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter it in any way. The bottle must be an exact copy of the one in the user's image.
  SCENE & STYLE: The bottle is lying on its side, partially enveloped in a swirl of translucent, flowing chiffon fabric. Rays of light cut through the scene, creating beautiful caustic reflections on and through the bottle and fabric.
  BACKGROUND & ATMOSPHERE: Dark and moody, focusing entirely on the interplay of light, texture, and the bottle's form.
  OUTPUT SPECIFICATIONS: High-resolution, artistic, and visually striking.
  `,
  `
  TASK: Create an ultra-realistic, high-fashion beauty portrait of a woman tenderly kissing the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the provided image must be used **WITHOUT ANY MODIFICATION**. Do not redraw it, change its label, or alter it in any way. The bottle must appear exactly as in the user’s photo.
  MODEL & STYLE: A sophisticated, modern woman with impeccable runway-style makeup—flawless luminous skin, subtly sculpted cheekbones, soft smoky eyes, and deep matte red lips. She closes her eyes in serene bliss as she gently kisses the bottle, conveying pure love for the fragrance. Her hair is styled in a sleek low chignon or loose glossy waves for a contemporary editorial look.
  WARDROBE & ACCESSORIES: Minimal yet luxurious—think a black silk slip dress, delicate diamond studs, or a single thin gold choker to emphasize elegance without distraction.
  LIGHTING & ATMOSPHERE: Clean, cinematic lighting with a gentle rim light to outline her silhouette and a soft golden key light to highlight her lips and the bottle’s glass. Background is a smooth, dark gradient or blurred warm bokeh to keep the focus entirely on her and the perfume.
  COMPOSITION & MOOD: Tight beauty framing from shoulders up. The kiss is intimate but classy, conveying modern sophistication and sensual appreciation rather than overt glamour.
  OUTPUT SPECIFICATIONS: High-resolution, magazine-cover quality, ideal for a luxury fragrance advertising campaign—minimalist, elegant, and timeless.
  `
];

// --- APPAREL PROMPTS ---
const APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, high-fashion, full-body editorial photo of a model wearing the provided clothing item.
CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the clothing. This includes its design, color, pattern, texture, and fit. It is a fixed, unchangeable element placed onto the model.
DYNAMIC DIRECTION: Study the garment's style, color, and character carefully. Choose a model archetype, pose, setting, and mood that feels authentically suited to THIS specific product — do not default to a generic or repeated look. The model's age, body type, skin tone, hair, expression, and pose should all feel unique and creatively matched to the garment's world.
LIGHTING: Choose lighting that best compliments the garment's texture and color palette — dramatic, soft, golden, or studio as appropriate.
OUTPUT SPECIFICATIONS: High-resolution, sharp, editorial quality. The clothing is the absolute star of the image. Every generation should feel fresh and distinctly creative.
`;

const APPAREL_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic fashion photo of a woman wearing the provided garment.
  CRITICAL RULE: The clothing item from the user's image must be used **EXACTLY AS IS** — no alterations to design, color, pattern, texture, or fit. It is a fixed, unchangeable element.
  DYNAMIC DIRECTION: Study the garment's aesthetic (casual, formal, ethnic, boho, contemporary, etc.) and build a scene that naturally belongs to its world. Choose a unique location — urban, coastal, rural, architectural, or natural — that complements the garment. The model's skin tone, body type, hair, makeup, and expression should feel authentic and creatively matched to this specific piece. The pose should feel candid and alive — not a repeated catalog stance.
  ATMOSPHERE: Background, lighting, and color grade should cohesively reflect the garment's spirit. Each generation must feel like a fresh, distinct creative direction.
  OUTPUT SPECIFICATIONS: High-resolution, editorial fashion quality — compelling visual storytelling, not just product display.
  `,
  `
  TASK: Generate an ultra-realistic lifestyle photo of a woman wearing the provided garment.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: Invent a lifestyle moment that feels naturally connected to this specific garment — a garden brunch, a city evening, a rooftop, a bookshop, a beach walk, a cultural venue, or any setting where someone wearing this piece would feel at home. The model's appearance, expression, and pose should feel real and relaxed — never generic or formulaic. Lighting and color palette should be chosen to harmonize with the product.
  OUTPUT SPECIFICATIONS: High-end, aspirational lifestyle photography. The image should feel like a candid moment, not a posed shoot.
  `,
  `
  TASK: Generate a dramatic, ultra-realistic close-up or medium shot that highlights the details of the provided clothing item.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** — preserve its original fabric texture, pattern, construction details, and color with perfect accuracy.
  DYNAMIC DIRECTION: Choose a creative crop and angle that best reveals the garment's most captivating features — embroidery, drape, print, texture, seams, or cut. The model's visible body part should be positioned in an artistically considered way. Lighting should be purposeful and directional, sculpting the fabric's surface realistically. The background tone should be chosen specifically to make this garment's colors and details pop.
  OUTPUT SPECIFICATIONS: High-fashion, sharp focus on the garment. Each generation of this shot should have a distinct feel and mood.
  `,
  `
  TASK: Generate an ultra-realistic, energetic photo of a model wearing the provided garment in motion.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit.
  DYNAMIC DIRECTION: Create a scene full of energy that feels right for this specific garment's character. The movement — a spin, a stride, a jump, a twirl, a joyful walk — should be chosen based on what feels organic to this garment. The location and atmosphere should be immersive and vivid — avoid generic white studios. Think creatively: a sunlit courtyard, a breezy hillside, a colorful market, a grand staircase. The model's energy and expression should feel expressive and free.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, full of life. A visually striking image that makes the garment feel desirable and the brand feel dynamic and modern.
  `,
  `
  TASK: Generate an ultra-realistic photo of a female model wearing the provided garment — focusing on the view that best represents the product uploaded.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**.
  CONDITIONAL DIRECTION:
  - If the uploaded product image shows the **back of the garment**, generate a back-facing or three-quarter rear view of the model that clearly showcases the back panel, back design, rear silhouette, and any back details of the garment.
  - If the uploaded product image shows the **front of the garment** or any other side, generate a front-facing or three-quarter front view that clearly showcases the front design, neckline, chest area, and overall silhouette of the garment as provided.
  - Do NOT generate a back view if no back product image was provided.
  MODEL & STYLE: Choose a pose, expression, and body language that creatively fits the garment's character — not a stiff catalog stance. The setting should be clean and complementary.
  OUTPUT SPECIFICATIONS: Clear, well-lit, and informative — as seen on a premium e-commerce product page, but with thoughtful creative direction.
  `
];

export const WOMEN_PROMPTS = {
    jewelry: {
        coverPrompt: JEWELRY_COVER_PROMPT,
        photoPrompts: JEWELRY_PHOTO_PROMPTS
    },
    purse: {
        coverPrompt: PURSE_COVER_PROMPT,
        photoPrompts: PURSE_PHOTO_PROMPTS
    },
    perfume: {
        coverPrompt: PERFUME_COVER_PROMPT,
        photoPrompts: PERFUME_PHOTO_PROMPTS
    },
    apparel: {
        coverPrompt: APPAREL_COVER_PROMPT,
        photoPrompts: APPAREL_PHOTO_PROMPTS
    }
};

// --- DYNAMIC ORNAMENT PROMPTS ---
const DYNAMIC_ORNAMENT_COVER_PROMPT = (name: string) => `
TASK: Create a luxurious product photoshoot stage for a piece of jewelry, specifically a ${name}.
IMPORTANT INSTRUCTION: You will be given an image containing a piece of jewelry. Your primary and most critical task is to use the **exact jewelry** from the provided image. **DO NOT ALTER THE JEWELRY IN ANY WAY.** This means:
- **NO** changes to its shape, design, or structure.
- **NO** changes to its materials, textures, or metal type.
- **NO** changes to the color, clarity, or cut of any gemstones, including diamonds.
The jewelry must be presented **AS IS**.
SCENE: Place this unaltered jewelry elegantly on a dark, textured rock surface. The background should feature a subtle, out-of-focus silhouette of an ancient, grand temple under a dark, moody sky.
LIGHTING: The lighting must be dramatic and cinematic, creating strong, clear highlights on the jewelry's intricate details and metallic shine, perfectly preserving its original form and material.
GOAL: The final composition should feel epic, high-end, and like a commercial advertisement, with the original jewelry as the untouched centerpiece.
`;

const DYNAMIC_ORNAMENT_PHOTO_PROMPTS = [
  (name: string) => `
  TASK: Generate an ultra-realistic close-up portrait of a woman wearing the provided ${name}.
  CRITICAL RULE: The ${name} from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the jewelry. This includes its design, materials, and the precise color of all gemstones. It is a fixed element.
  MODEL & STYLE: The model is an elegant woman with vintage Hollywood waves, clear contoured skin, and bold red lips. Her nails are polished in deep red.
  BACKGROUND & ATMOSPHERE: Soft, out-of-focus lights sparkle in the blurred background, creating a red-carpet atmosphere.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, timeless, and sophisticated.
  `,
  (name: string) => `
  TASK: Generate a dramatic, black and white, ultra-realistic close-up portrait of a woman wearing the provided ${name}.
  CRITICAL RULE: The ${name} from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, shape, or details. Even in this black and white scene, you must preserve the jewelry's original form and texture faithfully. It is a fixed element.
  MODEL & STYLE: A mysterious woman with flawless skin, intense smoky eyes, black matte lips, and wind-swept strands across her face. Gothic elegance.
  LIGHTING & ATMOSPHERE: Dark, moody cinematic lighting with high contrast. Luxurious and surreal.
  OUTPUT SPECIFICATIONS: The final image must be black and white, but the ${name} should be showcased prominently and accurately.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic medium-close portrait of a woman in a saree, adorned with the provided ${name}.
  CRITICAL RULE: You **MUST** use the ${name} from the user's image with **ZERO ALTERATIONS**. Do not change its design, its materials, or the color of its gemstones. It must be presented exactly as it appears in the original photo.
  MODEL & STYLE: A graceful woman in a soft pastel pink embroidered saree, draped beautifully. Her makeup is natural with soft rosy tones, and her hair is styled in gentle waves.
  BACKGROUND & ATMOSPHERE: A serene garden setup with pastel flowers and a soft, clear daylight glow, creating a romantic and traditional atmosphere.
  OUTPUT SPECIFICATIONS: The ${name} should be displayed with delicate elegance, remaining completely unchanged.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic, high-fashion portrait of an Indian woman in bridal attire wearing the provided ${name}.
  CRITICAL RULE: The ${name} from the user's image is the main subject and **MUST NOT BE CHANGED**. Its original design, materials, and gemstone colors must be preserved with perfect accuracy. Treat it as an unchangeable object placed on the model.
  MODEL & STYLE: A graceful woman in a three-quarter pose. She wears a luxurious green and gold embroidered saree. Her makeup is bold with deep red lips, perfectly sculpted brows, and dramatic eyeliner. Her skin should have a clear, natural complexion.
  LIGHTING & BACKGROUND: A pitch-dark background. The lighting is moody, cinematic, and silver-toned, designed to make the original ${name} sparkle and highlight its details.
  OUTPUT SPECIFICATIONS: High-fashion editorial style. Timeless, regal, and mysterious.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic, glamorous portrait of a woman in a gown wearing the provided ${name}.
  CRITICAL RULE: It is absolutely essential that the ${name} from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it, do not change the colors of the stones, do not alter the metal. The jewelry must be an exact copy of the one in the user's image.
  MODEL & STYLE: An elegant woman with softly curled brown hair styled in vintage Hollywood waves. She wears a deep crimson off-shoulder satin gown with voluminous sleeves. Her makeup is flawless with subtle eyeliner and nude peach lips.
  BACKGROUND & ATMOSPHERE: A dark, luxurious setting with golden accents, evoking regal cinematic grandeur.
  OUTPUT SPECIFICATIONS: High-resolution, glamorous, aristocratic elegance.
  `
];

export const DYNAMIC_ORNAMENT_PROMPTS_CONFIG = {
    coverPrompt: DYNAMIC_ORNAMENT_COVER_PROMPT,
    photoPrompts: DYNAMIC_ORNAMENT_PHOTO_PROMPTS
};
