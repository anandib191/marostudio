import React from 'react';
import { NavItem } from './ui/LimelightNav';
import { LimelightNav } from './ui/LimelightNav';
import { ImageUploader } from './ImageUploader';
import { ImageFile, ProductType, ApparelStyle } from '../types';

interface UploadStepProps {
    productTypes: { id: ProductType; name: string; icon: React.FC<{ className?: string; }> }[];
    activeProductType: ProductType;
    onProductTypeChange: (productType: ProductType) => void;
    apparelStyle: ApparelStyle;
    onApparelStyleChange: (style: ApparelStyle) => void;
    onImageUpload: (file: ImageFile, index: number) => void;
    onProceed: () => void;
    imageFiles: ImageFile[];
}

export const UploadStep: React.FC<UploadStepProps> = ({
    productTypes,
    activeProductType,
    onProductTypeChange,
    apparelStyle,
    onApparelStyleChange,
    onImageUpload,
    onProceed,
    imageFiles,
}) => {
    const navItems: NavItem[] = productTypes.map(p => ({
        id: p.id,
        icon: <p.icon />,
        label: p.name,
    }));

    const activeProductTypeIndex = productTypes.findIndex(p => p.id === activeProductType);

    const handleTabChange = (index: number) => {
        const newProductType = productTypes[index];
        if (newProductType) {
            onProductTypeChange(newProductType.id);
        }
    };

    const isApparel = activeProductType === 'apparel';

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in-up">
            <div className="text-center">
                <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-normal">Bring Your Product to Life</h1>
                <p className="mt-4 text-neutral-300 max-w-lg mx-auto">Upload a clean product photo. Our AI will generate an entire high-fashion photoshoot for you.</p>
            </div>

            <div className="w-full mt-12 bg-neutral-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-gold-500/10 shadow-2xl">
                <div className="text-center">
                    <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider">1. Select Product Type</p>
                    <div className="mt-4 flex justify-center">
                        <LimelightNav
                            items={navItems}
                            defaultActiveIndex={activeProductTypeIndex}
                            onTabChange={handleTabChange}
                            className="bg-neutral-900/50 border-neutral-700/50"
                            iconClassName="w-7 h-7"
                            iconContainerClassName="px-6 py-5"
                        />
                    </div>
                </div>

                {isApparel && (
                    <div className="mt-8 animate-fade-in text-center">
                         <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">2. Choose Apparel Style</p>
                         <div className="flex justify-center gap-2 p-1 rounded-lg bg-neutral-800/50 max-w-md mx-auto">
                            <button
                                onClick={() => onApparelStyleChange('general')}
                                className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${apparelStyle === 'general' ? 'bg-neutral-900 text-gold-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => onApparelStyleChange('professional')}
                                className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${apparelStyle === 'professional' ? 'bg-neutral-900 text-gold-400 shadow-sm' : 'text-neutral-300 hover:bg-neutral-700'}`}
                            >
                                Professional
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <p className="text-center text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">
                        {isApparel ? '3. Upload Photos' : '2. Upload Photo'}
                    </p>
                    {isApparel ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <div>
                          <p className="text-center text-sm font-medium text-neutral-300 mb-2">Front View</p>
                          <ImageUploader onImageUpload={(file) => onImageUpload(file, 0)} initialPreview={imageFiles[0]?.previewUrl} />
                        </div>
                        <div>
                          <p className="text-center text-sm font-medium text-neutral-300 mb-2">Back View (Optional)</p>
                          <ImageUploader onImageUpload={(file) => onImageUpload(file, 1)} initialPreview={imageFiles[1]?.previewUrl} />
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-sm mx-auto">
                        <ImageUploader onImageUpload={(file) => onImageUpload(file, 0)} initialPreview={imageFiles[0]?.previewUrl} />
                      </div>
                    )}
                </div>

                <div className="mt-10 flex justify-center">
                    <button
                        onClick={onProceed}
                        disabled={!imageFiles.some(f => f)}
                        className="text-white bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:bg-neutral-600 disabled:from-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed font-semibold py-3 px-8 rounded-lg shadow-lg shadow-gold-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-gold-500 text-lg"
                    >
                        Next: Add Details
                    </button>
                </div>
            </div>
        </div>
    );
};