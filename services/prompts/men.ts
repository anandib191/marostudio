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
  TASK: Generate an ultra-realistic, macro product shot of the provided watch resting on a piece of dark, polished obsidian.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the watch. It is a fixed, unchangeable element.
  SCENE & STYLE: The watch is delicately placed on a jagged yet reflective obsidian surface. A wisp of ethereal grey smoke curls in the dark background, adding mystery.
  LIGHTING & ATMOSPHERE: High-contrast, dramatic studio lighting with a sharp rim light highlighting the metallic edges and glass of the watch.
  OUTPUT SPECIFICATIONS: Premium, high-end editorial product photography, ultra-detailed.
  `,
  `
  TASK: Generate an ultra-realistic, luxurious product photoshoot of the provided watch resting on rich emerald green velvet.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**, without any modifications.
  SCENE & STYLE: The watch sits elegantly among the deep folds of premium emerald velvet. The texture of the fabric contrasts beautifully with the hard metallic and glass surfaces of the watch.
  LIGHTING & ATMOSPHERE: Soft, sweeping directional light that creates rich shadows in the velvet while illuminating the watch face perfectly.
  OUTPUT SPECIFICATIONS: Classic, wealthy, opulent, and flawlessly realistic.
  `,
  `
  TASK: Generate an ultra-realistic, creative aquatic product shot featuring the provided watch.
  CRITICAL RULE: You **MUST** use the watch from the user's image with **ZERO ALTERATIONS**.
  SCENE & STYLE: The watch is resting on a completely submerged smooth dark slate, with crystal clear water forming gentle, slow-motion ripples over its surface. The water magnifies the details and creates dynamic reflections.
  LIGHTING & ATMOSPHERE: Crisp, pure white lighting from above, creating caustic light patterns on the watch and surrounding stone.
  OUTPUT SPECIFICATIONS: Refreshing, dynamic, high-tech premium watch campaign.
  `,
  `
  TASK: Generate a modern, ultra-realistic architectural photoshoot featuring the provided watch.
  CRITICAL RULE: The watch from the user's image **MUST NOT BE CHANGED**.
  SCENE & STYLE: The watch is positioned on a series of minimalist, abstract geometric concrete and matte black blocks. The composition is highly structured and asymmetrical.
  LIGHTING & ATMOSPHERE: Harsh, cinematic sunlight creating strong, sharp diagonal shadows across the concrete, emphasizing a modern architectural aesthetic.
  OUTPUT SPECIFICATIONS: Contemporary, minimalist, avant-garde luxury.
  `,
  `
  TASK: Generate an ultra-realistic, high-fashion levitating product shot of the provided watch.
  CRITICAL RULE: It is absolutely essential that the watch from the provided image is used **WITHOUT ANY MODIFICATION**.
  SCENE & STYLE: The watch appears to be floating perfectly in mid-air against a seamless, deep matte black background. A scattering of fine gold dust or metallic particles is suspended around it, catching the light.
  LIGHTING & ATMOSPHERE: Dual side-lighting to flawlessly sculpt the edges of the watch, with a subtle golden glow illuminating the floating particles.
  OUTPUT SPECIFICATIONS: Magical, high-resolution, hypnotic and exclusive showcase.
  `,
  `
  TASK: Generate an ultra-realistic, sophisticated still-life photoshoot of the provided watch in a study setting.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**.
  SCENE & STYLE: The watch rests draped over the open pages of a vintage, leather-bound astronomical ledger. Beside it is a high-end fountain pen with golden nib details.
  LIGHTING & ATMOSPHERE: Warm, inviting ambient light, reminiscent of a crackling fireplace or a classic brass desk lamp, creating deep amber and golden tones.
  OUTPUT SPECIFICATIONS: Timeless, intellectual, heritage craftsmanship aesthetic.
  `,
  `
  TASK: Generate an ultra-realistic, dynamic light painting product shot featuring the provided watch.
  CRITICAL RULE: You **MUST** use the watch from the user's image with **ZERO ALTERATIONS**.
  SCENE & STYLE: The watch stands perfectly upright on a reflective black glass surface. The background features sweeping, long-exposure trails of vibrant neon blue and purple light beams crossing in a high-tech pattern.
  LIGHTING & ATMOSPHERE: The neon streaks reflect subtly on the watch face and metallic casing, giving it a futuristic, precision-engineered aura.
  OUTPUT SPECIFICATIONS: Cutting-edge, vibrant, visually arresting modern luxury.
  `,
  `
  TASK: Generate an ultra-realistic, elemental photoshoot of the provided watch resting on a block of ice.
  CRITICAL RULE: The watch from the user's image **MUST NOT BE CHANGED**. Its original design and details must be perfectly preserved.
  SCENE & STYLE: The watch is embedded slightly into a crystalline block of raw ice. Frozen bubbles and internal fractures are visible within the ice. Extreme macro focus.
  LIGHTING & ATMOSPHERE: Cool, pristine cyan and silver lighting coming from below the ice, making the scene feel intensely cold, durable, and pure.
  OUTPUT SPECIFICATIONS: Rugged yet pristine, high-end expedition luxury.
  `,
  `
  TASK: Generate an ultra-realistic, dark-mode styling photoshoot featuring the provided watch.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw it.
  SCENE & STYLE: The watch rests on a piece of dark, porous volcanic rock. The entire scene is monochromatic, leaning heavily into deep charcoal, black, and silver tones, focusing on supreme texture.
  LIGHTING & ATMOSPHERE: Moody, low-key lighting. Only the watch catches the subtle, focused light, emerging from the dark void like a masterpiece.
  OUTPUT SPECIFICATIONS: Stealthy, powerful, ultra-masculine editorial style.
  `,
  `
  TASK: Generate an ultra-realistic, high-speed photography product shot of the watch.
  CRITICAL RULE: You **MUST** use the watch from the user's image with **ZERO ALTERATIONS**. Do not change its design or details.
  SCENE & STYLE: The watch is standing on a dark pedestal, while a burst of fine, dry metallic silver powder explodes dynamically behind it. The powder is frozen in mid-air in razor-sharp detail.
  LIGHTING & ATMOSPHERE: Extremely bright, instantaneous strobe lighting to freeze the motion, creating an energetic and explosive visual impact.
  OUTPUT SPECIFICATIONS: Dynamic, explosive energy, ultra-detailed action product shot.
  `,
  `
  TASK: Generate an ultra-realistic, horological-themed photoshoot of the provided watch.
  CRITICAL RULE: The watch from the user's image must be used **WITHOUT ANY MODIFICATION**. It is a fixed, unchangeable element.
  SCENE & STYLE: The watch is placed on a pristine white jeweler's mat, surrounded artistically by macro-sized, disassembled golden cogs, springs, and ruby bearings.
  LIGHTING & ATMOSPHERE: Bright, immaculate, clean white lighting with zero harsh shadows, emphasizing pure mechanical perfection and engineering.
  OUTPUT SPECIFICATIONS: Technical, pristine, master-watchmaker aesthetic.
  `,
  `
  TASK: Generate an ultra-realistic, automotive-inspired macro product shot featuring the provided watch.
  CRITICAL RULE: The watch must be used **EXACTLY AS IS**. Do not alter its appearance in any way.
  SCENE & STYLE: The watch rests on a piece of ultra-premium quilted black leather with bright red or striking blue contrast stitching (like a supercar interior). There are no hands or steering wheels, just the pure materials contrasting.
  LIGHTING & ATMOSPHERE: Sleek, glossy lighting that highlights the grain of the premium leather and the polished finish of the watch.
  OUTPUT SPECIFICATIONS: High-octane luxury, refined material contrast, pure product focus.
  `,
  `
  TASK: Generate an ultra-realistic, fine art gallery photoshoot featuring the provided watch.
  CRITICAL RULE: The watch from the user's image **MUST NOT BE CHANGED**.
  SCENE & STYLE: The watch is displayed like a museum artifact on a solid, unpolished marble plinth. The background is a stark, textured gallery wall.
  LIGHTING & ATMOSPHERE: A single, perfectly circular beam of warm gallery spotlight illuminates only the watch and the top of the plinth, surrounded by deep, elegant vignette shadowing.
  OUTPUT SPECIFICATIONS: Museum-quality display, reverent, highly prestigious.
  `,
  `
  TASK: Generate an ultra-realistic, macro texture contrast photoshoot of the provided watch.
  CRITICAL RULE: You **MUST** use the watch from the user's image with **ZERO ALTERATIONS**. It is a fixed, unchangeable element.
  SCENE & STYLE: The watch is resting half on a piece of deeply distressed, aged brown wood and half on a sheet of flawless brushed titanium.
  LIGHTING & ATMOSPHERE: Even, diffused lighting that allows the eye to explore the contrast between the ancient organic wood, the high-tech metal, and the perfection of the watch itself.
  OUTPUT SPECIFICATIONS: Textural masterpiece, grounded yet highly engineered.
  `,
  `
  TASK: Generate an ultra-realistic, liquid gold concept photoshoot of the provided watch.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**. Do not modify it.
  SCENE & STYLE: The watch is placed on a dark surface while thick, luxurious liquid gold appears to be dripping or pooling around its base, reflecting the watch beautifully.
  LIGHTING & ATMOSPHERE: Warm, rich ambient light that makes the golden liquid shimmer intensely in the dark space.
  OUTPUT SPECIFICATIONS: Peak opulence, surreal luxury, breathtaking editorial product shot.
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
  `,

  `
  TASK: Generate an ultra-realistic, luxury penthouse balcony photo featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter it in any way.
  SCENE: The bottle sits on the glass railing of a penthouse balcony, with a breathtaking nighttime city skyline glittering behind it. A man's hand in a tailored suit sleeve reaches to pick it up.
  LIGHTING & ATMOSPHERE: Cool, ambient city glow mixed with warm interior light from behind. The bottle is sharply lit, creating beautiful glass reflections.
  OUTPUT SPECIFICATIONS: High-resolution, aspirational, urban luxury.
  `,

  `
  TASK: Generate an ultra-realistic, cigar lounge lifestyle photo featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED** — shape, label, and liquid color must stay exactly as provided.
  SCENE: The bottle is placed on a rich leather armrest beside a crystal tumbler of whiskey and an unlit cigar in an ashtray. A man's hand in a crisp shirt cuff is visible nearby. The setting is an exclusive private members' club.
  LIGHTING & ATMOSPHERE: Warm, amber-toned lighting with deep shadows. The mood is exclusive, distinguished, and unhurried.
  OUTPUT SPECIFICATIONS: High-resolution, rich, masculine luxury lifestyle.
  `,

  `
  TASK: Generate an ultra-realistic, rugged outdoor photo of the provided perfume bottle in a forest setting.
  CRITICAL RULE: You **MUST** use the perfume bottle from the user's image with **ZERO ALTERATIONS**. It is a fixed element.
  SCENE: The bottle sits on a moss-covered fallen tree trunk in a dense, misty forest. Ferns and wildflowers surround it. Morning dew droplets cling to the bottle's surface, connecting it to the raw natural environment.
  LIGHTING & ATMOSPHERE: Soft, diffused early morning forest light filtering through the canopy. The mood is fresh, earthy, and primal.
  OUTPUT SPECIFICATIONS: High-resolution, nature-inspired, rugged yet refined.
  `,

  `
  TASK: Generate an ultra-realistic, rain-soaked street editorial photo featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. Do not alter its shape, label, or cap.
  SCENE: A man in a dark overcoat walks on a rain-soaked city street at night. He holds the bottle close to his neck as if applying the fragrance. Neon lights from surrounding shops reflect in the wet pavement.
  LIGHTING & ATMOSPHERE: Dramatic, cinematic night lighting with vivid neon reflections and rain drops. The mood is mysterious, urban, and intensely atmospheric.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, moody street fashion.
  `,

  `
  TASK: Generate an ultra-realistic, athletic lifestyle photo featuring the provided perfume bottle after a workout.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED** in any way.
  SCENE: A fit man in a fitted grey T-shirt, towel around his neck, holds the perfume bottle in one hand in a modern locker room. His skin has a light sheen of sweat. The bottle is positioned as a post-workout ritual.
  LIGHTING & ATMOSPHERE: Clean, bright fluorescent lighting mixed with natural light from a window. The mood is fresh, energetic, and youthful.
  OUTPUT SPECIFICATIONS: High-resolution, sporty, fresh, and energetic.
  `,

  `
  TASK: Generate an ultra-realistic, vintage car product photo featuring the provided perfume bottle.
  CRITICAL RULE: You **MUST** use the perfume bottle from the user's image with **ZERO ALTERATIONS**. It is a fixed, unchangeable element.
  SCENE: The bottle sits elegantly on the polished leather dashboard or open glove compartment of a classic vintage car (such as a 1960s Aston Martin or Jaguar). The car's interior textures — stitched leather, chrome dials, wood trim — frame the bottle beautifully.
  LIGHTING & ATMOSPHERE: Warm, golden afternoon light streaming through the windshield. The mood is timeless, masculine, and refined.
  OUTPUT SPECIFICATIONS: High-resolution, vintage luxury, product-focused.
  `,

  `
  TASK: Generate an ultra-realistic, rooftop silhouette photo of a man with the provided perfume bottle at sunset.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. Do not modify it.
  SCENE: A man stands on the edge of a city rooftop at sunset, his silhouette dark against the vivid sky. He holds the perfume bottle up at arm's length, and the setting sun backlights it, making the liquid inside glow. The composition is dramatic and iconic.
  LIGHTING & ATMOSPHERE: Intense golden-hour backlighting with a vivid orange and purple sky. High contrast between the dark silhouette and the luminous sky and bottle.
  OUTPUT SPECIFICATIONS: High-resolution, iconic, cinematic, poster-worthy.
  `,

  `
  TASK: Generate an ultra-realistic, ski lodge luxury photo featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED**. Its shape, label, and details must remain exactly as provided.
  SCENE: The bottle sits on a rustic wooden table beside a steaming cup of hot chocolate and a pair of ski goggles. Through a large window behind, snow-covered mountains and pine trees are visible. A man's hand in a cable-knit sweater sleeve reaches for the bottle.
  LIGHTING & ATMOSPHERE: Warm, cozy interior firelight mixed with cool blue winter light from outside. The mood is adventurous yet comfortable.
  OUTPUT SPECIFICATIONS: High-resolution, cozy, winter-luxury lifestyle.
  `,

  `
  TASK: Generate an ultra-realistic, music studio lifestyle photo featuring the provided perfume bottle.
  CRITICAL RULE: You **MUST** use the perfume bottle from the user's image with **ZERO ALTERATIONS**.
  SCENE: The bottle sits on a mixing console in a professional recording studio. A pair of premium headphones, a notepad with lyrics, and a microphone are visible nearby. A man's hands rest on the console controls.
  LIGHTING & ATMOSPHERE: Moody, low ambient lighting with colored LED strips (purple, blue) creating a creative, artistic atmosphere.
  OUTPUT SPECIFICATIONS: High-resolution, creative, artistic, and coolly masculine.
  `,

  `
  TASK: Generate an ultra-realistic, ancient ruins product photo featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. Do not alter its design.
  SCENE: The bottle is placed on a weathered stone column fragment amid ancient Greek or Roman ruins. Wildflowers grow between the cracked stones. Behind the bottle, grand crumbling arches and columns stretch into the distance under a clear Mediterranean sky.
  LIGHTING & ATMOSPHERE: Clear, bright sunlight casting strong shadows from the ruins. The mood is timeless, historic, and mythic.
  OUTPUT SPECIFICATIONS: High-resolution, epic, heritage-inspired product photography.
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
  `,

  `
  TASK: Generate an ultra-realistic, equestrian lifestyle photo of a man wearing the provided belt.
  CRITICAL RULE: The belt must be used **EXACTLY AS IS**. Do not alter its appearance in any way.
  MODEL & STYLE: A well-built man in jodhpurs, riding boots, and a fitted polo shirt, standing next to a horse and stroking its mane. The belt is clearly visible, cinching his waist. The mood is refined and athletically elegant.
  BACKGROUND & ATMOSPHERE: A sunlit countryside stable with wooden fences and green fields visible behind. Warm, golden afternoon light.
  OUTPUT: Sophisticated, equestrian, and aspirationally masculine.
  `,

  `
  TASK: Generate an ultra-realistic, formal wedding-ready photo of a man wearing the provided belt.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**. It is a fixed element.
  MODEL & STYLE: A groom in a classic charcoal three-piece suit, adjusting his waistcoat. The belt peeks from under the waistcoat at the sides, clearly visible. His grooming is impeccable — clean shave, neat hair. He holds a single boutonniere or adjusts his tie.
  BACKGROUND & ATMOSPHERE: An elegant, sunlit venue — a manor house garden or a classic stone church porch. Soft, romantic lighting.
  OUTPUT: Polished, romantic, and premium wedding-ready.
  `,

  `
  TASK: Generate an ultra-realistic, craftsman workshop photo of the provided belt coiled alongside artisan tools.
  CRITICAL RULE: The belt **MUST NOT BE CHANGED**. Its texture, buckle, and stitching must be perfectly preserved.
  SCENE & STYLE: The belt is beautifully coiled on a rough wooden workbench alongside leather-working tools — a stitching awl, waxed thread, a burnishing tool, and leather scraps. The scene evokes handcrafted artisanship.
  LIGHTING & ATMOSPHERE: Warm, directional light from a workshop lamp. The textures of leather and wood fill the frame. The mood is authentic, artisanal, and respectful of craft.
  OUTPUT: Heritage craftsmanship, detail-rich, and product-focused.
  `,

  `
  TASK: Generate an ultra-realistic, flat-lay styling photo centered on the provided belt.
  CRITICAL RULE: The belt from the user's image must be used **WITHOUT ANY MODIFICATION**. It is a fixed, unchangeable element.
  SCENE & STYLE: A meticulously arranged flat-lay on a dark wooden surface. The belt is the hero piece, surrounded by complementary accessories — a leather wallet, a pair of sunglasses, a pocket knife, and a wristwatch. The arrangement is symmetrical and intentional.
  LIGHTING & ATMOSPHERE: Bright, even overhead lighting that clearly shows the belt's texture, color, and buckle detail.
  OUTPUT: High-resolution, editorial flat-lay, product-catalogue quality.
  `,

  `
  TASK: Generate an ultra-realistic, casual beach boardwalk photo of a man wearing the provided belt.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A relaxed man in rolled-up chinos, a linen shirt, and leather sandals, walking along a sun-drenched wooden boardwalk. The belt is clearly visible, adding a stylish detail to his casual beach-town look.
  BACKGROUND & ATMOSPHERE: A bright, coastal boardwalk with the ocean visible in the background. Warm, natural daylight with a slight sea breeze effect in his clothes.
  OUTPUT: Bright, relaxed, coastal-chic lifestyle.
  `,

  `
  TASK: Generate an ultra-realistic, seated office portrait focusing on the provided belt.
  CRITICAL RULE: The belt must be used **EXACTLY AS IS**. Do not alter its design, buckle, or material.
  MODEL & STYLE: A confident man seated in a leather office chair behind a modern desk. He leans forward with his hands clasped, and the belt is clearly visible where his jacket hangs open. He wears a crisp white shirt and tailored grey trousers.
  BACKGROUND & ATMOSPHERE: A modern, executive office with clean lines, bookshelves, and natural light from large windows. The background is softly blurred.
  OUTPUT: Professional, authoritative, and polished.
  `,

  `
  TASK: Generate an ultra-realistic, hiking trail adventure photo of a man wearing the provided belt.
  CRITICAL RULE: The belt **MUST NOT BE CHANGED** in any way. Preserve its original design and material.
  MODEL & STYLE: A rugged, outdoorsy man in tactical cargo pants and a fitted performance T-shirt, pausing on a mountain trail to take in a panoramic view. The belt is clearly visible and integrated naturally into his adventure gear.
  BACKGROUND & ATMOSPHERE: A breathtaking mountain landscape with valleys, forests, and a clear sky. Bright, high-altitude daylight.
  OUTPUT: Adventurous, rugged, and dynamic.
  `,

  `
  TASK: Generate an ultra-realistic, backstage concert photo of a rock musician wearing the provided belt.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**. It is a fixed element.
  MODEL & STYLE: A man with an edgy rock musician look — fitted black jeans, a band T-shirt, and tattoos visible on his forearms. The belt is a statement piece, visible at his hips. He sits on an amp backstage, tuning a guitar.
  BACKGROUND & ATMOSPHERE: A dimly lit backstage area with equipment cases, cables, and warm stage lights bleeding in from behind a curtain. The mood is gritty, creative, and cool.
  OUTPUT: Rock & roll, authentic, and edgy.
  `,

  `
  TASK: Generate an ultra-realistic, grooming mirror shot focusing on the provided belt.
  CRITICAL RULE: The belt from the user's image must be used **EXACTLY AS IS**. Do not modify it.
  MODEL & STYLE: A man is captured in a bathroom mirror reflection, finishing his morning routine. He wears tailored dark trousers with the belt already fastened, and has just put on a fresh white shirt that he is buttoning up. The belt is sharply reflected in the clean mirror.
  LIGHTING & ATMOSPHERE: Bright, clean bathroom lighting with a modern, minimalist interior. The reflection adds visual depth and interest.
  OUTPUT: Clean, intimate, aspirational morning-routine aesthetic.
  `,

  `
  TASK: Generate an ultra-realistic, autumn walk editorial photo of a man wearing the provided belt.
  CRITICAL RULE: The belt must be used **WITHOUT ANY MODIFICATION**. It is an unchangeable element.
  MODEL & STYLE: A well-dressed man in a tailored peacoat (open, showing the belt), dark jeans, and Chelsea boots, walking along a tree-lined path covered in golden fallen leaves. He carries a leather messenger bag over one shoulder.
  BACKGROUND & ATMOSPHERE: A beautiful autumn setting with warm orange, red, and gold foliage. Soft, warm afternoon sunlight filters through the canopy.
  OUTPUT: High-resolution, warm, seasonal, and effortlessly stylish.
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
  `,

  `
  TASK: Generate an ultra-realistic, heritage-inspired cultural portrait of a man wearing the provided garment.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS** — no alterations to design, color, pattern, texture, or fit.
  DYNAMIC DIRECTION: If the garment has ethnic or traditional roots, embrace that lineage — place the model in a setting that honors the garment's cultural origin (a Rajasthani fort, a Japanese temple garden, a Moroccan medina). If the garment is modern, create an intriguing contrast with a rich cultural backdrop. The model's accessories and styling should complement the heritage feel.
  ATMOSPHERE: Warm, rich colors and textures. Cinematic lighting with golden or amber tones.
  OUTPUT SPECIFICATIONS: High-resolution, culturally rich, and deeply atmospheric.
  `,

  `
  TASK: Generate an ultra-realistic, golden hour silhouette and detail photo of a man wearing the provided garment.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: Capture the model at golden hour in a way that highlights the garment's shape and texture — either as a dramatic backlit silhouette or with warm sunlight streaming across the fabric. The pose should be strong and considered, emphasizing the garment's structure and fit.
  ATMOSPHERE: Warm, golden light with long shadows. An open, expansive location — a field, a rooftop, or a coastline.
  OUTPUT SPECIFICATIONS: High-resolution, warm, dramatic, and poetic.
  `,

  `
  TASK: Generate an ultra-realistic, rain-soaked city editorial photo of a man wearing the provided garment.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** — preserve its original design, color, and texture perfectly.
  DYNAMIC DIRECTION: The model walks confidently through a rain-soaked urban street. Wet pavement creates beautiful reflections. The garment should look intentional and stylish despite the weather — showing the wearer's confidence and character. The mood is moody, cinematic, and atmospheric.
  ATMOSPHERE: Cool blue-grey tones accented by warm shop-window light. Film-like quality.
  OUTPUT SPECIFICATIONS: High-resolution, editorial, dramatic, and movie-like.
  `,

  `
  TASK: Generate an ultra-realistic, seated portrait of a man wearing the provided garment in a character-filled setting.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit.
  DYNAMIC DIRECTION: The model is seated in an interesting setting — a vintage barber's chair, a modern café booth, a workshop stool, or a classic car's open door. The seated pose naturally showcases how the garment falls and fits at rest. Expression should be contemplative, warm, or quietly confident.
  ATMOSPHERE: Thoughtful composition with the environment adding personality and narrative.
  OUTPUT SPECIFICATIONS: High-resolution, artistic, intimate portrait photography.
  `,

  `
  TASK: Generate an ultra-realistic, layered styling editorial of a man wearing the provided garment.
  CRITICAL RULE: The clothing item from the user's image must be used **EXACTLY AS IS**. It is a fixed, unchangeable element.
  DYNAMIC DIRECTION: Style the garment as part of a layered outfit — add a complementary jacket, scarf, blazer, or vest that enhances the look without hiding the garment. Show how the piece integrates into a complete, fashion-forward outfit that feels personal and intentional.
  ATMOSPHERE: A stylish urban environment — a concept store, a design district, or an art gallery. Clean, modern lighting.
  OUTPUT SPECIFICATIONS: High-resolution, editorial, showing real-world styling versatility.
  `,

  `
  TASK: Generate an ultra-realistic, athletic/sports lifestyle photo of a man wearing the provided garment.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: If the garment suits an active context, place the model in a relevant sports or fitness scenario — stretching at a track, boxing in a gym, warming up on a basketball court. If the garment is not athletic, create a contrast — an athlete in a casual or formal garment captured in a sports setting, showing versatility.
  ATMOSPHERE: Energetic, bold lighting. The setting should feel real and immersive.
  OUTPUT SPECIFICATIONS: High-resolution, powerful, and action-driven.
  `,

  `
  TASK: Generate an ultra-realistic, minimalist studio editorial photo of a man wearing the provided garment.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** in any way.
  DYNAMIC DIRECTION: A clean, stark studio shot that puts the garment on a pedestal. The model poses against a seamless solid background (white, grey, or a bold color chosen to complement the garment). The pose is strong and editorial — not a catalog pose. Grooming is clean and minimal.
  ATMOSPHERE: Pure, undistracted focus on the garment. Precise, professional lighting.
  OUTPUT SPECIFICATIONS: High-resolution, minimalist, powerful, gallery-quality fashion photography.
  `,

  `
  TASK: Generate an ultra-realistic, industrial warehouse editorial photo of a man wearing the provided garment.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit.
  DYNAMIC DIRECTION: The model stands or leans in a raw, industrial space — exposed brick, steel beams, concrete floors, large factory windows. The contrast between the raw venue and the styled garment creates visual tension. The pose should feel authentic and confident.
  ATMOSPHERE: Cool, desaturated tones with dramatic directional light from large windows creating hard shadows. Gritty, editorial, and cinematic.
  OUTPUT SPECIFICATIONS: High-resolution, industrial-chic, and visually compelling.
  `,

  `
  TASK: Generate an ultra-realistic, rooftop cityscape photo of a man wearing the provided garment at sunset.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS** — no alterations whatsoever.
  DYNAMIC DIRECTION: The model stands on a city rooftop with a panoramic skyline behind him. The setting sun casts dramatic warm light on the garment, highlighting its color and texture. His pose is confident and relaxed — looking out over the city or towards the camera.
  ATMOSPHERE: Golden-hour warmth mixed with cool urban tones. The skyline adds scale and aspiration.
  OUTPUT SPECIFICATIONS: High-resolution, aspirational, cinematic, and powerfully composed.
  `,

  `
  TASK: Generate an ultra-realistic, coastal/beach lifestyle photo of a man wearing the provided garment.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: The model is in a coastal setting — walking along a rocky shoreline, standing on a pier, or leaning against a beachside rail. The garment should feel natural in this environment. Hair is slightly windswept, the mood is relaxed and confident.
  ATMOSPHERE: Bright, natural daylight with vivid blues from sky and sea. Warm skin tones. The mood is relaxed luxury.
  OUTPUT SPECIFICATIONS: High-resolution, fresh, coastal-lifestyle editorial.
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
