const JEWELRY_COVER_PROMPT = `
TASK: Create a masterful, high-end editorial product stage for a piece of jewelry.
CRITICAL RULE — NON-NEGOTIABLE: You are provided with an image of a piece of jewelry. Your absolute priority is to render the **exact jewelry** from that image **WITHOUT A SINGLE ALTERATION**. The design, gemstones, metal texture, and intricate details must remain pristine and completely untouched.
SCENE & ATMOSPHERE: Study the jewelry's character (traditional, modern, bridal, minimalist). Build a high-fashion, atmospheric stage that elevates THIS specific item. Use premium textures like raw obsidian, silk, or architectural marble. The background should be a deeply blurred, sophisticated environment that creates a sense of scale and luxury (e.g., an ancient palace corridor, a moonlit garden, or a high-fashion gallery).
LIGHTING: Volumetric, professional fashion-grade illumination. Use soft, focused sculpting light to create radiant highlights and defined shadows that make the product pop. 
QUALITY CONTROL: NO visible camera equipment, light stands, umbrellas, or photographers in the scene or reflections.
`;

const JEWELRY_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, high-fashion editorial portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: The jewelry must be used **EXACTLY AS IS** — no alterations to design, stones, or metal. It is a fixed, unchangeable element.
  DYNAMIC DIRECTION: Choose a model archetype, ethnicity, and styling that perfectly complements the specific design of the uploaded jewelry. If it's traditional, match with a heritage look; if modern, use an edgy, contemporary aesthetic. The pose should be candid and expressive, showcasing the jewelry's interaction with skin and attire.
  LIGHTING & ATMOSPHERE: High-fashion cinematic lighting that creates depth and drama. A blurred, sophisticated background (like a moonlit terrace or a private lounge) that adds narrative without distraction.
  QUALITY CONTROL: Ensure zero visible camera gear or studio equipment. Focus on pure visual storytelling.
  `,

  `
  TASK: Generate a dramatic, black and white high-fashion portrait featuring the provided jewelry.
  CRITICAL RULE: The jewelry MUST NOT BE CHANGED. Preserve its original form and texture faithfully.
  DYNAMIC DIRECTION: Create a moody, evocative scene. Choose a model with a striking, unique look that suits the jewelry's weight and style. The shot should feel like it belongs in an avant-garde fashion magazine. 
  LIGHTING: Intense, high-contrast chiaroscuro lighting that sculpts the model's features and the jewelry. 
  QUALITY CONTROL: No visible strobe lights or photographers. The final output is purely monochrome, with the jewelry as the sharp, luminous focal point.
  `,

  `
  TASK: Generate an ultra-realistic, heritage-inspired portrait of a woman wearing the provided jewelry, elegantly integrated into a traditional attire.
  CRITICAL RULE: Use the jewelry from the user's image with **ZERO ALTERATIONS**.
  DYNAMIC DIRECTION: Study the jewelry's cultural cues. Select a saree or ethnic outfit (e.g., silk, embroidered, or sheer) that harmonizes with the product. The model's styling — hair, makeup, bindi — should feel authentic to the heritage theme. The pose should be graceful and regal.
  LIGHTING & ATMOSPHERE: A lush, sun-dappled courtyard or a grand traditional manor. Use warm, natural daylight filtering through architectural details.
  QUALITY CONTROL: Pure editorial result. No equipment visible.
  `,

  `
  TASK: Generate an ultra-realistic, cinematic bridal-themed portrait wearing the provided jewelry.
  CRITICAL RULE: The jewelry is the unchangeable centerpiece. Preserve its design, color, and materials perfectly.
  DYNAMIC DIRECTION: Create a high-stakes, regal bridal moment. Choose a bridal outfit (e.g., heavily embroidered lehenga or saree) that matches the grandeur of the jewelry. The model's expression should be poised and mysterious. 
  LIGHTING & BACKGROUND: A dark, moody, opulent setting. Use soft, directional "rim" lighting to trace the silhouette and make the jewelry's stones sparkle intensely. 
  QUALITY CONTROL: No visible studio gear. Each generation should feel like a different, unique high-end wedding campaign.
  `,

  `
  TASK: Generate an ultra-realistic, glamorous gala-style portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: The jewelry from the user's image must be used **WITHOUT ANY MODIFICATION**.
  DYNAMIC DIRECTION: Imagine a "Night at the Opera" or a "Red Carpet Event". Select a luxurious evening gown (satin, velvet, or silk) in a color that makes the jewelry stand out. The model's look and pose should radiate aristocratic elegance.
  BACKGROUND & ATMOSPHERE: A grand, out-of-focus ballroom or a darkened luxury foyer with marble and gold accents. 
  QUALITY CONTROL: Zero visible photographers or flashes. High-end, clean editorial focus.
  `,

  `
  TASK: Generate an ultra-realistic, contemporary fashion portrait featuring the provided jewelry.
  CRITICAL RULE: The jewelry must be used **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Think "Modern Power Styling". Choose a model with a sharp, confident look and a slicked-back hairstyle. Select a tailored, high-fashion outfit (like a power suit or a minimalist blazer) that provides a clean canvas for the jewelry. The pose should be intense and authoritative.
  BACKGROUND & ATMOSPHERE: A sleek, architectural interior or a high-rise office with a blurred twilight cityscape. 
  QUALITY CONTROL: Ensure no visible studio lights or umbrellas. The overall mood should be powerful and modern.
  `,

  `
  TASK: Generate an ultra-realistic, tropical luxury portrait wearing the provided jewelry.
  CRITICAL RULE: Use the jewelry **EXACTLY AS IS** — no changes to metal or stones.
  DYNAMIC DIRECTION: Create a "Resort Glamour" moment. Choose a model with a sun-kissed, radiant look and beachy hair. Select a flowing, elegant resort-wear outfit (like a white linen dress or a silk kaftan) that catches the warm light.
  BACKGROUND & ATMOSPHERE: A luxurious coastal setting or an overwater villa. Use golden-hour, natural sunlight to create a warm, dreamy glow and beautiful highlights on the jewelry.
  QUALITY CONTROL: No visible camera gear or artifacts.
  `,

  `
  TASK: Generate an ultra-realistic, heritage-inspired portrait of an Indian woman in Mughal-era styling wearing the provided jewelry.
  CRITICAL RULE: You **MUST** use the jewelry from the user's image with **ZERO ALTERATIONS**. Do not change its design, materials, or gemstone colors. It must appear exactly as provided.
  MODEL & STYLE: A regal woman with kohl-lined eyes, a small decorative bindi, and deep berry-toned lips. Her hair is adorned with fresh jasmine flowers in a low braid. She wears a rich royal blue velvet kurta with intricate gold zardosi embroidery.
  BACKGROUND & ATMOSPHERE: A dimly lit palatial marble corridor with ornate arched doorways and flickering brass oil lamps creating warm, amber-toned reflections.
  OUTPUT SPECIFICATIONS: High-resolution, regal, heritage-rich, and deeply atmospheric.
  `,

  `
  TASK: Generate an ultra-realistic, minimalist product-focused beauty portrait for the provided jewelry.
  CRITICAL RULE: The jewelry is the sole focus and **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Stripped-back, raw beauty. Choose a model with a clean, striking look and a simple, pulled-back hairstyle to avoid distraction. The shot is a tight crop focusing on the jewelry against the model's skin. 
  LIGHTING & ATMOSPHERE: Clean, volumetric light that reveals every detail of the jewelry. The background is a soft, seamless gradient that makes the product pop.
  QUALITY CONTROL: Absolutely NO visible light stands, softboxes, or technical equipment. Pure product focus.
  `,

  `
  TASK: Generate an ultra-realistic, rain-drenched editorial portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: The jewelry from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw it. Its design and gemstone colors are fixed.
  MODEL & STYLE: A striking woman with wet, slicked-back dark hair, dramatic smoky eyes, and nude lips. Her skin glistens with water droplets. She wears a sheer, dark-toned blouse. The jewelry stands out vividly against the wet, moody aesthetic.
  BACKGROUND & ATMOSPHERE: A dark urban rooftop at night during a light rain. City lights create beautiful bokeh and reflections on wet surfaces.
  OUTPUT SPECIFICATIONS: High-resolution, dramatic, edgy, and fashion-forward.
  `,

  `
  TASK: Generate an ultra-realistic, bohemian sunset portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: You **MUST** use the jewelry from the user's image with **ZERO ALTERATIONS**. Do not change its design, materials, or colors.
  MODEL & STYLE: A free-spirited woman with long, loose windswept hair, freckled skin, and warm earth-toned makeup. She wears a flowing rust-orange maxi dress with delicate crochet detailing. She gazes softly at the horizon.
  BACKGROUND & ATMOSPHERE: An open desert landscape at golden hour, with warm amber and magenta hues painting the sky. Soft wind creates gentle movement in her hair and dress.
  OUTPUT SPECIFICATIONS: High-resolution, warm, romantic, and free-spirited.
  `,

  `
  TASK: Generate an ultra-realistic Art Deco noir portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: The jewelry from the provided image is the centerpiece and **MUST NOT BE CHANGED**. Its original design, materials, and gemstone colors must be preserved with perfect accuracy.
  MODEL & STYLE: A woman with a sleek finger-wave hairstyle, porcelain skin, sharp winged eyeliner, and deep oxblood lips. She wears a slinky black silk bias-cut dress reminiscent of 1930s glamour. She holds a long vintage cigarette holder (unlit) for dramatic effect.
  BACKGROUND & ATMOSPHERE: An Art Deco interior with geometric gold and black patterns, mirrored surfaces, and dramatic shadows. The mood is mysterious and ultra-glamorous.
  OUTPUT SPECIFICATIONS: High-resolution, noir, retro-glamorous, and theatrical.
  `,

  `
  TASK: Generate an ultra-realistic winter luxury portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: It is absolutely essential that the jewelry from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter any detail whatsoever.
  MODEL & STYLE: An elegant woman with soft, voluminous curls, rosy cheeks from the cold, and natural pink-toned makeup. She wears a sumptuous cream-white faux fur coat draped over her shoulders, partially revealing the jewelry against her skin.
  BACKGROUND & ATMOSPHERE: A snowy winter scene — perhaps a frost-covered garden or a snow-dusted European street. The soft, diffused winter light creates a luminous, ethereal quality.
  OUTPUT SPECIFICATIONS: High-resolution, ethereal, cozy yet luxurious winter elegance.
  `,

  `
  TASK: Generate an ultra-realistic Mediterranean terrace portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: The jewelry from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter its design, metal, or gemstone colors. It is a fixed, unchangeable element.
  MODEL & STYLE: A sophisticated woman with a chic French bob hairstyle, sun-kissed olive skin, classic red lipstick, and a crisp white button-down shirt with the collar open. The jewelry is prominently displayed. She sits at a small café table holding an espresso cup.
  BACKGROUND & ATMOSPHERE: A sunlit Mediterranean terrace overlooking the sea, with whitewashed stone walls and trailing bougainvillea. Bright, clear, natural daylight.
  OUTPUT SPECIFICATIONS: High-resolution, chic, effortlessly sophisticated European style.
  `,

  `
  TASK: Generate an ultra-realistic haute couture runway-inspired portrait of a woman wearing the provided jewelry.
  CRITICAL RULE: You **MUST** use the jewelry from the user's image with **ZERO ALTERATIONS**. Do not change its design, materials, or the color of its gemstones. It must be presented exactly as provided.
  MODEL & STYLE: A high-fashion model with an avant-garde sculptural updo, bold geometric makeup with metallic accents, and dramatic lashes. She wears an architectural, structured black couture gown with exaggerated shoulders. The jewelry is the focal point of the look.
  BACKGROUND & ATMOSPHERE: A stark, dramatic runway environment with intense spotlights from above creating sharp shadows and a pool of light on the model.
  OUTPUT SPECIFICATIONS: High-resolution, avant-garde, high-fashion editorial perfection.
  `
];

// --- PURSE PROMPTS ---
const PURSE_COVER_PROMPT = `
TASK: Create a masterful, high-end editorial product stage for a women's purse.
CRITICAL RULE: Use the **exact purse** from the provided image. **DO NOT ALTER THE PURSE IN ANY WAY.**
SCENE & ATMOSPHERE: Study the purse's material, color, and style (luxury, casual, vintage). Build a sophisticated, minimalist stage that elevates this specific product. Use high-end textures like polished marble, architectural surfaces, or soft bokeh boutique interiors.
LIGHTING: Volumetric, directional light that flawlessly sculpts the purse's form and highlights its material texture and hardware.
QUALITY CONTROL: NO visible camera equipment, light stands, or technical artifacts. The result must be a clean, premium advertisement.
`;

const PURSE_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, high-fashion "Daylight Luxury" editorial for the purse.
  CRITICAL RULE: The purse **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: "Urban Sophistication". Choose a model archetype and chic outfit (e.g., a trench coat, silk midi skirt, or tailored separates) that suits the purse's style. The setting is a sun-drenched city street, a boutique storefront, or a cafe terrace. The model carries the purse naturally and confidently.
  LIGHTING: Bright, natural-feeling daylight with soft, flattering shadows.
  QUALITY CONTROL: Zero visible cameras or equipment. A clean, premium lifestyle shot.
  `,
  `
  TASK: Generate a cinematic, ultra-realistic medium shot of a woman at an elegant event, showcasing the provided purse.
  CRITICAL RULE: The purse must be used **EXACTLY AS IS**.
  DYNAMIC DIRECTION: "Evening Sophistication". Choose a model with an elegant, refined look and an upscale evening outfit (silk dress, sequined gown, or chic separates) that pairs beautifully with the purse. The pose should be graceful, holding the purse naturally.
  LIGHTING & ATMOSPHERE: Atmospheric, low-key lighting in a luxurious venue. Soft highlights should define the model and the purse. 
  QUALITY CONTROL: No visible photographers or flashes. Pure nighttime glamour.
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
  `,

  `
  TASK: Generate an ultra-realistic travel lifestyle photo of a woman at an international airport terminal, carrying the provided purse.
  CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter its design, material, color, or hardware.
  MODEL & STYLE: A chic woman in a comfortable yet stylish travel outfit — a cream cashmere sweater, fitted dark jeans, and ankle boots. She walks through a bright, modern terminal with the purse on her shoulder, pulling a small carry-on behind her.
  BACKGROUND & ATMOSPHERE: A contemporary airport terminal with large glass windows showing aircraft on the tarmac. Natural daylight floods the space. The background is slightly blurred for depth.
  OUTPUT SPECIFICATIONS: High-resolution, aspirational, jet-setter lifestyle.
  `,

  `
  TASK: Generate an ultra-realistic, top-down flat-lay photo centered on the provided purse.
  CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**, without any modifications. It is the hero of the composition.
  MODEL & STYLE: The purse is the centerpiece of a carefully styled flat-lay arrangement. Around it are complementary lifestyle items — a pair of sunglasses, a lipstick, a small notebook, a fresh flower, and a delicate watch — all arranged artistically on a clean marble surface.
  BACKGROUND & ATMOSPHERE: A bright, airy overhead shot with soft, even lighting that creates minimal shadows. Clean and editorial.
  OUTPUT SPECIFICATIONS: High-resolution, trendy, Instagram-worthy flat-lay composition.
  `,

  `
  TASK: Generate an ultra-realistic, moody evening photo of a woman walking in the rain with the provided purse.
  CRITICAL RULE: You **MUST** use the purse from the user's image with **ZERO ALTERATIONS**. Do not change its design, materials, or color.
  MODEL & STYLE: A sophisticated woman in a sleek black trench coat and heels, holding a transparent umbrella. The purse is tucked under her arm or held by a top handle, visible and prominent. Her expression is serene and confident.
  BACKGROUND & ATMOSPHERE: A rain-slicked city street at dusk, with warm golden lights from shop windows reflecting on wet pavement. Neon signs create colorful bokeh in the background.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, atmospheric, and romantic.
  `,

  `
  TASK: Generate an ultra-realistic luxury beach resort photo of a woman with the provided purse.
  CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**. Do not alter its design, color, or any detail.
  MODEL & STYLE: An elegant woman in a flowing white cover-up and wide-brimmed straw hat, walking along a pristine white sand beach. The purse is held naturally by her side, complementing the resort-chic look.
  BACKGROUND & ATMOSPHERE: A stunning tropical beach with turquoise water, swaying palm trees, and a pristine blue sky. Warm, golden sunlight bathes the scene.
  OUTPUT SPECIFICATIONS: High-resolution, vacation-luxury, aspirational and tropical.
  `,

  `
  TASK: Generate an ultra-realistic photo of a woman browsing art in a modern gallery, carrying the provided purse.
  CRITICAL RULE: The purse from the user's image **MUST NOT BE CHANGED**. Its original design, materials, and hardware must be preserved with perfect accuracy.
  MODEL & STYLE: A cultured woman in a minimalist black turtleneck dress, standing contemplatively before a large abstract painting. The purse is held elegantly in the crook of her arm, positioned as a statement accessory.
  BACKGROUND & ATMOSPHERE: A spacious, well-lit modern art gallery with white walls and polished concrete floors. The focus is on the woman and the purse, with the artwork providing a colorful, blurred backdrop.
  OUTPUT SPECIFICATIONS: High-resolution, intellectual, sophisticated, and gallery-chic.
  `,

  `
  TASK: Generate an ultra-realistic urban cycling lifestyle photo featuring the provided purse.
  CRITICAL RULE: The purse must be used **WITHOUT ANY MODIFICATION** to its design, color, or hardware.
  MODEL & STYLE: A trendy young woman in a striped Breton top, culottes, and ballet flats, standing beside a classic pastel-colored vintage bicycle on a charming cobblestone street. The purse is placed in the bicycle's front basket or slung across her body.
  BACKGROUND & ATMOSPHERE: A picturesque European side street with charming storefronts, flower boxes, and dappled sunlight filtering through trees.
  OUTPUT SPECIFICATIONS: High-resolution, charming, youthful, and effortlessly stylish.
  `,

  `
  TASK: Generate an ultra-realistic autumn lifestyle photo of a woman walking through a park, carrying the provided purse.
  CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter any aspect of it.
  MODEL & STYLE: A woman in a cozy camel-colored wool coat, a plaid scarf, and leather boots, walking along a path covered in golden and amber fallen leaves. She carries the purse by its handles or over her shoulder, looking relaxed and content.
  BACKGROUND & ATMOSPHERE: A beautiful autumnal park with trees in full fall color — reds, oranges, and golds. Soft, warm afternoon light filters through the canopy.
  OUTPUT SPECIFICATIONS: High-resolution, warm, seasonal, and inviting.
  `,

  `
  TASK: Generate an ultra-realistic, premium product display photo of the provided purse in a luxury boutique window.
  CRITICAL RULE: You **MUST** use the purse from the user's image with **ZERO ALTERATIONS**. It must be presented exactly as provided.
  MODEL & STYLE: The purse is the sole subject, elegantly displayed on a velvet-lined pedestal inside a high-end boutique window. It is flanked by subtle decorative elements — a single orchid stem, a small crystal ornament, or draped silk ribbon.
  BACKGROUND & ATMOSPHERE: A dimly lit, luxurious boutique interior visible behind the glass, with soft, focused spotlighting directed at the purse, making it glow against the muted background.
  OUTPUT SPECIFICATIONS: High-resolution, ultra-premium, visually luxurious retail display.
  `,

  `
  TASK: Generate an ultra-realistic, glamorous rooftop party photo of a woman with the provided purse.
  CRITICAL RULE: The purse from the provided image must be used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter its appearance in any way.
  MODEL & STYLE: A glamorous woman in a sequined mini dress, strappy heels, and statement earrings, laughing and socializing at a chic rooftop party. She holds the purse as a clutch or by a short handle, making it a key part of her nightlife look.
  BACKGROUND & ATMOSPHERE: A vibrant rooftop party setting at night with string lights, a city skyline glittering in the background, and warm ambient lighting from lanterns and candles.
  OUTPUT SPECIFICATIONS: High-resolution, vibrant, social, and nightlife-glamorous.
  `,
    
  `
  TASK: Generate an ultra-realistic vintage-inspired editorial photo of a woman with the provided purse at a flea market.
  CRITICAL RULE: The purse from the user's image must be used **EXACTLY AS IS**. It is a fixed, unchangeable element.
  MODEL & STYLE: A stylish woman in a vintage-inspired outfit — high-waisted wide-leg trousers, a polka-dot blouse tied at the waist, and retro cat-eye sunglasses. She browses curiosities at an outdoor vintage market, with the purse held casually in one hand.
  BACKGROUND & ATMOSPHERE: A bustling, colorful outdoor flea market with antique stalls, flowerpots, and bunting. Warm, natural daylight creates an inviting, nostalgic atmosphere.
  OUTPUT SPECIFICATIONS: High-resolution, retro-chic, characterful, and editorial.
  `
];

// --- PERFUME PROMPTS ---
const PERFUME_COVER_PROMPT = `
TASK: Create a masterful, high-end editorial product stage for a women's perfume bottle.
CRITICAL RULE: Use the **exact perfume bottle** from the provided image **WITHOUT A SINGLE ALTERATION**.
SCENE & ATMOSPHERE: Study the bottle's design (floral, minimalist, avant-garde). Build a sophisticated, evocative world around it. Use premium elements like silk drapes, floating flower petals, architectural glass, or reflecting water pools. The background should be a deeply blurred, high-fashion environment.
LIGHTING: Ethereal, volumetric light that creates a "glow" from within the bottle. Use soft highlights and luminous shadows to define the glass and liquid.
QUALITY CONTROL: NO visible camera gear, light stands, or technical equipment. Pure luxury advertisement.
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
  TASK: Generate an ultra-realistic close-up shot of a model's hands elegantly holding the provided perfume bottle.
  CRITICAL RULE: The perfume bottle is the focus and **MUST NOT BE CHANGED**. Its original design and label must be preserved with perfect accuracy. Treat it as an unchangeable object.
  MODEL & STYLE: A woman with flawless skin and a perfect, clean, neutral-colored manicure holds the bottle delicately. She is wearing the sleeve of a cream-colored silk blouse. The shot is tightly cropped to focus on the interaction between the hands and the bottle.
  LIGHTING & BACKGROUND: Soft, diffused studio lighting. The background is simple, out-of-focus, and non-distracting.
  OUTPUT SPECIFICATIONS: Graceful, sophisticated, and tactile, highlighting the product's elegance.
  `,
  `
  TASK: Create a masterful, ultra-realistic "Liquid Essence" fragrance advertisement.
  CRITICAL RULE: The perfume bottle must be used **WITHOUT ANY MODIFICATION**.
  DYNAMIC DIRECTION: Study the bottle's design. Surround it with artistic, dynamic elements like swirling perfume mist, crystalline water ripples, or floating botanical fragments that match its "scent soul" (e.g., woody, floral, fresh).
  LIGHTING & ATMOSPHERE: Ethereal, volumetric lighting. A deep, blurred background of a luxury lab or a moonlit garden.
  QUALITY CONTROL: NO visible studio gear, light stands, or camera artifacts. Pure sensory storytelling.
  `,
  `
  TASK: Generate an ultra-realistic, abstract photo featuring the provided perfume bottle with fabric and light play.
  CRITICAL RULE: It is absolutely essential that the perfume bottle from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter it in any way. The bottle must be an exact copy of the one in the user's image.
  SCENE & STYLE: The bottle is lying on its side, partially enveloped in a swirl of translucent, flowing chiffon fabric. Rays of light cut through the scene, creating beautiful caustic reflections on and through the bottle and fabric.
  BACKGROUND & ATMOSPHERE: Dark and moody, focusing entirely on the interplay of light, texture, and the bottle's form.
  OUTPUT SPECIFICATIONS: High-resolution, artistic, and visually striking.
  `,
  `
  TASK: Create a high-end, ultra-realistic fashion beauty portrait of a woman tenderly kissing the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the provided image must be used **WITHOUT ANY MODIFICATION**. Do not redraw it, change its label, or alter it in any way. The bottle must appear exactly as in the user’s photo.
  MODEL & STYLE: A sophisticated, modern woman with impeccable runway-style makeup—flawless luminous skin, subtly sculpted cheekbones, soft smoky eyes, and deep matte red lips. She closes her eyes in serene bliss as she gently kisses the bottle, conveying pure love for the fragrance. Her hair is styled in a sleek low chignon or loose glossy waves for a contemporary editorial look.
  WARDROBE & ACCESSORIES: Minimal yet luxurious—think a black silk slip dress, delicate diamond studs, or a single thin gold choker to emphasize elegance without distraction.
  LIGHTING & ATMOSPHERE: Clean, cinematic lighting with a gentle rim light to outline her silhouette and a soft golden key light to highlight her lips and the bottle’s glass. Background is a smooth, dark gradient or blurred warm bokeh to keep the focus entirely on her and the perfume.
  COMPOSITION & MOOD: Tight beauty framing from shoulders up. The kiss is intimate but classy, conveying modern sophistication and sensual appreciation rather than overt glamour.
  OUTPUT SPECIFICATIONS: High-resolution, magazine-cover quality, ideal for a luxury fragrance advertising campaign—minimalist, elegant, and timeless.
  `,

  `
  TASK: Generate an ultra-realistic, high-fashion fragrance campaign featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: "Scent of Elegance". Choose a model with a radiant, sophisticated look. Select a flowing, ethereal outfit (like a tulle gown or silk scarf) that suggests movement and fragrance. The model's interaction with the bottle should feel intimate and artistic.
  LIGHTING & ATMOSPHERE: Soft, diffused daylight or golden-hour glow. A lush, blurred floral garden or a sun-drenched luxury interior.
  QUALITY CONTROL: Zero visible cameras or equipment. Focus on pure sensory allure.
  `,
  `
  TASK: Generate an ultra-realistic, spring garden editorial photo featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter, modify, or redraw the bottle.
  SCENE & STYLE: The bottle is placed on a mossy stone surface in a lush English garden. Fresh dew drops are visible on surrounding petals. Blooming roses, lavender, and jasmine frame the bottle naturally, as though the fragrance itself emerged from the garden.
  LIGHTING & ATMOSPHERE: Soft, early morning golden light with a gentle haze. The mood is fresh, romantic, and natural.
  OUTPUT SPECIFICATIONS: High-resolution, organic, romantic garden aesthetic — ideal for a spring fragrance launch campaign.
  `,

  `
  TASK: Generate an ultra-realistic Art Deco still life featuring the provided perfume bottle in a glamorous vintage setting.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED** in any way — shape, label, cap, and liquid color must remain exactly as provided.
  SCENE & STYLE: The bottle sits on a polished brass tray alongside a crystal ashtray, a strand of pearls, and a vintage compact mirror on a lacquered black surface. The scene evokes 1920s opulence.
  LIGHTING & ATMOSPHERE: Warm, amber-toned directional light from the side. Deep shadows and bright specular highlights on glass and metal surfaces. The mood is timeless and decadent.
  OUTPUT SPECIFICATIONS: High-resolution, luxurious, vintage-inspired still life.
  `,

  `
  TASK: Generate an ultra-realistic, surreal underwater-inspired photo featuring the provided perfume bottle.
  CRITICAL RULE: You **MUST** use the perfume bottle from the user's image with **ZERO ALTERATIONS**. It must appear exactly as provided.
  SCENE & STYLE: The bottle appears suspended in a dreamlike underwater scene. Streams of tiny bubbles rise around it, and soft floating fabric and delicate jellyfish-like shapes drift in the background. The bottle is the sharp, clear focal point amidst the soft, ethereal elements.
  LIGHTING & ATMOSPHERE: Cool, aquamarine-blue tones with soft caustic light patterns dancing across the bottle's surface. The mood is mysterious, magical, and otherworldly.
  OUTPUT SPECIFICATIONS: High-resolution, fantastical, high-fashion editorial — a conceptual fragrance campaign visual.
  `,

  `
  TASK: Generate an ultra-realistic Parisian café scene with the provided perfume bottle as a lifestyle accessory.
  CRITICAL RULE: The perfume bottle from the provided image must be used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter it in any way.
  SCENE & STYLE: The bottle sits on a small round marble café table beside an espresso cup, a croissant on a plate, and a folded French newspaper. A woman's hand with a delicate gold bracelet reaches towards the bottle. Only her hand and wrist are visible.
  LIGHTING & ATMOSPHERE: Warm, natural Parisian morning light streaming through a café window. The ambiance is intimate, cultured, and effortlessly sophisticated.
  OUTPUT SPECIFICATIONS: High-resolution, lifestyle-driven, aspirational French chic.
  `,

  `
  TASK: Generate an ultra-realistic, botanical floral wreath product photo centered on the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter its design, shape, or label.
  SCENE & STYLE: The bottle stands upright at the center of a meticulously arranged circular wreath of fresh flowers and botanicals — peonies, eucalyptus, dried lavender, small berries, and delicate ferns. The arrangement is on a clean, light linen surface.
  LIGHTING & ATMOSPHERE: Bright, airy, overhead natural light. The mood is fresh, feminine, and artisanal.
  OUTPUT SPECIFICATIONS: High-resolution, clean, Instagram-ready product styling.
  `,

  `
  TASK: Generate an ultra-realistic, dramatic theater-inspired portrait of a woman holding the provided perfume bottle.
  CRITICAL RULE: The perfume bottle **MUST NOT BE CHANGED**. Its original design and label must be preserved with perfect accuracy.
  MODEL & STYLE: A dramatic woman in a deep burgundy velvet opera gown with elbow-length satin gloves. Her makeup is theatrical — bold red lips, sculpted cheekbones, and classic Hollywood eyeliner. She holds the bottle against her cheek with closed eyes, as if savoring the scent.
  BACKGROUND & ATMOSPHERE: A lavish theater box with plush red velvet curtains and soft, warm spotlights. The background is rich and dark.
  OUTPUT SPECIFICATIONS: High-resolution, theatrical, opulent, and dramatically glamorous.
  `,

  `
  TASK: Generate an ultra-realistic tropical sunset product photo featuring the provided perfume bottle.
  CRITICAL RULE: You **MUST** use the perfume bottle from the user's image with **ZERO ALTERATIONS**. Do not change its shape, label, or liquid color.
  SCENE & STYLE: The bottle is placed on a smooth, sun-warmed driftwood piece on a tropical beach at sunset. Soft waves lap in the far background. Exotic flowers — plumeria and hibiscus — are scattered naturally around the base of the bottle.
  LIGHTING & ATMOSPHERE: Rich, warm golden-hour lighting with vivid orange and pink sky hues reflecting off the bottle's glass surface.
  OUTPUT SPECIFICATIONS: High-resolution, warm, vacation-inspired, and premium summer fragrance aesthetic.
  `,

  `
  TASK: Generate an ultra-realistic, cozy winter fireside photo featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the provided image must be used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter any detail.
  SCENE & STYLE: The bottle sits on a polished mahogany side table beside a crackling fireplace. Next to it are a cashmere throw, a vintage leather-bound book, and a small glass of amber-colored brandy. A woman's hand in a soft knit sleeve reaches to pick up the bottle.
  LIGHTING & ATMOSPHERE: Warm, flickering firelight combined with soft ambient lamplight. The mood is luxurious, intimate, and wintry.
  OUTPUT SPECIFICATIONS: High-resolution, rich, warm-toned winter luxury lifestyle.
  `,

  `
  TASK: Generate an ultra-realistic, reflective mirror composition featuring the provided perfume bottle.
  CRITICAL RULE: The perfume bottle from the user's image must be used **EXACTLY AS IS**. It must appear identical in both the direct view and the reflection.
  SCENE & STYLE: The bottle stands on a large, rectangular vanity mirror lying flat on a dark surface. The reflection creates a symmetrical, kaleidoscopic effect. A few scattered rose petals and a single lit candle add subtle elements of romance and warmth.
  LIGHTING & ATMOSPHERE: Moody, low-key lighting with the candle providing a soft warm glow. Sharp highlights reflect off the mirror and the bottle's glass.
  OUTPUT SPECIFICATIONS: High-resolution, artistic, minimalist, and visually sophisticated.
  `
];

// --- APPAREL PROMPTS ---
const APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, pinnacle-fashion editorial of a female model wearing the provided garment in a poised, static position.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact garment** from the provided image **WITHOUT A SINGLE ALTERATION**. Design, color, pattern, texture, and fit must be perfectly preserved. Do NOT add any new trails, features, or stylistic additions to the cloth.
DYNAMIC DIRECTION: Study the garment's character (bridal, streetwear, ethnic, couture). Select a model archetype, age, styling, and a strong, static pose that perfectly match the product's soul. Build a world that THIS garment belongs to — avoid generic setups.
LIGHTING & ATMOSPHERE: High-fashion, volumetric illumination tailored to the garment's texture. Use light to sculpt the drape and fabric realistically.
QUALITY CONTROL: NO visible camera gear, light stands, seamless paper rolls, or photographers. 
`;

const APPAREL_PHOTO_PROMPTS = [
  `
  TASK: Generate a poised, ultra-realistic fashion editorial of a woman wearing the provided garment in a static position.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**. Do not alter the cloth or add new trails.
  DYNAMIC DIRECTION: Create a high-stakes, unique scene suited to the garment's aesthetic (e.g., an urban rooftop, a wild coastline, a brutalist staircase, or a lush botanic conservatory). Choose a model whose look and energy amplify the garment's character. The pose should be poised, static, and editorial.
  LIGHTING: Cinematic, non-technical illumination. Use natural or atmospheric light to create depth.
  QUALITY CONTROL: Zero technical artifacts. No equipment or gear visible.
  `,
  `
  TASK: Generate an ultra-realistic lifestyle photo of a woman wearing the provided garment in a relaxed, static pose.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture. Keep it exactly as per the image.
  DYNAMIC DIRECTION: Invent a lifestyle moment that feels naturally connected to this specific garment — a garden brunch, a city evening, a rooftop, a bookshop, a beach walk, a cultural venue, or any setting where someone wearing this piece would feel at home. The model's appearance, expression, and pose should feel real and poised — never generic or formulaic. Lighting and color palette should be chosen to harmonize with the product.
  OUTPUT SPECIFICATIONS: High-end, aspirational lifestyle photography. The image should feel like a poised editorial portrait, not a candid shoot.
  `,
  `
  TASK: Generate a dramatic, ultra-realistic close-up or medium shot that highlights the details of the provided clothing item.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** — preserve its original fabric texture, pattern, construction details, and color with perfect accuracy.
  DYNAMIC DIRECTION: Choose a creative crop and angle that best reveals the garment's most captivating features — embroidery, drape, print, texture, seams, or cut. The model's visible body part should be positioned in an artistically considered way. Lighting should be purposeful and directional, sculpting the fabric's surface realistically. The background tone should be chosen specifically to make this garment's colors and details pop.
  OUTPUT SPECIFICATIONS: High-fashion, sharp focus on the garment. Each generation of this shot should have a distinct feel and mood.
  `,
  `
  TASK: Generate an ultra-realistic, sophisticated portrait of a model wearing the provided garment in a strong, static pose.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit. Integrity of the clothing is absolute.
  DYNAMIC DIRECTION: Create a scene that feels right for this specific garment's character. The pose should be dignified and static — a strong stance, a thoughtful lean, or a poised look. The location and atmosphere should be immersive and vivid — avoid generic white studios. Think creatively: a sunlit courtyard, a breezy hillside, a colorful market, a grand staircase. The model's expression should feel poised and present.
  OUTPUT SPECIFICATIONS: High-resolution, cinematic, elegant, and static. A visually striking image that makes the garment feel desirable.
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
  `,

  `
  TASK: Generate an ultra-realistic, heritage-inspired cultural portrait of a woman wearing the provided garment.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS** — no alterations to design, color, pattern, texture, or fit.
  DYNAMIC DIRECTION: If the garment has ethnic or traditional roots, embrace that lineage — place the model in a setting that honors the garment's cultural world (a Rajasthani haveli, a Japanese zen garden, a Moroccan riad). If the garment is modern, place her in a culturally rich setting that creates an intriguing contrast. The model's jewelry, makeup, and hairstyle should be carefully chosen to complement the garment's heritage.
  ATMOSPHERE: Warm, rich colors and textures. Lighting should be cinematic with a golden or amber tone.
  OUTPUT SPECIFICATIONS: High-resolution, culturally rich, and deeply atmospheric.
  `,

  `
  TASK: Generate an ultra-realistic, golden hour silhouette and detail photo of a woman wearing the provided garment.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: Capture the model at golden hour — either as a stunning backlit silhouette that shows the garment's drape and shape, or with sunlight streaming across her body to illuminate the fabric's texture and color. The pose should be graceful and elongated, emphasizing the garment's flow.
  ATMOSPHERE: Warm, golden light with long shadows. The location should be open and expansive — a field, a rooftop, or a shoreline.
  OUTPUT SPECIFICATIONS: High-resolution, warm, dramatic, and poetic.
  `,

  `
  TASK: Generate an ultra-realistic, rainy city editorial photo of a woman wearing the provided garment in a static position.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** — preserve its original design, color, pattern, and texture perfectly. Do not add any new fabric trails or alterations.
  DYNAMIC DIRECTION: The model stands confidently on a rain-soaked city street. The wet pavement creates beautiful reflections. She may carry a transparent umbrella or let the light add to the drama. The garment should be styled to look intentional in this weather — showing the model's confidence. The pose is static, showcasing the garment's fit.
  ATMOSPHERE: Moody, cinematic, with a cool blue-grey color palette accented by warm shop-window light. The city is atmospheric and alive.
  OUTPUT SPECIFICATIONS: High-resolution, editorial, dramatic, and static.
  `,

  `
  TASK: Generate an ultra-realistic, seated portrait photo of a woman wearing the provided garment.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit.
  DYNAMIC DIRECTION: The model is seated in an interesting, character-filled setting — a velvet antique chair, a modern art-filled café, a stone garden bench, or a vintage motorcycle sidecar. The seated pose should naturally showcase how the garment falls, drapes, and fits when the wearer is at rest. Expression should be contemplative, warm, or quietly confident.
  ATMOSPHERE: Thoughtful composition with the environment adding personality.
  OUTPUT SPECIFICATIONS: High-resolution, artistic, intimate portrait photography.
  `,

  `
  TASK: Generate an ultra-realistic, layered styling editorial of a woman wearing the provided garment.
  CRITICAL RULE: The clothing item from the user's image must be used **EXACTLY AS IS**. It is a fixed, unchangeable element.
  DYNAMIC DIRECTION: Style the garment as part of a layered look — add a complementary jacket, scarf, belt, or outer piece that enhances the outfit without hiding the garment. The model should appear to be a real person with personal style, not a mannequin. Show how the garment integrates into a complete, fashion-forward outfit.
  ATMOSPHERE: A stylish urban environment — a concept store, a design district, or a modern loft. Clean, bright lighting.
  OUTPUT SPECIFICATIONS: High-resolution, editorial, showing real-world styling versatility.
  `,

  `
  TASK: Generate a minimalist, high-end "Sculptural Fashion" editorial of a woman wearing the garment.
  CRITICAL RULE: Preserve the garment perfectly.
  DYNAMIC DIRECTION: Focused, artistic, and clean. Use a model with a striking, statuesque look. The background is a sophisticated, textured solid (like plaster, raw concrete, or deep velvet) that complements the garment's color. The lighting should be sharp and directional to define the garment's silhouette.
  QUALITY CONTROL: NO visible studio equipment, paper rolls, or light stands. Pure minimalist excellence.
  `,

  `
  TASK: Generate an ultra-realistic, minimalist studio editorial photo of a woman wearing the provided garment.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED** in any way.
  DYNAMIC DIRECTION: A clean, stark studio shot that strips everything away and puts the garment on a pedestal. The model stands or poses against a seamless solid background (white, light grey, or a single bold color chosen to complement the garment). The pose is strong and editorial. Makeup is clean, hair is simple.
  ATMOSPHERE: Pure, undistracted focus on the garment's design, color, and silhouette. Lighting is precise and professional.
  OUTPUT SPECIFICATIONS: High-resolution, minimalist, powerful, gallery-quality fashion photography.
  `,

  `
  TASK: Generate an ultra-realistic beach or resort lifestyle photo of a woman wearing the provided garment in a static pose.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION** to its design, color, pattern, or fit.
  DYNAMIC DIRECTION: The model is in a luxury resort or beach setting — standing along the shore, lounging by an infinity pool, or standing on a sun-drenched terrace. The garment should feel perfect for the setting. Her styling includes minimal accessories — perhaps a straw hat, sandals, or delicate gold jewelry. The pose is static and relaxed.
  ATMOSPHERE: Bright, airy, sun-drenched. Vivid blues, whites, and warm skin tones. The mood is relaxed luxury.
  OUTPUT SPECIFICATIONS: High-resolution, aspirational vacation-wear photography.
  `,

  `
  TASK: Generate an ultra-realistic, architectural staircase editorial photo of a woman wearing the provided garment in a poised position.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS** — no alterations whatsoever.
  DYNAMIC DIRECTION: The model poses on a grand, visually striking staircase — marble, spiral, geometric, or ornate iron. The architecture becomes a dramatic backdrop that frames her and the garment. The pose is poised, static, and regal. The garment's full length and silhouette should be visible.
  ATMOSPHERE: Grand, architectural, and editorial. Lighting creates dramatic shadows from the staircase's structure.
  `,
  `
  TASK: Generate an ultra-realistic, vibrant market or bazaar editorial photo of a woman wearing the provided garment in a static pose.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS** to its design, color, or texture.
  DYNAMIC DIRECTION: The model stands within a colorful, bustling market — perhaps a spice souk, a flower market, or a textile bazaar. The rich colors and textures of the market complement and frame the garment beautifully. The model is poised, browsing, or interacting statically with the vibrant surroundings.
  ATMOSPHERE: Rich, saturated colors. Warm, natural light mixed with the market's ambient glow. The mood is adventurous and culturally immersive.
  OUTPUT SPECIFICATIONS: High-resolution, vibrant, story-driven, and culturally evocative.
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
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic, contemporary fashion portrait of a woman wearing the provided ${name} with a modern power suit.
  CRITICAL RULE: The ${name} from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter its design, materials, gemstones, or metal in any way.
  MODEL & STYLE: A confident woman with a slicked-back bun, sharp contoured makeup, and sculpted brows. She wears a tailored ivory blazer showcasing the ${name} against bare skin. Her expression is intense and authoritative.
  BACKGROUND & ATMOSPHERE: A sleek, modern penthouse interior with floor-to-ceiling windows showing a twilight cityscape.
  OUTPUT SPECIFICATIONS: High-resolution, editorial, powerful, and contemporary.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic tropical luxury portrait of a woman adorned with the provided ${name}.
  CRITICAL RULE: The ${name} from the user's image must be used **EXACTLY AS IS**, without any modifications to its design, materials, or gemstone colors.
  MODEL & STYLE: A radiant woman with sun-kissed skin, beachy textured waves, and dewy natural makeup. She wears a flowing white linen off-shoulder dress. The ${name} catches natural sunlight beautifully.
  BACKGROUND & ATMOSPHERE: A luxurious overwater villa terrace with crystal-clear turquoise water visible behind her. Golden hour lighting creates a warm, dreamy glow.
  OUTPUT SPECIFICATIONS: High-resolution, aspirational, warm, and radiant luxury.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic, heritage-inspired portrait of an Indian woman in Mughal-era styling wearing the provided ${name}.
  CRITICAL RULE: You **MUST** use the ${name} from the user's image with **ZERO ALTERATIONS**. Do not change its design, materials, or gemstone colors.
  MODEL & STYLE: A regal woman with kohl-lined eyes, a decorative bindi, and deep berry-toned lips. Her hair is adorned with jasmine flowers. She wears a rich royal blue velvet kurta with gold zardosi embroidery.
  BACKGROUND & ATMOSPHERE: A dimly lit palatial marble corridor with ornate arched doorways and flickering brass oil lamps.
  OUTPUT SPECIFICATIONS: High-resolution, regal, heritage-rich, and deeply atmospheric.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic, high-fashion beauty portrait of a woman wearing the providing jewelry.
  CRITICAL RULE: The jewelry **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Study the jewelry's aesthetic (classic, modern, ethnic). Choose a model archetype and styling that perfectly complements the piece. The pose should be intimate and sophisticated, with an artistic focus on the jewelry's interaction with the skin and hair.
  LIGHTING: Cinematic, non-technical illumination. Soft, diffused highlights that capture the sparkle and texture.
  QUALITY CONTROL: NO visible camera gear, light stands, or studio artifacts. Pure luxury excellence.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic minimalist studio portrait focusing entirely on the provided ${name}.
  CRITICAL RULE: The ${name} from the user's image is the sole focus and **MUST NOT BE CHANGED**. Its design, materials, and gemstone colors must be preserved with absolute accuracy.
  MODEL & STYLE: A woman with flawless porcelain skin, minimal no-makeup makeup, and her hair pulled tightly back. Her shoulders are bare, and the shot is tightly cropped around the ${name}, her neck, and décolletage.
  BACKGROUND & ATMOSPHERE: A pure, seamless soft grey gradient background with clean studio lighting and a subtle rim light to make the ${name} sparkle.
  OUTPUT SPECIFICATIONS: High-resolution, minimalist, product-focused beauty shot.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic, rain-drenched editorial portrait of a woman wearing the provided ${name}.
  CRITICAL RULE: The ${name} from the user's image must be used **EXACTLY AS IS**. You **MUST NOT** alter or redraw it.
  MODEL & STYLE: A striking woman with wet, slicked-back dark hair, dramatic smoky eyes, and nude lips. Her skin glistens with water droplets. She wears a sheer, dark-toned blouse. The ${name} stands out vividly against the wet, moody aesthetic.
  BACKGROUND & ATMOSPHERE: A dark urban rooftop at night during light rain. City lights create beautiful bokeh and reflections.
  OUTPUT SPECIFICATIONS: High-resolution, dramatic, edgy, and fashion-forward.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic, bohemian sunset portrait of a woman wearing the provided ${name}.
  CRITICAL RULE: You **MUST** use the ${name} from the user's image with **ZERO ALTERATIONS**. Do not change its design, materials, or colors.
  MODEL & STYLE: A free-spirited woman with long windswept hair, freckled skin, and warm earth-toned makeup. She wears a flowing rust-orange maxi dress with crochet detailing. She gazes softly at the horizon.
  BACKGROUND & ATMOSPHERE: An open desert landscape at golden hour, with warm amber and magenta hues painting the sky.
  OUTPUT SPECIFICATIONS: High-resolution, warm, romantic, and free-spirited.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic Art Deco noir portrait of a woman wearing the provided ${name}.
  CRITICAL RULE: The ${name} from the provided image is the centerpiece and **MUST NOT BE CHANGED**. Its original design and gemstone colors must be preserved with perfect accuracy.
  MODEL & STYLE: A woman with a sleek finger-wave hairstyle, porcelain skin, sharp winged eyeliner, and deep oxblood lips. She wears a slinky black silk bias-cut dress reminiscent of 1930s glamour.
  BACKGROUND & ATMOSPHERE: An Art Deco interior with geometric gold and black patterns, mirrored surfaces, and dramatic shadows. The mood is mysterious and ultra-glamorous.
  OUTPUT SPECIFICATIONS: High-resolution, noir, retro-glamorous, and theatrical.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic winter luxury portrait of a woman wearing the provided ${name}.
  CRITICAL RULE: It is absolutely essential that the ${name} from the provided image is used **WITHOUT ANY MODIFICATION**. Do not redraw it or alter any detail.
  MODEL & STYLE: An elegant woman with soft curls, rosy cheeks, and natural pink-toned makeup. She wears a sumptuous cream-white faux fur coat draped over her shoulders, partially revealing the ${name} against her skin.
  BACKGROUND & ATMOSPHERE: A snowy winter scene — a frost-covered garden or a snow-dusted European street. Soft, diffused winter light creates an ethereal quality.
  OUTPUT SPECIFICATIONS: High-resolution, ethereal, cozy yet luxurious winter elegance.
  `,
  (name: string) => `
  TASK: Generate an ultra-realistic haute couture runway-inspired portrait of a woman wearing the provided ${name}.
  CRITICAL RULE: You **MUST** use the ${name} from the user's image with **ZERO ALTERATIONS**. Do not change its design, materials, or gemstone colors.
  MODEL & STYLE: A high-fashion model with an avant-garde sculptural updo, bold geometric makeup with metallic accents, and dramatic lashes. She wears an architectural, structured black couture gown. The ${name} is the focal point of the look.
  BACKGROUND & ATMOSPHERE: A stark, dramatic runway environment with intense spotlights from above creating sharp shadows and a pool of light on the model.
  OUTPUT SPECIFICATIONS: High-resolution, avant-garde, high-fashion editorial perfection.
  `
];

export const DYNAMIC_ORNAMENT_PROMPTS_CONFIG = {
  coverPrompt: DYNAMIC_ORNAMENT_COVER_PROMPT,
  photoPrompts: DYNAMIC_ORNAMENT_PHOTO_PROMPTS
};
