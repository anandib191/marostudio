// --- APPAREL PROMPTS ---
const APPAREL_COVER_PROMPT = `
TASK: Generate an ultra-realistic, joyful fashion editorial of a child model wearing the provided garment in a poised, static position.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact garment** from the provided image **WITHOUT A SINGLE ALTERATION**. Design, color, pattern, texture, and fit must be perfectly preserved. Do NOT add any new trails or additions to the cloth.
DYNAMIC DIRECTION: Study the garment's character (playful, formal, school, seasonal). Select a child model archetype, age, expression, and a charming, static pose that perfectly match the product's spirit. Build a wholesome, imaginative world that THIS garment belongs to.
LIGHTING & ATMOSPHERE: Professional, soft fashion-grade illumination that creates a cheerful, vibrant, and natural mood.
QUALITY CONTROL: NO visible camera gear, light stands, studio umbrellas, or photographers. 
`;

const APPAREL_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, joyous "Nature Exploration" editorial of a child wearing the provided garment in a static position.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: "Poised Discovery". Choose a beautiful, sun-drenched outdoor setting (e.g., a flower meadow, a dappled forest path, or a coastal rockpool). The child's pose should be poised and static, focusing on the garment.
  LIGHTING: Vibrant, natural-feeling illumination.
  QUALITY CONTROL: Zero visible cameras or equipment. Focus on pure, unedited childhood magic.
  `,
  `
  TASK: Generate a poised, ultra-realistic "Playtime Portrait" of children wearing the provided garment in a static position.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Create a unique, heartwarming scene of friendship. Choose a diverse group of child models whose character matches the garment. The scene should feel like a captured moment of life in a static, poised arrangement.
  LIGHTING: Natural, bright, atmospheric illumination.
  QUALITY CONTROL: Zero technical artifacts. No equipment or gear visible.
  `,
  `
  TASK: Generate a dramatic, ultra-realistic "Artisan Detail" macro shot focusing on the provided garment.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Choose a charming, unconventional crop that highlights the garment's most beautiful detail (e.g., an embroidered patch, a wooden toggle, or a hand-stitched seam). Use a thin depth of field to make it feel tactile and precious.
  LIGHTING: Soft, directional light that grazes the texture.
  QUALITY CONTROL: NO visible technical artifacts.
  `,
  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment in a relaxed, cozy setting.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: A child sitting in a cozy armchair or a window nook, reading a picture book. Their expression is calm and engaged.
  BACKGROUND & ATMOSPHERE: A warm and inviting indoor setting, like a well-lit children's bedroom or library corner.
  OUTPUT SPECIFICATIONS: A sweet, peaceful image showing the comfort of the clothing.
  `,
  `
  TASK: Generate an ultra-realistic photo of a child standing by a playground swing or slide, wearing the provided garment.
  CRITICAL RULE: The garment must be used **EXACTLY AS IS**.
  MODEL & STYLE: A child poised near a playground structure, with a big smile or looking at the camera. The shot captures the delight of outdoor play in a static pose.
  BACKGROUND & ATMOSPHERE: A clean, modern playground. The image is clear and focused.
  OUTPUT SPECIFICATIONS: Fun, joyful, and static.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment, playing at the beach.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS**. Do not alter it in any way.
  MODEL & STYLE: A happy child building a sandcastle or collecting seashells on a bright sandy beach. Their expression is one of wonder and engagement. The garment moves naturally with their activity.
  BACKGROUND & ATMOSPHERE: A beautiful, sunny beach with gentle waves, clear blue sky, and warm golden light. The mood is carefree and summery.
  OUTPUT SPECIFICATIONS: High-resolution, sunny, aspirational beach lifestyle for children.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment, enjoying a garden picnic.
  CRITICAL RULE: The garment must be used with **ZERO ALTERATIONS**. It is a fixed element.
  MODEL & STYLE: A child seated on a checked picnic blanket in a lush garden, surrounded by healthy snacks, a juice box, and colorful fruit. They are mid-bite or laughing, looking completely natural and relaxed.
  BACKGROUND & ATMOSPHERE: A sunlit, green garden with flowers and butterflies. The lighting is soft, warm, and dreamy.
  OUTPUT SPECIFICATIONS: High-resolution, wholesome, and inviting.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment, standing in a school hallway.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**. Preserve its original design, color, and pattern.
  MODEL & STYLE: A confident, smiling child with a colorful backpack, standing in a bright, modern school hallway. Their pose is proud and happy. The garment looks perfect for a school day.
  BACKGROUND & ATMOSPHERE: A clean, modern school interior with lockers and bright walls. Natural daylight comes through large windows.
  OUTPUT SPECIFICATIONS: High-resolution, relatable, back-to-school lifestyle in a poised position.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment, standing in a rain puddle.
  CRITICAL RULE: You **MUST** use the garment from the user's image with **ZERO ALTERATIONS**. No new fabric trails.
  MODEL & STYLE: A child in colorful rain boots standing in a puddle on a rainy day, wearing the provided garment. Their face shows pure excitement and delight. The pose is static and poised.
  BACKGROUND & ATMOSPHERE: A rain-wet suburban street or park path with reflections in the puddles. Overcast but bright sky.
  OUTPUT SPECIFICATIONS: High-resolution, full of childhood joy, and static.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment at a birthday party.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: An excited child at a decorated birthday party table, surrounded by balloons, streamers, and a beautiful cake with candles. They are about to blow out candles or clapping with delight. The garment fits the festive occasion perfectly.
  BACKGROUND & ATMOSPHERE: A colorfully decorated room with bunting, confetti, and warm, cheerful lighting. The mood is celebratory and joyful.
  OUTPUT SPECIFICATIONS: High-resolution, festive, and full of party spirit.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment on a nature trail.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS**. Do not alter it.
  MODEL & STYLE: A curious child standing on a forest trail, looking up at tall trees or pointing at a butterfly. They carry a small, child-sized backpack. The garment looks comfortable and appropriate for outdoor exploration.
  BACKGROUND & ATMOSPHERE: A beautiful, lush forest trail with dappled sunlight filtering through the canopy. Green ferns and wildflowers line the path.
  OUTPUT SPECIFICATIONS: High-resolution, adventurous, and static focus.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment while doing arts and crafts.
  CRITICAL RULE: The garment **MUST NOT BE CHANGED** in any way.
  MODEL & STYLE: A focused child at a table, engaged in painting or drawing with colorful finger paints. Their tongue is slightly out in concentration. The garment is on display as a comfortable creative outfit.
  BACKGROUND & ATMOSPHERE: A bright, creative art room or playroom with paintings on the wall and art supplies scattered around. Cheerful, even lighting.
  OUTPUT SPECIFICATIONS: High-resolution, creative, and endearing.
  `,

  `
  TASK: Generate an ultra-realistic, seasonal layering photo of a child wearing the provided garment in an autumn setting.
  CRITICAL RULE: You **MUST** use the garment from the user's image with **ZERO ALTERATIONS**. It is a fixed element.
  MODEL & STYLE: A child standing in a park, with fallen autumn leaves around them. They wear the provided garment layered naturally with an appropriate scarf or jacket if seasonally suitable. Their expression is one of playful delight in a poised stance.
  BACKGROUND & ATMOSPHERE: A beautiful autumnal park with warm orange, red, and gold foliage. Soft, warm afternoon light.
  OUTPUT SPECIFICATIONS: High-resolution, warm, and static focus.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment while interacting with a pet.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: A child kneeling down to pet a friendly puppy or kitten in a sunny backyard. Both the child and the animal look joyful. The garment is clearly visible and moves naturally with the child's posture.
  BACKGROUND & ATMOSPHERE: A green, sunny backyard with a picket fence and soft, warm natural light. The mood is adorable and heartwarming.
  OUTPUT SPECIFICATIONS: High-resolution, adorable, and emotionally engaging.
  `,

  `
  TASK: Generate an ultra-realistic, "Festive Moment" of a child wearing the provided garment in a static pose.
  CRITICAL RULE: Use the garment **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Study the festive potential of the garment. Create a unique celebration scene (e.g., a garden party, or a joyful indoor holiday). The child's pose should be poised and static (e.g., holding a balloon or a festive treat).
  LIGHTING: Warm, atmospheric ambient lighting with a soft, magical glow.
  QUALITY CONTROL: Zero visible technical equipment. Pure celebratory joy.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment at a cultural or seasonal festival.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS**. It is a fixed, unchangeable element.
  MODEL & STYLE: A delighted child at a festive outdoor event — a fair, a carnival, or a holiday market. They hold cotton candy, a small flag, or a festive treat. The garment is appropriate for the occasion and clearly displayed.
  BACKGROUND & ATMOSPHERE: A vibrant, colorful festival scene with string lights, stalls, and decorations. Warm, festive ambient lighting with a slight bokeh background.
  OUTPUT SPECIFICATIONS: High-resolution, festive, vibrant, and culturally warm.
  `
];

// --- TOYS PROMPTS ---
const TOYS_COVER_PROMPT = `
TASK: Create a magical, enchanting product stage for a toy.
CRITICAL RULE — NON-NEGOTIABLE: Use the **exact toy** from the provided image **WITHOUT A SINGLE ALTERATION**.
SCENE & ATMOSPHERE: Build a miniature, imaginative world that relates to the toy's theme (e.g., a galactic void, a fairytale forest, or a candy racetrack). The background should be a dreamy, high-fashion blur of color and wonder.
LIGHTING: Whimsical, volumetric light with soft bokeh effects that create a sense of magic and scale.
QUALITY CONTROL: NO visible technical equipment, light stands, or camera gear. Pure imaginative storytelling.
`;

const TOYS_PHOTO_PROMPTS = [
  `
  TASK: Generate an ultra-realistic, emotional "Moment of Wonder" portrait centered on the child and provided toy.
  CRITICAL RULE: The toy **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Focus on the visceral connection between the child and the toy. Use a tight, cinematic framing that captures the sparkle in the child's eyes and the toy's unchangeable detail.
  LIGHTING: Ethereal, soft-focused illumination.
  QUALITY CONTROL: Zero visible cameras or gear.
  `,
  `
  TASK: Generate an ultra-realistic photo from the toy's perspective, looking up at a happy child.
  CRITICAL RULE: The toy must be used **EXACTLY AS IS**.
  SCENE & STYLE: A low-angle shot, as if taken from the toy's point of view. The toy is in the foreground, and the child's smiling face is looking down at it from above.
  LIGHTING & ATMOSPHERE: Clear, cheerful lighting. The mood is playful and imaginative.
  OUTPUT SPECIFICATIONS: A creative, unique, and engaging shot.
  `,
  `
  TASK: Generate a candid, ultra-realistic "Moment of Discovery" featuring a child's hands and the provided toy.
  CRITICAL RULE: The toy must be used **EXACTLY AS IS**.
  DYNAMIC DIRECTION: Close-up, top-down or cinematic angle focusing on the hands. The setting should be a clean, inviting play surface (wood, textured mat, or grass) that complements the toy's colors. The interaction should feel real and exploratory.
  LIGHTING: Soft, natural illumination that highlights the toy's specific materials.
  QUALITY CONTROL: Zero visible technical gear.
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
  `,

  `
  TASK: Generate an ultra-realistic photo of a child setting up a storytelling scene with the provided toy.
  CRITICAL RULE: The toy from the user's image must be used **EXACTLY AS IS**. Do not alter it.
  MODEL & STYLE: A child is on the floor of their bedroom, using the toy as the main character in an imaginative storytelling scene. Other simple toys, cushions, and blankets are arranged around it to create a makeshift kingdom, spaceship, or house.
  BACKGROUND & ATMOSPHERE: A cozy, lived-in child's bedroom with soft warm light. The mood is creative and imaginative.
  OUTPUT SPECIFICATIONS: High-resolution, story-driven, and captures the magic of childhood imagination.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child playing with the provided toy during bath time or water play.
  CRITICAL RULE: The toy must be used with **ZERO ALTERATIONS**. It is a fixed, unchangeable element.
  MODEL & STYLE: A child in a swimming suit or play clothes, playing with the toy near a splash pad, a shallow paddling pool, or a garden sprinkler. Water droplets and splashes add dynamic energy. The child is laughing with pure delight.
  BACKGROUND & ATMOSPHERE: A sunny backyard with green grass and blue sky. Bright, vivid natural light captures the sparkle of water.
  OUTPUT SPECIFICATIONS: High-resolution, dynamic, summery, and full of fun.
  `,

  `
  TASK: Generate an ultra-realistic photo of the provided toy placed in a miniature campsite adventure scene.
  CRITICAL RULE: The toy **MUST NOT BE CHANGED** in any way.
  SCENE & STYLE: The toy is the centerpiece of a meticulously crafted miniature campsite — a tiny tent made from fabric scraps, a small campfire made from twigs and orange paper, and tiny logs arranged as seats. The scene is set in real grass and moss.
  LIGHTING & ATMOSPHERE: Warm, soft golden-hour light with a slight magical glow from the "campfire." The mood is whimsical and adventurous.
  OUTPUT SPECIFICATIONS: High-resolution, creative, miniature-world aesthetic.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child in a classroom setting, proudly showing the provided toy for show-and-tell.
  CRITICAL RULE: You **MUST** use the toy from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A proud child standing in front of their classmates (blurred in background), holding the toy up for everyone to see. Their expression is one of pride and excitement. The classroom is bright and colorful.
  BACKGROUND & ATMOSPHERE: A cheerful, well-organized classroom with artwork on the walls and natural light from windows. Other children look on with interest.
  OUTPUT SPECIFICATIONS: High-resolution, relatable, school-life lifestyle.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child unboxing the provided toy with wide-eyed excitement.
  CRITICAL RULE: The toy must be used **WITHOUT ANY MODIFICATION**. It is a fixed element.
  MODEL & STYLE: A child sits on the floor surrounded by colorful wrapping paper and a gift box. They hold the toy up, freshly unwrapped, with a huge smile and wide, sparkling eyes. The shot captures the pure excitement of receiving a new toy.
  BACKGROUND & ATMOSPHERE: A warm, festive home setting — perhaps near a decorated Christmas tree, Diwali lights, or a birthday banner. The lighting is warm and cheerful.
  OUTPUT SPECIFICATIONS: High-resolution, emotionally captivating, and festive.
  `,

  `
  TASK: Generate an ultra-realistic, overhead flat-lay photo of the provided toy arranged with other toys in a playful lineup or parade.
  CRITICAL RULE: The provided toy from the user's image must be used **EXACTLY AS IS** and should be the most prominent item in the arrangement.
  SCENE & STYLE: A top-down view of the toy placed at the center of a colorful arrangement of complementary toys (building blocks, crayons, small figurines) on a clean, bright play surface. The arrangement is intentional and visually appealing.
  LIGHTING & ATMOSPHERE: Bright, even overhead lighting. Clean, cheerful, and catalogue-quality.
  OUTPUT SPECIFICATIONS: High-resolution, eye-catching product styling for a toy catalogue.
  `,

  `
  TASK: Generate an ultra-realistic, nighttime glow photo of a child snuggling the provided toy in bed.
  CRITICAL RULE: The toy **MUST NOT BE CHANGED** in any way.
  MODEL & STYLE: A sleepy child tucked into bed, hugging the toy close as a comfort companion. A soft nightlight or fairy lights provide a gentle, warm glow. The child's eyes are half-closed and content.
  BACKGROUND & ATMOSPHERE: A cozy child's bedroom at night. Soft, warm lighting from fairy lights or a star-shaped nightlight. The mood is peaceful, safe, and tender.
  OUTPUT SPECIFICATIONS: High-resolution, gentle, and emotionally warm.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child having a pretend picnic or tea party with the provided toy.
  CRITICAL RULE: You **MUST** use the toy from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A child sits on a blanket in a garden or park, having a pretend tea party with the toy propped up as a guest. Tiny tea cups, plates, and pretend food are arranged around them. The child is engaged in a conversation with the toy, full of imagination.
  BACKGROUND & ATMOSPHERE: A sunlit, green outdoor setting with flowers. The mood is sweet, imaginative, and quintessentially childlike.
  OUTPUT SPECIFICATIONS: High-resolution, adorable, and imaginative.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child using the provided toy in a superhero or fantasy role-play.
  CRITICAL RULE: The toy must be used **EXACTLY AS IS**. Do not alter its design or appearance.
  MODEL & STYLE: A child wearing a makeshift cape (a towel or blanket) holds the toy aloft, as if it's a magical artifact or sidekick in their superhero adventure. Their expression is one of fierce determination and joy. The shot captures them mid-action — a jump, a pose, a power stance.
  BACKGROUND & ATMOSPHERE: An open living room or backyard. Dynamic, bright lighting that feels heroic and fun.
  OUTPUT SPECIFICATIONS: High-resolution, energetic, and full of imagination and adventure.
  `,

  `
  TASK: Generate an ultra-realistic "Seasonal Adventure" for the provided toy.
  CRITICAL RULE: The toy **MUST NOT BE CHANGED**.
  DYNAMIC DIRECTION: Place the toy in an extreme, story-driven seasonal environment (e.g., a snowy peak, a desert dune, or a rain-drenched mossy forest). The scene should feel epic and cinematic, treating the toy as the legendary hero of its journey.
  LIGHTING: Dramatic, volumetric light suited to the weather — cool winter blue, warm desert gold, or misty forest green.
  QUALITY CONTROL: NO visible cameras or gear. Pure cinematic adventure.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child playing with the provided toy in the snow.
  CRITICAL RULE: The toy **MUST NOT BE CHANGED** in any way.
  MODEL & STYLE: A bundled-up child in a winter jacket and hat, playing with the toy in a snowy landscape. Perhaps the toy is perched on a snowman, or the child is making a snow scene around it. The child's cheeks are rosy from the cold, and their expression is delighted.
  BACKGROUND & ATMOSPHERE: A clean, white snowy setting — a snow-covered garden or park. Soft, cool winter light. The mood is magical and wintry.
  OUTPUT SPECIFICATIONS: High-resolution, wintry, and full of childhood wonder.
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