
const CRITICAL_AD_RULE = "TASK: Transform the provided image into a high-end advertisement. The model, clothing, and/or product in the image are the main subject and MUST remain EXACTLY the same, without any alterations. Only the background, lighting, and overall atmosphere should be modified to create a compelling ad.";

const AD_VARIATIONS = [
  // Variation 1: Social Media Post
  `${CRITICAL_AD_RULE}\n- ADAPTATION: Re-imagine this as a clean, vibrant social media post. Enhance the background to be modern and minimalist, perhaps with a soft color gradient or abstract shapes. The lighting should be bright and optimistic. The final image must look professional, eye-catching, and ready for an Instagram feed.`,
  // Variation 2: Luxury Magazine Ad
  `${CRITICAL_AD_RULE}\n- ADAPTATION: Re-imagine this for a luxury magazine advertisement. The background should be transformed into something more atmospheric and sophisticated—think moody architectural details, a soft-focus cityscape at night, or an elegant interior. The lighting should be cinematic and dramatic, with high contrast. The mood should be exclusive and aspirational.`,
  // Variation 3: E-commerce Banner
  `${CRITICAL_AD_RULE}\n- ADAPTATION: Re-imagine this as a clean, professional e-commerce banner. The background should be simple, non-distracting, and complementary to the product. Use soft studio lighting to ensure the product is perfectly lit and the main focus. The composition should feel polished and ready for a website homepage.`,
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
