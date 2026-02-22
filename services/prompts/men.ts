// // --- WATCH PROMPTS ---
// const WATCH_COVER_PROMPT = `
// TASK: Create a luxurious product photoshoot stage for a men's watch.
// IMPORTANT INSTRUCTION: You will be given an image containing a watch. Your primary and most critical task is to use the **exact watch** from the provided image. **DO NOT ALTER THE WATCH IN ANY WAY.** This includes its design, materials, watch face, and strap. It must be presented **AS IS**.
// SCENE: Place this unaltered watch on a rugged, natural element like a piece of dark, polished wood or a dark slate rock. The background should be a blurred, sophisticated setting like a modern office with city views or a mountain landscape at dusk.
// LIGHTING: The lighting must be dramatic and focused, creating crisp highlights on the watch's metallic details and glass face, preserving its original form.
// GOAL: The final composition should feel masculine, powerful, and high-end, with the original watch as the untouched centerpiece.
// `;

// const WATCH_PHOTO_PROMPTS = [
//   `
//   TASK: Generate an ultra-realistic, close-up shot of a man's wrist wearing the provided watch, with his hand on the steering wheel of a classic luxury car.
//   CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the watch. It is a fixed, unchangeable element.
//   MODEL & STYLE: The man is wearing a tailored leather driving glove on his other hand or a crisp shirt cuff is visible. The focus is sharp on the watch.
//   BACKGROUND & ATMOSPHERE: The interior of a vintage sports car. The lighting is cinematic, with clear light catching the details of the watch and the car's interior.
//   OUTPUT SPECIFICATIONS: High-resolution, aspirational, and sophisticated.
//   `,
//   `
//   TASK: Generate an ultra-realistic photo of a man in a sharp business suit, with the provided watch subtly visible.
//   CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**, without any modifications.
//   MODEL & STYLE: A confident man in a business meeting or his office, perhaps writing notes or adjusting his tie. The watch is visible peeking from under his shirt sleeve.
//   LIGHTING & ATMOSPHERE: Clear, natural light from a large office window. The mood is professional and successful.
//   OUTPUT SPECIFICATIONS: Polished, corporate, and elegant.
//   `,
//   `
//   TASK: Generate an ultra-realistic lifestyle photo of an adventurous man wearing the provided watch.
//   CRITICAL RULE: You **MUST** use the watch from the user's image with **ZERO ALTERATIONS**.
//   MODEL & STYLE: A ruggedly handsome man hiking or exploring, checking his watch against a mountain sunset or a coastal view. He wears practical, stylish outdoor gear.
//   BACKGROUND & ATMOSPHERE: A breathtaking natural landscape. The lighting is clear late afternoon light, creating a warm and adventurous feel.
//   OUTPUT SPECIFICATIONS: Aspirational, rugged, and dynamic.
//   `,
//   `
//   TASK: Generate a moody, ultra-realistic shot of a man at a sophisticated bar, with the provided watch in focus.
//   CRITICAL RULE: The watch from the user's image **MUST NOT BE CHANGED**.
//   MODEL & STYLE: A well-dressed man holding a glass of whiskey or a classic cocktail. The shot is cropped to focus on his hand, the glass, and the watch on his wrist.
//   LIGHTING & BACKGROUND: Dim, ambient lighting of an upscale bar. The lighting should clearly define the watch.
//   OUTPUT SPECIFICATIONS: Cinematic, mysterious, and masculine.
//   `,
//   `
//   TASK: Generate an ultra-realistic, casual street style photo featuring the provided watch.
//   CRITICAL RULE: It is absolutely essential that the watch from the provided image is used **WITHOUT ANY MODIFICATION**.
//   MODEL & STYLE: A stylish man in a leather jacket and jeans, leaning against a city wall. The watch is a key accessory to his cool, effortless look.
//   BACKGROUND & ATMOSPHERE: A chic urban environment with interesting textures (brick, concrete). Clear, natural daylight.
//   OUTPUT SPECIFICATIONS: High-resolution, fashionable, and candid.
//   `
// ];

// // --- PERFUME PROMPTS ---
// const PERFUME_COVER_PROMPT = `
// TASK: Create a luxurious, masculine product photoshoot stage for a men's perfume bottle.
// IMPORTANT INSTRUCTION: You will be given an image of a perfume bottle. Your primary and most critical task is to use the **exact perfume bottle** from the provided image. **DO NOT ALTER THE BOTTLE IN ANY WAY.** This includes its shape, label, and liquid color.
// SCENE: Place this unaltered bottle on a dark, textured surface like wet charcoal or a slab of concrete. The background should be abstract and moody, with elements like swirling smoke or dramatic water splashes.
// LIGHTING: Clear, high-contrast lighting. Use a single key light to sculpt the bottle's shape and create deep shadows.
// GOAL: The final composition should feel mysterious, sophisticated, and powerful, suitable for a luxury men's fragrance campaign.
// `;

// const PERFUME_PHOTO_PROMPTS = [
//   `
//   TASK: Generate an ultra-realistic luxury fragrance campaign visual featuring the provided perfume bottle.
//   CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED** (shape, label, cap, and proportions must remain exactly as provided).
//   SCENE: A sunlit Mediterranean coastal setting with deep turquoise sea and towering limestone cliffs forming a natural arch. An athletic, tanned male model reclines shirtless on the white deck of a sleek yacht, wearing crisp white swim trunks. He has short dark hair slicked back from the sea, subtle stubble, and sun-kissed skin glistening with water droplets. He rests casually, gazing forward with a calm, confident expression, evoking effortless summer luxury.
//   LIGHTING & BACKGROUND: Bright natural daylight with vivid ocean blues and shimmering reflections. The cliffs and arch create striking depth, while the open sea and clear sky provide expansive negative space for elegant typography.
//   OUTPUT SPECIFICATIONS: Ultra-detailed, photorealistic, bold, and editorial—ready for a premium fragrance advertisement with clean negative space for branding.
//   `,
//   `
//   TASK: Generate a dramatic black and white portrait of a bearded man in a suit, holding the provided perfume bottle close to his face.  
//   CRITICAL RULE: The perfume bottle must be used **EXACTLY AS IS** and must be the only element in color.  
//   MODEL & STYLE: A confident man with a thick beard, sharp features, and intense gaze, dressed in a tailored suit with an open-collar shirt. The rest of the scene is monochrome.  
//   LIGHTING & ATMOSPHERE: High-contrast, clear black and white studio lighting, with shadows adding depth and drama.  
//   OUTPUT SPECIFICATIONS: Striking, masculine, bold, and modern.
//   `,
//   `
//   TASK: Generate an ultra-realistic, high-fashion dark-fantasy fragrance advertisement featuring the provided perfume bottle.
//   CRITICAL RULE: The attached perfume bottle **MUST NOT BE CHANGED** — keep its exact shape, label, cap, and proportions.
//   SCENE: Extreme close-up composition where the **perfume bottle fills most of the frame**, resting on fractured black crystal with razor-sharp edges. Behind and partly above the bottle, a tall spectral witch-like figure emerges from swirling obsidian mist. Only her lower face and one hand are clearly revealed. Her long  finger presses to **luminous nuade-red lips** in a commanding “shh” gesture, appearing just over the bottle’s shoulder. Wisps of icy blue magic curl around the cap and base, as if drawn to the fragrance.
//   LIGHTING & BACKGROUND: Ultra-dramatic low-key lighting with focused electric-blue and silver edge lights that sculpt every surface of the bottle and crystal. Cold mist and faint sparks wrap the bottle in supernatural energy while the figure remains partially hidden in velvety shadow.
//   MOOD & STYLE: Dark, hypnotic, and intensely premium. The scene fuses high-fashion witchcraft with cinematic fantasy, making the **bottle the undisputed star** while still evoking forbidden allure and silent power.
//   OUTPUT SPECIFICATIONS: Ultra-detailed, photorealistic, 8k resolution—perfect for a bold, unforgettable luxury fragrance campaign.
//   `,
//   `
//   TASK: Generate a sophisticated, ultra-realistic still life featuring the provided perfume bottle.
//   CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED**.
//   SCENE: The bottle is placed on a polished dark wood desk, next to other masculine accessories like a leather-bound journal, a fountain pen, or a pair of classic sunglasses.
//   LIGHTING & BACKGROUND: Soft, directional light, like from a desk lamp, creating an intelligent and refined mood.
//   OUTPUT SPECIFICATIONS: Elegant, classic, and detailed.
//   `,
//   `
//   TASK: Generate a glamorous, ultra-realistic luxury fragrance advertisement featuring the provided perfume bottle.
//   CRITICAL RULE: The perfume bottle from the provided image **MUST NOT BE CHANGED** — keep its exact shape, label, and signature.
//   SCENE: A striking, fashion-forward couple stands in a sleek mirrored elevator. The man wears a perfectly tailored black tuxedo with a crisp white shirt and untied bow tie, leaning slightly toward the woman with one hand resting on the wall behind her and the other lightly at her waist. The woman, in a fitted black tuxedo jacket with a daring deep neckline, tilts her face up toward him, one hand placed gently on his chest and the other brushing his lapel. Their pose radiates intimacy and confidence. The perfume bottle is displayed on a glossy reflective surface in the foreground, perfectly centered and sharply detailed.
//   LIGHTING & BACKGROUND: Moody, cinematic lighting with soft golden highlights on their faces and dramatic shadows on the dark metallic elevator panels. Subtle reflections add depth and a sense of luxury.
//   OUTPUT SPECIFICATIONS: Ultra-realistic, elegant, and sensuous. Every detail—from clothing texture to reflections on the elevator walls—must convey premium sophistication and timeless allure.
//   `


// ];

// // --- BELT PROMPTS ---
// const BELT_COVER_PROMPT = `
// TASK: Create a minimalist, high-end product shot for a men's belt.
// IMPORTANT INSTRUCTION: You will be given an image of a belt. Your primary task is to use the **exact belt** from the image **WITHOUT ANY ALTERATION** to its design, buckle, color, or material.
// SCENE: The belt is coiled elegantly on a minimalist surface like brushed metal, concrete, or rich leather.
// LIGHTING: Clean, directional lighting that clearly defines the texture of the belt's material and the metallic finish of the buckle.
// GOAL: The final image should be sharp, sophisticated, and focused entirely on the craftsmanship of the unchanged belt.
// `;

// const BELT_PHOTO_PROMPTS = [
//   `
//   TASK: Create a hyper-realistic, high-contrast monochrome close-up shot focusing on the provided belt.
//   CRITICAL RULE: The belt **MUST NOT BE CHANGED**. Its texture, buckle, and stitching must be preserved with perfect accuracy. The entire image output must be black and white.
//   SCENE & STYLE: A man is fastening the belt. The shot is tightly cropped on his torso, with his hands visible. He is wearing dark, textured trousers (like raw denim). The focus is razor-sharp on the belt's buckle and the leather's grain. The belt must cast a soft, realistic shadow on the trousers.
//   PHOTOGRAPHY: Shot with a macro lens to capture extreme detail. The lighting should be dramatic and from the side, creating deep shadows and clear highlights that emphasize the texture of the materials. The final image should be a powerful, high-fashion black and white photograph.
//   OUTPUT: Moody, textural, and highly detailed.
//   `,
//   `
//   TASK: Generate a clean, ultra-realistic editorial photo of a man wearing the provided belt, focusing on how it complements his outfit.
//   CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**. It is a fixed element.
//   MODEL & STYLE: A three-quarter shot of a man wearing impeccably tailored chinos and a crisp, tucked-in linen shirt. The pose is simple and classic, showcasing the belt as a centerpiece of a smart-casual outfit. The belt must appear naturally cinched and conform to his waist.
//   BACKGROUND & ATMOSPHERE: A studio with clear, natural light coming from a large window just out of frame. The background is a simple, neutral-colored wall with subtle texture.
//   PHOTOGRAPHY & REALISM: Shot with an 85mm portrait lens for a clean, compressed look with soft background blur. The lighting should be soft and diffused, creating clear highlights on the buckle and subtle shadows that define the belt's shape and how it sits on the trousers. Every stitch should be visible.
//   OUTPUT: Sharp, sophisticated, and flawlessly realistic, like a page from a luxury brand's lookbook.
//   `,
//   `
//   TASK: Generate a cinematic, ultra-realistic portrait of a man wearing the provided belt, shot during late afternoon.
//   CRITICAL RULE: The belt from the user's image must be used **WITHOUT ANY MODIFICATION**. Its design, buckle, and material must be an exact match.
//   MODEL & STYLE: A rugged man in a simple, well-fitted white henley shirt and dark jeans, leaning against a rustic wall. The belt is a key element, and it must look naturally integrated, conforming to his posture.
//   PHOTOGRAPHY & REALISM: Shot on a 50mm f/1.4 lens. The clear light of the late afternoon must realistically reflect off the belt's buckle and the texture of the leather. The belt must cast soft, convincing shadows on his jeans. The overall feel should be authentic and clear, not like a composite image.
//   OUTPUT: Cinematic, and authentic.
//   `,
//   `
//   TASK: Generate a moody, ultra-realistic nighttime shot of a man wearing the provided belt in a city environment.
//   CRITICAL RULE: The belt must be used **WITHOUT ANY MODIFICATION**. It is an unchangeable part of his style.
//   MODEL & STYLE: A stylish man in a leather jacket and dark jeans, standing on a rain-slicked city street with neon lights blurred in the background. The belt is clearly visible and integrated into his look.
//   LIGHTING & REALISM: The scene is lit by ambient city lights. These colored lights must cast clear reflections on the metal buckle and the sheen of the leather. The belt must look like a natural part of his outfit, with shadows and highlights that match the complex lighting environment perfectly.
//   PHOTOGRAPHY: Cinematic, shallow depth of field, shot with a 35mm lens. A subtle film grain should be added for texture.
//   OUTPUT: Gritty, cool, and photorealistic.
//   `,
//   `
//   TASK: Generate an authentic, ultra-realistic photo of a man getting dressed, with a focus on him putting on the provided belt.
//   CRITICAL RULE: The belt must be used **EXACTLY AS IS**. Do not alter its appearance in any way.
//   MODEL & STYLE: A man in a stylish, well-lit bedroom. He is in the process of threading the belt through the loops of his trousers. The shot is a medium-close up, focusing on his hands, the belt, and his waist area.
//   BACKGROUND & ATMOSPHERE: A sophisticated and slightly out-of-focus background with a chair and warm ambient light. The depth of field should be shallow, keeping the focus entirely on the action of putting on the belt.
//   LIGHTING & REALISM: The lighting should be clear and natural, as if from a window. It must create clear highlights on the buckle as it moves and cast soft shadows from his hands onto the belt and trousers, ensuring the components look integrated and not flat.
//   OUTPUT: Candid, intimate, and highly realistic, focusing on the tactile quality of the product.
//   `
// ];

// // --- APPAREL PROMPTS ---
// const APPAREL_COVER_PROMPT = `
// TASK: Generate an ultra-realistic, high-fashion, full-body editorial photo of a male model wearing the provided clothing item.
// CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the clothing. This includes its design, color, pattern, texture, and fit. It is a fixed, unchangeable element placed onto the model.
// MODEL & STYLE: A confident male fashion model. His pose should be strong and impactful, like a magazine cover shot. Hair and makeup are clean and masculine.
// BACKGROUND & ATMOSPHERE: A clean, minimalist studio background with strong architectural elements (e.g., concrete blocks, a stark staircase).
// LIGHTING: Professional studio lighting with balanced shadows that highlights the form of the model and the texture of the fabric.
// OUTPUT SPECIFICATIONS: High-resolution, sharp, editorial quality. The clothing is the absolute star of the image.
// `;

// const APPAREL_PHOTO_PROMPTS = [
//   `
//   TASK: Generate an ultra-realistic, full-body street style photo of a man wearing the provided garment.
//   CRITICAL RULE: The clothing item must be used **EXACTLY AS IS**.
//   MODEL & STYLE: A stylish man walking confidently on a city street (e.g., SoHo, London). The pose is natural and in-motion, capturing an effortless look. Accessorize appropriately (e.g., sunglasses, sneakers).
//   BACKGROUND & ATMOSPHERE: A slightly blurred, chic urban street. The lighting is clear and natural, like on a sunny day.
//   OUTPUT SPECIFICATIONS: High-resolution, candid, editorial fashion magazine style.
//   `,
//   `
//   TASK: Generate an ultra-realistic lifestyle photo of a man wearing the provided garment in a relaxed, seated pose.
//   CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS**.
//   MODEL & STYLE: A man sitting in a modern armchair in a stylish loft apartment, at a rustic cafe, or on a park bench. His pose is relaxed and natural.
//   BACKGROUND & ATMOSPHERE: An aesthetically pleasing setting. The focus is sharp on the model and his outfit, with the background softly blurred.
//   OUTPUT SPECIFICATIONS: A high-end, aspirational lifestyle shot.
//   `,
//   `
//   TASK: Generate a dramatic, ultra-realistic medium-close-up shot focusing on the details of the provided clothing item.
//   CRITICAL RULE: The clothing **MUST NOT BE CHANGED**. Its original fabric texture, pattern, and details must be preserved.
//   MODEL & STYLE: A model in a simple, strong pose that showcases the garment's texture and cut. The crop should be from the waist-up.
//   LIGHTING & BACKGROUND: A plain, dark studio background. The lighting is designed to clearly define the fabric's details.
//   OUTPUT SPECIFICATIONS: High-fashion, sharp focus on the garment. Timeless and clean.
//   `,
//   `
//   TASK: Generate an ultra-realistic, dynamic photo of a model wearing the provided garment in motion.
//   CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
//   MODEL & STYLE: A male model captured mid-jump or striding with purpose such as creative modeling pose., causing the garment (if loose) to show movement and flow. The energy is powerful and athletic.
//   BACKGROUND & ATMOSPHERE: A simple, open space, like a minimalist rooftop or an empty warehouse, to avoid distraction.
//   OUTPUT SPECIFICATIONS: High-resolution and full of energy.
//   `,
//   `
//   TASK: Generate an ultra-realistic photo showing the back or three-quarter view of a model wearing the provided garment.
//   CRITICAL RULE: The garment must be used **EXACTLY AS IS**, accurately representing its fit from a non-frontal view.
//   MODEL & STYLE: A model standing with his back to the camera or in a three-quarter turn. The pose should clearly display the garment's silhouette from the back or side.
//   BACKGROUND & ATMOSPHERE: A clean, neutral studio background.
//   OUTPUT SPECIFICATIONS: Clear and well-lit, as seen on a high-end e-commerce site.
//   `
// ];

// export const MEN_PROMPTS = {
//     watch: {
//         coverPrompt: WATCH_COVER_PROMPT,
//         photoPrompts: WATCH_PHOTO_PROMPTS
//     },
//     perfume: {
//         coverPrompt: PERFUME_COVER_PROMPT,
//         photoPrompts: PERFUME_PHOTO_PROMPTS
//     },
//     belt: {
//         coverPrompt: BELT_COVER_PROMPT,
//         photoPrompts: BELT_PHOTO_PROMPTS
//     },
//     apparel: {
//         coverPrompt: APPAREL_COVER_PROMPT,
//         photoPrompts: APPAREL_PHOTO_PROMPTS
//     }
// };
// --- WATCH PROMPTS ---
const WATCH_COVER_PROMPT = `
TASK: Create a luxurious product photoshoot stage for a men's watch.
IMPORTANT INSTRUCTION: You will be given an image containing a watch. Your primary and most critical task is to use the **exact watch** from the provided image. **DO NOT ALTER THE WATCH IN ANY WAY.** This includes its design, materials, watch face, and strap. It must be presented **AS IS**.
SCENE: Place this unaltered watch on a rugged, natural element like a piece of dark, polished wood or a dark slate rock. The background should be a blurred, sophisticated setting like a modern office with city views or a mountain landscape at dusk.
LIGHTING: The lighting must be dramatic and focused, creating crisp highlights on the watch's metallic details and glass face, preserving its original form.
GOAL: The final composition should feel masculine, powerful, and high-end, with the original watch as the untouched centerpiece.
`;

const WATCH_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, close-up shot of a man's wrist wearing the provided watch, with his hand on the steering wheel of a classic luxury car.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the watch. It is a fixed, unchangeable element.
  MODEL & STYLE: The man is wearing a tailored leather driving glove on his other hand or a crisp shirt cuff is visible. The focus is sharp on the watch.
  BACKGROUND & ATMOSPHERE: The interior of a vintage sports car. The lighting is cinematic, with clear light catching the details of the watch and the car's interior.
  OUTPUT SPECIFICATIONS: High-resolution, aspirational, and sophisticated.
  `,
  `
  TASK: Generate an ultra-realistic photo of a man in a sharp business suit, with the provided watch subtly visible.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**, without any modifications.
  MODEL & STYLE: A confident man in a business meeting or his office, perhaps writing notes or adjusting his tie. The watch is visible peeking from under his shirt sleeve.
  LIGHTING & ATMOSPHERE: Clear, natural light from a large office window. The mood is professional and successful.
  OUTPUT SPECIFICATIONS: Polished, corporate, and elegant.
  `,
  `
  TASK: Generate an ultra-realistic lifestyle photo of an adventurous man wearing the provided watch.
  CRITICAL RULE: You **MUST** use the watch from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A ruggedly handsome man hiking or exploring, checking his watch against a mountain sunset or a coastal view. He wears practical, stylish outdoor gear.
  BACKGROUND & ATMOSPHERE: A breathtaking natural landscape. The lighting is clear late afternoon light, creating a warm and adventurous feel.
  OUTPUT SPECIFICATIONS: Aspirational, rugged, and dynamic.
  `,
  `
  TASK: Generate a moody, ultra-realistic shot of a man at a sophisticated bar, with the provided watch in focus.
  CRITICAL RULE: The watch from the user's image **MUST NOT BE CHANGED**.
  MODEL & STYLE: A well-dressed man holding a glass of whiskey or a classic cocktail. The shot is cropped to focus on his hand, the glass, and the watch on his wrist.
  LIGHTING & BACKGROUND: Dim, ambient lighting of an upscale bar. The lighting should clearly define the watch.
  OUTPUT SPECIFICATIONS: Cinematic, mysterious, and masculine.
  `,
  `
  TASK: Generate an ultra-realistic, casual street style photo featuring the provided watch.
  CRITICAL RULE: It is absolutely essential that the watch from the provided image is used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: A stylish man in a leather jacket and jeans, leaning against a city wall. The watch is a key accessory to his cool, effortless look.
  BACKGROUND & ATMOSPHERE: A chic urban environment with interesting textures (brick, concrete). Clear, natural daylight.
  OUTPUT SPECIFICATIONS: High-resolution, fashionable, and candid.
  `
];

// --- PERFUME PROMPTS ---
const PERFUME_COVER_PROMPT = `
TASK: Create a luxurious, masculine product photoshoot stage for a men's perfume bottle.
IMPORTANT INSTRUCTION: You will be given an image of a perfume bottle. Your primary and most critical task is to use the **exact perfume bottle** from the provided image. **DO NOT ALTER THE BOTTLE IN ANY WAY.** This includes its shape, label, and liquid color.
SCENE: Place this unaltered bottle on a dark, textured surface like wet charcoal or a slab of concrete. The background should be abstract and moody, with elements like swirling smoke or dramatic water splashes.
LIGHTING: Clear, high-contrast lighting. Use a single key light to sculpt the bottle's shape and create deep shadows.
GOAL: The final composition should feel mysterious, sophisticated, and powerful, suitable for a luxury men's fragrance campaign.
`;

const PERFUME_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic luxury fragrance campaign visual featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED** (shape, label, cap, and proportions must remain exactly as provided).
  SCENE: A sunlit Mediterranean coastal setting with deep turquoise sea and towering limestone cliffs forming a natural arch. An athletic, tanned male model reclines shirtless on the white deck of a sleek yacht, wearing crisp white swim trunks. He has short dark hair slicked back from the sea, subtle stubble, and sun-kissed skin glistening with water droplets. He rests casually, gazing forward with a calm, confident expression, evoking effortless summer luxury.
  LIGHTING & BACKGROUND: Bright natural daylight with vivid ocean blues and shimmering reflections. The cliffs and arch create striking depth, while the open sea and clear sky provide expansive negative space for elegant typography.
  OUTPUT SPECIFICATIONS: Ultra-detailed, photorealistic, bold, and editorial—ready for a premium fragrance advertisement with clean negative space for branding.
  `,
  `
  TASK: Generate a dramatic black and white portrait of a bearded man in a suit, holding the provided perfume bottle close to his face.  
  CRITICAL RULE: The perfume bottle must be used **EXACTLY AS IS** and must be the only element in color.  
  MODEL & STYLE: A confident man with a thick beard, sharp features, and intense gaze, dressed in a tailored suit with an open-collar shirt. The rest of the scene is monochrome.  
  LIGHTING & ATMOSPHERE: High-contrast, clear black and white studio lighting, with shadows adding depth and drama.  
  OUTPUT SPECIFICATIONS: Striking, masculine, bold, and modern.
  `,
  `
  TASK: Generate an ultra-realistic, high-fashion dark-fantasy fragrance advertisement featuring the provided perfume bottle.
  CRITICAL RULE: The attached perfume bottle **MUST NOT BE CHANGED** — keep its exact shape, label, cap, and proportions.
  SCENE: Extreme close-up composition where the **perfume bottle fills most of the frame**, resting on fractured black crystal with razor-sharp edges. Behind and partly above the bottle, a tall spectral witch-like figure emerges from swirling obsidian mist. Only her lower face and one hand are clearly revealed. Her long  finger presses to **luminous nuade-red lips** in a commanding “shh” gesture, appearing just over the bottle’s shoulder. Wisps of icy blue magic curl around the cap and base, as if drawn to the fragrance.
  LIGHTING & BACKGROUND: Ultra-dramatic low-key lighting with focused electric-blue and silver edge lights that sculpt every surface of the bottle and crystal. Cold mist and faint sparks wrap the bottle in supernatural energy while the figure remains partially hidden in velvety shadow.
  MOOD & STYLE: Dark, hypnotic, and intensely premium. The scene fuses high-fashion witchcraft with cinematic fantasy, making the **bottle the undisputed star** while still evoking forbidden allure and silent power.
  OUTPUT SPECIFICATIONS: Ultra-detailed, photorealistic, 8k resolution—perfect for a bold, unforgettable luxury fragrance campaign.
  `,
  `
  TASK: Generate a sophisticated, ultra-realistic still life featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED**.
  SCENE: The bottle is placed on a polished dark wood desk, next to other masculine accessories like a leather-bound journal, a fountain pen, or a pair of classic sunglasses.
  LIGHTING & BACKGROUND: Soft, directional light, like from a desk lamp, creating an intelligent and refined mood.
  OUTPUT SPECIFICATIONS: Elegant, classic, and detailed.
  `,
  `
  TASK: Generate a glamorous, ultra-realistic luxury fragrance advertisement featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the provided image **MUST NOT BE CHANGED** — keep its exact shape, label, and signature.
  SCENE: A striking, fashion-forward couple stands in a sleek mirrored elevator. The man wears a perfectly tailored black tuxedo with a crisp white shirt and untied bow tie, leaning slightly toward the woman with one hand resting on the wall behind her and the other lightly at her waist. The woman, in a fitted black tuxedo jacket with a daring deep neckline, tilts her face up toward him, one hand placed gently on his chest and the other brushing his lapel. Their pose radiates intimacy and confidence. The perfume bottle is displayed on a glossy reflective surface in the foreground, perfectly centered and sharply detailed.
  LIGHTING & BACKGROUND: Moody, cinematic lighting with soft golden highlights on their faces and dramatic shadows on the dark metallic elevator panels. Subtle reflections add depth and a sense of luxury.
  OUTPUT SPECIFICATIONS: Ultra-realistic, elegant, and sensuous. Every detail—from clothing texture to reflections on the elevator walls—must convey premium sophistication and timeless allure.
  `


];

// --- BELT PROMPTS ---
const BELT_COVER_PROMPT = `
TASK: Create a minimalist, high-end product shot for a men's belt.
IMPORTANT INSTRUCTION: You will be given an image of a belt. Your primary task is to use the **exact belt** from the image **WITHOUT ANY ALTERATION** to its design, buckle, color, or material.
SCENE: The belt is coiled elegantly on a minimalist surface like brushed metal, concrete, or rich leather.
LIGHTING: Clean, directional lighting that clearly defines the texture of the belt's material and the metallic finish of the buckle.
GOAL: The final image should be sharp, sophisticated, and focused entirely on the craftsmanship of the unchanged belt.
`;

const BELT_PHOTO_PROMPTS = [
  `
  TASK: Create a hyper-realistic, high-contrast monochrome close-up shot focusing on the provided belt.
  CRITICAL RULE: The belt **MUST NOT BE CHANGED**. Its texture, buckle, and stitching must be preserved with perfect accuracy. The entire image output must be black and white.
  SCENE & STYLE: A man is fastening the belt. The shot is tightly cropped on his torso, with his hands visible. He is wearing dark, textured trousers (like raw denim). The focus is razor-sharp on the belt's buckle and the leather's grain. The belt must cast a soft, realistic shadow on the trousers.
  PHOTOGRAPHY: Shot with a macro lens to capture extreme detail. The lighting should be dramatic and from the side, creating deep shadows and clear highlights that emphasize the texture of the materials. The final image should be a powerful, high-fashion black and white photograph.
  OUTPUT: Moody, textural, and highly detailed.
  `,
  `
  TASK: Generate a clean, ultra-realistic editorial photo of a man wearing the provided belt, focusing on how it complements his outfit.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**. It is a fixed element.
  MODEL & STYLE: A three-quarter shot of a man wearing impeccably tailored chinos and a crisp, tucked-in linen shirt. The pose is simple and classic, showcasing the belt as a centerpiece of a smart-casual outfit. The belt must appear naturally cinched and conform to his waist.
  BACKGROUND & ATMOSPHERE: A studio with clear, natural light coming from a large window just out of frame. The background is a simple, neutral-colored wall with subtle texture.
  PHOTOGRAPHY & REALISM: Shot with an 85mm portrait lens for a clean, compressed look with soft background blur. The lighting should be soft and diffused, creating clear highlights on the buckle and subtle shadows that define the belt's shape and how it sits on the trousers. Every stitch should be visible.
  OUTPUT: Sharp, sophisticated, and flawlessly realistic, like a page from a luxury brand's lookbook.
  `,
  `
  TASK: Generate a cinematic, ultra-realistic portrait of a man wearing the provided belt, shot during late afternoon.
  CRITICAL RULE: The belt from the user's image must be used **WITHOUT ANY MODIFICATION**. Its design, buckle, and material must be an exact match.
  MODEL & STYLE: A rugged man in a simple, well-fitted white henley shirt and dark jeans, leaning against a rustic wall. The belt is a key element, and it must look naturally integrated, conforming to his posture.
  PHOTOGRAPHY & REALISM: Shot on a 50mm f/1.4 lens. The clear light of the late afternoon must realistically reflect off the belt's buckle and the texture of the leather. The belt must cast soft, convincing shadows on his jeans. The overall feel should be authentic and clear, not like a composite image.
  OUTPUT: Cinematic, and authentic.
  `,
  `
  TASK: Generate a moody, ultra-realistic nighttime shot of a man wearing the provided belt in a city environment.
  CRITICAL RULE: The belt must be used **WITHOUT ANY MODIFICATION**. It is an unchangeable part of his style.
  MODEL & STYLE: A stylish man in a leather jacket and dark jeans, standing on a rain-slicked city street with neon lights blurred in the background. The belt is clearly visible and integrated into his look.
  LIGHTING & REALISM: The scene is lit by ambient city lights. These colored lights must cast clear reflections on the metal buckle and the sheen of the leather. The belt must look like a natural part of his outfit, with shadows and highlights that match the complex lighting environment perfectly.
  PHOTOGRAPHY: Cinematic, shallow depth of field, shot with a 35mm lens. A subtle film grain should be added for texture.
  OUTPUT: Gritty, cool, and photorealistic.
  `,
  `
  TASK: Generate an authentic, ultra-realistic photo of a man getting dressed, with a focus on him putting on the provided belt.
  CRITICAL RULE: The belt must be used **EXACTLY AS IS**. Do not alter its appearance in any way.
  MODEL & STYLE: A man in a stylish, well-lit bedroom. He is in the process of threading the belt through the loops of his trousers. The shot is a medium-close up, focusing on his hands, the belt, and his waist area.
  BACKGROUND & ATMOSPHERE: A sophisticated and slightly out-of-focus background with a chair and warm ambient light. The depth of field should be shallow, keeping the focus entirely on the action of putting on the belt.
  LIGHTING & REALISM: The lighting should be clear and natural, as if from a window. It must create clear highlights on the buckle as it moves and cast soft shadows from his hands onto the belt and trousers, ensuring the components look integrated and not flat.
  OUTPUT: Candid, intimate, and highly realistic, focusing on the tactile quality of the product.
  `
];

// --- APPAREL PROMPTS ---
const APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, high-fashion, full-body editorial photo of a male model wearing the provided clothing item.
CRITICAL RULE: The garment from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the clothing. This includes its design, color, pattern, texture, and fit. It is a fixed, unchangeable element placed onto the model.
DYNAMIC DIRECTION: Study the garment's style, color, and character carefully. Choose a model archetype, pose, background, and mood that feels authentically suited to THIS specific product — do not default to a generic or repeated look. The model's age, physique, hair, expression, and pose should all feel unique and creatively matched to the garment.
LIGHTING: Choose lighting that best compliments the garment's texture and color palette — dramatic, soft, outdoor, or studio as appropriate.
OUTPUT SPECIFICATIONS: High-resolution, sharp, editorial quality. The clothing is the absolute star of the image. Every generation should feel fresh and distinctly creative.
`;

const APPAREL_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic fashion photo of a man wearing the provided garment.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS** — no alterations to design, color, pattern, texture, or fit.
  DYNAMIC DIRECTION: Analyze the garment's aesthetic (streetwear, formal, casual, athletic, etc.) and create a scene that organically fits its personality. Choose a unique location — it could be urban, natural, industrial, coastal, or architectural. The model's build, skin tone, hair, expression, and body language should feel authentic and creatively matched to this specific garment. The pose should feel natural and uncontrived — not a standard catalog stance.
  ATMOSPHERE: The background, lighting, and color grading should feel cohesive with the garment's world — do not reuse the same scene across images. Each shot must feel like a distinct creative vision.
  OUTPUT SPECIFICATIONS: High-resolution, editorial fashion quality — compelling visual storytelling, not just product display.
  `,
  `
  TASK: Generate an ultra-realistic lifestyle photo of a man wearing the provided garment.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: Invent a lifestyle scenario that suits this specific garment — a rooftop, a garden, a workshop, a train station, a beach, a modern café, a gallery opening, or any setting that feels naturally connected to what someone wearing this piece would do. The model's appearance, expression, and pose should feel relaxed, real, and unique — never repeated or generic. Lighting and color palette should be creatively selected to complement the product.
  OUTPUT SPECIFICATIONS: High-end, aspirational lifestyle photography. The image should feel like a moment captured, not posed.
  `,
  `
  TASK: Generate a dramatic, ultra-realistic close-up or medium shot focusing on the details of the provided clothing item.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** — preserve its original fabric texture, pattern, construction details, and color with perfect accuracy.
  DYNAMIC DIRECTION: Choose a creative crop and angle that best reveals the garment's most interesting features — texture, pattern, seams, hardware, embroidery, or silhouette. The model's visible body part (hands, torso, shoulders) should be positioned in a way that is artistically interesting. Lighting should be directional and purposeful, sculpting the fabric realistically. The background should fade into a mood — dark, light, atmospheric — chosen to make this specific garment stand out.
  OUTPUT SPECIFICATIONS: High-fashion, sharp focus on the garment. Every generation of this shot should have a distinct composition and mood.
  `,
  `
  TASK: Generate an ultra-realistic, energetic photo of a model wearing the provided garment.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit.
  DYNAMIC DIRECTION: Create a scene full of energy and motion that feels right for this specific garment. The action — a jump, a walk, a turn, a lean, a run — should be chosen based on the garment's character. The location and atmosphere should be vivid and immersive — do not use a generic white studio. Think bold: a sunlit rooftop, a tunnel, an open field, an art space, a moving environment. The model's energy and expression should feel expressive and alive.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, full of momentum. A visually striking image that makes the garment feel desirable and the brand feel dynamic.
  `,
  `
  TASK: Generate an ultra-realistic photo of a male model wearing the provided garment — focusing on the view that best represents the product uploaded.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**.
  CONDITIONAL DIRECTION:
  - If the uploaded product image shows the **back of the garment**, generate a back-facing or three-quarter rear view of the model that clearly showcases the back panel, rear construction, and back design of the garment.
  - If the uploaded product image shows the **front of the garment** or any other side, generate a front-facing or three-quarter front view that clearly showcases the front design, collar, chest details, and overall silhouette of the garment as provided.
  - Do NOT generate a back view if no back product image was provided.
  MODEL & STYLE: Choose a pose, expression, and body language that creatively fits the garment's character — not a stiff catalog pose. The setting should be clean and complementary.
  OUTPUT SPECIFICATIONS: Clear, well-lit, and informative — as seen on a premium e-commerce product page, but with creative direction.
  `
];

export const MEN_PROMPTS = {
    watch: {
        coverPrompt: WATCH_COVER_PROMPT,
        photoPrompts: WATCH_PHOTO_PROMPTS
    },
    perfume: {
        coverPrompt: PERFUME_COVER_PROMPT,
        photoPrompts: PERFUME_PHOTO_PROMPTS
    },
    belt: {
        coverPrompt: BELT_COVER_PROMPT,
        photoPrompts: BELT_PHOTO_PROMPTS
    },
    apparel: {
        coverPrompt: APPAREL_COVER_PROMPT,
        photoPrompts: APPAREL_PHOTO_PROMPTS
    }
};
