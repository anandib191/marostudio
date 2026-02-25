
import { GoogleGenAI } from "@google/genai";
import { ImageFile, ProductType, Category, AspectRatio, BackgroundType, ImageQuality } from '../types';
import { WOMEN_PROMPTS } from './prompts/women';
import { MEN_PROMPTS } from './prompts/men';
import { KIDS_PROMPTS } from './prompts/kids';
import { ECOMMERCE_PROMPTS } from "./prompts/ecommerce";
import { STYLE_OPTIONS } from "./styles";
import { PROFESSIONAL_APPAREL_PROMPTS } from "./prompts/professionalApparel";

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

    // Process main image
    const mainBlob = await getBlobFromSource(imageFile.base64, imageFile.mimeType);
    formData.append('images', mainBlob, 'input_image.png');

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
 * Generates an image using the custom Bladdit API, or 4K API if imageQuality is '4k'
 */
const generateSingleImage = async (imageFile: ImageFile, prompt: string, aspectRatio: AspectRatio, referenceImageSource?: string, imageQuality: ImageQuality = 'hd'): Promise<string> => {
    // Route to 4K API if quality is 4k
    if (imageQuality === '4k') {
        return generate4KImage(imageFile, prompt, aspectRatio);
    }

    const formData = new FormData();

    // Process main image
    const mainBlob = await getBlobFromSource(imageFile.base64, imageFile.mimeType);
    formData.append('image', mainBlob, 'input_image.png');

    // If there's a reference image (for character consistency or back view), process it
    if (referenceImageSource) {
        const refBlob = await getBlobFromSource(referenceImageSource, 'image/png');
        formData.append('image', refBlob, 'reference_image.png');
    }

    formData.append('prompt', prompt);
    formData.append('model', 'nanobanana');

    // Map internal aspect ratio strings to API expected strings
    let apiAspectRatio = "match_input_image";
    if (['1:1', '16:9', '9:16'].includes(aspectRatio)) {
        apiAspectRatio = aspectRatio;
    }

    formData.append('aspect_ratio', apiAspectRatio);

    const response = await fetch('https://api.bladdit.com/v1/generate', {
        method: 'POST',
        headers: {
            'accept': 'application/json'
        },
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
    imageQuality: ImageQuality = 'hd'
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
        let activePhotoPrompts = [...photoPrompts];

        if (isBackViewOptional && !backImage) {
            activePhotoPrompts.pop();
        }

        const allPrompts = [coverPrompt, ...activePhotoPrompts];
        const generatedImages: string[] = [];
        let referenceImageForConsistency: string | undefined = undefined;

        if (consistentCharacter) {
            for (let index = 0; index < allPrompts.length; index++) {
                const prompt = allPrompts[index];
                let imageToUse = primaryImage;

                if (backImage && isBackViewOptional && index === allPrompts.length - 1) {
                    imageToUse = backImage;
                }

                const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

                try {
                    const image = await generateSingleImage(imageToUse, finalPrompt, aspectRatio, index > 0 ? referenceImageForConsistency : undefined, imageQuality);
                    onImageGenerated(image, index);
                    generatedImages.push(image);

                    if (index === 0) {
                        referenceImageForConsistency = image;
                    }
                } catch (err) {
                    console.error(`Failed to generate image for prompt index ${index}:`, err);
                }
            }
        } else {
            const promises = allPrompts.map(async (prompt, index) => {
                let imageToUse = primaryImage;
                if (backImage && isBackViewOptional && index === allPrompts.length - 1) {
                    imageToUse = backImage;
                }

                const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

                try {
                    const image = await generateSingleImage(imageToUse, finalPrompt, aspectRatio, undefined, imageQuality);
                    onImageGenerated(image, index);
                    return image;
                } catch (err) {
                    console.error(`Failed to generate image for prompt index ${index}:`, err);
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
    imageQuality: ImageQuality = 'hd'
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

    const generatedImages: string[] = [];
    let referenceImageForConsistency: string | undefined = undefined;

    if (consistentCharacter) {
        for (let index = 0; index < allPrompts.length; index++) {
            const prompt = allPrompts[index];
            const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

            try {
                const image = await generateSingleImage(imageFile, finalPrompt, aspectRatio, index > 0 ? referenceImageForConsistency : undefined, imageQuality);
                onImageGenerated(image, index);
                generatedImages.push(image);

                if (index === 0) {
                    referenceImageForConsistency = image;
                }
            } catch (err) {
                console.error(`Failed to generate image for prompt index ${index}:`, err);
            }
        }
    } else {
        const promises = allPrompts.map(async (prompt, index) => {
            const finalPrompt = `${prompt}\n\n${styleModifier}\n\n${backgroundInstruction}${extraPrompt ? `\n\nADDITIONAL USER INSTRUCTIONS: ${extraPrompt}` : ''}`;

            try {
                const image = await generateSingleImage(imageFile, finalPrompt, aspectRatio, undefined, imageQuality);
                onImageGenerated(image, index);
                return image;
            } catch (err) {
                console.error(`Failed to generate image for prompt index ${index}:`, err);
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
    formData.append('image', await getBlobFromSource(imageFile.base64, imageFile.mimeType), 'product.png');
    if (logoFile) {
        formData.append('image', await getBlobFromSource(logoFile.base64, logoFile.mimeType), 'logo.png');
    }

    const prompt = `TASK: Design a professional marketing poster for the product in the first image.
VISUAL STYLE: High-end, commercial advertisement suitable for social media or print.
${extraDetails ? `CAMPAIGN DETAILS/TEXT: ${extraDetails}` : ''}
${logoFile ? 'INSTRUCTION: Use the logo provided in the second image. Place it elegantly in the design.' : ''}`;

    formData.append('prompt', prompt);
    formData.append('model', 'nanobanana');
    formData.append('aspect_ratio', '4:5');

    const response = await fetch('https://api.bladdit.com/v1/generate', {
        method: 'POST',
        headers: {
            'accept': 'application/json'
        },
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
