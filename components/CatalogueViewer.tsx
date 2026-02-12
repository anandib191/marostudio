
import React from 'react';

interface CatalogueViewerProps {
  coverImage: string;
  generatedImages: string[];
  catalogueRef: React.RefObject<HTMLDivElement>;
  productName?: string;
  creatorName: string;
  hideBrand?: boolean; // if true, do not render brand signature (paid users)
}

const Page: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`catalogue-page bg-white shadow-2xl w-full aspect-[1/1.414] flex flex-col relative text-stone-900 font-sans overflow-hidden ${className}`}>
        {children}
    </div>
);

const BrandSignature: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => (
    <div className="flex items-center gap-1.5 text-center">
        <span className={`text-lg font-sans font-bold tracking-tighter ${isDark ? 'text-white' : 'text-neutral-900'}`}>MARO</span>
        <span className="text-lg font-serif-display italic font-medium text-gold-600">Studio</span>
    </div>
);


export const CatalogueViewer: React.FC<CatalogueViewerProps> = ({
  coverImage,
  generatedImages,
  catalogueRef,
  productName,
  creatorName,
  hideBrand,
}) => {
  const [shouldHideBrand, setShouldHideBrand] = React.useState<boolean>(Boolean(hideBrand));

  React.useEffect(() => {
    if (typeof hideBrand === 'boolean') return;
    const infer = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const API_URL = (import.meta.env.VITE_API_URL as string) || '';
        const res = await fetch(`${API_URL || ''}/api/credits?t=${Date.now()}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data && data.subscriptionPlan) {
          setShouldHideBrand(true);
        }
      } catch (e) {
        // ignore
      }
    };
    infer();
  }, [hideBrand]);
  return (
    <div className="flex flex-col items-center gap-8">
      <div ref={catalogueRef} className="max-w-xl w-full mx-auto space-y-12 p-6 bg-neutral-900/50 backdrop-blur-3xl rounded-[32px] border border-gold-500/10">
        {/* Cover Page */}
        <Page className="justify-between items-center text-center p-14 bg-[#fdfdfd]">
            <div className="w-full text-left">
              {!shouldHideBrand && <BrandSignature />}
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-neutral-400 mb-4">— Seasonal Editorial —</span>
              <h1 className="font-serif-display text-5xl md:text-6xl font-bold tracking-tighter text-neutral-950 max-w-sm break-words leading-[0.9]">
                  {productName || 'Lookbook'}
              </h1>
            </div>

            <div className="p-1.5 bg-white border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-xs transform -rotate-1">
                <img src={coverImage} alt="AI Generated Product Cover" className="w-full h-auto object-contain" />
            </div>

             <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">Curated By</p>
                <span className="text-lg font-serif-display italic font-semibold text-neutral-900">{creatorName}</span>
            </div>
        </Page>


        {/* Image Pages */}
        {generatedImages.map((image, index) => (
             <Page key={index} className="p-0 relative">
                <img src={image} alt={`Look ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-10 left-10 text-white" style={{textShadow: '0 2px 20px rgba(0,0,0,0.4)'}}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-1 opacity-80">Plate No.</p>
                    <h2 className="font-serif-display text-7xl font-bold tracking-tighter leading-none">0{index + 1}</h2>
                </div>
                {!shouldHideBrand && (
                  <div className="absolute top-10 right-10">
                    <BrandSignature isDark={true} />
                  </div>
                )}
            </Page>
        ))}

        {/* Back Cover */}
        <Page className="justify-center items-center text-center p-14 bg-[#0a0a0a]">
            {!shouldHideBrand && (
              <div className="scale-150 transform">
                  <BrandSignature isDark={true} />
              </div>
            )}
            {/* <div className="absolute bottom-12 text-center w-full px-10">
                <div className="h-px w-12 bg-white/20 mx-auto mb-6"></div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-medium">Neural engine output <br/>MARO Studio Studio</p>
            </div> */}
        </Page>
      </div>
    </div>
  );
};
