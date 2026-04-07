
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
import { ImageFile, ProductType, Category, ApparelStyle, AspectRatio, BackgroundType } from '../types';
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
import { UploadStep } from './UploadStep';
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
import { CreditsSummaryBox } from './CreditsSummaryBox';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { AspectRatio16x9Icon } from './icons/AspectRatio16x9Icon';
import { AspectRatio9x16Icon } from './icons/AspectRatio9x16Icon';
import { UserIcon } from './icons/UserIcon';
import {  addToCache, getCachedItems } from '../utils/cacheManager';


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
    { id: 'black', label: 'Deep Black' },
    { id: 'transparent', label: 'Isolated (Cutout)' },
    { id: 'workspace', label: 'Creative Workspace' },
    { id: 'city', label: 'Urban / Cityscape' },
    { id: 'historic', label: 'Historic Texture' },
    { id: 'custom', label: 'Custom Prompt...' },
];

// --- Sub-Components ---

const CategorySelection: React.FC<{ 
    onSelectionComplete: (productTypes: ProductTypeOption[], promptCategory: Category) => void; 
    onBack: () => void;
}> = ({ onSelectionComplete, onBack }) => {
    const [path, setPath] = useState<string[]>([]);

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
            <div className="text-center relative mb-16 md:mb-24">
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
            <div className={`w-full max-w-sm md:max-w-5xl mx-auto grid grid-cols-2 ${options.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-8`}>
                {options.map(([key, node]) => (
                    <GlassButton key={key} onClick={() => handleSelect(key)} className="group w-full aspect-square md:aspect-auto">
                        <div className="px-6 py-10 md:py-16 flex flex-col w-full items-center justify-center gap-6">
                            <node.icon className="w-10 h-10 md:w-16 md:h-16 text-gold-400/80 group-hover:text-gold-400 transition-all duration-500 group-hover:scale-110" />
                            <h2 className="font-sans font-bold text-xs md:text-sm text-white uppercase tracking-[0.3em]">{node.name}</h2>
                        </div>
                    </GlassButton>
                ))}
            </div>
        </div>
    );
};

interface DetailsStepProps {
    imageFiles: ImageFile[];
    productType: ProductType;
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
    customBackground: string;
    onCustomBackgroundChange: (val: string) => void;
    photoshootCredits?: number | null;
    navigate: ReturnType<typeof useNavigate>;
    isAuthenticated: boolean;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
    imageFiles,
    productType,
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
    customBackground,
    onCustomBackgroundChange,
    photoshootCredits,
    navigate,
    isAuthenticated
}) => {
    const isOtherOrnament = productType === 'other_ornament';
    
    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in-up">
            <h2 className="font-serif-display text-4xl sm:text-5xl text-center mb-16 text-white tracking-tighter">Production <span className="italic text-neutral-400">Specs</span></h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Upload Section */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="sticky top-32">
                        {productType === 'apparel' ? (
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-3 ml-1">Hero Asset (Front)</p>
                                    <ImageUploader onImageUpload={(file) => onImageUpload(file, 0)} initialPreview={imageFiles[0]?.previewUrl} enableAnimation={true} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-3 ml-1">Reference Asset (Back)</p>
                                    <ImageUploader onImageUpload={(file) => onImageUpload(file, 1)} initialPreview={imageFiles[1]?.previewUrl} enableAnimation={true} />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-3 ml-1">Product Asset</p>
                                <ImageUploader onImageUpload={(file) => onImageUpload(file, 0)} initialPreview={imageFiles[0]?.previewUrl} enableAnimation={true} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="creator-name-input" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3 block">Identity</label>
                            <input
                                id="creator-name-input"
                                name="creatorName"
                                type="text"
                                value={creatorName}
                                onChange={(e) => onCreatorNameChange(e.target.value)}
                                placeholder="Brand / Label Name"
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-neutral-700"
                            />
                        </div>
                        <div>
                            <label htmlFor={isOtherOrnament ? "other-ornament-select" : "product-name-input"} className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3 block">Label</label>
                             {isOtherOrnament ? (
                                <select
                                    id="other-ornament-select"
                                    name="otherOrnamentType"
                                    value={otherOrnamentType}
                                    onChange={(e) => onOtherOrnamentTypeChange(e.target.value)}
                                    className="w-full bg-neutral-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none appearance-none"
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
                                    className="w-full bg-neutral-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-neutral-700"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="aspect-ratio-select" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3 block">Canvas Ratio</label>
                            <div className="relative">
                                <select
                                    id="aspect-ratio-select"
                                    name="aspectRatio"
                                    value={aspectRatio}
                                    onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
                                    className="w-full bg-neutral-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none appearance-none"
                                >
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <option key={ratio.id} value={ratio.id}>{ratio.label}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3 block">Engine Control</label>
                            <button
                                onClick={() => onConsistentCharacterChange(!consistentCharacter)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border transition-all duration-300 ${
                                    consistentCharacter ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' : 'bg-neutral-900/50 border-white/5 text-neutral-500'
                                }`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest">Locked Persona</span>
                                <div className={`w-10 h-5 rounded-full relative ${consistentCharacter ? 'bg-gold-600' : 'bg-neutral-700'}`}>
                                    <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${consistentCharacter ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="background-select" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3 block">Environment</label>
                        <div className="relative">
                            <select
                                id="background-select"
                                name="background"
                                value={background}
                                onChange={(e) => onBackgroundChange(e.target.value as BackgroundType)}
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none appearance-none"
                            >
                                {BACKGROUND_OPTIONS.map((opt) => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                        </div>
                    </div>

                    {background === 'custom' && (
                        <div className="animate-fade-in">
                            <label htmlFor="custom-background-input" className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-3 block">Custom Background Description</label>
                            <input
                                id="custom-background-input"
                                name="customBackground"
                                type="text"
                                value={customBackground}
                                onChange={(e) => onCustomBackgroundChange(e.target.value)}
                                placeholder="Describe the neural background..."
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-4 block">Aesthetic Direction</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {STYLE_OPTIONS.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => onStyleChange(style.id)}
                                    className={`py-3 px-4 rounded-lg text-[9px] uppercase tracking-widest font-bold border transition-all ${
                                        selectedStyle === style.id ? 'bg-gold-600 text-white border-gold-500 shadow-lg shadow-gold-900/20' : 'bg-neutral-900/50 text-neutral-500 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    {style.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-10">
                        {!isAuthenticated ? (
                            <button
                                onClick={() => navigate('/login', { state: { from: { pathname: '/studio' } } })}
                                className="w-full text-[11px] uppercase tracking-[0.3em] text-white bg-gradient-to-r from-orange-500 via-gold-500 to-gold-500 hover:from-orange-600 hover:via-gold-600 hover:to-gold-600 font-bold py-6 px-12 rounded-xl shadow-2xl shadow-orange-950/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                LOG IN TO GENERATE
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onGenerate}
                                    disabled={!creatorName || isLoading || (photoshootCredits !== null && photoshootCredits < 20)}
                                    className="w-full text-[11px] uppercase tracking-[0.3em] text-white bg-gold-600 hover:bg-gold-500 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-6 px-12 rounded-xl shadow-2xl shadow-gold-950/40 transition-all transform hover:-translate-y-1 disabled:transform-none"
                                >
                                    {isLoading ? 'Processing Neural Sequence...' : 'Generate Photoshoot'}
                                </button>
                                {photoshootCredits !== null && (
                                    <div className="mt-3 space-y-2">
                                        <CreditsSummaryBox 
                                            credits={photoshootCredits} 
                                            creditType="photoshoot"
                                        />
                                        {photoshootCredits < 20 && (
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PhotoStudio: React.FC<{ onExit: () => void; onContentGenerated: () => void; }> = ({ onExit, onContentGenerated }) => {
    const navigate = useNavigate();
    const [photoshootCredits, setPhotoshootCredits] = useState<number | null>(null);
    const [isPaidUser, setIsPaidUser] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const fetchCredits = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setPhotoshootCredits(null);
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/credits?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setPhotoshootCredits(data.photoshootCredits);
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
    const [customBackground, setCustomBackground] = useState<string>('');

    const [identificationStatus, setIdentificationStatus] = useState<IdentificationStatus>('idle');
    const [identifiedProductName, setIdentifiedProductName] = useState<string>('');
    const [manualProductName, setManualProductName] = useState<string>('');

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
        setPhase('upload');
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
                    body: JSON.stringify({ type: 'photoshoot' }),
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
                result = await generateOtherProductImages(imageFiles[0], nameToUse, selectedStyle, onImageGenerated, undefined, extraPrompt, aspectRatio, consistentCharacter, background, customBackground);
            } else if (productType === 'other_ornament') {
                const nameToUse = otherOrnamentType;
                setProductName(nameToUse);
                result = await generateOtherProductImages(imageFiles[0], nameToUse, selectedStyle, onImageGenerated, DYNAMIC_ORNAMENT_PROMPTS_CONFIG, extraPrompt, aspectRatio, consistentCharacter, background, customBackground);
            } else {
                result = await generateCatalogueImages(imageFiles, promptCategory, productType, selectedStyle, onImageGenerated, apparelStyle, extraPrompt, aspectRatio, consistentCharacter, background, customBackground);
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
                        body: JSON.stringify({ type: 'photoshoot' }),
                    });
                    
                    // Update credits immediately after successful deduction
                    if (deductRes.ok) {
                        const deductData = await deductRes.json();
                        if (deductData.success) {
                            // Update from server response
                            setPhotoshootCredits(deductData.photoshootCredits);
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
    }, [imageFiles, creatorName, promptCategory, productType, selectedStyle, apparelStyle, identifiedProductName, otherOrnamentType, onContentGenerated, extraPrompt, productName, aspectRatio, consistentCharacter, background, customBackground, fetchCredits]);
    
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
            
            for (let i = 0; i < pages.length; i++) {
                try {
                    const pageCanvas = await html2canvas(pages[i], { 
                        scale: 2, 
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff',
                        logging: false,
                        imageTimeout: 0,
                    });
                    
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
            const pdfDataUrl = pdf.output('dataurlstring');
            
            // Cache the PDF lookbook
            const cachePrompt = `${promptCategory} lookbook - ${selectedStyle || 'Standard'} style`;
            const lookbookName = creatorName || 'campaign';
            try {
                // await addLookbookToCache(pdfDataUrl, 'photo', cachePrompt, lookbookName);
                console.log('✅ Lookbook PDF cached');
            } catch (cacheErr) {
                console.warn('Lookbook cache failed, continuing with download:', cacheErr);
            }
            
            // Download the PDF
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `${lookbookName}.pdf`;
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
            const { fetchImageAsBlob } = await import('../utils/downloadHelper');
            const zip = new JSZip();
            const fetchAndAdd = async (url: string, filename: string) => {
                const blob = await fetchImageAsBlob(url);
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
                                            disabled={photoshootCredits !== null && photoshootCredits <= 0}
                                            className="text-[10px] uppercase tracking-widest text-white bg-gold-600 hover:bg-gold-500 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-4 px-12 rounded-full transition-all"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    {photoshootCredits !== null && (
                                        <div className="space-y-2">
                                            <CreditsSummaryBox 
                                                credits={photoshootCredits} 
                                                creditType="photoshoot"
                                            />
                                            {photoshootCredits < 20 && (
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
                                        disabled={!manualProductName || (photoshootCredits !== null && photoshootCredits < 20)}
                                        className="w-full text-[10px] uppercase tracking-widest text-white bg-gold-600 hover:bg-gold-500 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-4 px-12 rounded-full"
                                    >
                                        Continue
                                    </button>
                                )}
                                {photoshootCredits !== null && (
                                    <div className="mt-2 space-y-2">
                                        <CreditsSummaryBox 
                                            credits={photoshootCredits} 
                                            creditType="photoshoot"
                                        />
                                        {photoshootCredits < 20 && (
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
            case 'upload':
                 return (
                    <UploadStep
                        productTypes={currentProductTypes}
                        activeProductType={productType}
                        onProductTypeChange={setProductType}
                        onImageUpload={handleImageUpload}
                        onProceed={handleProceedToDetails}
                        imageFiles={imageFiles}
                        apparelStyle={apparelStyle}
                        onApparelStyleChange={setApparelStyle}
                    />
                );
             case 'identification':
                return renderIdentificationStep();
             case 'details':
                 return (
                    <DetailsStep
                        imageFiles={imageFiles}
                        productType={productType}
                        productName={productName}
                        onProductNameChange={setProductName}
                        creatorName={creatorName}
                        onCreatorNameChange={setCreatorName}
                        selectedStyle={selectedStyle}
                        onStyleChange={setSelectedStyle}
                        onGenerate={() => handleGeneration()}
                        onImageUpload={handleImageUpload}
                        isLoading={isLoading}
                        photoshootCredits={photoshootCredits}
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
                        customBackground={customBackground}
                        onCustomBackgroundChange={setCustomBackground}
                        isAuthenticated={isAuthenticated}
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
                                    className="text-[10px] uppercase tracking-widest text-white bg-gold-600 hover:bg-gold-500 font-bold py-3 px-10 rounded-full transition-all flex items-center gap-3"
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