
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { HomeIcon } from './icons/HomeIcon'; // Re-using for a "back" icon

interface GeneratedAdsViewerProps {
  baseImage: string;
  adImages: string[];
  onBack: () => void;
}

export const GeneratedAdsViewer: React.FC<GeneratedAdsViewerProps> = ({
  baseImage,
  adImages,
  onBack,
}) => {

  const handleDownload = async (image: string, index: number) => {
    const { downloadImage } = await import('../utils/downloadHelper');
    await downloadImage(image, `ad_variation_${index + 1}.png`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="font-serif-display text-4xl text-white">Your Ads are Ready!</h2>
          <p className="text-neutral-300 mt-1">
            New ad concepts generated from your selected image.
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Back to Photoshoot</span>
        </button>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        
        {/* Original Image Column */}
        <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-semibold text-lg text-neutral-300 mb-4 text-center md:text-left">Original Image</h3>
            <div className="bg-neutral-800 rounded-lg overflow-hidden group relative border border-neutral-700">
                 <img
                    src={baseImage}
                    alt="Original selected"
                    className="w-full h-auto object-cover aspect-[3/4]"
                />
            </div>
        </div>

        {/* Generated Ads Column */}
        <div className="md:col-span-2 lg:col-span-3">
            <h3 className="font-semibold text-lg text-neutral-300 mb-4 text-center md:text-left">Generated Ads</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {adImages.map((image, index) => (
                    <div key={index} className="bg-neutral-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out group relative border border-neutral-700 hover:border-neutral-600">
                        <img
                            src={image}
                            alt={`Generated ad ${index + 1}`}
                            className="w-full h-auto object-cover aspect-[3/4]"
                            loading="lazy"
                        />
                        <button 
                            onClick={() => handleDownload(image, index)}
                            aria-label={`Download ad variation ${index + 1}`}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                            <DownloadIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
