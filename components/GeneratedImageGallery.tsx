
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface GeneratedImageGalleryProps {
  images: string[];
}

export const GeneratedImageGallery: React.FC<GeneratedImageGalleryProps> = ({ images }) => {
  
  const handleDownload = (image: string, index: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Prepare watermark text
      const padding = img.width * 0.04; 
      const fontSize = Math.max(20, Math.round(img.width / 30));
      ctx.font = `bold ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';

      const prefixText = 'NextGen ';
      const suffixText = 'Photo';
      const x = canvas.width - padding;
      const y = padding;

      // Measure text widths
      const suffixMetrics = ctx.measureText(suffixText);
      
      // Draw "Photo" in Indigo
      ctx.fillStyle = '#6366f1'; 
      ctx.fillText(suffixText, x, y);

      // Draw "NextGen" in White to the left
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(prefixText, x - suffixMetrics.width, y);

      // Trigger download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      const isCover = index === 0;
      const title = isCover ? 'hero-shot' : `frame-${index}`;
      link.download = `${title}-nextgen.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.onerror = () => {
      const link = document.createElement('a');
      link.href = image;
      const isCover = index === 0;
      const title = isCover ? 'hero-shot' : `frame-${index}`;
      link.download = `${title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image, index) => {
          const isCover = index === 0;
          const title = isCover ? 'Hero Composition' : `Neural Frame ${index}`;
          const altText = isCover ? 'AI-generated hero shot' : `Generated model frame ${index}`;
          
          return (
            <div 
              key={index} 
              className="group relative rounded-2xl overflow-hidden glass-card shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <img
                src={image}
                alt={altText}
                className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-700 ease-in-out group-hover:scale-105"
                loading="lazy"
              />
              
              <button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(image, index); }}
                  aria-label={`Download ${title}`}
                  className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-xl border border-white/10"
              >
                  <DownloadIcon />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white p-6 text-left pt-20">
                <p className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Asset Frame</p>
                <p className="font-serif-display italic text-xl">{title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
