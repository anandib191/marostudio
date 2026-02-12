import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { HomeIcon } from './icons/HomeIcon';

interface GeneratedVideoPlayerProps {
    videoUrl: string;
    productName: string;
    creatorName: string;
    onBack?: () => void;
}

export const GeneratedVideoPlayer: React.FC<GeneratedVideoPlayerProps> = ({
    videoUrl,
    productName,
    creatorName,
    onBack,
}) => {
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = videoUrl;
        const safeProductName = productName.replace(/[^a-zA-Z0-9]/g, '_') || 'product_video';
        link.download = `${safeProductName}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h2 className="font-serif-display text-4xl text-white">Your Video is Ready!</h2>
                    <p className="text-neutral-300 mt-1">
                        {productName ? `A cinematic debut for "${productName}"` : 'Your new video is here.'}
                    </p>
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                        <HomeIcon className="w-4 h-4" />
                        <span>Back to Photoshoot</span>
                    </button>
                )}
            </div>

            <div className="w-full bg-neutral-900/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
                 <video
                    src={videoUrl}
                    controls
                    className="w-full aspect-video rounded-lg"
                    autoPlay
                    loop
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            
            <button
                onClick={handleDownload}
                className="text-white bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 font-semibold py-3 px-8 rounded-lg shadow-lg shadow-gold-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-gold-500 flex items-center justify-center gap-3 w-full max-w-xs"
            >
                <DownloadIcon />
                <span>DOWNLOAD VIDEO (MP4)</span>
            </button>
        </div>
    );
};