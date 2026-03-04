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
  TASK: Generate an ultra-realistic, close-up editorial shot of a man wearing the provided watch with a bespoke tailored suit.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the watch. It is a fixed, unchangeable element.
  MODEL & STYLE: A sophisticated man adjusting his French cuff. The watch sits perfectly on his wrist, peeking out elegantly. The fabric of the suit is rich and textured (e.g., subtle houndstooth or premium wool).
  LIGHTING & ATMOSPHERE: High-end studio lighting, crisp and directional, replicating the polished look of a luxury menswear campaign.
  OUTPUT SPECIFICATIONS: Premium, high-end editorial fashion photography, ultra-detailed focus on the worn watch.
  `,
  `
  TASK: Generate an ultra-realistic, luxury lifestyle photoshoot of a man's wrist wearing the provided watch while gripping a leather steering wheel.
  CRITICAL RULE: The watch from the user's image must be used **EXACTLY AS IS**, without any modifications.
  MODEL & STYLE: The man is wearing a crisp, casually rolled-up linen shirt. The watch conforms perfectly to his wrist. His hand rests confidently on the hand-stitched leather steering wheel of a classic vintage sports car.
  LIGHTING & ATMOSPHERE: Warm, golden-hour sunlight streaming through the car window, catching the metallic details and glass of the watch face.
  OUTPUT SPECIFICATIONS: Classic, wealthy, aspirational, and flawlessly realistic lifestyle shot.
  `,
  `
  TASK: Generate an ultra-realistic, creative editorial shot of a man wearing the provided watch with casual luxury attire.
  CRITICAL RULE: You **MUST** use the watch from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A stylish man wearing a premium fine-knit cashmere sweater, resting his arm thoughtfully on a polished wooden table. The watch is the sharpest element in the frame, looking completely natural on his wrist.
  LIGHTING & ATMOSPHERE: Moody, atmospheric cafe or lounge lighting. Soft, diffused window light illuminating the watch details against the soft texture of the cashmere.
  OUTPUT SPECIFICATIONS: Sophisticated, modern quiet luxury, ultra-realistic product focus.
  `,
  `
  TASK: Generate a modern, ultra-realistic high-fashion portrait where the provided watch is worn prominently.
  CRITICAL RULE: The watch from the user's image **MUST NOT BE CHANGED**.
  MODEL & STYLE: A confident man in a sharp tuxedo, his hand resting near his chest or lapel, showcasing the watch perfectly on his wrist. The fit and placement of the watch must look flawless and intentional.
  LIGHTING & ATMOSPHERE: Dramatic, cinematic studio lighting with deep shadows and crisp highlights, emphasizing the watch as the ultimate statement piece of his formal wear.
  OUTPUT SPECIFICATIONS: Contemporary, elegant, avant-garde formal luxury.
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
TASK: Orchestrate a masterful, high-end editorial centerpiece photoshoot for a luxury men's belt.
IMPORTANT INSTRUCTION: You will be provided with an image of a belt. Your absolute priority is to render the **exact belt** from the image **WITHOUT A SINGLE ALTERATION**. The design, buckle intricacies, color grading, and material texture must remain pristine and completely untouched.
SCENE: The belt is sculpted into a striking, elegant helix, resting upon a gallery-worthy plinth—perhaps dark, porous obsidian or a slab of raw, highly textured travertine. The visual weight should feel grounded yet incredibly sophisticated.
LIGHTING: Employ precise, cinematic chiaroscuro lighting. A single, focused key light should carve out the architectural lines of the buckle and illuminate the microscopic grain of the leather, allowing deep, rich shadows to create immense depth and volume.
GOAL: Produce a breathtaking, museum-quality product portrait that exudes heritage craftsmanship, power, and unapologetic luxury. The original belt must be the absolute hero of this visual symphony.
`;

const BELT_PHOTO_PROMPTS = [
  `
  TASK: Execute a breathtaking, hyper-realistic, high-contrast monochrome editorial portrait featuring the provided belt.
  CRITICAL RULE: The belt **MUST NOT BE CHANGED**. Its texture, buckle architecture, and stitch fidelity must be preserved with absolute perfection. 
  SCENE & STYLE: A powerfully built model, sculpted by shadow, stands in profile fastening the belt over raw, heavyweight selvedge denim. His torso is artfully cropped to emphasize the waistline. The pose is deliberate, commanding, and sculptural, reminiscent of fine art photography.
  PHOTOGRAPHY: Shot on medium format film for unparalleled dynamic range. Razor-sharp macro focus on the belt's buckle, with the leather's grain heavily pronounced. Intense, single-source side lighting creates a dramatic fall-off, emphasizing the tactile reality of the materials.
  OUTPUT: Moody, intensely textural, avant-garde masculinity, worthy of a flagship luxury boutique's wall.
  `,
  `
  TASK: Capture a breathtaking, ultra-realistic cinematic lifestyle editorial of a man wearing the provided belt, exuding 'Sprezzatura'.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**. It is the non-negotiable anchor of the image.
  MODEL & STYLE: A charismatic man with effortless Mediterranean elegance, wearing a perfectly imperfect, casually unbuttoned linen suit in deep navy or crisp beige. The belt is the focal point, beautifully cinching the trousers with natural ease as he leans slightly against a sun-drenched stone balustrade.
  BACKGROUND & ATMOSPHERE: A hazy, sun-drenched Italian coastal villa overlooking the azure sea. The depth of field is shallow, rendering the background into a beautiful bokeh of light and color.
  PHOTOGRAPHY & REALISM: Shot on an 85mm f/1.2 lens. The lighting is golden-hour perfection, casting a warm, romantic glow that highlights the polished metal of the buckle against the matte linen.
  OUTPUT: Flawless, romantic, aspirational old-money luxury, captured with absolute photographic authenticity.
  `,
  `
  TASK: Direct an edgy, ultra-realistic, low-key urban fashion editorial featuring the provided belt.
  CRITICAL RULE: The belt must be used **WITHOUT ANY MODIFICATION**. It is the authentic centerpiece of the narrative.
  MODEL & STYLE: A ruggedly handsome man with a subtle artistic edge, wearing an open, heavy-gauge leather moto jacket over structured midnight-black denim. He sits astride a vintage custom motorcycle, adjusting his stance, allowing the belt to catch the ambient light perfectly at his waist.
  LIGHTING & REALISM: Illuminated by the raw, chaotic neon glow of a wet city night. The neon lights (crimson and cyan) must reflect authentically off the belt's buckle and the slick texture of the leather strap. 
  PHOTOGRAPHY: Shot with a 35mm lens for environmental context. Cinematic film grain is essential. The camera angle is slightly low, projecting power and cool indifference.
  OUTPUT: Gritty, unapologetically cool, photorealistic street-luxury, dripping with attitude.
  `,
  `
  TASK: Craft a striking, ultra-realistic avant-garde architectural portrait highlighting the provided belt.
  CRITICAL RULE: The belt **MUST NOT BE CHANGED**. Its geometry and material must remain perfectly intact.
  MODEL & STYLE: A strikingly angular model dressed in stark, unstructured monochrome fashion—perhaps a draped black overcoat layered over wide-leg trousers. The belt acts as the architectural anchor, violently cinching the silhouette into a masterpiece of modern proportion.
  BACKGROUND & ATMOSPHERE: An imposing background of brutalist concrete architecture. The lines are harsh, clean, and imposing.
  LIGHTING & REALISM: Cold, diffused, overcast daylight that eliminates harsh shadows but highlights the micro-textures of the concrete and the deep, rich finish of the belt. The metallic buckle provides the only sharp highlight in the frame.
  OUTPUT: High-concept, conceptual fashion, architecturally disciplined, and radically modern.
  `,
  `
  TASK: Generate an ultra-realistic, pinnacle-of-power editorial portrait centered on the provided belt.
  CRITICAL RULE: The belt must be used **EXACTLY AS IS**. Do not alter its design, buckle, or material; it is the emblem of control in this image.
  MODEL & STYLE: A fiercely confident executive in an immaculate, bespoke charcoal pinstripe suit. He is captured mid-motion, unbuttoning his suit jacket as he sits down, perfectly revealing the belt beneath a crisp, tailored white shirt. The fit is flawless.
  BACKGROUND & ATMOSPHERE: A cavernous, hyper-modern corner office with floor-to-ceiling glass overlooking a sprawling metropolis. 
  LIGHTING & REALISM: Dramatic 'Rembrandt' studio lighting seamlessly blended with the cool, blue-tinted natural light of the cityscape. The buckle gleams with a sharp, authoritative highlight, commanding immediate attention.
  OUTPUT: Cinematic, immensely powerful, flawless corporate luxury, exuding absolute authority.
  `,
  `
  TASK: Orchestrate a hyper-realistic, soulful lifestyle portrait of a man wearing the provided belt in a realm of pure craftsmanship.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**. Retain every nuance of its original essence.
  MODEL & STYLE: A weathered, artistic man with rolled-up flannel sleeves and rugged work jeans, standing amidst a beautifully chaotic sculptor’s or leatherworker's atelier. He is wiping his hands on a cloth, the belt sitting proudly and naturally at his waist, perfectly integrated into his authentic workwear aesthetic.
  LIGHTING & ATMOSPHERE: Dust motes dance in thick shafts of warm, amber light slicing through large, dirty workshop windows. The lighting is poetic and textured, illuminating the belt as a piece of functional art.
  OUTPUT: Earthy, authentic, heritage-rich, celebrating the romanticism of raw creation.
  `,
  `
  TASK: Capture a breathtaking, ultra-realistic red-carpet snapshot of a star wearing the provided belt.
  CRITICAL RULE: The belt from the user's image must be used **EXACTLY AS IS**. It is a fixed, untouchable element of his wardrobe.
  MODEL & STYLE: A classically handsome leading man in a razor-sharp, midnight blue velvet tuxedo. He is captured adjusting his cummerbund or jacket, briefly but clearly exposing the elegant lines of the provided belt acting as the luxurious anchor to his formalwear. 
  BACKGROUND & ATMOSPHERE: The blurred, chaotic energy of a film premiere or gala, with soft, out-of-focus flashbulbs popping in the background, creating a dazzling array of bokeh.
  LIGHTING & REALISM: The harsh, immediate flash of paparazzi cameras perfectly balanced with rich ambient event lighting, freezing the moment and making the belt's buckle pop with intense clarity.
  OUTPUT: High-glamour, timeless celebrity elegance, exceptionally dynamic and alive.
  `,
  `
  TASK: Create a mind-bending, ultra-realistic surrealist fashion editorial featuring the provided belt.
  CRITICAL RULE: The belt must be used **WITHOUT ANY MODIFICATION**. It must remain the definitive anchor of reality in this dreamscape.
  MODEL & STYLE: A slender, enigmatic model draped in flowing, earth-toned silk garments that billow impossibly in the wind. The belt violently cinches the ethereal fabric, providing a gorgeous contrast of rigid, structured leather against liquid-like textiles.
  BACKGROUND & ATMOSPHERE: An endless, desolate expanse of pristine white sand dunes beneath a bruised, stormy purple sky. 
  LIGHTING & REALISM: The lighting is unearthly, with a golden hour glow hitting the model from an impossibly low angle, stretching shadows into infinity and making the belt's hardware gleam like a desert artifact.
  OUTPUT: Ethereal, avant-garde, deeply poetic fashion photography that transcends the ordinary.
  `,
  `
  TASK: Direct an ultra-realistic, highly intimate, voyeuristic portrait of a man slipping on the provided belt.
  CRITICAL RULE: The belt **MUST NOT BE CHANGED** in any way. Preserve its original design and material perfectly.
  MODEL & STYLE: A man captured in the private sanctuary of a breathtaking, architecturally stunning bathroom. He is seen through an open doorway, half-dressed in dark trousers, his hands beautifully framing the belt as he pulls it through the final loop. His musculature is relaxed but defined.
  BACKGROUND & ATMOSPHERE: Rich, dark marble walls, a freestanding copper tub in the blurred background. Steam hangs heavy in the air.
  LIGHTING & REALISM: Soft, diffused morning light filtering through frosted glass, wrapping beautifully around his torso and hands, creating deep, luscious shadows and making the leather of the belt look incredibly supple and tactile.
  OUTPUT: Sensual, highly intimate, refined, and exceptionally cinematic.
  `,
  `
  TASK: Generate an ultra-realistic, high-kinetic-energy fashion shot of a man wearing the provided belt.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: An athletic model caught in mid-stride, leaping across a gap or vaulting a low wall in an urban environment. He wears high-end performance-meets-luxury apparel—technical trousers and a light windbreaker. The belt remains perfectly secured, visually anchoring his dynamic, airborne movement.
  PHOTOGRAPHY & REALISM: Shot with an incredibly fast shutter speed (e.g., 1/4000s) to freeze the action flawlessly. Sharp focus tracks the center of mass (the belt), while the extremities exhibit the slightest, artistic motion blur.
  OUTPUT: Explosively dynamic, high-performance luxury, dripping with adrenaline and perfect styling.
  `,
  `
  TASK: Craft an ultra-realistic, blue-blood equestrian lifestyle portrait highlighting the provided belt.
  CRITICAL RULE: The belt must be used **EXACTLY AS IS**. Do not alter its design, buckle, or material.
  MODEL & STYLE: A distinguished gentleman standing beside a magnificent, muscular thoroughbred horse. He is casually leaning against a weathered oak fence, wearing tailored riding breeches, knee-high bespoke boots, and an untucked, fine-gauge knit polo. The belt is prominently displayed at his waist, radiating quiet, old-world wealth.
  BACKGROUND & ATMOSPHERE: A rolling, emerald-green English countryside estate wrapped in the delicate morning mist.
  LIGHTING & REALISM: Soft, cool, diffused morning light that brings out the incredibly rich, organic earth tones of the leather belt and the horse's coat.
  OUTPUT: Aristocratic, deeply sophisticated, classic heritage elegance.
  `,
  `
  TASK: Compose a masterpiece, ultra-realistic editorial still-life focusing exclusively on the provided belt.
  CRITICAL RULE: The belt from the user's image must be used **WITHOUT ANY MODIFICATION**. It is the magnum opus of the composition.
  SCENE & STYLE: Not a standard flat-lay, but a dynamic, multi-layered composition. The belt is draped artistically over a stack of rare, vintage photography books and a crushed piece of heavy velvet. Next to it sit a crystal tumbler of amber liquid and a vintage Leica camera. The arrangement looks like the stylish detritus of a creative genius.
  LIGHTING & ATMOSPHERE: Cinematic, moody 'chiaroscuro' lighting from a single, slightly flagged source, creating rivers of light and deep pools of impenetrable shadow. 
  OUTPUT: Highly intellectual, rich in narrative, an absolute triumph of artistic product styling.
  `,
  `
  TASK: Capture a sun-drenched, ultra-realistic Riviera lifestyle editorial featuring the provided belt.
  CRITICAL RULE: You **MUST** use the belt from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A tanned, effortlessly chic man relaxing on the bleached teak deck of a luxury yacht. He wears pristine white tailored shorts and a subtle, unbuttoned silk shirt flapping in the sea breeze. The belt is the singular contrast point, perfectly dividing the bright whites of his outfit.
  BACKGROUND & ATMOSPHERE: The blinding, crystal-clear turquoise waters of the French Riviera. Bright, high-noon summer sun casting sharp, distinct shadows.
  PHOTOGRAPHY: Shot with a polarizing filter to make the sky pop and remove reflections, giving the image a hyper-clean, vibrant, high-end magazine aesthetic.
  OUTPUT: Crisp, vibrant, jet-set luxury, flawlessly executed.
  `,
  `
  TASK: Direct a deeply atmospheric, ultra-realistic vintage portrait of a man wearing the provided belt.
  CRITICAL RULE: The belt must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: A man exuding old-school cool, seated in a plush velvet booth at an underground jazz club. He sports a high-waisted, wide-leg trouser with suspenders hanging down, relying entirely on the provided belt. He leans forward, elbows on the table, smoke from a cigarette curling perfectly around him.
  LIGHTING & ATMOSPHERE: Illuminated only by the dim, warm glow of a small table lamp with a fringed shade. The lighting is incredibly warm, casting long, dramatic shadows and creating specular highlights on the metal belt buckle through the hazy, smoke-filled air.
  OUTPUT: Mood-drenched, cinematic, unapologetically classic and impossibly cool.
  `,
  `
  TASK: Generate an ultra-realistic, abstract macro art photograph focusing strictly on the provided belt being worn.
  CRITICAL RULE: The belt from the user's image must be used **EXACTLY AS IS**. Do not modify it.
  MODEL & STYLE: An extreme close-up of a model's waist. He wears a highly textured fabric—perhaps a heavy tweed or a deeply ribbed velvet. The composition is cropped so tightly that it becomes an abstract exploration of lines, curves, and overlapping materials.
  PHOTOGRAPHY & REALISM: Shot with a specialized macro lens. The depth of field is razor-thin. The focus rests absolutely perfectly on the edge of the belt's buckle, while the leather grain softly blurs away into the textured fabric of the trousers.
  OUTPUT: Highly specialized, abstract art photography, celebrating the microscopic beauty of design and texture.
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
