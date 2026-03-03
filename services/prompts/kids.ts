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
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment, walking through a school hallway.
  CRITICAL RULE: The clothing **MUST NOT BE CHANGED**. Preserve its original design, color, and pattern.
  MODEL & STYLE: A confident, smiling child with a colorful backpack, walking through a bright, modern school hallway. Their stride is proud and happy. The garment looks perfect for an active school day.
  BACKGROUND & ATMOSPHERE: A clean, modern school interior with lockers and bright walls. Natural daylight comes through large windows.
  OUTPUT SPECIFICATIONS: High-resolution, relatable, back-to-school lifestyle.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment, playing in rain puddles.
  CRITICAL RULE: You **MUST** use the garment from the user's image with **ZERO ALTERATIONS**.
  MODEL & STYLE: A child in colorful rain boots splashing in a puddle on a rainy day, wearing the provided garment. Their face shows pure excitement and delight. The splash is frozen mid-action.
  BACKGROUND & ATMOSPHERE: A rain-wet suburban street or park path with reflections in the puddles. Overcast but bright sky. The mood is playful and free-spirited.
  OUTPUT SPECIFICATIONS: High-resolution, dynamic, and full of childhood joy.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment at a birthday party.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: An excited child at a decorated birthday party table, surrounded by balloons, streamers, and a beautiful cake with candles. They are about to blow out candles or clapping with delight. The garment fits the festive occasion perfectly.
  BACKGROUND & ATMOSPHERE: A colorfully decorated room with bunting, confetti, and warm, cheerful lighting. The mood is celebratory and joyful.
  OUTPUT SPECIFICATIONS: High-resolution, festive, and full of party spirit.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment on a nature hiking trail.
  CRITICAL RULE: The clothing item must be used **EXACTLY AS IS**. Do not alter it.
  MODEL & STYLE: A curious child walking along a forest trail, looking up at tall trees or pointing at a butterfly. They carry a small, child-sized backpack. The garment looks comfortable and appropriate for outdoor exploration.
  BACKGROUND & ATMOSPHERE: A beautiful, lush forest trail with dappled sunlight filtering through the canopy. Green ferns and wildflowers line the path.
  OUTPUT SPECIFICATIONS: High-resolution, adventurous, and connected to nature.
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
  MODEL & STYLE: A child walking through a park, kicking fallen autumn leaves. They wear the provided garment layered naturally with an appropriate scarf or jacket if seasonally suitable. Their expression is one of playful delight.
  BACKGROUND & ATMOSPHERE: A beautiful autumnal park with warm orange, red, and gold foliage. Soft, warm afternoon light.
  OUTPUT SPECIFICATIONS: High-resolution, warm, and seasonally evocative.
  `,

  `
  TASK: Generate an ultra-realistic photo of a child wearing the provided garment while interacting with a pet.
  CRITICAL RULE: The garment must be used **WITHOUT ANY MODIFICATION**.
  MODEL & STYLE: A child kneeling down to pet a friendly puppy or kitten in a sunny backyard. Both the child and the animal look joyful. The garment is clearly visible and moves naturally with the child's posture.
  BACKGROUND & ATMOSPHERE: A green, sunny backyard with a picket fence and soft, warm natural light. The mood is adorable and heartwarming.
  OUTPUT SPECIFICATIONS: High-resolution, adorable, and emotionally engaging.
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