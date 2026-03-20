
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// jsPDF, html2canvas, JSZip are loaded dynamically when needed (see download handlers)

import { ImageUploader } from './ImageUploader';
import { GeneratedImageGallery } from './GeneratedImageGallery';
import { CatalogueViewer } from './CatalogueViewer';
import { Loader } from './Loader';
import { LoadingScreen } from './LoadingScreen';
import { generateCatalogueImages, identifyProduct, generateOtherProductImages } from '../services/geminiService';
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
import { notifyGenerationComplete } from '../utils/notification';
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

// Legacy CATEGORY_DATA kept for backward compatibility with CategorySelection
const CATEGORY_DATA: Record<string, CategoryNode> = {
    fashion: {
        name: 'Fashion',
        icon: FashionCrestIcon,
        promptCategory: 'women',
        productTypes: [{ id: 'apparel', name: 'Apparel', icon: TshirtIcon }]
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

// ─── 3-Layer Dropdown Category Data ───
interface DropdownCategoryItem {
    label: string;
    subcategories?: { label: string; items: string[] }[];
    items?: string[]; // flat items for categories without a middle layer
}

const DROPDOWN_CATEGORIES: DropdownCategoryItem[] = [
    {
        label: 'Fashion',
        subcategories: [
            { label: 'Men', items: ['T-Shirts', 'Shirts', 'Jackets', 'Hoodies', 'Jeans', 'Trousers', 'Shorts', 'Blazers', 'Kurta', 'Sherwani', 'Ethnic wear', 'Nightwear', 'Activewear', 'Gym wear'] },
            { label: 'Women', items: ['Tops', 'Shirts', 'Dresses', 'Saree', 'Lehenga', 'Kurtis', 'Co-ord sets', 'Gowns', 'Jeans', 'Skirts', 'Leggings', 'Jackets', 'Nightwear', 'Activewear', 'Gym wear'] },
            { label: 'Kids', items: ['Boys T-shirts', 'Boys shirts', 'Boys jeans', 'Boys shorts', 'Girls dresses', 'Girls frocks', 'Girls tops', 'Girls skirts', 'School uniforms', 'Baby wear', 'Winter wear', 'Kids ethnic wear'] },
        ],
    },
    {
        label: 'Fashion Accessories',
        subcategories: [
            { label: 'Bags', items: ['Handbags', 'Sling bags', 'Backpacks', 'Laptop bags', 'Travel bags', 'Tote bags', 'Wallets', 'Clutches', 'Crossbody bags'] },
            { label: 'Jewellery', items: [
                'Gold Necklace', 'Gold Earrings', 'Gold Bangles', 'Gold Ring', 'Gold Chain', 'Gold Pendant',
                'Diamond Necklace', 'Diamond Earrings', 'Diamond Ring', 'Diamond Bracelet', 'Diamond Pendant',
                'Silver Necklace', 'Silver Earrings', 'Silver Ring', 'Silver Bracelet', 'Silver Anklet', 'Silver Chain',
                'Bridal Set', 'Bridal Necklace', 'Bridal Earrings', 'Bridal Bangles', 'Maang Tikka', 'Nath (Nose Ring)',
                'Kundan Set', 'Kundan Necklace', 'Kundan Earrings',
                'Polki Set', 'Polki Necklace', 'Polki Earrings',
                'Meenakari Jewellery', 'Temple Jewellery', 'Antique Jewellery',
                'Mangalsutra', 'Toe Rings', 'Anklets', 'Choker', 'Rani Haar', 'Jhumkas',
                'Brooch', 'Nose Pin', 'Bajuband (Armlet)', 'Kamarbandh (Waist Chain)',
                'Pearl Necklace', 'Pearl Earrings', 'Pearl Set',
                'Artificial Jewellery', 'Imitation Jewellery', 'Oxidised Jewellery',
                'Platinum Ring', 'Platinum Chain', 'Rose Gold Jewellery',
                'Men\'s Ring', 'Men\'s Bracelet', 'Men\'s Chain', 'Cufflinks',
            ] },
            { label: 'Watches', items: ['Smart watches', 'Analog watches', 'Digital watches', 'Luxury watches', 'Chronograph watches', 'Dress watches', 'Sports watches'] },
            { label: 'Other Accessories', items: ['Sunglasses', 'Caps', 'Hats', 'Belts', 'Scarves', 'Hair accessories', 'Tie / Bow tie', 'Cufflinks', 'Pocket squares'] },
        ],
    },
    {
        label: 'Beauty & Personal Care',
        subcategories: [
            { label: 'Skincare', items: ['Face wash', 'Moisturizer', 'Serum', 'Sunscreen', 'Face mask', 'Toner', 'Scrub'] },
            { label: 'Haircare', items: ['Hair oil', 'Shampoo', 'Conditioner', 'Hair serum', 'Hair mask', 'Hair spray'] },
            { label: 'Makeup', items: ['Lipstick', 'Foundation', 'Concealer', 'Compact powder', 'Mascara', 'Eyeliner', 'Blush'] },
            { label: 'Grooming', items: ['Trimmer', 'Razor', 'Beard oil', 'Shaving cream'] },
        ],
    },
    {
        label: 'Electronics',
        items: ['Smartphones', 'Smart watches', 'Earbuds', 'Headphones', 'Speakers', 'Laptops', 'Tablets', 'Cameras', 'Gaming consoles', 'Smart home devices'],
    },
    {
        label: 'Home & Living',
        subcategories: [
            { label: 'Home Decor', items: ['Lamps', 'Wall art', 'Mirrors', 'Vases', 'Artificial plants'] },
            { label: 'Furniture', items: ['Chairs', 'Tables', 'Sofas', 'Beds', 'Cabinets'] },
            { label: 'Kitchen', items: ['Cookware', 'Cutlery', 'Kitchen appliances', 'Storage containers', 'Coffee makers'] },
        ],
    },
    {
        label: 'Footwear',
        subcategories: [
            { label: 'Men', items: ['Sneakers', 'Formal shoes', 'Boots', 'Loafers', 'Sandals', 'Slippers'] },
            { label: 'Women', items: ['Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals', 'Slippers'] },
            { label: 'Kids', items: ['School shoes', 'Sneakers', 'Sandals', 'Slippers'] },
        ],
    },
    {
        label: 'Sports & Fitness',
        items: ['Yoga mats', 'Dumbbells', 'Resistance bands', 'Gym equipment', 'Sports shoes', 'Cycling gear', 'Sportswear'],
    },
    {
        label: 'Toys & Baby Products',
        items: ['Educational toys', 'Dolls', 'Action figures', 'Building blocks', 'Baby care products', 'Baby strollers', 'Baby bottles'],
    },
    {
        label: 'Food & Beverages',
        items: ['Packaged food', 'Snacks', 'Health supplements', 'Coffee', 'Tea', 'Protein powders'],
    },
    {
        label: 'Automotive',
        items: ['Car accessories', 'Bike accessories', 'Helmets', 'Car care products'],
    },
    {
        label: 'Other',
        items: ['Auto-detect by AI'],
    },
];

// ─── Per-Category Config: which styles, default style, and toggle visibility ───
interface CategoryConfig {
    styleIds: string[];
    defaultStyle: string;
    showSameModel: boolean;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    // ─── Top-level category defaults ───
    'Fashion': { styleIds: ['modern', 'cinematic', 'vintage', 'monochrome', 'aesthetic', 'closeup'], defaultStyle: 'vintage', showSameModel: true },
    'Fashion Accessories': { styleIds: ['modern', 'cinematic', 'vintage', 'monochrome', 'closeup'], defaultStyle: 'closeup', showSameModel: false },
    'Beauty & Personal Care': { styleIds: ['modern', 'aesthetic', 'closeup', 'monochrome'], defaultStyle: 'aesthetic', showSameModel: false },
    'Electronics': { styleIds: ['modern', 'cinematic', 'monochrome', 'closeup'], defaultStyle: 'modern', showSameModel: false },
    'Home & Living': { styleIds: ['modern', 'vintage', 'aesthetic', 'cinematic'], defaultStyle: 'modern', showSameModel: false },
    'Footwear': { styleIds: ['modern', 'cinematic', 'vintage', 'monochrome', 'closeup'], defaultStyle: 'modern', showSameModel: true },
    'Sports & Fitness': { styleIds: ['modern', 'cinematic', 'aesthetic'], defaultStyle: 'modern', showSameModel: true },
    'Toys & Baby Products': { styleIds: ['modern', 'aesthetic', 'vintage'], defaultStyle: 'aesthetic', showSameModel: false },
    'Food & Beverages': { styleIds: ['modern', 'aesthetic', 'closeup', 'vintage'], defaultStyle: 'closeup', showSameModel: false },
    'Automotive': { styleIds: ['modern', 'cinematic', 'monochrome'], defaultStyle: 'modern', showSameModel: false },
    'Other': { styleIds: ['modern', 'cinematic', 'vintage', 'monochrome', 'aesthetic', 'closeup'], defaultStyle: 'modern', showSameModel: true },

    // ─── Sub-category overrides (Jewellery) ───
    'Jewellery': { styleIds: ['closeup', 'modern', 'cinematic', 'aesthetic', 'vintage'], defaultStyle: 'closeup', showSameModel: false },

    // ─── Sub-category overrides (Fashion) ───
    'Men': { styleIds: ['modern', 'cinematic', 'vintage', 'monochrome', 'aesthetic', 'closeup'], defaultStyle: 'modern', showSameModel: true },
    'Women': { styleIds: ['modern', 'cinematic', 'vintage', 'aesthetic', 'monochrome', 'closeup'], defaultStyle: 'vintage', showSameModel: true },
    'Kids': { styleIds: ['modern', 'cinematic', 'vintage', 'monochrome', 'aesthetic', 'closeup'], defaultStyle: 'aesthetic', showSameModel: true },

    // ─── Sub-category overrides (Beauty) ───
    'Skincare': { styleIds: ['modern', 'aesthetic', 'closeup'], defaultStyle: 'aesthetic', showSameModel: false },
    'Makeup': { styleIds: ['modern', 'aesthetic', 'closeup', 'cinematic'], defaultStyle: 'closeup', showSameModel: false },
    'Haircare': { styleIds: ['modern', 'aesthetic', 'closeup'], defaultStyle: 'modern', showSameModel: false },
    'Grooming': { styleIds: ['modern', 'cinematic', 'closeup'], defaultStyle: 'modern', showSameModel: false },

    // ─── Sub-category overrides (Other) ───
    'Bags': { styleIds: ['modern', 'cinematic', 'vintage', 'aesthetic'], defaultStyle: 'modern', showSameModel: false },
    'Watches': { styleIds: ['modern', 'cinematic', 'closeup', 'monochrome'], defaultStyle: 'closeup', showSameModel: false },
    'Home Decor': { styleIds: ['modern', 'vintage', 'aesthetic'], defaultStyle: 'aesthetic', showSameModel: false },
    'Furniture': { styleIds: ['modern', 'vintage', 'cinematic'], defaultStyle: 'modern', showSameModel: false },
    'Kitchen': { styleIds: ['modern', 'closeup', 'aesthetic'], defaultStyle: 'modern', showSameModel: false },
};

const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
    styleIds: ['modern', 'cinematic', 'vintage', 'monochrome', 'aesthetic', 'closeup'],
    defaultStyle: 'vintage',
    showSameModel: true,
};

const OTHER_ORNAMENT_OPTIONS = ['Brooch', 'Mang tika', 'Nose pin', 'Finger ring', 'Ear rings', 'Ladies bracelet', 'Buckle'];

const ASPECT_RATIOS: { id: AspectRatio; label: string; icon?: React.FC<{ className?: string }> }[] = [
    { id: '9:16', label: 'Instagram Story (9:16)', icon: AspectRatio9x16Icon },
    { id: '16:9', label: 'Cinematic / Web (16:9)', icon: AspectRatio16x9Icon },
    { id: '1:1', label: 'Square Post (1:1)' },
    { id: '4:5', label: 'Classic Social (4:5)' },
    { id: '3:2', label: 'Camera / Print (3:2)' },
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
    const [searchParams, setSearchParams] = useSearchParams();

    const pathParam = searchParams.get('category');
    const path = pathParam ? pathParam.split(',') : [];

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
            setSearchParams({ category: newPath.join(',') });
        }
    };

    // Keep goBack around in case it needs to be mapped later, but we are removing the visual button.
    const goBack = () => {
        if (path.length > 0) {
            const newPath = path.slice(0, -1);
            if (newPath.length > 0) {
                setSearchParams({ category: newPath.join(',') });
            } else {
                searchParams.delete('category');
                setSearchParams(searchParams);
            }
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
    useSameLocation: boolean;
    onUseSameLocationChange: (enabled: boolean) => void;
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
    /** Called when the inline category dropdown changes so parent can update promptCategory */
    onCategoryChange?: (category: Category, productType: ProductType, itemName?: string) => void;
    isLight?: boolean;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
    imageFiles,
    productName,
    onProductNameChange,
    creatorName,
    onCreatorNameChange,
    selectedStyle,
    onStyleChange,
    onGenerate,
    onImageUpload,
    isLoading,
    aspectRatio,
    onAspectRatioChange,
    consistentCharacter,
    onConsistentCharacterChange,
    useSameLocation,
    onUseSameLocationChange,
    imageQuality,
    onImageQualityChange,
    numberOfImages,
    onNumberOfImagesChange,
    remainingCredits,
    totalCredits,
    usedPhotoshootCredits,
    usedMarketingCredits,
    navigate,
    isAuthenticated,
    isPaidUser,
    onCategoryChange,
    isLight,
}) => {
    // PRO feature gating — all features unlocked for all users
    const PRO_QUALITY_IDS: string[] = [];
    const PRO_STYLE_IDS: string[] = [];
    const [shakeId, setShakeId] = useState<string | null>(null);
    const [proToast, setProToast] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [shakeUpload, setShakeUpload] = useState(false);
    const uploadAreaRef = useRef<HTMLDivElement>(null);

    // 3-layer category dropdown state
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('');

    // Searchable dropdown state
    const [categorySearch, setCategorySearch] = useState<string>('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
    const [itemSearch, setItemSearch] = useState('');
    const itemDropdownRef = useRef<HTMLDivElement>(null);

    const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] = useState(false);
    const subcategoryDropdownRef = useRef<HTMLDivElement>(null);

    // Build flat search index: { itemLabel, categoryLabel, subcategoryLabel? }
    const searchIndex = useMemo(() => {
        const index: { item: string; category: string; subcategory: string }[] = [];
        for (const cat of DROPDOWN_CATEGORIES) {
            if (cat.subcategories) {
                for (const sub of cat.subcategories) {
                    for (const item of sub.items) {
                        index.push({ item, category: cat.label, subcategory: sub.label });
                    }
                }
            } else if (cat.items) {
                for (const item of cat.items) {
                    index.push({ item, category: cat.label, subcategory: '' });
                }
            }
        }
        return index;
    }, []);

    // Filter search results
    const searchResults = useMemo(() => {
        if (!categorySearch.trim()) return [];
        const q = categorySearch.toLowerCase();
        return searchIndex.filter(entry =>
            entry.item.toLowerCase().includes(q) ||
            entry.category.toLowerCase().includes(q) ||
            entry.subcategory.toLowerCase().includes(q)
        ).slice(0, 20); // cap at 20 results
    }, [categorySearch, searchIndex]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
            if (subcategoryDropdownRef.current && !subcategoryDropdownRef.current.contains(e.target as Node)) {
                setIsSubcategoryDropdownOpen(false);
            }
            if (itemDropdownRef.current && !itemDropdownRef.current.contains(e.target as Node)) {
                setIsItemDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const triggerProLock = (id: string) => {
        setShakeId(id);
        setProToast(true);
        setTimeout(() => setShakeId(null), 600);
        setTimeout(() => setProToast(false), 2500);
    };
    const hasImage = imageFiles.some(f => f);

    // Derive subcategory and item options from the selected category
    const activeCategoryData = DROPDOWN_CATEGORIES.find(c => c.label === selectedCategory);
    const subcategoryOptions: string[] = activeCategoryData?.subcategories?.map(s => s.label) || [];
    const activeSubcategoryData = activeCategoryData?.subcategories?.find(s => s.label === selectedSubcategory);
    const itemOptions: string[] = activeSubcategoryData?.items || activeCategoryData?.items || [];
    
    // Filter item options for the third dropdown
    const filteredItemOptions = useMemo(() => {
        if (!itemSearch.trim()) return itemOptions;
        const q = itemSearch.toLowerCase();
        return itemOptions.filter(item => item.toLowerCase().includes(q));
    }, [itemOptions, itemSearch]);

    // Per-category config — sub-category overrides top-level category
    const categoryConfig = selectedSubcategory
        ? (CATEGORY_CONFIG[selectedSubcategory] || CATEGORY_CONFIG[selectedCategory] || DEFAULT_CATEGORY_CONFIG)
        : selectedCategory
            ? (CATEGORY_CONFIG[selectedCategory] || DEFAULT_CATEGORY_CONFIG)
            : DEFAULT_CATEGORY_CONFIG;
    const filteredStyles = STYLE_OPTIONS.filter(s => categoryConfig.styleIds.includes(s.id));

    // ─── Clean Category → Prompt Mapping ───
    // Only categories with dedicated prompt files get specific types.
    // Everything else uses 'other' which dynamically generates from the item name.
    const derivedCategory = (cat: string, sub: string, _item?: string): Category => {
        if (cat === 'Fashion') {
            if (sub === 'Men') return 'men';
            if (sub === 'Women') return 'women';
            if (sub === 'Kids') return 'kids';
            return 'women';
        }
        if (cat === 'Fashion Accessories') {
            if (sub === 'Jewellery' || sub === 'Bags') return 'women';
            if (sub === 'Watches') return 'men';
            return 'ecommerce';
        }
        if (cat === 'Electronics' || cat === 'Home & Living') return 'ecommerce';
        if (cat === 'Toys & Baby Products') return 'kids';
        return 'ecommerce';
    };
    const derivedProductType = (cat: string, sub?: string, item?: string): ProductType => {
        // Fashion → men/women/kids apparel prompts (dedicated)
        if (cat === 'Fashion') return 'apparel';
        // Fashion Accessories → each subcategory has dedicated prompts
        if (cat === 'Fashion Accessories') {
            if (sub === 'Jewellery') return 'jewelry';
            if (sub === 'Bags') return 'purse';
            if (sub === 'Watches') return 'watch';
            if (sub === 'Other Accessories' && item && item.toLowerCase().includes('belt')) return 'belt';
            return 'other';
        }
        // E-commerce categories with dedicated prompts
        if (cat === 'Electronics') return 'electronics';
        if (cat === 'Home & Living') {
            if (sub === 'Kitchen') return 'home-and-kitchen';
            if (sub === 'Furniture') return 'furniture';
            return 'other';
        }
        if (cat === 'Toys & Baby Products') return 'toys';
        // Everything else (Beauty, Footwear, Sports, Food, Auto, Other) → dynamic 'other'
        return 'other';
    };

    // Reset dependent dropdowns when parent changes + auto-set default style
    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
        setSelectedSubcategory('');
        setSelectedItem('');
        setCategorySearch('');
        setIsCategoryDropdownOpen(false);
        // Auto-set default style for the new category
        const config = val ? (CATEGORY_CONFIG[val] || DEFAULT_CATEGORY_CONFIG) : DEFAULT_CATEGORY_CONFIG;
        onStyleChange(config.defaultStyle);
        // Notify parent about category change
        const dCat = derivedCategory(val, '', '');
        const dProd = derivedProductType(val, '', '');
        onCategoryChange?.(dCat, dProd, '');
    };
    const handleSubcategoryChange = (val: string) => {
        setSelectedSubcategory(val);
        setSelectedItem('');
        setItemSearch('');
        setIsItemDropdownOpen(false);
        // Auto-set default style for the sub-category
        const subConfig = CATEGORY_CONFIG[val] || CATEGORY_CONFIG[selectedCategory] || DEFAULT_CATEGORY_CONFIG;
        onStyleChange(subConfig.defaultStyle);
        // Notify parent
        const dCat = derivedCategory(selectedCategory, val, '');
        const dProd = derivedProductType(selectedCategory, val, '');
        onCategoryChange?.(dCat, dProd, '');
    };
    // Handle search result selection — auto-fill all three layers
    const handleSearchSelect = (entry: { item: string; category: string; subcategory: string }) => {
        setSelectedCategory(entry.category);
        setSelectedSubcategory(entry.subcategory);
        setSelectedItem(entry.item);
        setCategorySearch('');
        setIsCategoryDropdownOpen(false);
        setItemSearch('');
        setIsItemDropdownOpen(false);
        // Auto-set default style — prefer sub-category config
        const config = CATEGORY_CONFIG[entry.subcategory] || CATEGORY_CONFIG[entry.category] || DEFAULT_CATEGORY_CONFIG;
        onStyleChange(config.defaultStyle);
        // Notify parent
        const dCat = derivedCategory(entry.category, entry.subcategory, entry.item);
        const dProd = derivedProductType(entry.category, entry.subcategory, entry.item);
        onCategoryChange?.(dCat, dProd, entry.item);
    };

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in-up px-3 sm:px-4">
            {/* Heading */}
            <h2 className={`font-serif-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-normal text-center mb-3 sm:mb-4 ${isLight ? 'text-neutral-800' : 'text-white'}`}>Bring Your Product to <span className={`italic ${isLight ? 'text-neutral-400' : 'text-neutral-400'}`}>Life</span></h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {/* ──── LEFT PANEL: Upload ──── */}
                <div className="space-y-2">
                    {/* Image Upload Area — always Front + Back */}
                    <div ref={uploadAreaRef} className={`backdrop-blur-sm rounded-lg border p-2.5 sm:p-3 transition-all duration-300 ${shakeUpload ? 'border-red-500 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.3)]' : isLight ? 'border-neutral-200 bg-white/60' : 'border-white/5 bg-neutral-900/40'}`}>
                        {shakeUpload && (
                            <p className="text-xs text-red-400 font-medium text-center mb-2 animate-fade-in">⚠ Please upload a product image first</p>
                        )}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div>
                                <p className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-bold mb-1 ml-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>Front</p>
                                <ImageUploader onImageUpload={(file) => onImageUpload(file, 0)} initialPreview={imageFiles[0]?.previewUrl} enableAnimation={true} aspectRatio="aspect-[4/5]" />
                            </div>
                            <div>
                                <p className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-bold mb-1 ml-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>Back <span className={`${isLight ? 'text-neutral-400' : 'text-neutral-600'}`}>(Opt.)</span></p>
                                <ImageUploader onImageUpload={(file) => onImageUpload(file, 1)} initialPreview={imageFiles[1]?.previewUrl} enableAnimation={true} aspectRatio="aspect-[4/5]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ──── RIGHT PANEL: Production Details ──── */}
                <div className="transition-all duration-500">

                    <div className="space-y-2.5 sm:space-y-3">
                        {/* ── Searchable 3-Layer Category Dropdown ── */}
                        <div className="relative z-[60]">
                            <label className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold mb-1 block ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Product Category</label>
                            <div className="grid grid-cols-1 gap-2">
                                {/* Layer 1: Searchable Category */}
                                <div className="relative z-[120]" ref={categoryDropdownRef}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={isCategoryDropdownOpen ? categorySearch : selectedCategory}
                                            onFocus={() => { setIsCategoryDropdownOpen(true); setCategorySearch(''); setIsItemDropdownOpen(false); setIsSubcategoryDropdownOpen(false); }}
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            placeholder="Search or select category..."
                                            className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 ${isLight ? 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400' : 'bg-neutral-900/70 border-white/15 text-white placeholder:text-neutral-500'}`}
                                            autoComplete="off"
                                        />
                                        <svg className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>

                                    {/* Dropdown panel */}
                                    {isCategoryDropdownOpen && (
                                        <div className={`absolute z-[100] mt-1 w-full max-h-64 overflow-y-auto border rounded-lg shadow-2xl animate-fade-in ${isLight ? 'bg-white border-neutral-200 shadow-neutral-200/60' : 'bg-neutral-950 border-white/15 shadow-black/80'}`}>
                                            {categorySearch.trim() ? (
                                                /* Search results — flat list of matching items */
                                                searchResults.length > 0 ? (
                                                    searchResults.map((entry, i) => (
                                                        <button
                                                            key={`${entry.category}-${entry.subcategory}-${entry.item}-${i}`}
                                                            onClick={() => handleSearchSelect(entry)}
                                                            className={`w-full text-left px-3 py-2.5 transition-colors flex items-center gap-2 border-b last:border-0 ${isLight ? 'hover:bg-neutral-50 border-neutral-100' : 'hover:bg-white/10 border-white/5'}`}
                                                        >
                                                            <span className={`text-sm font-medium ${isLight ? 'text-neutral-800' : 'text-white'}`}>{entry.item}</span>
                                                            <span className={`text-[9px] ml-auto ${isLight ? 'text-neutral-400' : 'text-neutral-400'}`}>{entry.category}{entry.subcategory ? ` › ${entry.subcategory}` : ''}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-4 text-center text-sm text-neutral-400">No results found</div>
                                                )
                                            ) : (
                                                /* Default view — only top-level categories */
                                                DROPDOWN_CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat.label}
                                                        onClick={() => handleCategoryChange(cat.label)}
                                                        className={`w-full text-left px-3 py-2.5 text-xs sm:text-sm font-medium border-b transition-colors ${isLight ? 'border-neutral-100 hover:bg-neutral-50' : 'border-white/5 hover:bg-white/10'} ${selectedCategory === cat.label ? 'text-gold-400 bg-gold-500/10' : isLight ? 'text-neutral-700' : 'text-white'}`}
                                                    >
                                                        {cat.label}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Layer 2: Subcategory (only if the selected category has subcategories) */}
                                {selectedCategory && subcategoryOptions.length > 0 && (
                                    <div className="relative z-[110] animate-fade-in" ref={subcategoryDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => { setIsSubcategoryDropdownOpen(!isSubcategoryDropdownOpen); setIsCategoryDropdownOpen(false); setIsItemDropdownOpen(false); }}
                                            className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 pr-8 text-sm text-left focus:outline-none focus:ring-1 focus:ring-gold-500/30 ${isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-neutral-900/70 border-white/15 text-white'}`}
                                        >
                                            {selectedSubcategory || <span className="text-neutral-500">Select subcategory...</span>}
                                        </button>
                                        <ChevronDownIcon className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400 pointer-events-none transition-transform ${isSubcategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                        {isSubcategoryDropdownOpen && (
                                            <div className={`absolute z-[100] mt-1 w-full max-h-48 overflow-y-auto border rounded-lg shadow-2xl animate-fade-in ${isLight ? 'bg-white border-neutral-200 shadow-neutral-200/60' : 'bg-neutral-950 border-white/15 shadow-black/80'}`}>
                                                {subcategoryOptions.map(sub => (
                                                    <button
                                                        key={sub}
                                                        onClick={() => {
                                                            handleSubcategoryChange(sub);
                                                            setIsSubcategoryDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 text-xs sm:text-sm font-medium border-b transition-colors ${isLight ? 'border-neutral-100 hover:bg-neutral-50' : 'border-white/5 hover:bg-white/10'} ${selectedSubcategory === sub ? 'text-gold-400 bg-gold-500/10' : isLight ? 'text-neutral-700' : 'text-white'}`}
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Layer 3: Item (show if category has flat items OR subcategory is selected) */}
                                {selectedCategory && itemOptions.length > 0 && (subcategoryOptions.length === 0 || selectedSubcategory) && (
                                    <div className="relative z-[100] animate-fade-in" ref={itemDropdownRef}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={isItemDropdownOpen ? itemSearch : selectedItem}
                                                onFocus={() => { setIsItemDropdownOpen(true); setItemSearch(''); setIsCategoryDropdownOpen(false); setIsSubcategoryDropdownOpen(false); }}
                                                onChange={(e) => setItemSearch(e.target.value)}
                                                placeholder="Search or select item..."
                                                className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 ${isLight ? 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400' : 'bg-neutral-900/70 border-white/15 text-white placeholder:text-neutral-500'}`}
                                                autoComplete="off"
                                            />
                                            <svg className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </div>
                                        
                                        {/* Dropdown panel */}
                                        {isItemDropdownOpen && (
                                            <div className={`absolute z-[100] mt-1 w-full max-h-48 overflow-y-auto border rounded-lg shadow-2xl animate-fade-in ${isLight ? 'bg-white border-neutral-200 shadow-neutral-200/60' : 'bg-neutral-950 border-white/15 shadow-black/80'}`}>
                                                {/* Pinned special options */}
                                                {(!itemSearch.trim() || 'ai detected'.includes(itemSearch.toLowerCase())) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem('AI Detected');
                                                            setItemSearch('');
                                                            setIsItemDropdownOpen(false);
                                                            // Re-derive with item context
                                                            const dCat = derivedCategory(selectedCategory, selectedSubcategory, 'AI Detected');
                                                            const dProd = derivedProductType(selectedCategory, selectedSubcategory, 'AI Detected');
                                                            onCategoryChange?.(dCat, dProd, 'AI Detected');
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 text-sm font-medium border-b transition-colors flex items-center gap-2 ${isLight ? 'border-neutral-100 hover:bg-gold-50' : 'border-white/10 hover:bg-gold-500/10'} ${selectedItem === 'AI Detected' ? 'text-gold-400 bg-gold-500/10' : 'text-gold-400/80'}`}
                                                    >
                                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                                        AI Detected
                                                    </button>
                                                )}
                                                {(!itemSearch.trim() || 'other'.includes(itemSearch.toLowerCase())) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem('Other');
                                                            setItemSearch('');
                                                            setIsItemDropdownOpen(false);
                                                            // Re-derive with item context
                                                            const dCat2 = derivedCategory(selectedCategory, selectedSubcategory, 'Other');
                                                            const dProd2 = derivedProductType(selectedCategory, selectedSubcategory, 'Other');
                                                            onCategoryChange?.(dCat2, dProd2, 'Other');
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 text-sm font-medium border-b transition-colors flex items-center gap-2 ${isLight ? 'border-neutral-100 hover:bg-neutral-50' : 'border-white/10 hover:bg-white/10'} ${selectedItem === 'Other' ? 'text-gold-400 bg-gold-500/10' : isLight ? 'text-neutral-600' : 'text-neutral-300'}`}
                                                    >
                                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                        Other
                                                    </button>
                                                )}
                                                {/* Regular items */}
                                                {filteredItemOptions.length > 0 ? (
                                                    filteredItemOptions.map(item => (
                                                        <button
                                                            key={item}
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setItemSearch('');
                                                                setIsItemDropdownOpen(false);
                                                                // Re-derive with item context (e.g. for Belt detection)
                                                                const dCat3 = derivedCategory(selectedCategory, selectedSubcategory, item);
                                                                const dProd3 = derivedProductType(selectedCategory, selectedSubcategory, item);
                                                                onCategoryChange?.(dCat3, dProd3, item);
                                                            }}
                                                            className={`w-full text-left px-3 py-2.5 text-sm font-medium border-b last:border-0 transition-colors ${isLight ? 'border-neutral-100 hover:bg-neutral-50' : 'border-white/5 hover:bg-white/10'} ${selectedItem === item ? 'text-gold-400 bg-gold-500/10' : isLight ? 'text-neutral-700' : 'text-white'}`}
                                                        >
                                                            {item}
                                                        </button>
                                                    ))
                                                ) : (
                                                    !itemSearch.trim() ? null : <div className="px-3 py-4 text-center text-sm text-neutral-400">No matching items found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Manual input when "Other" is selected */}
                                {selectedItem === 'Other' && (
                                    <div className="animate-fade-in">
                                        <input
                                            type="text"
                                            value={productName}
                                            onChange={(e) => onProductNameChange(e.target.value)}
                                            placeholder="Enter product type (e.g. Kurta, Saree, Watch...)"
                                            className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/50 ${isLight ? 'bg-white border-gold-400/30 text-neutral-800 placeholder:text-neutral-400' : 'bg-neutral-900/70 border-gold-500/30 text-white placeholder:text-neutral-500'}`}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Identity + Label — stacked on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div>
                                <label htmlFor="creator-name-input" className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold mb-1.5 block ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Brand Name</label>
                                <input
                                    id="creator-name-input"
                                    name="creatorName"
                                    type="text"
                                    value={creatorName}
                                    onChange={(e) => onCreatorNameChange(e.target.value)}
                                    placeholder="e.g. Nike, Apple..."
                                    className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all ${isLight ? 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400' : 'bg-neutral-900/70 border-white/15 text-white placeholder:text-neutral-500'}`}
                                />
                            </div>
                            <div>
                                <label htmlFor="product-name-input" className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold mb-1.5 block ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Product Name</label>
                                <input
                                    id="product-name-input"
                                    name="productName"
                                    type="text"
                                    value={productName}
                                    onChange={(e) => onProductNameChange(e.target.value)}
                                    placeholder="e.g. Air Max 90..."
                                    className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all ${isLight ? 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400' : 'bg-neutral-900/70 border-white/15 text-white placeholder:text-neutral-500'}`}
                                />
                            </div>
                        </div>

                        {/* Visual Style — Essential, always visible */}
                        <div>
                            <label className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold mb-1.5 block ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Visual Style</label>
                            <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {filteredStyles.map((style) => {
                                    const isActive = selectedStyle === style.id;
                                    // Map style IDs to project images for preview
                                    const styleImages: Record<string, string> = {
                                        modern: '/assets/images/image_carousel/product/webp/product-1.webp',
                                        cinematic: '/assets/images/hero-carousel/a4/webp/a4-2.webp',
                                        vintage: '/assets/images/hero-carousel/a1/webp/a1-2.webp',
                                        monochrome: '/assets/images/hero-carousel/a4/webp/a4-3.webp',
                                        aesthetic: '/assets/images/hero-carousel/a3/webp/a3-1.webp',
                                        closeup: '/assets/images/image_carousel/accessories/webp/accessories-1.webp',
                                    };
                                    const previewImage = styleImages[style.id];

                                    return (
                                        <button
                                            key={style.id}
                                            onClick={() => onStyleChange(style.id)}
                                            className={`flex-shrink-0 flex flex-col items-center gap-1 group transition-all duration-300 w-[60px] sm:w-[72px]`}
                                        >
                                            <div className={`w-full aspect-square rounded-lg border-2 overflow-hidden transition-all ${isActive
                                                    ? 'border-gold-400 scale-105 shadow-[0_0_12px_rgba(250,204,21,0.15)]'
                                                    : isLight ? 'border-neutral-200 group-hover:border-neutral-400' : 'border-white/15 group-hover:border-white/30'
                                                }`}>
                                                {previewImage ? (
                                                    <img src={previewImage} alt={style.name} className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center ${isLight ? 'bg-neutral-100' : 'bg-neutral-800'}`}>
                                                        <span className={`text-[10px] font-bold ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{style.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-[9px] sm:text-[10px] font-semibold tracking-wide text-center leading-tight ${isActive ? 'text-gold-500' : isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                                                {style.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Image Quality — Essential, always visible (outside advanced) */}
                        <div>
                            <label htmlFor="image-quality-select" className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold mb-1 block ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Image Quality</label>
                            <div className={`flex gap-1 p-0.5 rounded-md border ${isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-800/70 border-white/10'}`}>
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
                                                ? isLight ? 'bg-white text-gold-600 shadow-sm' : 'bg-neutral-900 text-gold-400 shadow-sm'
                                                : isProLocked
                                                    ? 'text-neutral-400 cursor-not-allowed'
                                                    : isLight ? 'text-neutral-500 hover:bg-neutral-200' : 'text-neutral-300 hover:bg-neutral-700'
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

                        {/* Format */}
                        <div>
                            <label htmlFor="aspect-ratio-select" className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold mb-1 block ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Format</label>
                            <div className="relative">
                                <select
                                    id="aspect-ratio-select"
                                    name="aspectRatio"
                                    value={aspectRatio}
                                    onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
                                    className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm focus:outline-none appearance-none ${isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-neutral-900/70 border-white/15 text-white'}`}
                                >
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <option key={ratio.id} value={ratio.id}>{ratio.label}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-col gap-1.5">
                            {categoryConfig.showSameModel && (
                                <button
                                    onClick={() => onConsistentCharacterChange(!consistentCharacter)}
                                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md border transition-all duration-300 ${consistentCharacter ? 'bg-gold-500/10 border-gold-500/30' : isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900/70 border-white/15'}`}
                                    title="Ensures the same person appears across multiple photos."
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold ${consistentCharacter ? 'text-gold-400' : isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Keep Same Person</span>
                                        <div className="relative group/tooltip">
                                            <div className="flex items-center justify-center w-3 h-3 rounded-full border border-neutral-600 text-[8px] text-neutral-500 font-serif italic pb-px cursor-help">?</div>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-neutral-800 border border-white/10 rounded-md text-[9px] text-neutral-300 font-normal normal-case tracking-normal whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-lg z-20">Uses the same AI model across all your photos</div>
                                        </div>
                                    </div>
                                    <div className={`w-7 h-3.5 sm:w-8 sm:h-4 rounded-full relative flex-shrink-0 ${consistentCharacter ? 'bg-gold-600' : isLight ? 'bg-neutral-300' : 'bg-neutral-700'}`}>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform ${consistentCharacter ? 'translate-x-3.5 sm:translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Number of Images */}
                        <div>
                            <label htmlFor="number-of-images-select" className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold mb-1 block ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>Number of Images</label>
                            <div className="relative">
                                <select
                                    id="number-of-images-select"
                                    name="numberOfImages"
                                    value={numberOfImages}
                                    onChange={(e) => onNumberOfImagesChange(Number(e.target.value))}
                                    className={`w-full border rounded-md py-1.5 sm:py-2 px-2.5 sm:px-3 text-sm focus:outline-none appearance-none ${isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-neutral-900/70 border-white/15 text-white'}`}
                                >
                                    <option value={2}>2 Images</option>
                                    <option value={4}>4 Images</option>
                                    <option value={6}>6 Images</option>
                                </select>
                                <ChevronDownIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400 pointer-events-none" />
                            </div>
                            <p className={`mt-1.5 text-[9px] sm:text-[10px] font-medium tracking-wide ${isLight ? 'text-gold-600/80' : 'text-gold-400/80'}`}>
                                This will use <span className={`font-bold ${isLight ? 'text-gold-600' : 'text-gold-400'}`}>{numberOfImages * (imageQuality === '4K' ? 40 : 20)}</span> Credits
                            </p>
                        </div>


                        {/* Generate Button */}
                        <div className="pt-0.5 sm:pt-1">
                            {!isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        if (!hasImage) {
                                            setShakeUpload(true);
                                            setTimeout(() => setShakeUpload(false), 1500);
                                            uploadAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            return;
                                        }
                                        navigate('/login', { state: { from: { pathname: '/studio' } } });
                                    }}
                                    className="w-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white bg-gold-600 hover:bg-gold-500 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md shadow-gold-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2"
                                >
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    LOG IN TO GENERATE
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            if (!hasImage) {
                                                setShakeUpload(true);
                                                setTimeout(() => setShakeUpload(false), 1500);
                                                uploadAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                return;
                                            }
                                            onGenerate();
                                        }}
                                        disabled={isLoading || (remainingCredits !== null && remainingCredits < (numberOfImages * (imageQuality === '4K' ? 40 : 20)))}
                                        className="w-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white bg-gold-700 hover:bg-gold-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg shadow-gold-950/40 transition-all transform hover:-translate-y-0.5 disabled:transform-none"
                                    >
                                        {isLoading ? 'Processing...' : `Generate Photoshoot — ${numberOfImages * (imageQuality === '4K' ? 40 : 20)} Credits`}
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

export const PhotoStudio: React.FC<{ onExit: () => void; onContentGenerated: () => void; onPhaseChange?: (phase: string) => void; onJumpToPhaseRef?: (fn: (phase: string) => void) => void; isLight?: boolean; }> = ({ onExit, onContentGenerated, onPhaseChange, onJumpToPhaseRef, isLight }) => {
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
    const [phase, setPhase] = useState<StudioPhase>('details');

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

    // Default to 'ecommerce' so generation works without category selection step
    const [promptCategory, setPromptCategory] = useState<Category>('ecommerce');
    const [currentProductTypes, setCurrentProductTypes] = useState<ProductTypeOption[]>([]);
    const [productType, setProductType] = useState<ProductType>('apparel');
    const [productName, setProductName] = useState<string>('');
    const [creatorName, setCreatorName] = useState<string>('');
    const [selectedStyle, setSelectedStyle] = useState<string>('vintage');
    const [loadingImages, setLoadingImages] = useState<string[]>([]);
    const [apparelStyle, setApparelStyle] = useState<ApparelStyle>('general');
    const [loadingMessage, setLoadingMessage] = useState<string>("");
    const [otherOrnamentType, setOtherOrnamentType] = useState<string>(OTHER_ORNAMENT_OPTIONS[0]);
    const [extraPrompt, setExtraPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
    const [consistentCharacter, setConsistentCharacter] = useState<boolean>(false);
    const [useSameLocation, setUseSameLocation] = useState<boolean>(false);
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
        if (imageFiles.length === 0) {
            setError('Please upload a product image first.');
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
                result = await generateCatalogueImages(imageFiles, promptCategory, productType, selectedStyle, onImageGenerated, apparelStyle, extraPrompt, aspectRatio, consistentCharacter, background, customBackground, imageQuality, numberOfImages, productName);
            }

            setCoverImage(result.coverImage);
            setModelImages(result.modelImages);
            setPhase('results');
            onContentGenerated();
            notifyGenerationComplete('Photoshoot');

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
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                try {
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

                // Save generation record for admin tracking
                try {
                    const allImages = [result.coverImage, ...result.modelImages].filter(Boolean);
                    await fetch(`${API_URL}/api/user/generations/save`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            type: 'photoshoot',
                            quality: imageQuality,
                            imageUrls: allImages,
                            category: promptCategory,
                            productType,
                            style: selectedStyle,
                            creditsUsed: numberOfImages * (imageQuality === '4K' ? 40 : 20),
                            sourceImageUrl: imageFiles[0]?.previewUrl || null,
                            numberOfImages,
                            background,
                            creatorName: creatorName || null,
                        }),
                    });
                } catch (err) {
                    console.error('Save generation record error:', err);
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

            const { default: jsPDF } = await import('jspdf');
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

                    const { default: html2canvas } = await import('html2canvas');
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
            const { default: JSZip } = await import('jszip');
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

    // Track elapsed time for "stay tuned" message
    const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (phase === 'generating') {
            setGenerationStartTime(Date.now());
            setElapsedSeconds(0);
        } else {
            setGenerationStartTime(null);
            setElapsedSeconds(0);
        }
    }, [phase]);

    useEffect(() => {
        if (!generationStartTime) return;
        const interval = setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - generationStartTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [generationStartTime]);

    const renderPhaseContent = () => {
        if (phase === 'generating' || isLoading) {
            const generatedCount = loadingImages.filter(Boolean).length;
            const total = numberOfImages || 2;
            const pct = Math.max(4, Math.round((generatedCount / total) * 100));
            return (
                <div className={`w-full min-h-[70vh] flex flex-col items-center justify-center animate-fade-in-up px-4 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                    {/* Floating particles background */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                            <span
                                key={i}
                                className="absolute rounded-full opacity-20 animate-pulse"
                                style={{
                                    width: `${6 + (i % 4) * 4}px`,
                                    height: `${6 + (i % 4) * 4}px`,
                                    background: `radial-gradient(circle, #e6b71e, transparent)`,
                                    top: `${8 + (i * 7) % 84}%`,
                                    left: `${4 + (i * 9) % 92}%`,
                                    animationDelay: `${i * 0.4}s`,
                                    animationDuration: `${2 + (i % 3)}s`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Central progress ring */}
                    <div className="relative mb-8">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'} strokeWidth="8" />
                            <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke="url(#goldGrad)" strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 52}`}
                                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                            />
                            <defs>
                                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f8cd6b" />
                                    <stop offset="100%" stopColor="#ae820d" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* Pct label in centre */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gold-400">{pct}%</span>
                            <span className={`text-[9px] uppercase tracking-[0.2em] font-semibold mt-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>done</span>
                        </div>
                    </div>

                    {/* Image pill strip */}
                    <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mb-8">
                        {Array.from({ length: total }, (_, i) => {
                            const url = loadingImages[i];
                            const isDone = !!url;
                            const isActive = !isDone && i === generatedCount;
                            return (
                                <div
                                    key={i}
                                    className={`relative overflow-hidden rounded-2xl transition-all duration-700 ${
                                        isDone
                                            ? 'w-[80px] h-[100px] sm:w-[100px] sm:h-[124px] shadow-[0_0_24px_rgba(230,183,30,0.25)]'
                                            : isActive
                                                ? 'w-[70px] h-[88px] sm:w-[88px] sm:h-[110px] opacity-80'
                                                : 'w-[56px] h-[70px] sm:w-[70px] sm:h-[88px] opacity-40'
                                    } border-2 ${
                                        isDone ? 'border-gold-400' : isActive ? 'border-gold-500/50 animate-pulse' : (isLight ? 'border-neutral-300' : 'border-white/10')
                                    }`}
                                >
                                    {isDone ? (
                                        <img src={url} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${isLight ? 'bg-neutral-100' : 'bg-neutral-900'}`}>
                                            {isActive ? (
                                                <div className="w-6 h-6 rounded-full border-2 border-transparent border-t-gold-500 animate-spin" />
                                            ) : (
                                                <span className={`text-sm font-bold ${isLight ? 'text-neutral-300' : 'text-white/20'}`}>{i + 1}</span>
                                            )}
                                        </div>
                                    )}
                                    {isDone && (
                                        <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center shadow-md">
                                            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Headline — below the pills */}
                    <h2 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight mt-2 mb-1 text-center ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                        Crafting Your <span className="italic text-gold-400">Photoshoot</span>
                    </h2>
                    <p className={`text-sm mb-6 text-center ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        {generatedCount < total
                            ? `Image ${generatedCount + 1} of ${total} generating…`
                            : 'Finishing touches…'
                        }
                    </p>

                    {/* Thin progress bar */}
                    <div className={`w-full max-w-sm h-1 rounded-full overflow-hidden mb-3 ${isLight ? 'bg-neutral-200' : 'bg-neutral-800'}`}>
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-700 ease-out"
                            style={{ width: `${pct}%` }}
                        />
                    </div>

                    {/* Stay tuned */}
                    {elapsedSeconds >= 40 && generatedCount < total && (
                        <p className={`text-xs animate-fade-in font-medium ${isLight ? 'text-neutral-400' : 'text-neutral-400'}`}>
                            ⏳ Taking a little longer — <span className="text-gold-400">stay tuned!</span>
                        </p>
                    )}
                </div>
            );
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
                        useSameLocation={useSameLocation}
                        onUseSameLocationChange={setUseSameLocation}
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
                        onCategoryChange={(cat, pt, itemName) => {
                            setPromptCategory(cat);
                            setProductType(pt);
                            // Auto-set product label from item name for dynamic 'other' prompts
                            if (itemName && itemName !== 'AI Detected' && itemName !== 'Other' && itemName !== '') {
                                setIdentifiedProductName(itemName);
                            }
                        }}
                        isLight={isLight}
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
