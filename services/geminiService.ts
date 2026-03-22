
import { GoogleGenAI } from "@google/genai";
import { ImageFile, ProductType, Category, AspectRatio, BackgroundType, ImageQuality } from '../types';
import { WOMEN_PROMPTS } from './prompts/women';
import { MEN_PROMPTS } from './prompts/men';
import { KIDS_PROMPTS } from './prompts/kids';
import { ECOMMERCE_PROMPTS } from "./prompts/ecommerce";
import { STYLE_OPTIONS } from "./styles";
import { PROFESSIONAL_APPAREL_PROMPTS } from "./prompts/professionalApparel";

/**
 * Fisher-Yates shuffle: returns a new array with elements in random order.
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to convert base64 string to a Blob for FormData
 */
async function base64ToBlob(base64: string, mimeType: string): Promise<Blob> {
    try {
        // Remove any potential whitespace or data URI prefix just in case
        const cleanBase64 = base64.replace(/^data:image\/(png|jpeg|webp|jpg);base64,/, "").replace(/\s/g, "");
        const bytes = atob(cleanBase64);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
            arr[i] = bytes.charCodeAt(i);
        }
        return new Blob([arr], { type: mimeType });
    } catch (e) {
        console.error("base64ToBlob failed:", e);
        throw new Error("Invalid image data format.");
    }
}

/**
 * Helper to get a Blob from either a base64 string or a remote URL
 */
async function getBlobFromSource(source: string, mimeType: string): Promise<Blob> {
    if (source.startsWith('http')) {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Failed to fetch reference image: ${response.statusText}`);
        return await response.blob();
    }
    return await base64ToBlob(source, mimeType);
}

const getApparelThemeInstructions = (styleId: string): string => {
    switch (styleId.toLowerCase()) {
        case 'vintage':
            return "SCENE: Professional fashion shoot at a heritage site. BACKGROUND: Grand palaces with intricate architecture, marble corridors, or serene lakes with historic pavilions in the background. Atmosphere is nostalgic and premium.";
        case 'aesthetic':
            return "SCENE: Minimalist high-fashion studio or urban setting. BACKGROUND: Clean lines, curated aesthetic objects like ceramic vases, pampas grass, or architectural textures. Soft, artistic shadows.";
        case 'monochrome':
            return "SCENE: Dramatic high-contrast black and white photography. BACKGROUND: Old-world vintage hotel lobby, marble stairs, or a dramatic urban street at night with classic lamp posts. Mood is mid-century fashion editorial.";
        default:
            return "";
    }
}

const getBackgroundInstruction = (bg: BackgroundType, customPrompt?: string) => {
    switch (bg) {
        case 'white': return "BACKGROUND OVERRIDE: Use a clean, seamless solid white background (#FFFFFF). High-key lighting.";
        case 'black': return "BACKGROUND OVERRIDE: Use a clean, seamless solid black background (#000000). Dramatic lighting.";
        case 'transparent': return "BACKGROUND OVERRIDE: The subject must be isolated on a pure, flat white background with sharp edges for easy background removal.";
        case 'workspace': return "BACKGROUND OVERRIDE: A modern, organized creative workspace or office desk setting with blurred details.";
        case 'studio': return "BACKGROUND OVERRIDE: A professional photography studio setting with infinite cycling wall and soft lighting.";
        case 'city': return "BACKGROUND OVERRIDE: A stylish city street with modern architecture, softly out of focus.";
        case 'historic': return "BACKGROUND OVERRIDE: An ancient, textured historic setting with stone walls, columns, or ruins.";
        case 'custom': return `BACKGROUND OVERRIDE: ${customPrompt}`;
        default: return "";
    }
}

/**
 * Generates a 4K image using the Joingy API
 */
const generate4KImage = async (imageFile: ImageFile, prompt: string, aspectRatio: AspectRatio, referenceImageSource?: string): Promise<string> => {
    const formData = new FormData();

    // Process main image
    const mainBlob = await getBlobFromSource(imageFile.base64, imageFile.mimeType);
    formData.append('images', mainBlob, 'input_image.png');

    // If there's a reference image (for character consistency or back view), process it
    if (referenceImageSource) {
        const refBlob = await getBlobFromSource(referenceImageSource, 'image/png');
        formData.append('images', refBlob, 'reference_image.png');
    }

    formData.append('prompt', prompt);
    formData.append('image_size', '4K');

    // Map internal aspect ratio strings to API expected strings
    let apiAspectRatio = "16:9";
    if (['1:1', '16:9', '9:16', '4:5', '3:2'].includes(aspectRatio)) {
        apiAspectRatio = aspectRatio;
    }
    formData.append('aspect_ratio', apiAspectRatio);

    const response = await fetch('https://api.joingy.site/', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`4K Generation API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.output && data.output.length > 0) {
        return data.output[0]; // Returns the URL of the generated 4K image
    }

    throw new Error('4K Image generation failed: ' + (data.message || 'Unknown API error'));
}

/**
 * Generates an image using the Joingy API, with 4K or 2K quality
 */
const generateSingleImage = async (imageFile: ImageFile, prompt: string, aspectRatio: AspectRatio, referenceImageSource?: string, imageQuality: ImageQuality = 'HD'): Promise<string> => {
    // Route to 4K API if quality is 4K
    if (imageQuality === '4K') {
        return generate4KImage(imageFile, prompt, aspectRatio, referenceImageSource);
    }

    const formData = new FormData();

    // Process main image
    const mainBlob = await getBlobFromSource(imageFile.base64, imageFile.mimeType);
    formData.append('images', mainBlob, 'input_image.png');

    // If there's a reference image (for character consistency or back view), process it
    if (referenceImageSource) {
        const refBlob = await getBlobFromSource(referenceImageSource, 'image/png');
        formData.append('images', refBlob, 'reference_image.png');
    }

    formData.append('prompt', prompt);
    formData.append('image_size', '2K');

    // Map internal aspect ratio strings to API expected strings
    let apiAspectRatio = "16:9";
    if (['1:1', '16:9', '9:16', '4:5', '3:2'].includes(aspectRatio)) {
        apiAspectRatio = aspectRatio;
    }

    formData.append('aspect_ratio', apiAspectRatio);

    const response = await fetch('https://api.joingy.site/', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Generation API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.output && data.output.length > 0) {
        return data.output[0]; // Returns the URL of the generated image
    }

    throw new Error('Image generation failed: ' + (data.message || 'Unknown API error'));
}

/**
 * Retry wrapper: attempts generateSingleImage up to MAX_RETRIES times.
 * Waits 1 second between retries.
 */
const MAX_RETRIES = 3;

const generateWithRetry = async (
    imageFile: ImageFile,
    prompt: string,
    aspectRatio: AspectRatio,
    referenceImageSource?: string,
    imageQuality: ImageQuality = 'HD'
): Promise<string> => {
    let lastError: Error | unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await generateSingleImage(imageFile, prompt, aspectRatio, referenceImageSource, imageQuality);
        } catch (err) {
            lastError = err;
            console.warn(`Image generation attempt ${attempt}/${MAX_RETRIES} failed:`, err);
            if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    throw lastError;
}

const PROMPT_MAP = {
    women: WOMEN_PROMPTS,
    men: MEN_PROMPTS,
    kids: KIDS_PROMPTS,
    ecommerce: ECOMMERCE_PROMPTS,
};

const PROFESSIONAL_PROMPT_MAP = {
    women: { apparel: PROFESSIONAL_APPAREL_PROMPTS },
    men: { apparel: PROFESSIONAL_APPAREL_PROMPTS },
    kids: { apparel: PROFESSIONAL_APPAREL_PROMPTS },
};

export const generateCatalogueImages = async (
    imageFiles: ImageFile[],
    category: Category,
    productType: ProductType,
    styleId: string,
    onImageGenerated: (image: string, index: number) => void,
    apparelStyle: 'general' | 'professional' = 'general',
    extraPrompt?: string,
    aspectRatio: AspectRatio = '1:1',
    consistentCharacter: boolean = false,
    background: BackgroundType = 'studio',
    customBackgroundPrompt?: string,
    imageQuality: ImageQuality = 'HD',
    numberOfImages: number = 2,
    itemName?: string
): Promise<{ coverImage: string; modelImages: string[] }> => {
    try {
        const frontImage = imageFiles.find((_f, i) => i === 0 && _f);
        const backImage = imageFiles.find((_f, i) => i === 1 && _f);

        if (!frontImage && !backImage) {
            throw new Error("At least one product image must be provided.");
        }

        const primaryImage = frontImage || backImage!;

        // --- SUB-CATEGORY / ITEM MAPPING OVERRIDES ---
        let effectiveProductType: string = productType;
        
        if (itemName) {
            const lowerItem = itemName.toLowerCase();
            // Force Saree to apparel as requested
            if (category === 'women' && (lowerItem === 'saree' || lowerItem.includes('saree'))) {
                effectiveProductType = 'apparel';
            } 
            // Map Ornaments/Jewelry properly
            else if (lowerItem.includes('jewelry') || lowerItem.includes('jewellery') || lowerItem.includes('ornament') || 
                     lowerItem.includes('gold') || lowerItem.includes('diamond') || lowerItem.includes('silver') || 
                     lowerItem.includes('bridal')) {
                effectiveProductType = 'jewelry';
            }
            // Map Perfume properly
            else if (lowerItem === 'perfume' || lowerItem.includes('perfume')) {
                effectiveProductType = 'perfume';
            }
        }

        let prompts;
        if (effectiveProductType === 'apparel' && apparelStyle === 'professional' && (category === 'women' || category === 'men' || category === 'kids')) {
            prompts = PROFESSIONAL_PROMPT_MAP[category].apparel;
        } else {
            const categoryPrompts = PROMPT_MAP[category];
            prompts = categoryPrompts[effectiveProductType as keyof typeof categoryPrompts];
        }

        if (!prompts) {
            throw new Error(`No prompts found for category: ${category} and product type: ${productType}`);
        }

        const { coverPrompt, photoPrompts } = prompts;
        const styleModifier = STYLE_OPTIONS.find(s => s.id === styleId)?.promptModifier || '';
        let backgroundInstruction = getBackgroundInstruction(background, customBackgroundPrompt);

        // Inject apparel-specific theme logic for certain backgrounds
        if (productType === 'apparel') {
            const themeInstructions = getApparelThemeInstructions(styleId);
            if (themeInstructions && (background === 'studio' || background === 'historic' || background === 'city')) {
                backgroundInstruction = `THEME-SPECIFIC BACKGROUND & SCENE INSTRUCTIONS:\n${themeInstructions}`;
            }
        }

        const isBackViewOptional = effectiveProductType === 'apparel' && (apparelStyle === 'professional' || category === 'women' || category === 'men');
        let activePhotoPrompts = [...photoPrompts];

        if (isBackViewOptional && !backImage) {
            activePhotoPrompts.pop();
        }

        // Shuffle photo prompts randomly for variety, keeping cover prompt as first
        const shuffledPhotoPrompts = shuffleArray(activePhotoPrompts);
        const allPrompts = [coverPrompt, ...shuffledPhotoPrompts];

        // Build the final prompt list: generate exactly numberOfImages images,
        // cycling through available prompts if numberOfImages > allPrompts.length
        const finalPromptList: string[] = [];
        for (let i = 0; i < numberOfImages; i++) {
            finalPromptList.push(allPrompts[i % allPrompts.length]);
        }

        const generatedImages: string[] = [];
        let referenceImageForConsistency: string | undefined = undefined;

        if (consistentCharacter) {
            try {
                // Generate a pure face portrait BEFORE catalogue images.
                // This tight headshot prevents the API from copying a full-body pose as the reference!
                const facePrompt = `HEADSHOT PORTRAIT ONLY: Generate an ultra-realistic, highly detailed, well-lit portrait of a fashion model's face. The face MUST be clearly visible and front-facing. This is for face reference only. Do NOT show the full body. Make sure the face takes up the entire frame. \n\nQUALITY CONTROL: Crisp editorial portrait. NO full body composition.`;
                referenceImageForConsistency = await generateWithRetry(primaryImage, facePrompt, '1:1', undefined, 'HD');
            } catch (err) {
                console.error('Master face generation failed. Proceeding without character consistency.', err);
                consistentCharacter = false;
            }
        }

        // Determine Jewelry Focus Instruction based on itemName
        let jewelryFocusInstruction = "";
        if (effectiveProductType === "jewelry" && itemName) { // Use effectiveProductType
            const lowerItem = itemName.toLowerCase();
            if (lowerItem.includes("ring") || lowerItem.includes("band")) {
                jewelryFocusInstruction = "FOCUS: Extreme macro focus on the hand and fingers, showcasing the ring's interaction with the skin.";
            } else if (lowerItem.includes("neck") || lowerItem.includes("pendant") || lowerItem.includes("chain") || lowerItem.includes("choker")) {
                jewelryFocusInstruction = "FOCUS: Tight editorial crop on the neck and collarbone, highlighting the drape and sparkle of the necklace.";
            } else if (lowerItem.includes("ear") || lowerItem.includes("jhumka") || lowerItem.includes("stud")) {
                jewelryFocusInstruction = "FOCUS: Precise macro focus on the ear and jawline, capturing the detailed craftsmanship and dangle of the earring.";
            } else if (lowerItem.includes("bracelet") || lowerItem.includes("bangle") || lowerItem.includes("wrist")) {
                jewelryFocusInstruction = "FOCUS: Macro focus on the wrist and forearm, highlighting the jewelry's fit and movement.";
            } else {
                jewelryFocusInstruction = "FOCUS: Professional editorial closeup that best showcases the specific jewelry item provided.";
            }
        }

        let apparelFocusInstruction = "";
        if (effectiveProductType === "apparel" && itemName) {
            apparelFocusInstruction = `CRITICAL PRODUCT MATCH: The clothing item being worn is specifically a "${itemName}". Ensure the styling, drape, fit, and physical properties perfectly match a ${itemName}. DO NOT add any extra layers, jackets, straps, or unrequested clothing items. The ${itemName} must be the primary focus and completely unaltered.`;
        }

        const processedPrompts = finalPromptList.map((p: string, index: number) => {
            let currentPrompt = p;
            if (jewelryFocusInstruction) {
                currentPrompt = `${jewelryFocusInstruction}\n${currentPrompt}`;
            }
            if (apparelFocusInstruction) {
                // Dynamically replace generic words with the precise item name
                currentPrompt = currentPrompt.replace(/the provided garment/gi, `the provided ${itemName}`);
                currentPrompt = currentPrompt.replace(/this garment/gi, `this ${itemName}`);
                currentPrompt = currentPrompt.replace(/the garment/gi, `the ${itemName}`);
                currentPrompt = currentPrompt.replace(/the clothing item/gi, `the ${itemName}`);
                currentPrompt = currentPrompt.replace(/this clothing item/gi, `this ${itemName}`);
                currentPrompt = currentPrompt.replace(/the piece of clothing/gi, `the ${itemName}`);
                currentPrompt = currentPrompt.replace(/this piece of clothing/gi, `this ${itemName}`);
                currentPrompt = currentPrompt.replace(/the clothing\b/gi, `the ${itemName}`);
                currentPrompt = currentPrompt.replace(/this clothing\b/gi, `this ${itemName}`);
                currentPrompt = currentPrompt.replace(/the piece\b/gi, `the ${itemName}`);
                currentPrompt = currentPrompt.replace(/this piece\b/gi, `this ${itemName}`);
                currentPrompt = `${apparelFocusInstruction}\n${currentPrompt}`;
            }
            
            const qualityControl = "\n\nQUALITY CONTROL: Ensure a high-end, clean editorial result. Strictly avoid rendering any technical equipment like camera gear, light stands, studio umbrellas, or photographers in reflections.";
            
            let colorLock = "";
            if (styleId === 'monochrome') {
                colorLock = "\n\nEXTREME B&W OVERRIDE: The ENTIRE final image, including the product, MUST BE 100% pure black, white, and grayscale. Absolutely ZERO color is permitted.";
            } else {
                colorLock = "\n\nCRITICAL COLOR MATCH: The exact original solid color, hue, pattern, and texture of the uploaded garment must be 100% perfectly preserved. DO NOT let atmospheric lighting, shadows, or background elements alter the true color of the clothing. The garment's original color is the absolute highest priority in this generation.";
            }
            
            let finalPrompt = `${currentPrompt}\n\n${styleModifier}\n\n${backgroundInstruction}${qualityControl}${colorLock}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;
            
            if (consistentCharacter && referenceImageForConsistency) {
                // Inject massive diverse pose instructions to break the AI out of identical static poses
                const dynamicPoses = [
                  "The model is standing confidently in a dynamic, asymmetrical pose, slightly angled to the camera.",
                  "The model is seated elegantly, leaning slightly forward, projecting a relaxed yet sophisticated presence.",
                  "The model is captured mid-stride, walking gracefully with natural movement and an effortless gaze.",
                  "The model is striking a bold editorial pose with one hand near the face or waist, projecting high-fashion energy.",
                  "The model is leaning beautifully against a surface, looking away thoughtfully with a relaxed, natural stance.",
                  "The model is doing a dynamic over-the-shoulder look, showing graceful movement and high-energy expression."
                ];
                const variedPose = dynamicPoses[index % dynamicPoses.length];
                finalPrompt = `MAINTAIN CHARACTER CONSISTENCY: Use the exact same person (model) from the reference image provided. IMPORTANT: BREAK OUT OF RIGIDITY. DO NOT COPY THE POSE FROM THE REFERENCE IMAGE. ${variedPose} Follow the scene and styling described in the prompt below while keeping the character's facial features and identity identical.\n${finalPrompt}`;
            }
            return finalPrompt;
        });

        if (consistentCharacter && referenceImageForConsistency) {
            for (let index = 0; index < processedPrompts.length; index++) {
                const finalPrompt = processedPrompts[index];
                let imageToUse = primaryImage;

                if (backImage && isBackViewOptional && index === processedPrompts.length - 1) {
                    imageToUse = backImage;
                }

                try {
                    const image = await generateWithRetry(
                        imageToUse, 
                        finalPrompt, 
                        aspectRatio, 
                        referenceImageForConsistency, 
                        imageQuality
                    );
                    onImageGenerated(image, index);
                    generatedImages.push(image);
                } catch (err) {
                    console.error(`Image ${index} generation failed:`, err);
                }
            }
        } else {
            const promises = processedPrompts.map(async (finalPrompt, index) => {
                let imageToUse = primaryImage;
                if (backImage && isBackViewOptional && index === processedPrompts.length - 1) {
                    imageToUse = backImage;
                }

                try {
                    const image = await generateWithRetry(imageToUse, finalPrompt, aspectRatio, undefined, imageQuality);
                    onImageGenerated(image, index);
                    return image;
                } catch (err) {
                    console.error(`Image ${index} generation failed:`, err);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            results.forEach(img => {
                if (img) generatedImages.push(img);
            });
        }

        const coverImage = generatedImages[0];
        const modelImages = generatedImages.slice(1);

        if (!coverImage) throw new Error("Cover image failed to generate.");

        return { coverImage, modelImages };
    } catch (error) {
        console.error("Error generating catalogue images:", error);
        throw new Error("Failed to generate one or more images. See console for details.");
    }
};

export const generateOtherProductImages = async (
    imageFile: ImageFile,
    productName: string,
    styleId: string,
    onImageGenerated: (image: string, index: number) => void,
    promptsConfig?: { coverPrompt: (name: string) => string; photoPrompts: ((name: string) => string)[] },
    extraPrompt?: string,
    aspectRatio: AspectRatio = '1:1',
    consistentCharacter: boolean = false,
    background: BackgroundType = 'studio',
    customBackgroundPrompt?: string,
    imageQuality: ImageQuality = 'HD',
    numberOfImages: number = 2
): Promise<{ coverImage: string; modelImages: string[] }> => {
    const config = promptsConfig || ECOMMERCE_PROMPTS.other;
    if (!config) throw new Error('Prompts for this product category not found.');

    const coverPromptFn = config.coverPrompt as (name: string) => string;
    const photoPromptsFns = config.photoPrompts as ((name: string) => string)[];

    const styleModifier = STYLE_OPTIONS.find(s => s.id === styleId)?.promptModifier || '';
    const backgroundInstruction = getBackgroundInstruction(background, customBackgroundPrompt);

    // Shuffle photo prompts randomly for variety, keeping cover prompt as first
    const shuffledPhotoPrompts = shuffleArray(photoPromptsFns).map(fn => fn(productName));
    const allPrompts = [
        coverPromptFn(productName),
        ...shuffledPhotoPrompts
    ];

    // Build the final prompt list: generate exactly numberOfImages images,
    // cycling through available prompts if numberOfImages > allPrompts.length
    const finalPromptList: string[] = [];
    for (let i = 0; i < numberOfImages; i++) {
        finalPromptList.push(allPrompts[i % allPrompts.length]);
    }

    const generatedImages: string[] = [];
    let referenceImageForConsistency: string | undefined = undefined;

    if (consistentCharacter) {
        for (let index = 0; index < finalPromptList.length; index++) {
            const prompt = finalPromptList[index];
            let finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

            if (index === 0) {
                finalPrompt = `CHARACTER ESTABLISHMENT: Ensure the model's face is clearly visible, well-lit, and highly detailed. This image will serve as the master face reference for character consistency in subsequent shots.\n${finalPrompt}`;
            } else {
                finalPrompt = `MAINTAIN CHARACTER CONSISTENCY: Use the exact same person (model) from the reference image provided. Follow the new pose, gesture, scene, and styling described in the prompt below while keeping the character's facial features and identity identical.\n${finalPrompt}`;
            }

            try {
                const image = await generateWithRetry(imageFile, finalPrompt, aspectRatio, index > 0 ? referenceImageForConsistency : undefined, imageQuality);
                onImageGenerated(image, index);
                generatedImages.push(image);

                if (index === 0) {
                    referenceImageForConsistency = image;
                }
            } catch (err) {
                console.error("Image generation failed. Please try again.");
            }
        }
    } else {
        const promises = finalPromptList.map(async (prompt, index) => {
            const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

            try {
                const image = await generateWithRetry(imageFile, finalPrompt, aspectRatio, undefined, imageQuality);
                onImageGenerated(image, index);
                return image;
            } catch (err) {
                console.error("Image generation failed. Please try again.");
                return null;
            }
        });

        const results = await Promise.all(promises);
        results.forEach(img => {
            if (img) generatedImages.push(img);
        });
    }

    const coverImage = generatedImages[0];
    const modelImages = generatedImages.slice(1);

    if (!coverImage) throw new Error("Cover image failed to generate for 'other' product.");

    return { coverImage, modelImages };
};

/**
 * Uses Gemini for product identification (text-based output)
 */
export const identifyProduct = async (imageFile: ImageFile): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { data: imageFile.base64, mimeType: imageFile.mimeType } },
                { text: 'Identify the main object in this image. Respond with only the name of the object, in two or three words at most. For example: "black leather handbag" or "silver wristwatch".' }
            ]
        },
    });
    const text = response.text?.trim() || "";
    if (!text) {
        throw new Error("AI could not identify the product.");
    }
    return text;
};

/**
 * Generates a marketing poster using the custom API
 */
export const generateMarketingPoster = async (
    imageFile: ImageFile,
    extraDetails: string,
    logoFile: ImageFile | null
): Promise<string> => {
    const formData = new FormData();
    formData.append('images', await getBlobFromSource(imageFile.base64, imageFile.mimeType), 'product.png');
    if (logoFile) {
        formData.append('images', await getBlobFromSource(logoFile.base64, logoFile.mimeType), 'logo.png');
    }

    const prompt = `TASK: Design a professional marketing poster for the product in the first image.
VISUAL STYLE: High-end, commercial advertisement suitable for social media or print.
${extraDetails ? `CAMPAIGN DETAILS/TEXT: ${extraDetails}` : ''}
${logoFile ? 'INSTRUCTION: Use the logo provided in the second image. Place it elegantly in the design.' : ''}`;

    formData.append('prompt', prompt);
    formData.append('image_size', '2K');
    formData.append('aspect_ratio', '4:5');

    const response = await fetch('https://api.joingy.site/', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Poster generation API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.output && data.output.length > 0) {
        return data.output[0];
    }

    throw new Error('No poster was generated.');
};

/**
 * Placeholder for video generation using Veo
 */
export const generateProductVideo = async (
    imageFile: ImageFile,
    category: string,
    productType: string,
    productName: string,
    onProgress: (message: string) => void
): Promise<string> => {
    onProgress("Initiating cinematic render...");
    const prompt = `Create a professional 4K promotional video for: ${productName}. Category: ${category}, Type: ${productType}. Exact product from image.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: imageFile.base64,
            mimeType: imageFile.mimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        onProgress("Directing scenes...");
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

export const generateAdFilm = async (
    images: ImageFile[],
    category: string,
    productType: string,
    productName: string,
    onProgress: (message: string) => void,
    aspectRatio: '16:9' | '9:16'
): Promise<string> => {
    onProgress("Drafting script...");
    const prompt = `Ad film for ${productName}. ${category} ${productType}. Vertical/Horizontal: ${aspectRatio}. Dynamic cuts, professional lighting.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: images[0].base64,
            mimeType: images[0].mimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        onProgress("Synthesizing frames...");
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};
