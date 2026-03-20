// --- WATCH PROMPTS ---
const WATCH_COVER_PROMPT = `
TASK: Create a masterful, high-end editorial product stage for a men's watch.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact watch** from the provided image **WITHOUT A SINGLE ALTERATION**. Design, materials, watch face, and strap must remain pristine.
SCENE & ATMOSPHERE: Study the watch's character (classic, sport, tactical, luxury). Build an immersive, high-fashion world that THIS specific item belongs to. Use premium textures like brushed titanium, dark slate, carbon fiber, or polished mahogany. The background should be a deeply blurred, sophisticated environment.
LIGHTING: Volumetric, directional light that creates crisp highlights and defined shadows, sculpting the watch's form and highlighting its materials.
QUALITY CONTROL: NO visible camera gear, light stands, or technical artifacts. Pure flagship luxury campaign result.
`;

const WATCH_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, pinnacle-fashion editorial of a man wearing the provided watch.
  CRITICAL RULE: Use the watch **EXACTLY AS IS**.
  DYNAMIC DIRECTION: "Modern Masculinity". Choose a model archetype and styling (e.g., bespoke tailoring, minimalist luxury, or rugged heritage) that perfectly matches the watch's character. The pose should be a candid, high-end "adjustment" or "moment of pause" that feels intentional and powerful.
  LIGHTING & ATMOSPHERE: Cinematic, non-technical illumination. A blurred, sophisticated environment like a glass-walled office, a luxury car interior, or a private lounge.
  QUALITY CONTROL: Zero visible cameras or studio gear. Pure visual storytelling.
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
  TASK: Generate an ultra-realistic, avant-garde "Zero-G" product showcase featuring the provided watch.
  CRITICAL RULE: The watch **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Create a breathtaking, surrealist showcase. The watch appears to be floating in a void of pure luxury. Use elements like liquid metallic particles, crystalline fragments, or light beams that swirl around the product.
  LIGHTING & ATMOSPHERE: Masterful, volumetric lighting that sculptures every edge of the watch. The background is a sophisticated, dark matte void.
  QUALITY CONTROL: Absolutely NO technical equipment visible. The result must feel like a hypnotic, high-res digital art masterpiece.
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
TASK: Create a masterful, high-end editorial product stage for a men's perfume bottle.
CRITICAL RULE: Use the **exact perfume bottle** from the provided image **WITHOUT A SINGLE ALTERATION**.
SCENE & ATMOSPHERE: Study the bottle's aesthetic (heavy glass, sharp lines, wood accents). Build a world of raw power and sophistication. Use elements like wet charcoal, volcanic rock, minimalist concrete, or swirling misty voids.
LIGHTING: High-contrast, dramatic illumination that defines the bottle's silhouette and creates deep, meaningful shadows.
QUALITY CONTROL: NO visible camera gear, light stands, or technical artifacts. A clean, premium luxury result.
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
  TASK: Generate an ultra-realistic, dramatic monochrome portrait of a man, integrated with the provided perfume bottle.
  CRITICAL RULE: The bottle must be used **EXACTLY AS IS** (the only element in color).
  DYNAMIC DIRECTION: "Intense Essence". Choose a model with striking, rugged features and an intense gaze. The composition is a tightly cropped, high-contrast black and white portrait. The bottle is held prominently. 
  LIGHTING: Chiaroscuro lighting with deep, rich shadows and sharp highlights.
  QUALITY CONTROL: No visible strobe lights or photographers. A bold, modern, and artistic result.
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
  TASK: Generate an ultra-realistic, high-fashion "Urban Power" fragrance advertisement for the perfume bottle.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Choose a model archetype and sophisticated styling (e.g., a leather jacket or sharp topcoat) that matches the bottle's aesthetic. The setting is a blurred, moonlit city skyline or a modern architectural foyer. The model interacts with the bottle with confidence and poise.
  LIGHTING: Cinematic, low-key lighting with deep shadows and sharp highlights.
  QUALITY CONTROL: Zero visible cameras, light stands, or studio gear. Pure masculine allure.
  `,
  `
  TASK: Generate an ultra-realistic, pinnacle-fashion fragrance campaign featuring the provided perfume bottle.
  CRITICAL RULE: The bottle **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: "Essence of the Wild". Choose a model archetype and rugged/sophisticated styling (e.g., oversized knitwear or tailored linen) that suits the product. The setting is a dramatic natural landscape — a jagged cliff, a misty forest, or a vast desert at twilight. The composition is cinematic and grand.
  LIGHTING: Atmospheric, natural-feeling illumination.
  QUALITY CONTROL: Absolutely no technical equipment or camera gear visible. A breathtaking final result.
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

// --- BELT PROMPTS (DYNAMIC) ---

// ─── Dynamic Pool Definitions ────────────────────────────────────────────────
// These pools are inspired by 2024 luxury belt editorial trends:
// statement buckles, artisan craftsmanship, urban noir, architectural abstraction,
// dark nature, reversible styling, sustainable materials, and tech-forward designs.

const _BELT_BUCKLE_FOCUSES = [
  "The statement buckle dominates the frame — its geometry catches a razor-sharp specular highlight that draws the eye instantly.",
  "A macro close-up reveals the intricate engraving on the buckle, each groove catching soft directional light that sculptures the metal.",
  "The burnished gold-toned prong buckle gleams against the matte leather, acting as the single point of brilliance in an otherwise moody frame.",
  "An oversized, geometric minimalist buckle provides strikingly bold contrast against the fine-grain leather — modern and assertive.",
  "A vintage-style roller buckle with an antique patina finish tells a story of heirloom quality and timeless design.",
  "The brushed silver hardware of the belt buckle glints coolly, an engineering detail celebrated for its mechanical precision.",
];

const _BELT_SCENES = [
  // Artisan / Craftsmanship
  "A dimly lit artisan leatherworker's atelier. The belt hangs from a worn wooden peg above a workbench cluttered with awls, leather scraps, heavy-gauge needles, and thread spools. Dust motes float in a single amber shaft of light.",
  // Urban Noir
  "A rain-slicked urban alleyway at midnight. Neon signage (deep crimson and electric teal) reflects off the wet cobblestones. The belt rests on the hood of a parked vintage muscle car, the city noise implied in every shadow.",
  // Architectural Abstraction
  "A brutalist concrete staircase with harsh geometric shadows. The belt is draped over the edge of a thick concrete ledge, its leather contrasting dramatically with the raw, porous surface. Clean, austere, and commanding.",
  // Dark Nature
  "A moody forest floor at dusk. Dark volcanic rock, gnarled roots, and damp fallen leaves surround the belt, coiled naturally like a resting creature. The scene is primal, rugged, and deeply atmospheric.",
  // Gentleman's Study
  "A sophisticated dark-oak paneled study. The belt is laid across an open first-edition leather-bound book on a mahogany desk beside a crystal decanter of amber scotch and a vintage Mont Blanc pen. Warm lamplight creates pools of gold.",
  // Rooftop Powerplay
  "A penthouse rooftop terrace at twilight. The belt is fastened around the waist of a silhouetted figure against a sweeping cityscape igniting with amber and violet light. The scene radiates quiet, supreme power.",
  // Fine Art Gallery
  "A minimalist fine-art gallery with stark white walls. The belt lies on an unpolished travertine plinth under a single focused gallery spotlight. Treated as a museum artifact — irreplaceable and iconic.",
  // Equestrian Estate
  "A fog-drenched English countryside estate at dawn. The belt is worn by a distinguished man in riding breeches, leaning against a weathered oak fence as a thoroughbred horse stands majestically in the background.",
  // Reflective Obsidian
  "The belt is displayed on a polished black acrylic surface. Its reflection creates a perfect mirror image below it, the buckle gleaming with razor-sharp specular highlights in the inky dark void.",
  // Jazz Club Vintage
  "A subterranean jazz club glowing with the amber warmth of table lamps and candles. The belt is worn by a man in high-waisted wide-leg trousers, leaning back in a velvet booth while the haze of the room wraps everything in nostalgic atmosphere.",
  // Riviera Yacht
  "The sun-blazed teak deck of a superyacht off the French Riviera. The belt divides the pristine white of a man's tailored linen outfit, the turquoise sea stretching to the horizon behind him.",
  // Kinetic Urban
  "A man mid-vault over a low urban barrier in a gritty downtown district, the belt perfectly secured at his waist — frozen in razor-sharp detail by a 1/4000s shutter, the background city a dynamic blur of energy.",
  // Macro Texture
  "An extreme macro composition: a razor-thin depth of field places the belt buckle edge in knife-sharp focus while the grain of heavyweight tweed trousers dissolves into abstract texture behind it.",
  // Surrealist Desert
  "An impossibly vast expanse of porcelain-white salt flats beneath a bruised violet storm sky. The belt cinches billowing earth-toned silk garments, the only rigid, grounded element in a dreamlike, windswept scene.",
];

const _BELT_LIGHTING_MOODS = [
  "Cinematic chiaroscuro — dramatic, high-contrast illumination that creates deep pools of shadow and a powerful, sculpted look.",
  "Cool, overcast diffused daylight — clean, shadowless illumination that reveals every micro-texture and stitch detail with absolute clarity.",
  "Golden-hour warmth — the last horizontal rays of sunlight wrapping the leather in a burnished, liquid amber glow.",
  "Neon-noir — vibrant crimson and electric cyan reflections painting the buckle and strap with pops of cinematic color against deep shadow.",
  "Classic high-fashion glow — soft, directional illumination that highlights the model's form and creates a luminous focus on the belt.",
  "Sublime architectural light — a sharp, volumetric beam that illuminates only the belt and its immediate texture, surrounded by mysterious shadow.",
  "Amber workshop illumination — warm, slightly dusty shafts of incandescent light slicing through dark space, making the leather glow with organic warmth.",
  "Blue-hour cool ambiance — the calm, desaturated light just after sunset, giving the belt a cool, authoritative presence against blue-grey urban textures.",
  "Reflected city glow — ambient light sourced entirely from the glittering city skyline, bathing the scene in layered warm amber and cool blue.",
];

const _BELT_MODEL_ARCHETYPES = [
  "A powerfully built man with sharp, confident features and close-cropped hair, exuding controlled authority.",
  "A lean, angular artist with expressive eyes and slightly disheveled dark hair — creative, intense, and magnetic.",
  "A sun-bronzed Mediterranean man with effortless ease, the kind of man who was born into quiet luxury.",
  "A rugged, weathered outdoorsman with calloused hands and a calm, knowing expression — heritage and grit personified.",
  "A sharp, immaculate corporate executive — suit flawlessly tailored, posture commanding, not a single detail out of place.",
  "An athletic, broad-shouldered man with a relaxed but deliberate energy — the modern gentleman at rest.",
  "A distinguished silver-templed man in his 40s radiating effortless, old-money sophistication and quiet confidence.",
];

const _BELT_STYLE_CONTEXTS = [
  "paired with raw selvedge heavyweight denim and a crisp white Oxford shirt, sleeves rolled to the forearm",
  "cinching a perfectly imperfect unstructured linen suit in deep navy, casually unbuttoned at the collar",
  "anchoring a bespoke charcoal pinstripe suit with a crisp white shirt beneath, the picture of corporate mastery",
  "worn over slim dark technical trousers and a deconstructed leather moto jacket, urban and razor-sharp",
  "pairing with wide-leg vintage high-waisted wool trousers and a fine-knit cashmere roll-neck",
  "cinching cream tailored chinos and a breathable linen blazer — effortlessly summer, unmistakably luxurious",
  "fastened over midnight-black slim-fit formal trousers under a midnight blue velvet dinner jacket",
  "worn with tailored riding breeches and a subtle untucked fine-gauge polo — equestrian, aristocratic",
];

// ─── Helper: seeded random pick ─────────────────────────────────────────────
function _beltPick<T>(arr: T[], seed: number): T {
  // Use a simple LCG permutation on the seed so different call-sites with the same
  // base seed still pick independently from different positions in each array.
  const idx = Math.abs(seed * 1664525 + 1013904223) % arr.length;
  return arr[idx];
}

// ─── Dynamic Cover Prompt ────────────────────────────────────────────────────
export function getBeltCoverPrompt(): string {
  const seed = Date.now();
  const scene = _beltPick(_BELT_SCENES, seed);
  const lighting = _beltPick(_BELT_LIGHTING_MOODS, seed ^ 0xDEADBEEF);
  const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0xCAFEBABE);

  return `
TASK: Create a masterful, high-end editorial centerpiece for a luxury men's belt.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact belt** from the provided image **WITHOUT A SINGLE ALTERATION**.
SCENE: ${scene}
LIGHTING: ${lighting}
BUCKLE FOCUS: ${buckle}
QUALITY CONTROL: NO visible camera equipment, light stands, or technical artifacts. The results must be a pure, high-end advertising masterpiece.
`.trim();
}

// ─── Dynamic Photo Prompts Array (replaces static BELT_PHOTO_PROMPTS) ────────
// Each entry is a function that generates a fresh, unique prompt using randomized
// combinations of scene, lighting, model, and style from the pools above.
// The final BELT_PHOTO_PROMPTS array is built at module load time.

const _BELT_PHOTO_PROMPT_TEMPLATES: Array<(seed: number) => string> = [
  // 1. Statement Buckle Close-Up Editorial
  (seed) => {
    const lighting = _beltPick(_BELT_LIGHTING_MOODS, seed);
    const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0x11);
    const style = _beltPick(_BELT_STYLE_CONTEXTS, seed ^ 0x22);
    return `
TASK: Generate an ultra-realistic, statement-buckle close-up editorial featuring the provided belt.
CRITICAL RULE: The belt MUST NOT BE CHANGED — its buckle design, leather texture, stitching, and color must remain exactly as provided. It is the sole untouchable element.
COMPOSITION: Frame a razor-tight crop at the model's waist, ${style}. The composition is deliberately abstract — the belt's buckle anchors the center while the surrounding fabric and leather blur into rich texture.
BUCKLE FOCUS: ${buckle}
LIGHTING: ${lighting}
PHOTOGRAPHY: Shot with a 100mm macro lens, aperture f/2.8, capturing every engraving and surface nuance. The depth of field is knife-thin — the buckle edge is in surgical focus, the strap dissolving into beautiful bokeh.
OUTPUT: Intensely textural, abstract product art — the belt celebrated as a sculptural object, not merely a functional accessory.
`.trim();
  },

  // 2. Artisan Workshop Heritage
  (seed) => {
    const model = _beltPick(_BELT_MODEL_ARCHETYPES, seed);
    const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0x33);
    return `
TASK: Orchestrate a hyper-realistic, soulful artisan-heritage portrait featuring the provided belt.
CRITICAL RULE: You MUST use the belt from the user's image with ZERO ALTERATIONS. Every nuance of its design, buckle, stitching, and leather must be preserved exactly.
SCENE: A dimly lit, rustic leatherworker's atelier — workbench strewn with awls, thread spools, leather scraps, and hand tools. Raw leather hides hang on the wall. The space feels lived-in and honest.
MODEL: ${model} He stands in the atelier, wearing the provided belt naturally over rugged work jeans and a rolled-up flannel shirt, wiping his hands on a worn cloth. The belt sits at his waist like a finished masterpiece.
BUCKLE FOCUS: ${buckle}
LIGHTING: Thick, amber shafts of warm incandescent light cut through dusty workshop air at dramatic angles. Dust motes dance visibly. Deep, enveloping shadows surround the islands of warm light.
PHOTOGRAPHY: Shot on 35mm film, slight organic grain, medium close-up that includes hands, waist, and the workshop environment. Cinematic color grade — deep amber, warm brown, dark shadow.
OUTPUT: Earthy, authentic, heritage-rich. The belt is celebrated as functional art, born from craft and worn with genuine purpose.
`.trim();
  },

  // 3. Urban Noir Night
  (seed) => {
    const model = _beltPick(_BELT_MODEL_ARCHETYPES, seed);
    const style = _beltPick(_BELT_STYLE_CONTEXTS, seed ^ 0x44);
    return `
TASK: Direct an edgy, ultra-realistic urban noir editorial featuring the provided belt.
CRITICAL RULE: The belt must be used WITHOUT ANY MODIFICATION. Its design, buckle, leather color, and stitching are a fixed, non-negotiable element.
SCENE: A rain-soaked city alleyway at midnight. Crimson and electric cyan neon signs reflect off the wet cobblestones, creating puddles of vivid color in the darkness. The air feels heavy, charged, cinematic.
MODEL: ${model} Wearing the provided belt, ${style}. He leans against a rain-slicked brick wall or stands mid-stride, his posture exuding controlled, cool indifference.
LIGHTING: Pure neon-noir — no artificial softboxes. The entire scene is lit by the chaos of reflected neon and distant street lamps. The buckle catches a sharp sliver of crimson light, a single point of intensity against the moody darkness.
PHOTOGRAPHY: 35mm lens, cinematic film grain, slightly underexposed for maximum atmosphere. Low camera angle projecting power.
OUTPUT: Gritty, unapologetically cool, photorealistic street-luxury. The belt is the anchor of discipline in a beautifully chaotic urban world.
`.trim();
  },

  // 4. Architectural Brutalist Power
  (seed) => {
    const model = _beltPick(_BELT_MODEL_ARCHETYPES, seed);
    const style = _beltPick(_BELT_STYLE_CONTEXTS, seed ^ 0x55);
    const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0x66);
    return `
TASK: Craft an ultra-realistic, avant-garde architectural editorial featuring the provided belt.
CRITICAL RULE: The belt MUST NOT BE CHANGED. Its geometry, buckle design, and leather must remain perfectly intact — it is the sole element of warmth and humanity in a cold architectural world.
SCENE: An imposing brutalist concrete structure — raw poured concrete walls, geometric staircase, harsh structural shadows creating bold graphic patterns.
MODEL: ${model} Dressed in stark, monochrome fashion with the provided belt, ${style}. He stands perfectly still against the concrete geometry, the belt's warm leather contrasting violently with the cold, industrial backdrop.
BUCKLE FOCUS: ${buckle}
LIGHTING: Cold, diffused overcast daylight, clinical and shadowless — revealing every micro-texture of the concrete and every grain of the belt leather with forensic detail. The metallic buckle is the only warm specular highlight in the entire frame.
PHOTOGRAPHY: Shot on an 85mm lens, full body to mid-shot, strong graphic composition. Deep contrast in post.
OUTPUT: High-concept, architecturally disciplined, radically modern — the belt as the only human warmth in a controlled, abstract world.
`.trim();
  },

  // 5. Corporate Power Play
  (seed) => {
    const model = _beltPick(_BELT_MODEL_ARCHETYPES, seed);
    const lighting = _beltPick(_BELT_LIGHTING_MOODS, seed ^ 0x77);
    return `
TASK: Generate an ultra-realistic, pinnacle-of-power editorial centered on the provided belt.
CRITICAL RULE: The belt must be used EXACTLY AS IS — design, buckle, leather grain, and color are untouchable. It is the emblem of controlled authority.
SCENE: A hyper-modern corner office with floor-to-ceiling glass walls overlooking a glittering metropolis. Dark walnut desk, architect's chair, a single framed abstract canvas on the wall. The space is immaculate and imposing.
MODEL: ${model} In a bespoke charcoal pinstripe suit, mid-motion — seated, leaning forward over the desk, suit jacket falling open to perfectly reveal the belt beneath the crisp white shirt. The posture radiates absolute control.
LIGHTING: ${lighting}
PHOTOGRAPHY: 85mm, f/4, capturing both sharp belt detail and the sweeping cityscape in soft bokeh. Cinematic desaturated color grade with a single pop of warmth on the belt's leather.
OUTPUT: Cinematic, immensely powerful corporate luxury. The belt is the emblem of a man at the absolute apex of his world.
`.trim();
  },

  // 6. Red-Carpet Glamour
  (seed) => {
    const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0x88);
    return `
TASK: Capture an ultra-realistic red-carpet editorial featuring the provided belt as an unexpected luxury detail.
CRITICAL RULE: The belt from the user's image must be used EXACTLY AS IS — it is a fixed, untouchable element of his wardrobe, celebrated as a deliberate style choice.
SCENE: The electric, chaotic energy of a major film premiere or fashion gala. Models are a blur of glamour behind the velvet rope. The air crackles with camera flashes and the energy of a thousand eyes.
MODEL: A classically handsome, charismatic leading man in a razor-sharp midnight blue velvet tuxedo. Captured in a candid mid-adjustment moment — jacket falling open as he turns to the cameras, perfectly revealing the provided belt beneath.
BUCKLE FOCUS: ${buckle}
LIGHTING: The harsh, immediate burst of paparazzi camera flashes balanced with rich, warm event ambient lighting. The buckle pops with a single intense highlight that freezes it with perfect clarity against the velvet.
PHOTOGRAPHY: 35mm lens for editorial immediacy, slight motion in the crowd background, tack-sharp focus on the model and belt. Vibrant, high-energy color grade.
OUTPUT: High-glamour, timeless celebrity elegance — the belt elevated from accessory to signature statement.
`.trim();
  },

  // 7. Kinetic Urban Action
  (seed) => {
    const style = _beltPick(_BELT_STYLE_CONTEXTS, seed ^ 0x99);
    return `
TASK: Generate an ultra-realistic, high-kinetic-energy fashion shot featuring the provided belt in a moment of pure, frozen motion.
CRITICAL RULE: You MUST use the belt from the user's image with ZERO ALTERATIONS. The belt's design, buckle, and leather are fixed elements that persist perfectly through motion.
SCENE: A raw urban environment — a gritty downtown district, an empty plaza, or a concrete parkour terrain. The city is a blurred backdrop to a singular moment of controlled athleticism.
MODEL: An athletic, broad-shouldered model caught mid-action — vaulting a barrier, mid-stride in a powerful run, or spinning in a sharp pivot. He wears the provided belt, ${style}. The movement is dynamic, the styling remains impeccably intentional.
LIGHTING: Bright, directional midday sun — hard shadows frozen mid-motion. The belt buckle catches a sharp, explosive highlight at the moment of peak energy.
PHOTOGRAPHY: 1/4000s shutter speed freezes all motion flawlessly. The focus tracks the belt's center with tack-sharp precision, while extremities show the faintest artistic motion blur. 70mm lens, dynamic composition with the rule of thirds breaking for tension.
OUTPUT: Explosively dynamic, high-performance luxury — the belt as the anchor of perfect style in a world of movement and energy.
`.trim();
  },

  // 8. Reflective Dark Still Life
  (seed) => {
    const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0xAA);
    const companions = _beltPick([
      "a crystal decanter of aged Scotch, a vintage Leica camera, and a crushed piece of dark velvet",
      "a leather-bound first-edition book, a Montblanc fountain pen, a pair of aviator sunglasses",
      "a hand-rolled cigar in a dark ceramic ashtray, a brushed silver lighter, a stack of rare photography books",
      "a premium mechanical watch removed from its wrist, a rough fragment of volcanic rock, a single white orchid",
    ], seed ^ 0xBB);
    return `
TASK: Compose an ultra-realistic, moody dark luxury still-life centered on the provided belt.
CRITICAL RULE: The belt from the user's image must be used WITHOUT ANY MODIFICATION — it is the magnum opus at the center of this arrangement.
SCENE: A polished black acrylic surface in a nearly dark room. The belt is coiled or draped artistically in the center, its reflection mirrored perfectly in the glossy surface below. Carefully placed beside it: ${companions}. Every element is chosen to imply a character — an intelligent, worldly, quietly powerful man.
BUCKLE FOCUS: ${buckle}
LIGHTING: Cinematic chiaroscuro — a single, slightly flagged key light creates rivers of intense light falling across the belt and companions, while deep, absolute shadow consumes the edges of the frame. The reflection adds another layer of glowing, mysterious depth.
PHOTOGRAPHY: Overhead or 30° elevated angle, medium format for flawless detail. Color grade: cool deep shadows, warm amber highlights. Zero grain — immaculate and precise.
OUTPUT: Intellectually rich, narratively deep, an absolute triumph of product styling that feels like a painting from a museum of modern luxury.
`.trim();
  },

  // 9. Golden-Hour Silhouette
  (seed) => {
    const model = _beltPick(_BELT_MODEL_ARCHETYPES, seed);
    const style = _beltPick(_BELT_STYLE_CONTEXTS, seed ^ 0xCC);
    return `
TASK: Generate an ultra-realistic, golden-hour silhouette and detail portrait featuring the provided belt.
CRITICAL RULE: The belt MUST NOT BE CHANGED in any way — its design, buckle, leather, and color are preserved perfectly in both silhouette and lit portions of the frame.
SCENE: A sweeping open location at golden hour — a city rooftop, a vast salt flat, an ocean bluff. The last horizontal rays of the sun create impossibly long shadows.
MODEL: ${model} Wearing the provided belt, ${style}. He stands in profile or faces the dying sun, his silhouette crisp and powerful against a vivid orange and violet sky. The buckle catches a precise, blazing rim of golden back-light — the only element that glows from within the silhouette.
LIGHTING: Intense golden-hour backlighting. The sky is vivid — deep amber, blazing orange, bruised violet. The model is underexposed to near-silhouette, but the belt's buckle catches a razor edge of pure gold light.
PHOTOGRAPHY: 85mm, f/8, hyperfocal distance set to capture both model and sky with superb detail. Polarizing filter on the sky. Slightly warm color grade.
OUTPUT: Iconic, poster-worthy, cinematic. The belt glows at the center of a breathtaking natural spectacle — a timeless image of power and ease.
`.trim();
  },

  // 10. Equestrian Heritage
  (seed) => {
    const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0xDD);
    return `
TASK: Craft an ultra-realistic, blue-blood equestrian heritage portrait featuring the provided belt.
CRITICAL RULE: The belt must be used EXACTLY AS IS — its design, buckle, leather color, and stitching are unchangeable elements of old-world authenticity.
SCENE: A fog-drenched English countryside estate at dawn. Rolling emerald hills, ancient stone walls, bare oak trees in the morning mist. A magnificent bay thoroughbred stands behind a weathered wooden fence.
MODEL: A distinguished gentleman in his late 40s with effortless silver-templed elegance. He wears tailored cavalry twill riding breeches, knee-high bespoke leather boots, and a fine-gauge knit polo — the provided belt prominently cinching the breeches. He leans against the fence with one hand resting on the horse's strong neck, relaxed and natural.
BUCKLE FOCUS: ${buckle}
LIGHTING: Soft, cool diffused morning light — no harsh shadows, just a gentle luminosity that brings out the incredibly rich earth tones of the leather, the horse's coat, and the dewy grass. The buckle has a subtle warm gleam from the pale morning sun breaking through the mist.
PHOTOGRAPHY: 135mm lens for gentle compression, pulling the landscape beautifully around the figure. Clean, organic color grade — muted greens, warm browns, silver-grey mist.
OUTPUT: Aristocratic, deeply sophisticated, classic heritage elegance. The belt as the natural choice of a man who inherits quality, not chases it.
`.trim();
  },

  // 11. Jazz Club Vintage Noir
  (seed) => {
    const model = _beltPick(_BELT_MODEL_ARCHETYPES, seed);
    return `
TASK: Direct an ultra-realistic, deeply atmospheric vintage jazz-club editorial featuring the provided belt.
CRITICAL RULE: The belt must be used WITHOUT ANY MODIFICATION — every leather detail, buckle design, and stitch is preserved with perfection.
SCENE: A subterranean jazz club alive with warm amber candlelight, thick cigarette haze, and the implied sound of a double bass. A plush velvet booth. Dark wood paneling. A small table lamp with a fringed amber shade.
MODEL: ${model} Dressed in vintage-inspired high-waisted, wide-leg wool trousers with suspenders hanging loose, relying entirely on the provided belt to hold the look together. He sits forward, elbows on the table, a glass of amber rye within reach, looking into the middle distance with unforgettable cool.
LIGHTING: Illuminated only by the small table lamp and the ambient warmth of the room. Extremely warm, low-key — deep, impenetrable shadow fills much of the frame. A single golden highlight traces the belt buckle through the haze, the brightest element in the shot.
PHOTOGRAPHY: Shot at f/1.4 for maximum atmospheric bokeh in the background. Film simulation — Kodak Portra 800 tones. The grain is part of the mood.
OUTPUT: Mood-drenched, cinematic, impossibly cool vintage masculinity. The belt as the quiet anchor of a look built on nostalgia and effortless charisma.
`.trim();
  },

  // 12. Surrealist Desert Dream
  (seed) => {
    const buckle = _beltPick(_BELT_BUCKLE_FOCUSES, seed ^ 0xEE);
    const style = _beltPick(_BELT_STYLE_CONTEXTS, seed ^ 0xFF);
    return `
TASK: Create an ultra-realistic surrealist fashion editorial featuring the provided belt as the single anchor of reality in a dreamscape.
CRITICAL RULE: The belt must be used WITHOUT ANY MODIFICATION. It must remain the definitive, rigid centerpiece of a scene that dissolves into fantasy around it.
SCENE: An impossibly vast expanse of porcelain-white salt flats stretching to the horizon under a bruised, storm-violet sky. The air is electric. The environment is alien, dreamlike, and haunting.
MODEL: A slender, enigmatic figure draped in voluminous, earth-toned raw silk garments that billow impossibly in the wind — as if defying gravity. The provided belt, ${style}, cinches the center of this flowing mass of fabric with a single act of structural authority.
BUCKLE FOCUS: ${buckle} Against the white salt and the dark sky, the buckle is the only hard, defined object in a frame of dissolving forms.
LIGHTING: Unearthly golden hour from an impossibly low angle — stretching every shadow across the white salt flats into infinity. Light wraps around the silk like liquid while the belt's leather and buckle remain crisply, defiantly real.
PHOTOGRAPHY: 50mm, slight tilt downward, capturing the salt flat reflection beneath the figure. The sky is fully saturated — the most saturated element in the image. The belt is the sharpest.
OUTPUT: Ethereal, avant-garde, deeply poetic. Fashion photography that transcends commerce and becomes pure visual storytelling.
`.trim();
  },
];

// Build the static export arrays from the dynamic templates at module load time.
// Each template is called with a unique seed derived from its index so the
// initial set of prompts is already diverse — and every subsequent reload or
// shuffle produces a completely different set of results.
const BELT_PHOTO_PROMPTS: string[] = _BELT_PHOTO_PROMPT_TEMPLATES.map(
  (fn, i) => fn(Date.now() + i * 999983) // large prime step keeps seeds well-separated
);

const BELT_COVER_PROMPT: string = getBeltCoverPrompt();
// --- APPAREL PROMPTS ---
const APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, pinnacle-fashion editorial of a male model wearing the provided garment in a poised, static position.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact garment** from the provided image **WITHOUT A SINGLE ALTERATION**. Design, color, pattern, texture, and fit must be perfectly preserved. Do NOT add any new trails, features, or stylistic additions to the cloth.
DYNAMIC DIRECTION: Study the garment's character (streetwear, formal, ethnic, technical). Select a model archetype, age, styling, and a strong, static pose that perfectly match the product's soul. Build a world that THIS garment belongs to — avoid generic setups.
LIGHTING & ATMOSPHERE: High-fashion, volumetric illumination tailored to the garment's fabric. Use light to sculpt the drape and texture realistically.
QUALITY CONTROL: NO visible camera gear, light stands, seamless paper rolls, or photographers. 
`;

const APPAREL_PHOTO_PROMPTS = [
  `
  TASK: Generate a "New York Editorial" style high-fashion photo of a man wearing the provided garment.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Choose a model archetype and sophisticated styling (e.g., layering, accessories, grooming) that elevates the garment to a high-fashion cover level. The setting is iconic and atmospheric — a brutalist lobby, a moody library, or a minimalist gallery. The pose is strong, editorial, and unique.
  LIGHTING: Cinematic, non-technical illumination that sculptures the model and product.
  QUALITY CONTROL: NO visible technical artifacts or equipment.
  `,
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
  TASK: Generate an ultra-realistic, sophisticated static editorial of a man wearing the garment in a poised position.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**. No new trails or enhancements.
  DYNAMIC DIRECTION: "Moment of Presence". Choose a strong, architectural or urban setting. The model is poised and perfectly still, showcasing the garment's structure and fit with absolute clarity. The pose is strong and intentional.
  LIGHTING: Dramatic, cinematic studio-grade lighting. Volumetric light cutting through the scene.
  QUALITY CONTROL: Zero visible cameras or equipment. A masterpiece of static composition.
  `,
  `
  TASK: Generate an ultra-realistic, poised photo of a model wearing the provided garment in a static position.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit.
  DYNAMIC DIRECTION: Create a scene that feels right for this specific garment's character. The pose should be stable and poised — a lean, a strong stance, or a thoughtful gaze. The location and atmosphere should be vivid and immersive — do not use a generic white studio. Think bold: a sunlit rooftop, a tunnel, an open field, an art space. The model's presence should feel expressive and alive but static.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, full of presence but static focus. A visually striking image that makes the garment feel desirable.
  `,
  `
  TASK: Generate an ultra-realistic, product-focused informative editorial of a man wearing the garment — focusing on the view that best represents the uploaded item.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**.
  CONDITIONAL DIRECTION:
  - If the uploaded product image shows the **back of the garment**, generate a back-facing or three-quarter rear view of the model that clearly showcases the back design.
  - If the uploaded product image shows the **front of the garment** or any other side, generate a front-facing or three-quarter front view that clearly showcases the front design, collar, and silhouette.
  DYNAMIC DIRECTION: Choose a model archetype and character-filled pose that suits the garment. The background should be clean and sophisticated (not a generic white studio).
  QUALITY CONTROL: NO technical artifacts like paper rolls or equipment visible.
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
  TASK: Generate an ultra-realistic, rain-soaked city editorial photo of a man wearing the provided garment in a static pose.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** — preserve its original design, color, and texture perfectly. Do not add any new fabric trails.
  DYNAMIC DIRECTION: The model stands confidently on a rain-soaked urban street. Wet pavement creates beautiful reflections. The garment should look intentional and stylish despite the weather — showing the wearer's confidence and character. The pose is static, allowing for full appreciation of the garment's construction.
  ATMOSPHERE: Cool blue-grey tones accented by warm shop-window light. Film-like quality.
  OUTPUT SPECIFICATIONS: High-resolution, editorial, dramatic, and static.
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
  TASK: Generate an ultra-realistic, athletic/sports lifestyle photo of a man wearing the provided garment in a static pose.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: If the garment suits an active context, place the model in a relevant sports or fitness scenario — posing at a track, standing by a boxing ring, or preparing on a basketball court. If the garment is not athletic, create a contrast — an athlete in a casual or formal garment captured in a sports setting, showing versatility. The pose is static and poised.
  ATMOSPHERE: Striking, bold lighting. The setting should feel real and immersive.
  OUTPUT SPECIFICATIONS: High-resolution, powerful, and poised.
  `,

  `
  TASK: Generate a high-fashion, ultra-realistic "Statuesque" editorial of a man wearing the garment.
  CRITICAL RULE: Use the garment **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Artistic, clean, and powerful. Choose a model with a striking, architectural look. The background is a sophisticated solid (like raw plaster, matte metal, or deep charcoal) that makes the garment pop. The pose is strong and editorial — avoiding generic catalog stances.
  LIGHTING: Precise, volumetric illumination that defines the product's structure.
  QUALITY CONTROL: NO visible studio gear, paper rolls, or light stands. Pure minimalist excellence.
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
  TASK: Generate an ultra-realistic, coastal/beach lifestyle photo of a man wearing the provided garment in a static position.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture. Keep the cloth exactly as per the provided image.
  DYNAMIC DIRECTION: The model is in a coastal setting — standing along a rocky shoreline, standing on a pier, or leaning statically against a beachside rail. The garment should feel natural in this environment. Hair is slightly windswept, the mood is relaxed and confident. The pose is static.
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
