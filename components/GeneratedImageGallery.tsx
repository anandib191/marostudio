
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface GeneratedImageGalleryProps {
  images: string[];
  hideWatermark?: boolean; // optional prop: if true, do not add watermark on download
}

export const GeneratedImageGallery: React.FC<GeneratedImageGalleryProps> = ({ images, hideWatermark }) => {
  const [shouldHideWatermark, setShouldHideWatermark] = React.useState<boolean>(Boolean(hideWatermark));

  // If parent didn't provide flag, infer from user's subscription via /api/credits
  React.useEffect(() => {
    if (typeof hideWatermark === 'boolean') return; // parent provided explicit choice
    const infer = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const API_URL = (import.meta.env.VITE_API_URL as string) || '';
        const res = await fetch(`${API_URL || ''}/api/credits?t=${Date.now()}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data && data.subscriptionPlan) {
          setShouldHideWatermark(true);
        }
      } catch (e) {
        // silent
      }
    };
    infer();
  }, [hideWatermark]);

  const handleDownload = async (image: string, index: number) => {
    const isCover = index === 0;
    const title = isCover ? 'hero-shot' : `frame-${index}`;
    const fileName = `${title}-marostudio.png`;

    // If no watermark needed, use the simple proxy download
    if (shouldHideWatermark) {
      const { downloadImage } = await import('../utils/downloadHelper');
      await downloadImage(image, fileName);
      return;
    }

    // Need watermark: fetch via proxy, then draw to canvas
    try {
      const { fetchImageAsBlob } = await import('../utils/downloadHelper');
      const blob = await fetchImageAsBlob(image);
      const blobUrl = URL.createObjectURL(blob);

      const img = new Image();
      img.src = blobUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { URL.revokeObjectURL(blobUrl); return; }

        ctx.drawImage(img, 0, 0);

        // Draw watermark
        const padding = img.width * 0.04;
        const fontSize = Math.max(20, Math.round(img.width / 30));
        ctx.font = `bold ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';

        const prefixText = 'MARO ';
        const suffixText = 'Studio';
        const x = canvas.width - padding;
        const y = padding;
        const suffixMetrics = ctx.measureText(suffixText);

        ctx.fillStyle = '#e6b71e';
        ctx.fillText(suffixText, x, y);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(prefixText, x - suffixMetrics.width, y);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        window.open(image, '_blank');
      };
    } catch {
      // Fallback: open in new tab
      window.open(image, '_blank');
    }
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
                className="w-full h-auto object-contain transition-transform duration-700 ease-in-out group-hover:scale-105"
                loading="lazy"
              />
              
              <button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(image, index); }}
                  aria-label={`Download ${title}`}
                  className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-gold-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-xl border border-white/10"
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
