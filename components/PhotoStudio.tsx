
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

import { ImageUploader } from './ImageUploader';
import { GeneratedImageGallery } from './GeneratedImageGallery';
import { CatalogueViewer } from './CatalogueViewer';
import { Loader } from './Loader';
import { LoadingScreen } from './LoadingScreen';
import { generateCatalogueImages, identifyProduct, generateOtherProductImages } from '../services/geminiServiceold';
import { DYNAMIC_ORNAMENT_PROMPTS_CONFIG } from '../services/prompts/women';
import { STYLE_OPTIONS } from '../services/styles';
import { ImageFile, ProductType, Category, ApparelStyle, AspectRatio, BackgroundType, ImageQuality } from '../types';
import { GridIcon } from './icons/GridIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { InfoIcon } from './icons/InfoIcon';
import { DiamondIcon } from './icons/DiamondIcon';
import { PurseIcon } from './icons/PurseIcon';
import { PerfumeIcon } from './icons/PerfumeIcon';
import { TshirtIcon } from './icons/TshirtIcon';
import { WomanCrestIcon } from './icons/WomanCrestIcon';
import { ManCrestIcon } from './icons/ManCrestIcon';
import { KidsCrestIcon } from './icons/KidsCrestIcon';
import { WatchIcon } from './icons/WatchIcon';
import { BeltIcon } from './icons/BeltIcon';
import { ToysIcon } from './icons/ToysIcon';
import { GlassButton } from './ui/GlassButton';
import { LimelightNav } from './ui/LimelightNav';
import { EcomCrestIcon } from './icons/EcomCrestIcon';
import { HomeAndKitchenIcon } from './icons/HomeAndKitchenIcon';
import { ElectronicsIcon } from './icons/ElectronicsIcon';
import { OtherProductIcon } from './icons/OtherProductIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { FashionCrestIcon } from './icons/FashionCrestIcon';
import { AccessoriesCrestIcon } from './icons/AccessoriesCrestIcon';
import { BoyCrestIcon } from './icons/BoyCrestIcon';
import { GirlCrestIcon } from './icons/GirlCrestIcon';
import { FurnitureIcon } from './icons/FurnitureIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UnifiedCreditsSummaryBox } from './UnifiedCreditsSummaryBox';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { AspectRatio16x9Icon } from './icons/AspectRatio16x9Icon';
import { AspectRatio9x16Icon } from './icons/AspectRatio9x16Icon';
import { UserIcon } from './icons/UserIcon';
import { addToCache, getCachedItems } from '../utils/cacheManager';


type ViewMode = 'gallery' | 'catalogue';
type StudioPhase = 'category' | 'upload' | 'identification' | 'details' | 'generating' | 'results';
type DownloadingType = 'pdf' | 'zip' | null;
type IdentificationStatus = 'idle' | 'identifying' | 'confirming' | 'inputting';

interface ProductTypeOption {
    id: ProductType;
    name: string;
    icon: React.FC<{ className?: string }>;
}

interface CategoryNode {
    name: string;
    icon: React.FC<{ className?: string }>;
    subCategories?: Record<string, CategoryNode>;
    productTypes?: ProductTypeOption[];
    promptCategory?: Category;
}

const CATEGORY_DATA: Record<string, CategoryNode> = {
    fashion: {
        name: 'Fashion',
        icon: FashionCrestIcon,
        subCategories: {
            women: {
                name: 'Women',
                icon: WomanCrestIcon,
                promptCategory: 'women',
                productTypes: [{ id: 'apparel', name: 'Apparel', icon: TshirtIcon }]
            },
            men: {
                name: 'Men',
                icon: ManCrestIcon,
                promptCategory: 'men',
                productTypes: [{ id: 'apparel', name: 'Apparel', icon: TshirtIcon }]
            },
            kids: {
                name: 'Kids',
                icon: KidsCrestIcon,
                subCategories: {
                    boy: {
                        name: 'Boy',
                        icon: BoyCrestIcon,
                        promptCategory: 'kids',
                        productTypes: [{ id: 'apparel', name: 'Apparel', icon: TshirtIcon }]
                    },
                    girl: {
                        name: 'Girl',
                        icon: GirlCrestIcon,
                        promptCategory: 'kids',
                        productTypes: [{ id: 'apparel', name: 'Apparel', icon: TshirtIcon }]
                    }
                }
            }
        }
    },
    accessories: {
        name: 'Accessories',
        icon: AccessoriesCrestIcon,
        subCategories: {
            women: {
                name: 'Women',
                icon: WomanCrestIcon,
                subCategories: {
                    purse: {
                        name: 'Purse',
                        icon: PurseIcon,
                        promptCategory: 'women',
                        productTypes: [{ id: 'purse', name: 'Purse', icon: PurseIcon }]
                    },
                    perfume: {
                        name: 'Perfume',
                        icon: PerfumeIcon,
                        promptCategory: 'women',
                        productTypes: [{ id: 'perfume', name: 'Perfume', icon: PerfumeIcon }]
                    },
                    ornaments: {
                        name: 'Ornaments',
                        icon: DiamondIcon,
                        subCategories: {
                            necklace: {
                                name: 'Necklace',
                                icon: DiamondIcon,
                                promptCategory: 'women',
                                productTypes: [{ id: 'jewelry', name: 'Necklace', icon: DiamondIcon }]
                            },
                            other: {
                                name: 'Other',
                                icon: SparklesIcon,
                                promptCategory: 'women',
                                productTypes: [{ id: 'other_ornament', name: 'Other', icon: SparklesIcon }]
                            }
                        }
                    }
                }
            },
            men: {
                name: 'Men',
                icon: ManCrestIcon,
                promptCategory: 'men',
                productTypes: [
                    { id: 'watch', name: 'Watch', icon: WatchIcon },
                    { id: 'belt', name: 'Belt', icon: BeltIcon },
                    { id: 'perfume', name: 'Perfume', icon: PerfumeIcon }
                ]
            },
            kids: {
                name: 'Kids',
                icon: KidsCrestIcon,
                subCategories: {
                    boy: {
                        name: 'Boy',
                        icon: BoyCrestIcon,
                        promptCategory: 'kids',
                        productTypes: [{ id: 'toys', name: 'Toys', icon: ToysIcon }]
                    },
                    girl: {
                        name: 'Girl',
                        icon: GirlCrestIcon,
                        promptCategory: 'kids',
                        productTypes: [{ id: 'toys', name: 'Toys', icon: ToysIcon }]
                    }
                }
            }
        }
    },
    ecommerce: {
        name: 'E-commerce',
        icon: EcomCrestIcon,
        promptCategory: 'ecommerce',
        productTypes: [
            { id: 'home-and-kitchen', name: 'Home & Kitchen', icon: HomeAndKitchenIcon },
            { id: 'electronics', name: 'Electronics', icon: ElectronicsIcon },
            { id: 'furniture', name: 'Furniture', icon: FurnitureIcon },
            { id: 'other', name: 'Other', icon: OtherProductIcon },
        ]
    }
};

const OTHER_ORNAMENT_OPTIONS = ['Brooch', 'Mang tika', 'Nose pin', 'Finger ring', 'Ear rings', 'Ladies bracelet', 'Buckle'];

const ASPECT_RATIOS: { id: AspectRatio; label: string; icon?: React.FC<{ className?: string }> }[] = [
    { id: '9:16', label: '9:16 (Story)', icon: AspectRatio9x16Icon },
    { id: '16:9', label: '16:9 (Cinema)', icon: AspectRatio16x9Icon },
    { id: '1:1', label: '1:1 (Square)' },
    { id: '4:5', label: '4:5 (Classic)' },
    { id: '3:2', label: '3:2 (Camera)' },
];

const BACKGROUND_OPTIONS: { id: BackgroundType; label: string }[] = [
    { id: 'studio', label: 'Neutral Studio' },
    { id: 'white', label: 'Solid White' },
    { id: 'black', label: 'Solid Black' },
    { id: 'workspace', label: 'Lifestyle Workspace' },
    { id: 'city', label: 'Urban / City' },
    { id: 'historic', label: 'Historical / Heritage' },
    { id: 'custom', label: 'Custom Prompt' },
];

const IMAGE_QUALITY_OPTIONS: { id: ImageQuality; label: string }[] = [
    { id: 'HD', label: 'HD' },
    { id: '4K', label: '4K' },
];

// --- Sub-Components ---

// Image sets for each category/subcategory card
const CATEGORY_IMAGES: Record<string, string[]> = {
    // Top-level categories
    fashion: [
        '/assets/images/image_carousel/fashion/webp/fashion-1.webp',
        '/assets/images/image_carousel/fashion/webp/fashion-2.webp',
        '/assets/images/image_carousel/fashion/webp/fashion-3.webp',
    ],
    accessories: [
        '/assets/images/image_carousel/accessories/webp/accessories-1.webp',
        '/assets/images/image_carousel/accessories/webp/accessories-2.webp',
        '/assets/images/image_carousel/accessories/webp/accessories-3.webp',
    ],
    ecommerce: [
        '/assets/images/image_carousel/product/webp/product-1.webp',
        '/assets/images/image_carousel/product/webp/product-2.webp',
        '/assets/images/image_carousel/product/webp/product-3.webp',
    ],
    // Fashion sub-categories - correct gender mapping
    women: [
        '/assets/images/image_carousel/fashion/webp/fashion-1.webp',
        '/assets/images/hero-carousel/a4/webp/a4-1.webp',
        '/assets/images/hero-carousel/a2/webp/a2-1.webp',
    ],
    men: [
        '/assets/images/image_carousel/fashion/webp/fashion-2.webp',
        '/assets/images/hero-carousel/a4/webp/a4-2.webp',
        '/assets/images/hero-carousel/a4/webp/a4-3.webp',
    ],
    kids: [
        '/assets/images/hero-carousel/a1/webp/a1-1.webp',
        '/assets/images/hero-carousel/a3/webp/a3-1.webp',
        '/assets/images/image_carousel/fashion/webp/fashion-3.webp',
    ],
    // Kids sub-categories
    boy: [
        '/assets/images/hero-carousel/a1/webp/a1-1.webp',
        '/assets/images/hero-carousel/a1/webp/a1-2.webp',
        '/assets/images/hero-carousel/a1/webp/a1-3.webp',
    ],
    girl: [
        '/assets/images/hero-carousel/a3/webp/a3-1.webp',
        '/assets/images/hero-carousel/a3/webp/a3-2.webp',
        '/assets/images/image_carousel/fashion/webp/fashion-3.webp',
    ],
    // Deeper sub-categories
    purse: [
        '/assets/images/image_carousel/accessories/webp/accessories-1.webp',
        '/assets/images/image_carousel/accessories/webp/accessories-2.webp',
        '/assets/images/image_carousel/accessories/webp/accessories-3.webp',
    ],
    perfume: [
        '/assets/images/hero-carousel/a5/webp/a5-1.webp',
        '/assets/images/hero-carousel/a5/webp/a5-2.webp',
        '/assets/images/hero-carousel/a5/webp/a5-3.webp',
    ],
    ornaments: [
        '/assets/images/hero-carousel/a2/webp/a2-1.webp',
        '/assets/images/hero-carousel/a2/webp/a2-2.webp',
        '/assets/images/hero-carousel/a2/webp/a2-3.webp',
    ],
};

// Shared hook for cycling images
const useCycleIndex = (length: number, intervalMs = 2500) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        if (length <= 1) return;
        const timer = setInterval(() => setIndex(prev => (prev + 1) % length), intervalMs);
        return () => clearInterval(timer);
    }, [length, intervalMs]);
    return index;
};

const CategorySelection: React.FC<{
    onSelectionComplete: (productTypes: ProductTypeOption[], promptCategory: Category) => void;
    onBack: () => void;
}> = ({ onSelectionComplete, onBack }) => {
    const [path, setPath] = useState<string[]>([]);
    const cycleIndex = useCycleIndex(3, 2500);

    const getCurrentNode = () => {
        let node: { subCategories?: Record<string, CategoryNode>; name: string } = { subCategories: CATEGORY_DATA, name: "Main" };
        for (const key of path) {
            if (node.subCategories && node.subCategories[key]) {
                node = node.subCategories[key];
            } else {
                return null;
            }
        }
        return node;
    };

    const handleSelect = (key: string) => {
        const newPath = [...path, key];
        let currentNode: CategoryNode | undefined = CATEGORY_DATA[newPath[0]];
        for (let i = 1; i < newPath.length; i++) {
            currentNode = currentNode?.subCategories?.[newPath[i]];
        }

        if (currentNode?.productTypes && currentNode.promptCategory) {
            onSelectionComplete(currentNode.productTypes, currentNode.promptCategory);
        } else if (currentNode?.subCategories) {
            setPath(newPath);
        }
    };

    const goBack = () => {
        if (path.length > 0) {
            setPath(prev => prev.slice(0, -1));
        } else {
            onBack();
        }
    };

    const currentNode = getCurrentNode();
    const options = currentNode?.subCategories ? Object.entries(currentNode.subCategories) : [];

    const title = path.length > 0 ? `${currentNode?.name}` : "Studio Setup";
    const subtitle = path.length === 0 ? "Select your production track" : `Select specialized category`;

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
            <div className="text-center relative mb-10 md:mb-16">
                <button
                    onClick={goBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-bold">Back</span>
                </button>
                <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter mb-4">{title}</h2>
                <p className="text-neutral-500 font-light text-lg">{subtitle}</p>
            </div>
            <div className={`w-full max-w-sm md:max-w-5xl mx-auto grid grid-cols-2 ${options.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
                {options.map(([key, node]) => {
                    const images = CATEGORY_IMAGES[key];
                    return (
                        <GlassButton key={key} onClick={() => handleSelect(key)} className="group w-full">
                            <div className="flex flex-col w-full items-center overflow-hidden rounded-xl">
                                {/* Image area */}
                                {images && images.length > 0 ? (
                                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
                                        {images.map((src, i) => (
                                            <img
                                                key={src}
                                                src={src}
                                                alt={node.name}
                                                loading="lazy"
                                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105 transition-transform duration-500"
                                                style={{ opacity: cycleIndex === i ? 1 : 0 }}
                                            />
                                        ))}
                                        {/* Gradient overlay at bottom */}
                                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="w-full py-8 flex items-center justify-center">
                                        <node.icon className="w-12 h-12 md:w-16 md:h-16 text-gold-500/80 group-hover:text-gold-400 transition-all duration-500 group-hover:scale-110" />
                                    </div>
                                )}
                                {/* Label below image */}
                                <div className="w-full py-3 md:py-4 text-center">
                                    <h2 className="font-sans font-bold text-xs md:text-sm text-white uppercase tracking-[0.3em]">{node.name}</h2>
                                </div>
                            </div>
                        </GlassButton>
                    );
                })}
            </div>
        </div>
    );
};

interface DetailsStepProps {
    imageFiles: ImageFile[];
    productType: ProductType;
    productTypes: { id: ProductType; name: string; icon: React.FC<{ className?: string }> }[];
    onProductTypeChange: (productType: ProductType) => void;
    apparelStyle: ApparelStyle;
    onApparelStyleChange: (style: ApparelStyle) => void;
    productName: string;
    onProductNameChange: (name: string) => void;
    creatorName: string;
    onCreatorNameChange: (name: string) => void;
    selectedStyle: string;
    onStyleChange: (styleId: string) => void;
    onGenerate: () => void;
    onImageUpload: (file: ImageFile, index: number) => void;
    isLoading: boolean;
    otherOrnamentType: string;
    onOtherOrnamentTypeChange: (type: string) => void;
    extraPrompt: string;
    onExtraPromptChange: (val: string) => void;
    aspectRatio: AspectRatio;
    onAspectRatioChange: (ratio: AspectRatio) => void;
    consistentCharacter: boolean;
    onConsistentCharacterChange: (enabled: boolean) => void;
    background: BackgroundType;
    onBackgroundChange: (bg: BackgroundType) => void;
    imageQuality: ImageQuality;
    onImageQualityChange: (quality: ImageQuality) => void;
    numberOfImages: number;
    onNumberOfImagesChange: (count: number) => void;
    customBackground: string;
    onCustomBackgroundChange: (val: string) => void;
    remainingCredits?: number | null;
    totalCredits?: number | null;
    usedPhotoshootCredits?: number;
    usedMarketingCredits?: number;
    navigate: ReturnType<typeof useNavigate>;
    isAuthenticated: boolean;
    isPaidUser: boolean;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
    imageFiles,
    productType,
    productTypes,
    onProductTypeChange,
    apparelStyle,
    onApparelStyleChange,
    productName,
    onProductNameChange,
    creatorName,
    onCreatorNameChange,
    selectedStyle,
    onStyleChange,
    onGenerate,
    onImageUpload,
    isLoading,
    otherOrnamentType,
    onOtherOrnamentTypeChange,
    extraPrompt,
    onExtraPromptChange,
    aspectRatio,
    onAspectRatioChange,
    consistentCharacter,
    onConsistentCharacterChange,
    background,
    onBackgroundChange,
    imageQuality,
    onImageQualityChange,
    numberOfImages,
    onNumberOfImagesChange,
    customBackground,
    onCustomBackgroundChange,
    remainingCredits,
    totalCredits,
    usedPhotoshootCredits,
    usedMarketingCredits,
    navigate,
    isAuthenticated,
    isPaidUser
}) => {
    // PRO feature gating
    const PRO_QUALITY_IDS = ['4k'];
    const PRO_STYLE_IDS = ['cinematic', 'vintage'];
    const PRO_BACKGROUND_IDS = ['workspace', 'city', 'historic', 'custom'];
    const [shakeId, setShakeId] = useState<string | null>(null);
    const [proToast, setProToast] = useState(false);

    const triggerProLock = (id: string) => {
        setShakeId(id);
        setProToast(true);
        setTimeout(() => setShakeId(null), 600);
        setTimeout(() => setProToast(false), 2500);
    };
    const isOtherOrnament = productType === 'other_ornament';
    const isApparel = productType === 'apparel';
    const hasImage = imageFiles.some(f => f);

    // Build nav items for product type selector
    const navItems: import('./ui/LimelightNav').NavItem[] = productTypes.map(p => ({
        id: p.id,
        icon: <p.icon />,
        label: p.name,
    }));
    const activeProductTypeIndex = productTypes.findIndex(p => p.id === productType);
    const handleTabChange = (index: number) => {
        const newPt = productTypes[index];
        if (newPt) onProductTypeChange(newPt.id);
    };

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in-up px-3 sm:px-4">
            {/* Heading — smaller on mobile */}
            <h2 className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-normal text-center mb-3 sm:mb-4">Bring Your Product to <span className="italic text-neutral-400">Life</span></h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {/* ──── LEFT PANEL: Product Type + Upload ──── */}
                <div className="space-y-2">
                    {/* Product Type Selector */}
                    {productTypes.length > 1 && (
                        <div className="bg-neutral-900/40 backdrop-blur-sm rounded-lg border border-white/5 px-3 py-2">
                            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-1.5 text-center">Product Type</p>
                            <div className="flex justify-center">
                                <LimelightNav
                                    items={navItems}
                                    defaultActiveIndex={activeProductTypeIndex}
                                    onTabChange={handleTabChange}
                                    className="bg-neutral-900/50 border-neutral-700/50"
                                    iconClassName="w-5 h-5"
                                    iconContainerClassName="px-3 py-2"
                                />
                            </div>
                        </div>
                    )}

                    {/* Apparel Style Toggle */}
                    {isApparel && (
                        <div className="bg-neutral-900/40 backdrop-blur-sm rounded-lg border border-white/5 px-3 py-2 animate-fade-in">
                            <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-1.5 text-center">Apparel Style</p>
                            <div className="flex gap-1 p-0.5 rounded-md bg-neutral-800/50">
                                <button
                                    onClick={() => onApparelStyleChange('general')}
                                    className={`w-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded transition-all duration-300 ${apparelStyle === 'general' ? 'bg-neutral-900 text-gold-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
                                >
                                    General
                                </button>
                                <button
                                    onClick={() => onApparelStyleChange('professional')}
                                    className={`w-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded transition-all duration-300 ${apparelStyle === 'professional' ? 'bg-neutral-900 text-gold-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
                                >
                                    Professional
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Image Upload Area */}
                    <div className="bg-neutral-900/40 backdrop-blur-sm rounded-lg border border-white/5 p-2.5 sm:p-3">
                        {isApparel ? (
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div>
                                    <p className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 ml-0.5">Front</p>
                                    <ImageUploader onImageUpload={(file) => onImageUpload(file, 0)} initialPreview={imageFiles[0]?.previewUrl} enableAnimation={true} aspectRatio="aspect-[4/5]" />
                                </div>
                                <div>
                                    <p className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 ml-0.5">Back <span className="text-neutral-600">(Opt.)</span></p>
                                    <ImageUploader onImageUpload={(file) => onImageUpload(file, 1)} initialPreview={imageFiles[1]?.previewUrl} enableAnimation={true} aspectRatio="aspect-[4/5]" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 ml-0.5">Product Asset</p>
                                <ImageUploader onImageUpload={(file) => onImageUpload(file, 0)} initialPreview={imageFiles[0]?.previewUrl} enableAnimation={true} aspectRatio="aspect-[4/3]" />
                            </div>
                        )}
                    </div>
                </div>

                {/* ──── RIGHT PANEL: Production Details ──── */}
                <div className={`transition-all duration-500 ${hasImage ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'}`}>
                    {!hasImage && (
                        <div className="text-center py-1.5 sm:py-2 mb-2 rounded-lg bg-gold-500/5 border border-gold-500/10">
                            <p className="text-xs sm:text-sm text-gold-400/80 font-medium"><span className="lg:hidden">↑</span><span className="hidden lg:inline">←</span> Upload a photo to unlock details</p>
                        </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-3">
                        {/* Identity + Label */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div>
                                <label htmlFor="creator-name-input" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Identity</label>
                                <input
                                    id="creator-name-input"
                                    name="creatorName"
                                    type="text"
                                    value={creatorName}
                                    onChange={(e) => onCreatorNameChange(e.target.value)}
                                    placeholder="Brand / Label"
                                    className="w-full bg-neutral-900/50 border border-white/5 rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-neutral-700"
                                />
                            </div>
                            <div>
                                <label htmlFor={isOtherOrnament ? "other-ornament-select" : "product-name-input"} className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Label</label>
                                {isOtherOrnament ? (
                                    <select
                                        id="other-ornament-select"
                                        name="otherOrnamentType"
                                        value={otherOrnamentType}
                                        onChange={(e) => onOtherOrnamentTypeChange(e.target.value)}
                                        className="w-full bg-neutral-900/50 border border-white/5 rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white focus:outline-none appearance-none"
                                    >
                                        {OTHER_ORNAMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        id="product-name-input"
                                        name="productName"
                                        type="text"
                                        value={productName}
                                        onChange={(e) => onProductNameChange(e.target.value)}
                                        placeholder="Product Name"
                                        className="w-full bg-neutral-900/50 border border-white/5 rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-neutral-700"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Canvas + Environment */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div>
                                <label htmlFor="aspect-ratio-select" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Canvas</label>
                                <div className="relative">
                                    <select
                                        id="aspect-ratio-select"
                                        name="aspectRatio"
                                        value={aspectRatio}
                                        onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
                                        className="w-full bg-neutral-900/50 border border-white/5 rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white focus:outline-none appearance-none"
                                    >
                                        {ASPECT_RATIOS.map((ratio) => (
                                            <option key={ratio.id} value={ratio.id}>{ratio.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-600 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="background-select" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Environment</label>
                                <div className="relative">
                                    <select
                                        id="background-select"
                                        name="background"
                                        value={background}
                                        onChange={(e) => {
                                            const val = e.target.value as BackgroundType;
                                            if (PRO_BACKGROUND_IDS.includes(val) && !isPaidUser) {
                                                e.target.value = background; // reset
                                                triggerProLock(`bg-${val}`);
                                                return;
                                            }
                                            onBackgroundChange(val);
                                        }}
                                        className="w-full bg-neutral-900/50 border border-white/5 rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white focus:outline-none appearance-none"
                                    >
                                        {BACKGROUND_OPTIONS.map((opt) => {
                                            const isProLocked = PRO_BACKGROUND_IDS.includes(opt.id) && !isPaidUser;
                                            return (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.label}{isProLocked ? ' ✦ PRO' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-600 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Image Quality + Persona */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div>
                                <label htmlFor="image-quality-select" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Image Quality</label>
                                <div className="flex gap-1 p-0.5 rounded-md bg-neutral-800/50">
                                    {IMAGE_QUALITY_OPTIONS.map((opt) => {
                                        const isProLocked = PRO_QUALITY_IDS.includes(opt.id) && !isPaidUser;
                                        const isActive = imageQuality === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => {
                                                    if (isProLocked) { triggerProLock(`quality-${opt.id}`); return; }
                                                    onImageQualityChange(opt.id as ImageQuality);
                                                }}
                                                className={`relative w-full px-2 py-1.5 text-[10px] sm:text-[11px] font-semibold rounded transition-all duration-300 flex items-center justify-center gap-1 ${isActive && !isProLocked
                                                    ? 'bg-neutral-900 text-gold-400 shadow-sm'
                                                    : isProLocked
                                                        ? 'text-neutral-600 cursor-not-allowed'
                                                        : 'text-neutral-300 hover:bg-neutral-700'
                                                    } ${shakeId === `quality-${opt.id}` ? 'animate-shake' : ''}`}
                                            >
                                                {opt.label}
                                                {PRO_QUALITY_IDS.includes(opt.id) && !isPaidUser && (
                                                    <span className="text-[7px] font-black tracking-wider text-amber-500/80 bg-amber-500/10 px-1 py-px rounded">PRO</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Persona</label>
                                <button
                                    onClick={() => onConsistentCharacterChange(!consistentCharacter)}
                                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md border transition-all duration-300 ${consistentCharacter ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' : 'bg-neutral-900/50 border-white/5 text-neutral-500'}`}
                                >
                                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Lock</span>
                                    <div className={`w-7 h-3.5 sm:w-8 sm:h-4 rounded-full relative flex-shrink-0 ${consistentCharacter ? 'bg-gold-600' : 'bg-neutral-700'}`}>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform ${consistentCharacter ? 'translate-x-3.5 sm:translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Number of Images */}
                        <div>
                            <label htmlFor="number-of-images-select" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Number of Images</label>
                            <div className="relative">
                                <select
                                    id="number-of-images-select"
                                    name="numberOfImages"
                                    value={numberOfImages}
                                    onChange={(e) => onNumberOfImagesChange(Number(e.target.value))}
                                    className="w-full bg-neutral-900/50 border border-white/5 rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white focus:outline-none appearance-none"
                                >
                                    <option value={2}>2 Images</option>
                                    <option value={4}>4 Images</option>
                                    <option value={6}>6 Images</option>
                                </select>
                                <ChevronDownIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-600 pointer-events-none" />
                            </div>
                            <p className="mt-1.5 text-[9px] sm:text-[10px] text-gold-400/80 font-medium tracking-wide">
                                This will use <span className="text-gold-400 font-bold">{numberOfImages * (imageQuality === '4K' ? 40 : 20)}</span> Credits
                            </p>
                        </div>

                        {background === 'custom' && (
                            <div className="animate-fade-in">
                                <label htmlFor="custom-background-input" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Custom Background</label>
                                <input
                                    id="custom-background-input"
                                    name="customBackground"
                                    type="text"
                                    value={customBackground}
                                    onChange={(e) => onCustomBackgroundChange(e.target.value)}
                                    placeholder="Describe the background..."
                                    className="w-full bg-neutral-900/50 border border-white/5 rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm text-white focus:outline-none"
                                />
                            </div>
                        )}

                        {/* Aesthetic Direction */}
                        <div>
                            <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-500 mb-1 block">Aesthetic Direction</label>
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                {STYLE_OPTIONS.map((style) => {
                                    const isProLocked = PRO_STYLE_IDS.includes(style.id) && !isPaidUser;
                                    const isActive = selectedStyle === style.id;
                                    return (
                                        <button
                                            key={style.id}
                                            onClick={() => {
                                                if (isProLocked) { triggerProLock(`style-${style.id}`); return; }
                                                onStyleChange(style.id);
                                            }}
                                            className={`relative py-1.5 sm:py-2 px-2 sm:px-3 rounded text-[9px] sm:text-[10px] uppercase tracking-wider font-bold border transition-all flex items-center justify-center gap-1.5 ${isActive && !isProLocked
                                                ? 'bg-gold-600 text-white border-gold-500 shadow-sm shadow-gold-900/20'
                                                : isProLocked
                                                    ? 'bg-neutral-900/50 text-neutral-600 border-white/5 cursor-not-allowed'
                                                    : 'bg-neutral-900/50 text-neutral-500 border-white/5 hover:border-white/20'
                                                } ${shakeId === `style-${style.id}` ? 'animate-shake' : ''}`}
                                        >
                                            {style.name}
                                            {isProLocked && (
                                                <span className="text-[7px] font-black tracking-wider text-amber-500/80 bg-amber-500/10 px-1 py-px rounded">PRO</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* PRO Toast Notification */}
                        {proToast && (
                            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
                                <div className="bg-neutral-900/95 backdrop-blur-md border border-amber-500/30 rounded-lg px-5 py-3 shadow-xl shadow-black/40 flex items-center gap-3">
                                    <span className="text-[9px] font-black tracking-wider text-amber-500 bg-amber-500/15 px-1.5 py-0.5 rounded">PRO</span>
                                    <span className="text-sm text-neutral-300">Upgrade your plan to unlock this feature</span>
                                    <button
                                        onClick={() => navigate('/pricing')}
                                        className="text-[9px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors ml-2"
                                    >
                                        View Plans →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Generate Button */}
                        <div className="pt-0.5 sm:pt-1">
                            {!isAuthenticated ? (
                                <button
                                    onClick={() => navigate('/login', { state: { from: { pathname: '/studio' } } })}
                                    className="w-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white bg-gradient-to-r from-orange-500 via-gold-500 to-gold-500 hover:from-orange-600 hover:via-gold-600 hover:to-gold-600 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg shadow-orange-950/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2"
                                >
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    LOG IN TO GENERATE
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={onGenerate}
                                        disabled={!hasImage || !creatorName || isLoading || (remainingCredits !== null && remainingCredits < (numberOfImages * (imageQuality === '4K' ? 40 : 20)))}
                                        className="w-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white bg-gold-700 hover:bg-gold-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg shadow-gold-950/40 transition-all transform hover:-translate-y-0.5 disabled:transform-none"
                                    >
                                        {isLoading ? 'Processing...' : 'Generate Photoshoot'}
                                    </button>
                                    {totalCredits !== null && (
                                        <div className="mt-2 space-y-1.5">
                                            <UnifiedCreditsSummaryBox
                                                totalCredits={totalCredits}
                                                usedPhotoshootCredits={usedPhotoshootCredits}
                                                usedMarketingCredits={usedMarketingCredits}
                                            />
                                            {remainingCredits < 20 && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        navigate('/pricing');
                                                    }}
                                                    className="w-full text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-white bg-gradient-to-r from-gold-600 to-gold-600 hover:from-gold-500 hover:to-gold-500 font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-md shadow-sm shadow-gold-950/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                                                >
                                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Get More Credits
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PhotoStudio: React.FC<{ onExit: () => void; onContentGenerated: () => void; onPhaseChange?: (phase: string) => void; onJumpToPhaseRef?: (fn: (phase: string) => void) => void; }> = ({ onExit, onContentGenerated, onPhaseChange, onJumpToPhaseRef }) => {
    const navigate = useNavigate();
    const [totalCredits, setTotalCredits] = useState<number | null>(null);
    const [usedPhotoshootCredits, setUsedPhotoshootCredits] = useState<number>(0);
    const [usedMarketingCredits, setUsedMarketingCredits] = useState<number>(0);
    const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
    const [isPaidUser, setIsPaidUser] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const fetchCredits = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setTotalCredits(null);
            setRemainingCredits(null);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/credits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setTotalCredits(data.totalCredits);
                setUsedPhotoshootCredits(data.usedPhotoshootCredits);
                setUsedMarketingCredits(data.usedMarketingCredits);
                setRemainingCredits(data.remainingCredits);
                setIsPaidUser(Boolean(data.subscriptionPlan));
            }
        } catch (err) {
            console.error('Failed to fetch credits:', err);
        }
    }, []);

    useEffect(() => {
        // Check authentication status
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        if (token) {
            fetchCredits();
            // Refresh credits every 5 seconds to catch payment/admin updates (reduced to avoid rate limits)
            const interval = setInterval(fetchCredits, 5000); // Every 5 seconds
            return () => clearInterval(interval);
        }
    }, [fetchCredits]);
    const [phase, setPhase] = useState<StudioPhase>('category');

    // Notify parent of phase changes so sidebar can update step indicator
    useEffect(() => {
        onPhaseChange?.(phase);
    }, [phase, onPhaseChange]);

    // Register jump function so parent/sidebar can navigate to any phase
    useEffect(() => {
        onJumpToPhaseRef?.((targetPhase: string) => {
            setPhase(targetPhase as StudioPhase);
        });
    }, [onJumpToPhaseRef]);


    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [modelImages, setModelImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [downloadingType, setDownloadingType] = useState<DownloadingType>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('gallery');
    const catalogueRef = useRef<HTMLDivElement>(null);

    const [promptCategory, setPromptCategory] = useState<Category | null>(null);
    const [currentProductTypes, setCurrentProductTypes] = useState<ProductTypeOption[]>([]);
    const [productType, setProductType] = useState<ProductType>('jewelry');
    const [productName, setProductName] = useState<string>('');
    const [creatorName, setCreatorName] = useState<string>('');
    const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_OPTIONS[0].id);
    const [loadingImages, setLoadingImages] = useState<string[]>([]);
    const [apparelStyle, setApparelStyle] = useState<ApparelStyle>('general');
    const [loadingMessage, setLoadingMessage] = useState<string>("");
    const [otherOrnamentType, setOtherOrnamentType] = useState<string>(OTHER_ORNAMENT_OPTIONS[0]);
    const [extraPrompt, setExtraPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
    const [consistentCharacter, setConsistentCharacter] = useState<boolean>(false);
    const [background, setBackground] = useState<BackgroundType>('studio');
    const [imageQuality, setImageQuality] = useState<ImageQuality>('HD');
    const [numberOfImages, setNumberOfImages] = useState<number>(2);
    const [customBackground, setCustomBackground] = useState<string>('');

    const [identificationStatus, setIdentificationStatus] = useState<IdentificationStatus>('idle');
    const [identifiedProductName, setIdentifiedProductName] = useState<string>('');
    const [manualProductName, setManualProductName] = useState<string>('');

    // Notify parent about phase changes for sidebar tracking
    useEffect(() => {
        onPhaseChange?.(phase);
    }, [phase, onPhaseChange]);

    useEffect(() => {
        if (phase === 'identification' && imageFiles.length > 0 && identificationStatus === 'idle') {
            const identify = async () => {
                setIdentificationStatus('identifying');
                setError(null);
                try {
                    setLoadingMessage("Identifying product...");
                    const name = await identifyProduct(imageFiles[0]);
                    setIdentifiedProductName(name);
                    setIdentificationStatus('confirming');
                } catch (err) {
                    setError('Manual identification required.');
                    setIdentificationStatus('inputting');
                } finally {
                    setLoadingMessage("");
                }
            };
            identify();
        }
    }, [phase, imageFiles, identificationStatus]);

    const handleSelectionComplete = (productTypes: ProductTypeOption[], category: Category) => {
        setPromptCategory(category);
        setCurrentProductTypes(productTypes);
        if (productTypes.length > 0) {
            setProductType(productTypes[0].id);
        }
        setPhase('details');
    };

    const handleImageUpload = (file: ImageFile, index: number) => {
        const newFiles = [...imageFiles];
        newFiles[index] = file;
        if (productType !== 'apparel') {
            setImageFiles([file]);
        } else {
            setImageFiles(newFiles);
        }
    };

    const handleProceedToDetails = () => {
        if (imageFiles.some(f => f)) {
            setModelImages([]);
            setCoverImage(null);
            setError(null);
            setViewMode('gallery');
            if (productType === 'other') {
                setPhase('identification');
            } else {
                setPhase('details');
            }
        }
    };

    const handleGeneration = useCallback(async (productNameOverride?: string) => {
        if (imageFiles.length === 0 || !promptCategory) {
            setError('Asset or Category missing.');
            return;
        }

        if (productType !== 'other' && !creatorName) {
            setError('Identity is required.');
            return;
        }

        // Check credits before generation
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const checkRes = await fetch(`${API_URL}/api/credits/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ type: 'photoshoot', imageQuality, numberOfImages }),
                });
                const checkData = await checkRes.json();

                if (!checkData.success || !checkData.hasCredits) {
                    const errorMsg = checkData.message || 'You have no photoshoot credits remaining.';
                    setError(errorMsg);
                    return;
                }
            } catch (err) {
                console.error('Credit check error:', err);
                // Continue with generation if credit check fails (for development/testing)
            }
        }

        setIsLoading(true);
        setPhase('generating');
        setError(null);
        setLoadingImages([]);
        setCoverImage(null);
        setModelImages([]);

        try {
            const onImageGenerated = (image: string, index: number) => {
                setLoadingImages(prev => {
                    const newImages = [...prev];
                    newImages[index] = image;
                    return newImages;
                });
            };

            let result;
            if (productType === 'other') {
                const nameToUse = productNameOverride || identifiedProductName;
                if (!nameToUse) throw new Error('Label required.');
                const finalCreatorName = creatorName || 'Indie Brand';
                setProductName(nameToUse);
                setCreatorName(finalCreatorName);
                result = await generateOtherProductImages(imageFiles[0], nameToUse, selectedStyle, onImageGenerated, undefined, extraPrompt, aspectRatio, consistentCharacter, background, customBackground, imageQuality, numberOfImages);
            } else if (productType === 'other_ornament') {
                const nameToUse = otherOrnamentType;
                setProductName(nameToUse);
                result = await generateOtherProductImages(imageFiles[0], nameToUse, selectedStyle, onImageGenerated, DYNAMIC_ORNAMENT_PROMPTS_CONFIG, extraPrompt, aspectRatio, consistentCharacter, background, customBackground, imageQuality, numberOfImages);
            } else {
                result = await generateCatalogueImages(imageFiles, promptCategory, productType, selectedStyle, onImageGenerated, apparelStyle, extraPrompt, aspectRatio, consistentCharacter, background, customBackground, imageQuality, numberOfImages);
            }

            setCoverImage(result.coverImage);
            setModelImages(result.modelImages);
            setPhase('results');
            onContentGenerated();

            // Add images to cache for "Previously Generated" page
            // Convert remote URLs to data URLs for persistence in localStorage
            try {
                console.log('🔄 Starting cache process for PhotoStudio images...');

                // Helper function to convert URL to data URL
                const convertUrlToDataUrl = async (url: string): Promise<string> => {
                    if (url.startsWith('data:')) {
                        return url; // Already a data URL
                    }

                    try {
                        console.log('🔄 Converting remote URL to data URL:', url.substring(0, 100));
                        const response = await fetch(url, { mode: 'cors', cache: 'no-cache' });
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        const blob = await response.blob();
                        if (blob.size === 0) {
                            throw new Error('Blob is empty');
                        }
                        const reader = new FileReader();
                        return await new Promise<string>((resolve, reject) => {
                            const timeout = setTimeout(() => {
                                reject(new Error('FileReader timeout'));
                            }, 10000);
                            reader.onloadend = () => {
                                clearTimeout(timeout);
                                resolve(reader.result as string);
                            };
                            reader.onerror = () => {
                                clearTimeout(timeout);
                                reject(new Error('FileReader failed'));
                            };
                            reader.readAsDataURL(blob);
                        });
                    } catch (error) {
                        console.error('❌ Failed to convert URL to data URL:', error);
                        // Return original URL as fallback
                        return url;
                    }
                };

                // Cache cover image
                if (result.coverImage) {
                    const cachePrompt = `${promptCategory} photoshoot - ${selectedStyle || 'Standard'} style`;
                    const coverDataUrl = await convertUrlToDataUrl(result.coverImage);
                    await addToCache(coverDataUrl, 'photo', cachePrompt);
                    console.log('✅ Cover image cached');
                }

                // Cache model images
                if (result.modelImages && result.modelImages.length > 0) {
                    for (let idx = 0; idx < result.modelImages.length; idx++) {
                        const img = result.modelImages[idx];
                        const imgPrompt = `${promptCategory} photo ${idx + 1} - ${selectedStyle || 'Standard'}`;
                        const imgDataUrl = await convertUrlToDataUrl(img);
                        await addToCache(imgDataUrl, 'photo', imgPrompt);
                        console.log(`✅ Model image ${idx + 1} cached`);
                    }
                }

                console.log('✅ All PhotoStudio images added to cache successfully');

                // Verify cache
                setTimeout(async () => {
                    const photoItems = (await getCachedItems()).filter((item: any) => item.studioType === 'photo');
                    console.log('✅ Verification: Total cached photo items:', photoItems.length);
                }, 100);
            } catch (cacheError) {
                console.error('❌ Failed to cache images:', cacheError);
                // Don't fail generation if caching fails
            }

            // Deduct credit after successful generation
            if (token) {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                    const deductRes = await fetch(`${API_URL}/api/credits/deduct`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ type: 'photoshoot', imageQuality, numberOfImages }),
                    });

                    // Update credits immediately after successful deduction
                    if (deductRes.ok) {
                        const deductData = await deductRes.json();
                        if (deductData.success) {
                            // Update from server response
                            setTotalCredits(deductData.totalCredits);
                            setUsedPhotoshootCredits(deductData.usedPhotoshootCredits);
                            setUsedMarketingCredits(deductData.usedMarketingCredits);
                            setRemainingCredits(deductData.remainingCredits);
                        } else {
                            // Fallback: fetch from server
                            await fetchCredits();
                        }
                    } else {
                        // If deduction failed, refresh credits anyway
                        await fetchCredits();
                    }
                } catch (err) {
                    console.error('Credit deduction error:', err);
                    // Don't fail the generation if credit deduction fails
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Generation failed.');
            setPhase('details');
        } finally {
            setIsLoading(false);
            setLoadingImages([]);
            setLoadingMessage("");
        }
    }, [imageFiles, creatorName, promptCategory, productType, selectedStyle, apparelStyle, identifiedProductName, otherOrnamentType, onContentGenerated, extraPrompt, productName, aspectRatio, consistentCharacter, background, customBackground, imageQuality, numberOfImages, fetchCredits]);

    const handleDownloadPdf = async () => {
        if (!catalogueRef.current) return;
        setDownloadingType('pdf');
        try {
            const pages = catalogueRef.current.querySelectorAll<HTMLElement>('.catalogue-page');
            if (!pages || pages.length === 0) {
                console.error('No catalogue pages found');
                setError('No lookbook pages found to export.');
                setDownloadingType(null);
                return;
            }

            const pdf = new jsPDF({
                orientation: 'portrait', unit: 'mm', format: 'a4', hotfixes: ['px_scaling'],
            });

            // Helper function to convert oklch colors to rgb
            const oklchToRgb = (oklchStr: string): string => {
                // Simple oklch to hex conversion for common colors
                const oklchMap: { [key: string]: string } = {
                    'oklch(0.4 0.05 264.9)': '#e6b71e', // gold-500
                    'oklch(0.486 0.153 265.76)': '#ae820d', // gold-700
                    'oklch(0.544 0.135 265.76)': '#e6b71e', // gold-500 lighter
                };

                // Check if it's a known oklch color
                for (const [oklch, rgb] of Object.entries(oklchMap)) {
                    if (oklchStr.includes(oklch.split('(')[1].split(')')[0])) {
                        return rgb;
                    }
                }

                // Fallback: extract oklch values and approximate
                const match = oklchStr.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
                if (match) {
                    return '#e6b71e'; // Default to gold
                }
                return oklchStr;
            };

            for (let i = 0; i < pages.length; i++) {
                try {
                    // Clone the page while keeping styles
                    const pageElement = pages[i] as HTMLElement;
                    const clonedPage = pageElement.cloneNode(true) as HTMLElement;

                    // Convert oklch colors in style tags to rgb
                    const styleTags = clonedPage.querySelectorAll('style');
                    styleTags.forEach(styleTag => {
                        if (styleTag.textContent) {
                            // Replace all oklch() functions with hex equivalents
                            styleTag.textContent = styleTag.textContent.replace(
                                /oklch\([^)]+\)/g,
                                match => {
                                    // Map common oklch values to hex
                                    if (match.includes('264.9')) return '#e6b71e'; // gold
                                    if (match.includes('265')) return '#4f46e5'; // gold-600
                                    return '#000000'; // fallback to black
                                }
                            );
                        }
                    });

                    // Also handle inline styles with oklch
                    const allElements = clonedPage.querySelectorAll('*');
                    allElements.forEach(el => {
                        const styleAttr = el.getAttribute('style');
                        if (styleAttr && styleAttr.includes('oklch')) {
                            const newStyle = styleAttr.replace(
                                /oklch\([^)]+\)/g,
                                match => {
                                    if (match.includes('264.9')) return '#e6b71e';
                                    if (match.includes('265')) return '#4f46e5';
                                    return '#000000';
                                }
                            );
                            el.setAttribute('style', newStyle);
                        }
                    });

                    // Create temporary container for html2canvas
                    const tempContainer = document.createElement('div');
                    tempContainer.style.position = 'fixed';
                    tempContainer.style.left = '-9999px';
                    tempContainer.style.top = '-9999px';
                    tempContainer.style.width = '210mm';
                    tempContainer.style.height = '297mm';
                    tempContainer.appendChild(clonedPage);
                    document.body.appendChild(tempContainer);

                    const pageCanvas = await html2canvas(clonedPage, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff',
                        logging: false,
                        imageTimeout: 0,
                        // Intercept and fix oklch before parsing
                        onclone: (doc) => {
                            const styles = doc.querySelectorAll('style');
                            styles.forEach(style => {
                                if (style.textContent) {
                                    style.textContent = style.textContent.replace(
                                        /oklch\([^)]+\)/g,
                                        match => {
                                            if (match.includes('264.9')) return '#e6b71e';
                                            if (match.includes('265')) return '#4f46e5';
                                            return '#000000';
                                        }
                                    );
                                }
                            });
                        }
                    });

                    document.body.removeChild(tempContainer);

                    if (i > 0) {
                        pdf.addPage('a4', 'portrait');
                    }

                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    const imgData = pageCanvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
                } catch (pageError) {
                    console.error(`Failed to capture page ${i}:`, pageError);
                }
            }

            // Get PDF as blob
            const pdfBlob = pdf.output('blob');

            // Download the PDF
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `${creatorName || 'campaign'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (e) {
            console.error('PDF Export error:', e);
            setError("PDF Export failed. Please try again.");
        } finally {
            setDownloadingType(null);
        }
    };

    const handleDownloadZip = async () => {
        if (!coverImage || modelImages.length === 0) return;
        setDownloadingType('zip');
        try {
            const zip = new JSZip();
            const fetchAndAdd = async (url: string, filename: string) => {
                const response = await fetch(url);
                const blob = await response.blob();
                zip.file(filename, blob);
            };
            const promises = [fetchAndAdd(coverImage, 'hero.png')];
            modelImages.forEach((img, i) => promises.push(fetchAndAdd(img, `frame-${i + 1}.png`)));
            await Promise.all(promises);
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'production-assets.zip';
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (e) {
            setError("ZIP Export failed.");
        } finally {
            setDownloadingType(null);
        }
    };

    const renderIdentificationStep = () => {
        if (!imageFiles[0]) return null;
        return (
            <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
                <h2 className="font-serif-display text-4xl text-center mb-16 text-white tracking-tighter">Object <span className="italic text-neutral-400">Detection</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="w-full aspect-square rounded-[32px] overflow-hidden border border-white/5 bg-neutral-900/30 p-6">
                        <img src={imageFiles[0].previewUrl} alt="Asset" className="w-full h-full object-contain rounded-2xl" />
                    </div>
                    <div className="flex items-center justify-center p-12 bg-neutral-900/20 rounded-[32px] border border-white/5">
                        {identificationStatus === 'identifying' ? (
                            <div className="flex flex-col items-center gap-6">
                                <Loader size="lg" />
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500">Scanning...</p>
                            </div>
                        ) : identificationStatus === 'confirming' ? (
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gold-400 mb-2">Match found</p>
                                <p className="text-4xl font-bold font-serif-display text-white mb-10 capitalize">"{identifiedProductName}"</p>
                                <div className="flex flex-col gap-4">
                                    {!isAuthenticated ? (
                                        <button
                                            onClick={() => navigate('/signin')}
                                            className="text-[10px] uppercase tracking-widest text-white bg-gradient-to-r from-orange-500 via-gold-500 to-gold-500 hover:from-orange-600 hover:via-gold-600 hover:to-gold-600 font-bold py-4 px-12 rounded-full transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            LOG IN TO GENERATE
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleGeneration(identifiedProductName)}
                                            disabled={remainingCredits !== null && remainingCredits <= 0}
                                            className="text-[10px] uppercase tracking-widest text-white bg-gold-600 hover:bg-gold-500 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-4 px-12 rounded-full transition-all"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    {remainingCredits !== null && (
                                        <div className="space-y-2">
                                            <UnifiedCreditsSummaryBox
                                                totalCredits={totalCredits}
                                                usedPhotoshootCredits={usedPhotoshootCredits}
                                                usedMarketingCredits={usedMarketingCredits}
                                            />
                                            {remainingCredits < 20 && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        navigate('/pricing');
                                                    }}
                                                    className="w-full text-[10px] uppercase tracking-widest text-white bg-gold-600 hover:bg-gold-500 font-bold py-3 px-6 rounded-full transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gold-900/20"
                                                >
                                                    Purchase plan for more generation
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <button onClick={() => setIdentificationStatus('inputting')} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                                        Edit manually
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full text-center space-y-6">
                                <label htmlFor="manual-product-name-input" className="sr-only">Enter Label</label>
                                <input
                                    id="manual-product-name-input"
                                    name="manualProductName"
                                    type="text"
                                    value={manualProductName}
                                    onChange={(e) => setManualProductName(e.target.value)}
                                    placeholder="Enter Label"
                                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl py-4 px-6 text-white text-center focus:outline-none"
                                />
                                {!isAuthenticated ? (
                                    <button
                                        onClick={() => navigate('/login', { state: { from: { pathname: '/studio' } } })}
                                        className="w-full text-[10px] uppercase tracking-widest text-white bg-gradient-to-r from-orange-500 via-gold-500 to-gold-500 hover:from-orange-600 hover:via-gold-600 hover:to-gold-600 font-bold py-4 px-12 rounded-full transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        LOG IN TO GENERATE
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleGeneration(manualProductName)}
                                        disabled={!manualProductName || (remainingCredits !== null && remainingCredits < 20)}
                                        className="w-full text-[10px] uppercase tracking-widest text-white bg-gold-600 hover:bg-gold-500 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-4 px-12 rounded-full"
                                    >
                                        Continue
                                    </button>
                                )}
                                {remainingCredits !== null && (
                                    <div className="mt-2 space-y-2">
                                        <UnifiedCreditsSummaryBox
                                            credits={remainingCredits}
                                            creditType="photoshoot"
                                        />
                                        {remainingCredits < 20 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    navigate('/pricing');
                                                }}
                                                className="w-full text-[11px] uppercase tracking-[0.3em] text-white bg-gradient-to-r from-gold-600 to-gold-600 hover:from-gold-500 hover:to-gold-500 font-bold py-4 px-8 rounded-xl shadow-lg shadow-gold-950/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Purchase Plan to Get Credits
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderPhaseContent = () => {
        if (phase === 'generating' || isLoading) {
            return <LoadingScreen mode={'image'} imageUrl={imageFiles[0]?.previewUrl} generatedImages={loadingImages} message={loadingMessage} />;
        }

        switch (phase) {
            case 'category':
                return <CategorySelection onSelectionComplete={handleSelectionComplete} onBack={onExit} />;
            case 'identification':
                return renderIdentificationStep();
            case 'details':
                return (
                    <DetailsStep
                        imageFiles={imageFiles}
                        productType={productType}
                        productTypes={currentProductTypes}
                        onProductTypeChange={setProductType}
                        apparelStyle={apparelStyle}
                        onApparelStyleChange={setApparelStyle}
                        productName={productName}
                        onProductNameChange={setProductName}
                        creatorName={creatorName}
                        onCreatorNameChange={setCreatorName}
                        selectedStyle={selectedStyle}
                        onStyleChange={setSelectedStyle}
                        onGenerate={() => handleGeneration()}
                        onImageUpload={handleImageUpload}
                        isLoading={isLoading}
                        remainingCredits={remainingCredits}
                        totalCredits={totalCredits}
                        usedPhotoshootCredits={usedPhotoshootCredits}
                        usedMarketingCredits={usedMarketingCredits}
                        navigate={navigate}
                        otherOrnamentType={otherOrnamentType}
                        onOtherOrnamentTypeChange={setOtherOrnamentType}
                        extraPrompt={extraPrompt}
                        onExtraPromptChange={setExtraPrompt}
                        aspectRatio={aspectRatio}
                        onAspectRatioChange={setAspectRatio}
                        consistentCharacter={consistentCharacter}
                        onConsistentCharacterChange={setConsistentCharacter}
                        background={background}
                        onBackgroundChange={setBackground}
                        imageQuality={imageQuality}
                        onImageQualityChange={setImageQuality}
                        numberOfImages={numberOfImages}
                        onNumberOfImagesChange={setNumberOfImages}
                        customBackground={customBackground}
                        onCustomBackgroundChange={setCustomBackground}
                        isAuthenticated={isAuthenticated}
                        isPaidUser={isPaidUser}
                    />
                );
            case 'results':
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="font-serif-display text-5xl text-center mb-16 text-white tracking-tighter">Studio <span className="italic text-neutral-400">Deliverables</span></h2>

                        <div className="flex flex-col items-center gap-10 mb-20 w-full">
                            <div className="flex bg-neutral-900/50 p-1.5 rounded-full border border-white/5 w-fit">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`flex items-center gap-2 px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${viewMode === 'gallery' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                                >
                                    <GridIcon /> Gallery
                                </button>
                                <button
                                    onClick={() => setViewMode('catalogue')}
                                    className={`flex items-center gap-2 px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${viewMode === 'catalogue' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                                >
                                    <BookOpenIcon /> Lookbook
                                </button>
                            </div>


                            <div className="flex flex-wrap justify-center items-center gap-4">
                                <button
                                    onClick={handleDownloadZip}
                                    disabled={!!downloadingType}
                                    className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 font-bold py-3 px-8 rounded-full transition-all flex items-center gap-3"
                                >
                                    {downloadingType === 'zip' ? <Loader size="sm" /> : <DownloadIcon />}
                                    ZIP Export
                                </button>

                                <button
                                    onClick={handleDownloadPdf}
                                    disabled={!!downloadingType}
                                    className="text-[10px] uppercase tracking-widest text-white bg-gold-700 hover:bg-gold-600 font-bold py-3 px-10 rounded-full transition-all flex items-center gap-3"
                                >
                                    {downloadingType === 'pdf' ? <Loader size="sm" /> : <DownloadIcon />}
                                    Lookbook PDF
                                </button>
                            </div>
                        </div>

                        <div className="animate-fade-in">
                            {viewMode === 'gallery' ? (
                                <GeneratedImageGallery images={[coverImage!, ...modelImages]} hideWatermark={isPaidUser} />
                            ) : (
                                <CatalogueViewer
                                    coverImage={coverImage!}
                                    generatedImages={modelImages}
                                    catalogueRef={catalogueRef}
                                    productName={productName}
                                    creatorName={creatorName}
                                    hideBrand={isPaidUser}
                                />
                            )}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="w-full h-full pb-20">
            {renderPhaseContent()}
            {error && <div className="mt-12 p-6 bg-red-900/10 border border-red-500/20 text-red-300 rounded-2xl text-center max-w-lg mx-auto text-sm">{error}</div>}
        </div>
    );
};
