
const CRITICAL_AD_RULE = "TASK: Transform the provided image into a high-end advertisement. The model, clothing, and/or product in the image are the main subject and MUST remain EXACTLY the same, without any alterations. Build an immersive, premium world around this unchangeable hero.";

const AD_VARIATIONS = [
  // Variation 1: Social Media Post
  `${CRITICAL_AD_RULE}\n- ADAPTATION: Re-imagine this as a clean, vibrant social media post. Build a modern, minimalist environment (e.g., soft color gradients or organic geometric shapes). Use bright, optimistic, volumetric lighting. The result must be professional, eye-catching, and ready for an Instagram feed.\n- QUALITY CONTROL: NO visible technical artifacts, camera gear, or light stands.`,
  // Variation 2: Luxury Magazine Ad
  `${CRITICAL_AD_RULE}\n- ADAPTATION: Re-imagine this for a luxury magazine advertisement. Build a highly atmospheric and sophisticated environment (e.g., moody architectural details, a blurred cityscape at night, or an elegant interior). Use cinematic, non-technical illumination with high contrast. The mood should be exclusive and aspirational.\n- QUALITY CONTROL: Zero visible cameras or equipment.`,
  // Variation 3: E-commerce Banner
  `${CRITICAL_AD_RULE}\n- ADAPTATION: Re-imagine this as a clean, professional e-commerce banner. The background should be simple, non-distracting, and architecturally complementary. Use soft, volumetric illumination to ensure the product is the absolute hero. The composition should be polished and ready for a flagship homepage.\n- QUALITY CONTROL: Absolutely no technical equipment or light stands visible.`,
];

export const AD_PROMPTS = {
    women: {
        jewelry: AD_VARIATIONS,
        purse: AD_VARIATIONS,
        perfume: AD_VARIATIONS,
        apparel: AD_VARIATIONS,
    },
    men: {
        watch: AD_VARIATIONS,
        perfume: AD_VARIATIONS,
        belt: AD_VARIATIONS,
        apparel: AD_VARIATIONS,
    },
    kids: {
        apparel: AD_VARIATIONS,
        toys: AD_VARIATIONS,
    },
};
