

import { GoogleGenAI, Modality } from "@google/genai";
import { ImageFile, ProductType, Category } from '../types';
import { WOMEN_PROMPTS } from './prompts/women';
import { MEN_PROMPTS } from './prompts/men';
import { KIDS_PROMPTS } from './prompts/kids';
// FIX: Removed unnecessary comment.
import { ECOMMERCE_PROMPTS } from "./prompts/ecommerce";
import { STYLE_OPTIONS } from "./styles";
import { PROFESSIONAL_APPAREL_PROMPTS } from "./prompts/professionalApparel";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const generateSingleImage = async (imageFile: ImageFile, prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: imageFile.base64,
                        mimeType: imageFile.mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error('No image was generated for the prompt: ' + prompt);
}

const PROMPT_MAP = {
    women: WOMEN_PROMPTS,
    men: MEN_PROMPTS,
    kids: KIDS_PROMPTS,
    // FIX: Removed unnecessary comment.
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
    apparelStyle: 'general' | 'professional' = 'general'
): Promise<{ coverImage: string; modelImages: string[] }> => {
  try {
    const frontImage = imageFiles.find((_f, i) => i === 0 && _f);
    const backImage = imageFiles.find((_f, i) => i === 1 && _f);

    if (!frontImage && !backImage) {
      throw new Error("At least one product image must be provided.");
    }

    const primaryImage = frontImage || backImage!; // Use front if available, else back.

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
    
    const allPrompts = [coverPrompt, ...photoPrompts];
    
    const backPromptIndex = (productType === 'apparel') 
      ? allPrompts.length - 1 
      : -1;

    const promises = allPrompts.map((prompt, index) => {
        let imageToUse = primaryImage;
        if (backPromptIndex !== -1 && index === backPromptIndex && backImage) {
            imageToUse = backImage;
        }

        return generateSingleImage(imageToUse, `${prompt}\n\n${styleModifier}`)
            .then(image => {
                onImageGenerated(image, index);
                return image;
            })
            .catch(err => {
                console.error(`Failed to generate image for prompt index ${index}:`, err);
                return null;
            });
    });

    const allGeneratedImages = await Promise.all(promises);
    
    const coverImage = allGeneratedImages[0];
    const modelImages = allGeneratedImages.slice(1).filter((img): img is string => img !== null);

    if (!coverImage || modelImages.length < photoPrompts.length) {
        console.warn(`Generated ${modelImages.length} model images, expected ${photoPrompts.length}. Some generations may have failed.`);
        if(!coverImage) throw new Error("Cover image failed to generate.");
    }
    
    return { coverImage, modelImages };
  } catch (error) {
    console.error("Error generating catalogue images:", error);
    throw new Error("Failed to generate one or more images. See console for details.");
  }
};

export const generateAdFilm = async (
    images: ImageFile[],
    category: Category,
    productType: ProductType,
    productName: string,
    onProgress: (message: string) => void,
    aspectRatio: '16:9' | '9:16'
): Promise<string> => {
     if (images.length === 0) {
        throw new Error("At least one image is required to generate an ad film.");
    }
    const referenceImage = images[0];

    try {
        onProgress("Storyboarding your ad film...");
        
        let prompt: string;

        if (productType === 'apparel') {
            prompt = `
VIDEO PRODUCTION BRIEF
IMPORTANT CONTEXT: The reference image provided is an AI-generated synthetic image. The person depicted is not real and does not exist in reality. This is a fictional, creative exercise.
OBJECTIVE: Generate a professional video advertisement for a fashion garment.
ASPECT RATIO: ${aspectRatio} (Strictly enforce this).
REFERENCE IMAGE: The provided image contains the AI-generated model and the specific clothing item.
- VISUAL CONTINUITY: The model's appearance and the clothing item (design, color, texture) from the reference image MUST be perfectly replicated in all generated scenes. This is the most important rule.
SEQUENCE OF SHOTS (Generate 4 distinct scenes):
1.  SCENE 1 - WIDE SHOT: SETTING: Minimalist studio with neutral-toned architectural elements. ACTION: Model holds a confident, static pose. VISUAL EFFECT: A bright, crisp camera flash effect occurs once. CAMERA: Static shot.
2.  SCENE 2 - MEDIUM SHOT: SETTING: Same studio. ACTION: Model is in motion (e.g., a slow turn, walking towards the camera). The motion should showcase the garment's fabric. VISUAL EFFECT: Another distinct camera flash effect. Use quick editing cuts. CAMERA: Follows the model's movement smoothly.
3.  SCENE 3 - EXTREME CLOSE-UP: SETTING: Abstract, focused on the garment. ACTION: A macro-style shot highlighting the garment's fabric texture, stitching, or a specific detail like a button. CAMERA: Very slow push-in or static.
4.  SCENE 4 - HERO SHOT (MEDIUM CLOSE-UP): SETTING: Same studio. ACTION: Model strikes a final, strong pose, looking directly into the lens. LIGHTING: More focused, sculpted lighting to highlight the model's features and the garment's form. CAMERA: Static.
EXECUTION NOTES: Generate new, distinct video scenes for each shot. Do not create a simple animation or video effect from the single source image. The editing should be clean and modern. Overall tone: Professional, high-fashion, clean.
`;
        } else {
            prompt = `
VIDEO PRODUCTION BRIEF
IMPORTANT CONTEXT: The reference image provided is an AI-generated synthetic image. Any person depicted is not real and does not exist in reality. This is a fictional, creative exercise.
OBJECTIVE: Generate a professional video advertisement for a product.
ASPECT RATIO: ${aspectRatio} (Strictly enforce this).
PRODUCT CATEGORY: ${productType}.
REFERENCE IMAGE: The provided image contains the product and potentially an AI-generated model.
- VISUAL CONTINUITY: The product's appearance (design, color, texture) and the model's appearance from the reference image MUST be perfectly replicated in all generated scenes. This is the most important rule.
SEQUENCE OF SHOTS (Generate 3 distinct scenes):
1.  SCENE 1 - WIDE SHOT (ESTABLISHING): SETTING: An elegant, clean, and abstract environment that complements the product. ACTION: The product is presented clearly. CAMERA: Slow, smooth camera movement (e.g., a gentle pan or orbit).
2.  SCENE 2 - MEDIUM SHOT (SHOWCASE): SETTING: Same environment, tighter framing. ACTION: If a model is present, they interact with the product naturally. If no model, the product is shown in motion (e.g., rotating slowly). The goal is to display key features. LIGHTING: Bright, focused, commercial lighting. CAMERA: Follows the action or motion smoothly.
3.  SCENE 3 - CLOSE-UP SHOT (DETAIL): SETTING: Abstract, focused on the product. ACTION: A macro-style shot highlighting the product's fine details, craftsmanship, materials, or texture. CAMERA: Static or a very slow push-in to reveal detail.
EXECUTION NOTES: Generate new, distinct video scenes for each shot. Do not create a simple animation or video effect from the single source image. The visual style should be clean, sophisticated, and well-lit.
`;
        }


        onProgress("Sending request to the film studio...");
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: referenceImage.base64,
                mimeType: referenceImage.mimeType,
            },
            config: {
                numberOfVideos: 1,
                aspectRatio: aspectRatio,
            }
        });

        let pollCount = 0;
        const progressMessages = [
            "Directing the first scene...", "Editing the sequence...", "Applying visual effects...", "Rendering your cinematic ad...", "Polishing the final cut...",
        ];
        
        while (!operation.done) {
            onProgress(progressMessages[pollCount % progressMessages.length]);
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
            pollCount++;
        }

        if ((operation as any).error) {
            const error = (operation as any).error;
            console.error("Ad film generation operation failed:", error);
            const errorMessage = error.message || 'An unknown error occurred during video processing.';
            throw new Error(`Ad film generation failed: ${errorMessage}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            console.error("Ad film response did not contain a download link. Full response:", JSON.stringify(operation.response, null, 2));
            throw new Error("Ad film generation completed, but no download link was found.");
        }

        onProgress("Downloading your final ad film...");
        const separator = downloadLink.includes('?') ? '&' : '?';
        const response = await fetch(`${downloadLink}${separator}key=${process.env.API_KEY}`);

        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        
        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating ad film:", error);
        const message = error instanceof Error ? error.message : "Failed to generate the ad film. Please check the console.";
        throw new Error(message);
    }
};


export const generateProductVideo = async (
    imageFile: ImageFile,
    category: Category,
    productType: ProductType,
    productName: string,
    onProgress: (message: string) => void
): Promise<string> => {
    try {
        onProgress("Crafting the perfect video concept...");
        const prompt = `Create a professional 4K promotional video for a product.
- Product Details: A ${productType} from the ${category} collection, named "${productName || 'our latest release'}".
- Core Requirement: The video must feature the exact product from the provided image. The product's appearance must not be altered in any way.
- Visual Style: Modern, clean, and elegant.
- Camera Work: Use dynamic camera movements, such as orbiting shots and smooth zooms, to showcase the product from various angles.
- Background: A simple, abstract background with a complementary and sophisticated color palette.
- Overall Mood: Professional, premium, and high-quality.`;

        onProgress("Sending request to the video studio...");
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: imageFile.base64,
                mimeType: imageFile.mimeType,
            },
            config: {
                numberOfVideos: 1,
            }
        });

        let pollCount = 0;
        const progressMessages = [
            "Warming up the cameras...", "Animating your product...", "Rendering final scenes...", "Adding cinematic touches...", "Almost there, polishing the final cut...",
        ];
        
        while (!operation.done) {
            onProgress(progressMessages[pollCount % progressMessages.length]);
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
            pollCount++;
        }
        
        if ((operation as any).error) {
            const error = (operation as any).error;
            console.error("Video generation operation failed:", error);
            const errorMessage = error.message || 'An unknown error occurred during video processing.';
            throw new Error(`Video generation failed: ${errorMessage}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            console.error("Video generation response did not contain a download link. Full response:", JSON.stringify(operation.response, null, 2));
            throw new Error("Video generation completed, but no download link was found.");
        }

        onProgress("Downloading your final video...");
        const separator = downloadLink.includes('?') ? '&' : '?';
        const response = await fetch(`${downloadLink}${separator}key=${process.env.API_KEY}`);

        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        
        return videoUrl;

    } catch (error) {
        console.error("Error generating product video:", error);
        const message = error instanceof Error ? error.message : "Failed to generate the video. Please check the console for details.";
        throw new Error(message);
    }
};