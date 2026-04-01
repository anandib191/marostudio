
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
    console.warn("API_KEY environment variable not set. AI features will not work until it is configured.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const getAI = () => {
    if (!ai) throw new Error("API_KEY environment variable not set. Please set GEMINI_API_KEY in your .env file.");
    return ai;
};

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
const generate4KImage = async (imageFile: ImageFile, prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    const formData = new FormData();

    const mainBlob = await getBlobFromSource(imageFile.base64, imageFile.mimeType);
    formData.append('images', mainBlob, 'input_image.png');

    formData.append('prompt', prompt);
    formData.append('image_size', '4K');

    let apiAspectRatio = "16:9";
    if (['1:1', '16:9', '9:16', '4:5', '3:2'].includes(aspectRatio)) {
        apiAspectRatio = aspectRatio;
    }
    formData.append('aspect_ratio', apiAspectRatio);

    const response = await fetch('https://4kimages-git-devlopment-hirings-projects-44b058c4.vercel.app/', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`4K Generation API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.output && data.output.length > 0) {
        return data.output[0];
    }

    throw new Error('4K Image generation failed: ' + (data.message || 'Unknown API error'));
}

/**
 * Generates an image using the Joingy API, with 4K or 2K quality
 */
const generateSingleImage = async (imageFile: ImageFile, prompt: string, aspectRatio: AspectRatio, referenceImageSource?: string, imageQuality: ImageQuality = 'HD'): Promise<string> => {
    // Route to 4K API if quality is 4K
    if (imageQuality === '4K') {
        return generate4KImage(imageFile, prompt, aspectRatio);
    }

    const formData = new FormData();

    const mainBlob = await getBlobFromSource(imageFile.base64, imageFile.mimeType);
    formData.append('images', mainBlob, 'input_image.png');

    if (referenceImageSource) {
        const refBlob = await getBlobFromSource(referenceImageSource, 'image/png');
        formData.append('images', refBlob, 'reference_image.png');
    }

    formData.append('prompt', prompt);
    formData.append('image_size', '2K');

    let apiAspectRatio = "16:9";
    if (['1:1', '16:9', '9:16', '4:5', '3:2'].includes(aspectRatio)) {
        apiAspectRatio = aspectRatio;
    }
    formData.append('aspect_ratio', apiAspectRatio);

    const response = await fetch('https://4kimages-git-devlopment-hirings-projects-44b058c4.vercel.app/', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Generation API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.output && data.output.length > 0) {
        return data.output[0];
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
    numberOfImages: number = 2
): Promise<{ coverImage: string; modelImages: string[] }> => {
    try {
        const frontImage = imageFiles.find((_f, i) => i === 0 && _f);
        const backImage = imageFiles.find((_f, i) => i === 1 && _f);

        if (!frontImage && !backImage) {
            throw new Error("At least one product image must be provided.");
        }

        const primaryImage = frontImage || backImage!;

        let prompts;
        if (productType === 'apparel' && apparelStyle === 'professional' && (category === 'women' || category === 'men' || category === 'kids')) {
            prompts = PROFESSIONAL_PROMPT_MAP[category].apparel;
        } else {
            const categoryPrompts = PROMPT_MAP[category];
            prompts = categoryPrompts[productType as keyof typeof categoryPrompts];
        }

        if (!prompts) {
            throw new Error(`No prompts found for category: ${category} and product type: ${productType}`);
        }

        const { coverPrompt, photoPrompts } = prompts;
        const styleModifier = STYLE_OPTIONS.find(s => s.id === styleId)?.promptModifier || '';
        const backgroundInstruction = getBackgroundInstruction(background, customBackgroundPrompt);

        const isBackViewOptional = productType === 'apparel' && (apparelStyle === 'professional' || category === 'women' || category === 'men');
        let activePhotoPrompts = shuffleArray([...photoPrompts]);

        if (isBackViewOptional && !backImage) {
            activePhotoPrompts.pop();
        }

        const allPrompts = [coverPrompt, ...activePhotoPrompts];

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
                let imageToUse = primaryImage;

                if (backImage && isBackViewOptional && index === finalPromptList.length - 1) {
                    imageToUse = backImage;
                }

                const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

                try {
                    const image = await generateWithRetry(imageToUse, finalPrompt, aspectRatio, index > 0 ? referenceImageForConsistency : undefined, imageQuality);
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
                let imageToUse = primaryImage;
                if (backImage && isBackViewOptional && index === finalPromptList.length - 1) {
                    imageToUse = backImage;
                }

                const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

                try {
                    const image = await generateWithRetry(imageToUse, finalPrompt, aspectRatio, undefined, imageQuality);
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

    const allPrompts = [
        coverPromptFn(productName),
        ...photoPromptsFns.map(fn => fn(productName))
    ];

    // Build the final prompt list: generate exactly numberOfImages images
    const finalPromptList: string[] = [];
    for (let i = 0; i < numberOfImages; i++) {
        finalPromptList.push(allPrompts[i % allPrompts.length]);
    }

    const generatedImages: string[] = [];
    let referenceImageForConsistency: string | undefined = undefined;

    if (consistentCharacter) {
        for (let index = 0; index < finalPromptList.length; index++) {
            const prompt = finalPromptList[index];
            const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

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
    const response = await getAI().models.generateContent({
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
 * Generates a marketing poster using the Joingy API
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

    const response = await fetch('https://4kimages-git-devlopment-hirings-projects-44b058c4.vercel.app/', {
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

    let operation = await getAI().models.generateVideos({
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
        operation = await getAI().operations.getVideosOperation({ operation: operation });
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

    let operation = await getAI().models.generateVideos({
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
        operation = await getAI().operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};
