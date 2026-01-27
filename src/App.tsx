

import React, { useState, useCallback, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DropdownMenu } from './components/DropdownMenu';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageGallery } from './components/GeneratedImageGallery';
import { CatalogueViewer } from './components/CatalogueViewer';
import { Loader } from './components/Loader';
import { LoadingScreen } from './components/LoadingScreen';
import { generateCatalogueImages, generateProductVideo, generateAdFilm } from './services/geminiService';
import { STYLE_OPTIONS } from './services/styles';
import { ImageFile, ProductType, Category, GenerationType, ApparelStyle } from './types';
import { GridIcon } from './components/icons/GridIcon';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { DiamondIcon } from './components/icons/DiamondIcon';
import { PurseIcon } from './components/icons/PurseIcon';
import { PerfumeIcon } from './components/icons/PerfumeIcon';
import { TshirtIcon } from './components/icons/TshirtIcon';
import { WomanCrestIcon } from './components/icons/WomanCrestIcon';
import { ManCrestIcon } from './components/icons/ManCrestIcon';
import { KidsCrestIcon } from './components/icons/KidsCrestIcon';
import { WatchIcon } from './components/icons/WatchIcon';
import { BeltIcon } from './components/icons/BeltIcon';
import { ToysIcon } from './components/icons/ToysIcon';
import { GlassFilter } from './components/ui/GlassFilter';
import { GlassButton } from './components/ui/GlassButton';
import { LimelightNav, NavItem } from './components/ui/LimelightNav';
import { GeneratedVideoPlayer } from './components/GeneratedVideoPlayer';
import { VideoIcon } from './components/icons/VideoIcon';
import { ImageIcon } from './components/icons/ImageIcon';
import { ImageCarousel } from './components/ImageCarousel';
import { DemoCard } from './components/DemoCard';
import { AIModelsGrid } from './components/AIModelsGrid';
import { BookDemoPage } from './components/BookDemoPage';
import { PricingPage } from './components/PricingPage';
import { UploadStep } from './components/UploadStep';
import { GeneratedAdsViewer } from './components/GeneratedAdsViewer';
// FIX: Import FurnitureIcon to support the new furniture product type.
import { EcomCrestIcon } from './components/icons/EcomCrestIcon';
import { HomeAndKitchenIcon } from './components/icons/HomeAndKitchenIcon';
import { ElectronicsIcon } from './components/icons/ElectronicsIcon';
import { OtherProductIcon } from './components/icons/OtherProductIcon';
import { FurnitureIcon } from './components/icons/FurnitureIcon';


// --- Types ---
type ViewMode = 'gallery' | 'catalogue' | 'ads';
type IntroPhase = 'landing' | 'category' | 'upload' | 'details' | 'bookDemo';

interface ProductTypeOption {
    id: ProductType;
    name: string;
    icon: React.FC<{ className?: string }>;
}

// --- Intro Flow Components ---

interface LandingIntroProps {
  onStart: () => void;
  onBookDemo: () => void;
}

const LandingIntro: React.FC<LandingIntroProps> = ({ onStart, onBookDemo }) => {
  // FIX: Removed unnecessary comment.
  const pricingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  
  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-7xl animate-fade-in-up">
        <h1 className="font-serif-display text-6xl sm:text-7xl md:text-9xl font-bold text-white tracking-normal">You. Me. & camera</h1>
        <p className="mt-8 text-neutral-300 text-lg md:text-xl">No studio. No noise. Just creation.</p>
        <p className="mt-4 text-neutral-400 text-base md:text-lg">Select your aesthetic. Strike your AI pose</p>
        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBookDemo}
            className="text-white bg-transparent border border-white/50 hover:bg-white/10 font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-lg transition-all duration-300 w-full sm:w-auto text-lg"
          >
            Book Demo
          </button>
          <button
            onClick={onStart}
            className="text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-lg shadow-lg shadow-rose-900/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-rose-500 w-full sm:w-auto text-lg"
          >
            Enter the Studio
          </button>
        </div>
      </div>
      <div className="w-full mt-24 md:mt-32">
        <ImageCarousel />
      </div>
      <div className="mt-24 md:mt-32 text-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-normal">Where fashion meets intelligence.</h2>
          <p className="mt-4 text-neutral-300 text-base md:text-lg max-w-2xl mx-auto">The complete AI toolkit for fashion creation.</p>
      </div>

      <div className="w-full max-w-7xl mt-24 md:mt-40 flex flex-col lg:flex-row items-center justify-between gap-16 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
          <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block bg-orange-500/20 text-orange-300 text-sm font-semibold px-4 py-1.5 rounded-full">
                  Flat-lay → Model
              </span>
              <h2 className="mt-4 font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-normal">From Fabric to Frame</h2>
              <p className="mt-6 text-neutral-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">Transform flat-lays into living editorials.</p>
              <p className="mt-2 text-neutral-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0">Your product, reimagined through AI artistry.</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                      onClick={onBookDemo}
                      className="text-white bg-transparent border border-white/50 hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300 w-full sm:w-auto"
                  >
                      Book demo
                  </button>
                  <button
                      onClick={onStart}
                      className="text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 font-semibold py-3 px-8 rounded-lg shadow-lg shadow-rose-900/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-rose-500 w-full sm:w-auto"
                  >
                      Try It Now
                  </button>
              </div>
          </div>
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0 flex justify-center lg:justify-end">
              <DemoCard />
          </div>
      </div>
      
      <div className="w-full max-w-7xl mt-24 md:mt-40 flex flex-col lg:flex-row items-center justify-between gap-16 animate-fade-in-up" style={{ animationDelay: '1500ms' }}>
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-start">
              <AIModelsGrid />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block bg-rose-500/20 text-rose-300 text-sm font-semibold px-4 py-1.5 rounded-full">
                  AI Models
              </span>
              <h2 className="mt-4 font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-normal">Generate diverse AI models</h2>
              <p className="mt-6 text-neutral-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">Create inclusive, diverse model representations for your brand in seconds.</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                   <button
                      onClick={onBookDemo}
                      className="text-white bg-transparent border border-white/50 hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300 w-full sm:w-auto"
                  >
                      Book demo
                  </button>
                  <button
                      onClick={onStart}
                      className="text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 font-semibold py-3 px-8 rounded-lg shadow-lg shadow-rose-900/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-rose-500 w-full sm:w-auto"
                  >
                      Try for Free
                  </button>
              </div>
          </div>
      </div>
      <div ref={howItWorksRef}><HowItWorks /></div>
      <ComingSoonPage />
      <div ref={pricingRef}><PricingPage /></div>
      <Footer ref={contactRef}/>
    </div>
  );
};


interface CategorySelectionProps {
  onSelectCategory: (category: Category) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelectCategory }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center">
        <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-normal">Select a Category</h2>
        <p className="mt-2 text-neutral-300">Who are you creating for?</p>
      </div>
      <div className="mt-12 md:mt-16 w-full max-w-sm md:max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <GlassButton onClick={() => onSelectCategory('women')} className="group w-full">
              <div className="px-6 py-5 md:py-8 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                  <h2 className="font-sans font-semibold text-lg md:text-xl text-white uppercase tracking-[0.25em]">Women</h2>
                  <WomanCrestIcon className="w-9 h-9 md:w-12 md:h-12 text-neutral-300 group-hover:text-white transition-colors duration-300" />
              </div>
          </GlassButton>
          <GlassButton onClick={() => onSelectCategory('men')} className="group w-full">
               <div className="px-6 py-5 md:py-8 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                  <h2 className="font-sans font-semibold text-lg md:text-xl text-white uppercase tracking-[0.25em]">Men</h2>
                  <ManCrestIcon className="w-9 h-9 md:w-12 md:h-12 text-neutral-300 group-hover:text-white transition-colors duration-300" />
              </div>
          </GlassButton>
          <GlassButton onClick={() => onSelectCategory('kids')} className="group w-full">
               <div className="px-6 py-5 md:py-8 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                  <h2 className="font-sans font-semibold text-lg md:text-xl text-white uppercase tracking-[0.25em]">Kids</h2>
                  <KidsCrestIcon className="w-9 h-9 md:w-12 md:h-12 text-neutral-300 group-hover:text-white transition-colors duration-300" />
              </div>
          </GlassButton>
          
          <GlassButton onClick={() => onSelectCategory('ecommerce')} className="group w-full">
               <div className="px-6 py-5 md:py-8 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                  <h2 className="font-sans font-semibold text-lg md:text-xl text-white uppercase tracking-[0.25em]">E-commerce</h2>
                  <EcomCrestIcon className="w-9 h-9 md:w-12 md:h-12 text-neutral-300 group-hover:text-white transition-colors duration-300" />
              </div>
          </GlassButton>
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
    generationType: GenerationType;
    onGenerationTypeChange: (type: GenerationType) => void;
    onGenerate: () => void;
    onImageUpload: (file: ImageFile, index: number) => void;
    isLoading: boolean;
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
    generationType,
    onGenerationTypeChange,
    onGenerate,
    onImageUpload,
    isLoading,
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
            <h2 className="font-serif-display text-3xl sm:text-4xl text-center mb-8 text-white">Final Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="bg-neutral-900/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
                    {productType === 'apparel' ? (
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-center text-sm font-medium text-neutral-300 mb-2">Front View</p>
                                <ImageUploader
                                    onImageUpload={(file) => onImageUpload(file, 0)}
                                    initialPreview={imageFiles[0]?.previewUrl}
                                    enableAnimation={true}
                                />
                            </div>
                            <div>
                                <p className="text-center text-sm font-medium text-neutral-300 mb-2">Back View</p>
                                <ImageUploader
                                    onImageUpload={(file) => onImageUpload(file, 1)}
                                    initialPreview={imageFiles[1]?.previewUrl}
                                    enableAnimation={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <ImageUploader
                            onImageUpload={(file) => onImageUpload(file, 0)}
                            initialPreview={imageFiles[0]?.previewUrl}
                            enableAnimation={true}
                        />
                    )}
                </div>
                <div className="bg-neutral-900/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl h-full flex flex-col">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="product-name" className="block text-sm font-medium text-neutral-400 mb-2">Product Name (Optional)</label>
                            <input
                                type="text"
                                id="product-name"
                                value={productName}
                                onChange={(e) => onProductNameChange(e.target.value)}
                                placeholder="e.g., The 'Ember' Necklace"
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="creator-name" className="block text-sm font-medium text-neutral-400 mb-2">Brand / Creator's Name</label>
                            <input
                                type="text"
                                id="creator-name"
                                value={creatorName}
                                onChange={(e) => onCreatorNameChange(e.target.value)}
                                placeholder="e.g., Aurum Creations"
                                required
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-3">Output Format</label>
                            <div className="flex gap-2 p-1 rounded-lg bg-neutral-800/50">
                                <button
                                    onClick={() => onGenerationTypeChange('image')}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${generationType === 'image' ? 'bg-neutral-900 text-rose-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
                                >
                                    <ImageIcon className="w-5 h-5" />
                                    Image Photoshoot
                                </button>
                                <button
                                    onClick={() => onGenerationTypeChange('video')}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${generationType === 'video' ? 'bg-neutral-900 text-rose-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
                                >
                                    <VideoIcon className="w-5 h-5" />
                                    Product Video
                                </button>
                            </div>
                        </div>

                        {generationType === 'image' && (
                            <div className="animate-fade-in">
                                <label htmlFor="style-selector" className="block text-sm font-medium text-neutral-400 mb-3">Photoshoot Style</label>
                                <div id="style-selector" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {STYLE_OPTIONS.map((style) => (
                                    <GlassButton
                                        key={style.id}
                                        onClick={() => onStyleChange(style.id)}
                                        isActive={selectedStyle === style.id}
                                    >
                                    <div className={`text-center px-4 py-3 text-sm font-semibold transition-colors ${
                                        selectedStyle === style.id
                                        ? 'text-rose-300'
                                        : 'text-neutral-200'
                                        }`
                                    }>
                                        {style.name}
                                    </div>
                                    </GlassButton>
                                ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-10 flex-grow flex flex-col justify-end">
                        <button
                            onClick={onGenerate}
                            disabled={!creatorName || isLoading}
                            className="w-full text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:bg-neutral-600 disabled:from-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed font-semibold py-4 px-8 rounded-lg shadow-lg shadow-rose-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-rose-500 text-lg"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                <Loader size="sm" color="white" />
                                <span>GENERATING...</span>
                                </div>
                            ) : (
                                <span>{generationType === 'video' ? 'GENERATE VIDEO' : 'GENERATE PHOTOSHOOT'}</span>
                            )}
                        </button>
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400 max-w-md mx-auto px-4">
                            <InfoIcon className="w-4 h-4 flex-shrink-0" />
                            <p className="italic text-center">AI is a creative tool. Results may vary. {generationType === 'video' && 'Video generation can take a few minutes.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [modelImages, setModelImages] = useState<string[]>([]);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const catalogueRef = useRef<HTMLDivElement>(null);
  
  const [introPhase, setIntroPhase] = useState<IntroPhase>('landing');
  const [category, setCategory] = useState<Category | null>(null);
  const [productType, setProductType] = useState<ProductType>('jewelry');
  const [productName, setProductName] = useState<string>('');
  const [creatorName, setCreatorName] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_OPTIONS[0].id);
  const [loadingImages, setLoadingImages] = useState<string[]>([]);
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const [apparelStyle, setApparelStyle] = useState<ApparelStyle>('general');
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const [isGeneratingAdFilm, setIsGeneratingAdFilm] = useState<boolean>(false);
  const [generatedAdFilmUrl, setGeneratedAdFilmUrl] = useState<string | null>(null);
  const [selectedImagesForAdFilm, setSelectedImagesForAdFilm] = useState<string[]>([]);
  
  const [generatedAds, setGeneratedAds] = useState<string[]>([]);
  const [baseAdImage, setBaseAdImage] = useState<string | null>(null);


  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    const cleanup = () => {
        if (generatedVideoUrl) URL.revokeObjectURL(generatedVideoUrl);
        if (generatedAdFilmUrl) URL.revokeObjectURL(generatedAdFilmUrl);
    };
    return cleanup;
  }, [generatedVideoUrl, generatedAdFilmUrl]);

  const productTypeMap: Record<Category, ProductTypeOption[]> = {
    women: [
      { id: 'jewelry', name: 'Jewelry', icon: DiamondIcon },
      { id: 'purse', name: 'Purse', icon: PurseIcon },
      { id: 'perfume', name: 'Perfume', icon: PerfumeIcon },
      { id: 'apparel', name: 'Apparel', icon: TshirtIcon },
    ],
    men: [
      { id: 'watch', name: 'Watch', icon: WatchIcon },
      { id: 'perfume', name: 'Perfume', icon: PerfumeIcon },
      { id: 'belt', name: 'Belt', icon: BeltIcon },
      { id: 'apparel', name: 'Apparel', icon: TshirtIcon },
    ],
    kids: [
      { id: 'apparel', name: 'Apparel', icon: TshirtIcon },
      { id: 'toys', name: 'Toys', icon: ToysIcon },
    ],
    // FIX: Add 'furniture' to the product types for the e-commerce category.
    ecommerce: [
        { id: 'home-and-kitchen', name: 'Home & Kitchen', icon: HomeAndKitchenIcon },
        { id: 'electronics', name: 'Electronics', icon: ElectronicsIcon },
        { id: 'furniture', name: 'Furniture', icon: FurnitureIcon },
        { id: 'other', name: 'Other', icon: OtherProductIcon },
    ],
  };

  const handleCategorySelect = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setProductType(productTypeMap[selectedCategory][0].id);
    setIntroPhase('upload');
  };
  
  const handleBookDemoClick = () => {
    setIntroPhase('bookDemo');
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
      setIntroPhase('details');
    }
  };


  const handleGeneration = useCallback(async () => {
    if (imageFiles.length === 0 || !category || !creatorName) {
      setError('Please ensure an image is uploaded, a category is selected, and a creator name is provided.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingImages([]);
    setCoverImage(null);
    setModelImages([]);
    setGeneratedVideoUrl(null);

    try {
        if (generationType === 'image') {
            const onImageGenerated = (image: string, index: number) => {
                setLoadingImages(prev => {
                    const newImages = [...prev];
                    newImages[index] = image;
                    return newImages;
                });
            };
            const { coverImage, modelImages } = await generateCatalogueImages(imageFiles, category, productType, selectedStyle, onImageGenerated, apparelStyle);
            setCoverImage(coverImage);
            setModelImages(modelImages);
        } else {
             const onProgress = (message: string) => {
                setLoadingMessage(message);
            };
            const videoUrl = await generateProductVideo(imageFiles[0], category, productType, productName, onProgress);
            setGeneratedVideoUrl(videoUrl);
        }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsLoading(false);
      setLoadingImages([]);
      setLoadingMessage("");
    }
  }, [imageFiles, creatorName, category, productType, selectedStyle, generationType, productName, apparelStyle]);

  const handleDownload = async () => {
    if (!catalogueRef.current) return;
    setIsDownloading(true);
    setError(null);
    try {
      const pages = catalogueRef.current.querySelectorAll<HTMLElement>('.catalogue-page');
      if (pages.length === 0) {
        throw new Error("No catalogue pages found to generate PDF.");
      }
      
      const firstPageCanvas = await html2canvas(pages[0], { scale: 3, useCORS: true });
      const pdf = new jsPDF({
        orientation: 'portrait', unit: 'px', format: [firstPageCanvas.width, firstPageCanvas.height], hotfixes: ['px_scaling'],
      });

      const firstPageImgData = firstPageCanvas.toDataURL('image/png');
      pdf.addImage(firstPageImgData, 'PNG', 0, 0, firstPageCanvas.width, firstPageCanvas.height, undefined, 'FAST');

      for (let i = 1; i < pages.length; i++) {
        const pageCanvas = await html2canvas(pages[i], { scale: 3, useCORS: true });
        const pageImgData = pageCanvas.toDataURL('image/png');
        pdf.addPage([pageCanvas.width, pageCanvas.height], 'portrait');
        pdf.addImage(pageImgData, 'PNG', 0, 0, pageCanvas.width, pageCanvas.height, undefined, 'FAST');
      }

      pdf.save('modern-mom-catalogue.pdf');
    } catch (e) {
      console.error("Failed to create PDF", e);
      setError("Sorry, we couldn't create the high-quality PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGoHome = () => {
    setImageFiles([]);
    setCoverImage(null);
    setModelImages([]);
    setGeneratedVideoUrl(null);
    setError(null);
    setViewMode('gallery');
    setIntroPhase('landing');
    setCategory(null);
    setProductName('');
    setCreatorName('');
    setProductType('jewelry');
    setGenerationType('image');
    setGeneratedAdFilmUrl(null);
    setSelectedImagesForAdFilm([]);
    setGeneratedAds([]);
    setBaseAdImage(null);
  };

  const handleGenerateAdFilm = useCallback(async (selectedImages: string[], aspectRatio: '16:9' | '9:16') => {
    if (!category || !productType || selectedImages.length === 0) return;
    
    setIsGeneratingAdFilm(true);
    setSelectedImagesForAdFilm(selectedImages);
    setGeneratedAdFilmUrl(null);
    setError(null);

    try {
        const imageFiles: ImageFile[] = selectedImages.map(imgUrl => {
            const mimeType = imgUrl.substring(imgUrl.indexOf(':') + 1, imgUrl.indexOf(';'));
            const base64 = imgUrl.split(',')[1];
            return { base64, mimeType, previewUrl: imgUrl };
        });

        const onProgress = (message: string) => {
            setLoadingMessage(message);
        };
        
        const videoUrl = await generateAdFilm(imageFiles, category, productType, productName, onProgress, aspectRatio);
        setGeneratedAdFilmUrl(videoUrl);

    } catch (err) {
      console.error("Error generating ad film:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during ad film generation.');
      setIsGeneratingAdFilm(false);
      setSelectedImagesForAdFilm([]);
    } finally {
        setIsGeneratingAdFilm(false);
        setLoadingMessage("");
    }
  }, [category, productType, productName]);

  const handleBackToPhotoshoot = () => {
    setGeneratedAdFilmUrl(null);
    setSelectedImagesForAdFilm([]);
    setGeneratedAds([]);
    setBaseAdImage(null);
    setViewMode('gallery');
    setError(null);
  };
  
  const hasGeneratedContent = !isLoading && (modelImages.length > 0 || !!generatedVideoUrl || !!generatedAdFilmUrl || generatedAds.length > 0);

  const renderIntro = () => {
    switch(introPhase) {
      case 'landing':
        return <LandingIntro onStart={() => setIntroPhase('category')} onBookDemo={handleBookDemoClick} />;
      case 'bookDemo':
        return <BookDemoPage />;
      case 'category':
        return <CategorySelection onSelectCategory={handleCategorySelect} />;
      case 'upload':
        if (!category) {
          setIntroPhase('category');
          return null;
        }
        return (
          <UploadStep
            productTypes={productTypeMap[category]}
            activeProductType={productType}
            onProductTypeChange={setProductType}
            onImageUpload={handleImageUpload}
            onProceed={handleProceedToDetails}
            imageFiles={imageFiles}
            apparelStyle={apparelStyle}
            onApparelStyleChange={setApparelStyle}
          />
        );
      case 'details':
        if (imageFiles.length === 0) {
          setIntroPhase('upload');
          return null;
        }
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
            generationType={generationType}
            onGenerationTypeChange={setGenerationType}
            onGenerate={handleGeneration}
            onImageUpload={handleImageUpload}
            isLoading={isLoading}
          />
        );
      default:
        setIntroPhase('landing');
        return null;
    }
  };

  const renderContent = () => {
    if (isLoading || isGeneratingAdFilm) {
      let mode: 'image' | 'video' | 'ad-film' = 'image';
      let imageUrl: string | null | undefined = imageFiles[0]?.previewUrl;
      let generatedImages: string[] = loadingImages;

      if (isGeneratingAdFilm) {
        mode = 'ad-film';
        imageUrl = selectedImagesForAdFilm[0];
        generatedImages = selectedImagesForAdFilm;
      } else if (generationType === 'video') {
        mode = 'video';
      }
      
      return <LoadingScreen mode={mode} imageUrl={imageUrl} generatedImages={generatedImages} message={loadingMessage} />;
    }
    
    if (viewMode === 'ads' && baseAdImage && generatedAds.length > 0) {
      return (
        <GeneratedAdsViewer
          baseImage={baseAdImage}
          adImages={generatedAds}
          onBack={handleBackToPhotoshoot}
        />
      );
    }
    
    if (generatedAdFilmUrl) {
        return (
          <GeneratedVideoPlayer 
            videoUrl={generatedAdFilmUrl}
            productName={productName || "Ad Film"}
            creatorName={creatorName}
            onBack={handleBackToPhotoshoot}
          />
        );
    }

    if (generatedVideoUrl) {
      return (
        <GeneratedVideoPlayer 
          videoUrl={generatedVideoUrl}
          productName={productName}
          creatorName={creatorName}
        />
      );
    }
    
    if (coverImage && modelImages.length > 0) {
      return (
        <>
          <h2 className="font-serif-display text-5xl text-center mb-4 text-white">Your Photoshoot is Ready</h2>
          <div className="flex justify-center items-center gap-1 mb-10 p-1 rounded-lg bg-neutral-800 max-w-sm mx-auto">
            <button
              onClick={() => setViewMode('gallery')}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${viewMode === 'gallery' ? 'bg-neutral-900 text-rose-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
            >
              <GridIcon />
              Gallery
            </button>
            <button
              onClick={() => setViewMode('catalogue')}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${viewMode === 'catalogue' ? 'bg-neutral-900 text-rose-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
            >
              <BookOpenIcon />
              Catalogue
            </button>
          </div>
          {viewMode === 'gallery' ? (
            <GeneratedImageGallery 
              images={[coverImage, ...modelImages]}
            />
          ) : (
            <CatalogueViewer
              coverImage={coverImage}
              generatedImages={modelImages}
              catalogueRef={catalogueRef}
              productName={productName}
              creatorName={creatorName}
            />
          )}
        </>
      );
    }
    
    return (
        <div className={`flex flex-col items-center justify-center ${introPhase === 'landing' || introPhase === 'bookDemo' ? 'min-h-[80vh]' : 'min-h-[70vh]'}`}>
          {renderIntro()}
        </div>
    );
  };

  const showLandingBackground = introPhase === 'landing' || introPhase === 'bookDemo';

  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans relative flex flex-col">
       {showLandingBackground && (
        <>
          <div className="fixed inset-0 w-full h-full z-[-2] bg-black" />
          <div className="fixed inset-0 w-screen h-screen z-[-1] overflow-hidden">
             <iframe
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2"
                src="https://player.vimeo.com/video/909756734?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
                allow="autoplay; fullscreen"
                allowFullScreen
                frameBorder="0"
              />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </>
      )}

      <Header 
        onGoHome={handleGoHome} 
        hasGeneratedContent={hasGeneratedContent}
        onMenuClick={() => setIsMenuOpen(prev => !prev)}
        isMenuOpen={isMenuOpen}
        activeSection={activeSection}
        onTryNow={() => introPhase === 'landing' ? setIntroPhase('category') : handleGoHome() /* Logic might need refinement */}
      />
      {isMenuOpen && <DropdownMenu onClose={() => setIsMenuOpen(false)} activeSection={activeSection} onTryNow={() => { setIntroPhase('category'); setIsMenuOpen(false); }} />}
      
      {!showLandingBackground && (
          <GlassFilter />
      )}
      
      <main className={`relative z-10 flex-grow flex flex-col ${showLandingBackground ? 'justify-start' : ''} px-4 sm:px-6 lg:px-8 ${showLandingBackground ? 'py-16 md:py-24' : 'py-8 md:py-16'}`}>
        
        <div className="animate-fade-in w-full h-full">
          {renderContent()}
        </div>

        {error && <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg text-center max-w-md mx-auto">{error}</div>}
      
      </main>
      
      {/* FIX: Removed unnecessary comment. */}
      {!showLandingBackground && (
        <footer className="text-center py-6 text-sm text-neutral-500 relative z-10">
        </footer>
      )}
    </div>
  );
};

export default App;