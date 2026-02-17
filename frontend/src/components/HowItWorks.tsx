
import React from 'react';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { CheckIcon } from './icons/CheckIcon';
import { FilePdfIcon } from './icons/FilePdfIcon';
import { FileZipIcon } from './icons/FileZipIcon';
import { MagicSparkleIcon } from './icons/MagicSparkleIcon';

// --- Visual Components for each step ---

const UploadVisual: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center animate-fade-in">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-neutral-900/50 backdrop-blur-2xl rounded-3xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center text-center p-4 overflow-hidden group">
             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-900/40 mb-4 z-10">
                <UploadCloudIcon className="w-8 h-8 text-white" />
            </div>
            <img 
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop" 
                alt="Flat-lay garment" 
                className="w-full h-full object-contain absolute opacity-20 transition-transform duration-700 group-hover:scale-110" 
            />
            <p className="font-semibold text-lg text-white z-10">Upload Photo</p>
            <p className="text-xs text-neutral-400 z-10">Front, Back, or Side view</p>
        </div>
    </div>
);

const StyleVisual: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center animate-fade-in">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-neutral-900/50 backdrop-blur-2xl rounded-3xl border border-white/5 flex flex-col items-center justify-center overflow-hidden">
            {/* Background Model Image - Side View */}
            <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" 
                alt="AI Styling Preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]"
            />
            
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-gold-500 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
                <MagicSparkleIcon className="w-3 h-3" />
                <span>Side View Processing</span>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-3 -rotate-3">
                <div className="px-5 py-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl">
                    <p className="text-white font-bold text-sm uppercase tracking-widest">Modern</p>
                </div>
                <div className="px-5 py-3 bg-gold-500/40 rounded-xl border border-gold-500 backdrop-blur-xl -translate-y-4 shadow-2xl">
                    <p className="text-gold-100 font-bold text-sm uppercase tracking-widest">Cinematic</p>
                </div>
                <div className="px-5 py-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xl translate-y-4 shadow-2xl">
                    <p className="text-white font-bold text-sm uppercase tracking-widest">Vintage</p>
                </div>
                <div className="px-5 py-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl">
                    <p className="text-white font-bold text-sm uppercase tracking-widest">Natural</p>
                </div>
            </div>
        </div>
    </div>
);

const AssetsVisual: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center animate-fade-in">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-neutral-900/50 backdrop-blur-2xl rounded-3xl border border-white/5 flex flex-col items-center justify-center p-6 overflow-hidden">
             {/* Catalog Layout Preview */}
            <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1 opacity-20 grayscale pointer-events-none">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm" />
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm" />
                <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm" />
                <img src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="p-6 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center gap-6 scale-90 md:scale-100">
                    <div className="flex flex-col items-center gap-2 text-center group">
                        <div className="p-3 bg-gold-500/10 rounded-2xl group-hover:bg-gold-500/20 transition-colors">
                            <FilePdfIcon className="w-12 h-12 text-gold-500" />
                        </div>
                        <span className="font-bold text-white text-[10px] uppercase tracking-widest">Catalog.pdf</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center group">
                        <div className="p-3 bg-gold-500/10 rounded-2xl group-hover:bg-gold-500/20 transition-colors">
                            <FileZipIcon className="w-12 h-12 text-gold-400" />
                        </div>
                        <span className="font-bold text-white text-[10px] uppercase tracking-widest">Assets.zip</span>
                    </div>
                </div>
                 <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gold-600/90 backdrop-blur-xl text-white font-bold text-xs uppercase tracking-widest border border-gold-400/50 shadow-2xl">
                    <CheckIcon className="w-4 h-4" />
                    <span>Side View Rendered</span>
                </div>
            </div>
        </div>
    </div>
);


// --- Main Component ---

const steps = [
  {
    title: "Upload Your Product Image",
    description: "Start by uploading a clean, high-quality photo of your product. Front, side, and back views are all supported.",
    visual: <UploadVisual />,
  },
  {
    title: "Choose Theme & Add Details",
    description: "Select from a range of high-end aesthetics and add product details to guide the neural engine in creating the perfect photoshoot.",
    visual: <StyleVisual />,
  },
  {
    title: "Download Your Assets",
    description: "Export professional PDF catalogs and high-resolution image ZIPs, featuring multiple model perspectives including side-profile frames.",
    visual: <AssetsVisual />,
  }
];

export const HowItWorks: React.FC = () => {

    return (
        <div className="w-full max-w-7xl mx-auto py-4 md:py-6 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <div className="text-center mb-8 md:mb-12 px-4">
                <span className="text-gold-500 font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block">Process</span>
                <h2 className="font-serif-display text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter">Liquid Workflow</h2>
                <p className="mt-6 text-neutral-500 text-lg md:text-xl font-light">From static asset to cinematic reality in three steps.</p>
            </div>
            
            <div className="w-full max-w-5xl mx-auto px-4">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="py-6 md:py-6 lg:py-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12"
                    >
                        {/* Step Number and Content */}
                        <div className="w-full md:w-1/2 flex flex-col text-center md:text-left">
                            <span className="font-serif-display text-5xl md:text-6xl font-bold text-neutral-700/70 mb-2 block leading-none">{`0${index + 1}.`}</span>
                            <h3 className="mt-1 font-serif-display text-xl md:text-3xl font-bold text-white tracking-tight leading-tight">{step.title}</h3>
                            <p className="mt-2 text-neutral-400 text-sm md:text-base font-light leading-relaxed">{step.description}</p>
                        </div>
                        
                        {/* Visual - Always visible, responsive */}
                        <div className="w-full md:w-1/2 flex items-center justify-center">
                            {step.visual}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
