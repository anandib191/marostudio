
import React, { useState, useEffect } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { WandIcon } from './icons/WandIcon';
import { LightningIcon } from './icons/LightningIcon';
import { MagicSparkleIcon } from './icons/MagicSparkleIcon';

const PRODUCT_ASSET_URL = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop";

const Step1 = () => (
    <div className="p-4 flex flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gold-400/30 p-4 bg-black/40">
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500 text-white font-bold text-[10px] uppercase tracking-widest z-10">
                <UploadCloudIcon className="w-3 h-3" />
                <span>Upload</span>
            </div>
            <img 
                src={PRODUCT_ASSET_URL}
                alt="Flat-lay garment"
                className="w-full h-full object-contain relative z-0"
            />
        </div>
        <p className="font-semibold text-xs uppercase tracking-widest text-neutral-400">Step 1: Input Asset</p>
    </div>
);

const Step2 = () => (
    <div className="relative p-4 flex flex-col items-center justify-center gap-6 animate-fade-in h-[404px] overflow-hidden">
        <img 
            src={PRODUCT_ASSET_URL}
            alt="Asset ghost"
            className="absolute inset-0 w-full h-full object-contain opacity-10 blur-sm pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center gap-6 w-full">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-900/40">
                    <WandIcon className="w-4 h-4 text-white" />
                </div>
                <p className="font-bold text-sm uppercase tracking-widest text-white">Neural Settings</p>
            </div>
            <div className="w-full space-y-2 px-4">
                {['Persona: Minimalist', 'Scene: Tokyo Dusk', 'Lighting: Hyper-Natural'].map((text, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 px-5 py-3 rounded-lg border border-white/5 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{text}</span>
                        <CheckIcon className="w-3 h-3 text-gold-400" />
                    </div>
                ))}
            </div>
        </div>
        <p className="relative z-10 mt-4 font-semibold text-xs uppercase tracking-widest text-neutral-500">Step 2: Analysis</p>
    </div>
);

const Step3 = () => (
    <div className="relative p-4 flex flex-col items-center justify-center gap-8 animate-fade-in h-[404px] overflow-hidden">
        <img 
            src={PRODUCT_ASSET_URL}
            alt="Asset processing"
            className="absolute inset-0 w-full h-full object-contain opacity-5 grayscale pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="w-20 h-20 rounded-full bg-gold-600 flex items-center justify-center shadow-2xl shadow-gold-500/30 animate-pulse">
                <LightningIcon className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-[10px] tracking-[0.5em] text-gold-400 uppercase">Generating Views</p>
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest opacity-60">
                <MagicSparkleIcon className="w-4 h-4" />
                <span>Synthesizing Reality</span>
            </div>
        </div>
        <p className="relative z-10 mt-4 font-semibold text-xs uppercase tracking-widest text-neutral-500">Step 3: Rendering</p>
    </div>
);

const Step4 = () => (
     <div className="animate-fade-in">
        <div className="p-4">
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" 
                    alt="Generated professional photoshoot"
                    className="w-full h-auto"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500 text-white font-bold text-[10px] uppercase tracking-widest">
                    <CheckIcon className="w-3 h-3" />
                    <span>Campaign Ready</span>
                </div>
            </div>
        </div>
        <div className="px-6 pb-6 text-center space-y-3">
            <p className="font-bold text-xs text-white uppercase tracking-widest">Side Profile Complete 🚀</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Ready for deployment.</p>
            <button className="w-full py-2 px-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 hover:from-gold-400 hover:via-gold-500 hover:to-gold-700 text-white font-bold text-xs rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Download & Export
            </button>
        </div>
    </div>
);

export const DemoCard: React.FC = () => {
    const [step, setStep] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prevStep => (prevStep % 4) + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const renderStepContent = () => {
        switch (step) {
            case 1: return <Step1 />;
            case 2: return <Step2 />;
            case 3: return <Step3 />;
            case 4: return <Step4 />;
            default: return <Step1 />;
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-neutral-900/60 backdrop-blur-3xl rounded-[32px] border border-gold-500/10 shadow-2xl overflow-hidden animate-float-card">
            <div className="px-8 py-5 flex justify-between items-center border-b border-white/5 bg-white/5">
                <h3 className="font-bold text-[10px] tracking-widest text-neutral-500 uppercase">Engine Status</h3>
                <span className="text-gold-400 text-[10px] font-bold uppercase tracking-widest">State 0{step}</span>
            </div>
            <div className="relative">
                {renderStepContent()}
            </div>
        </div>
    );
};
