import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StudioSidebar } from './StudioSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Generation {
  _id: string;
  type: 'photoshoot' | 'marketing';
  quality?: string;
  imageUrls: string[];
  category?: string;
  productType?: string;
  style?: string;
  creditsUsed?: number;
  sourceImageUrl?: string;
  numberOfImages?: number;
  background?: string;
  creatorName?: string;
  aspectRatio?: string;
  consistentCharacter?: boolean;
  createdAt: string;
}

export const PreviouslyGenerated: React.FC = () => {
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/generations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGenerations(data.generations || []);
      } else {
        toast.error(data.message || 'Failed to fetch generations');
      }
    } catch (err) {
      console.error('Failed to fetch generations:', err);
      toast.error('Failed to fetch generations');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    }
  };

  const handleDeleteClick = (generationId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setGenerationToDelete(generationId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!generationToDelete) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/user/generations/${generationToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGenerations(prev => prev.filter(g => g._id !== generationToDelete));
        if (selectedGeneration?._id === generationToDelete) {
          setSelectedGeneration(null);
        }
        toast.success('Generation deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete generation');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete generation');
    } finally {
      setShowDeleteConfirm(false);
      setGenerationToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex w-full bg-black text-white" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950/20 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(230,183,30,0.08),transparent_50%)]"></div>
      </div>

      <StudioSidebar
        activeStudio={null}
        currentStep={-1}
        onSelectStudio={() => { }}
        onJumpToStep={() => { }}
        onExit={() => navigate('/studio')}
      />

      <main className="flex-1 min-w-0 overflow-x-hidden pt-8 px-4 sm:px-6 lg:px-14 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Previously Generated</h1>
              <p className="text-neutral-400 text-sm">
                Your generated images
              </p>
              {generations.length > 0 && (
                <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                  <span>{generations.length} generations</span>
                  <span>•</span>
                  <span>{generations.reduce((acc, g) => acc + g.imageUrls.length, 0)} total images</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchGenerations}
                className="px-4 py-2 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 rounded-lg text-gold-300 text-sm font-medium transition-colors flex items-center gap-2"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content - Generation Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading generations...</p>
            </div>
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-20 h-20 text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Generations Yet</h3>
            <p className="text-neutral-400 text-sm mb-6">Generate images to see them here!</p>
            <button
              onClick={() => navigate('/studio')}
              className="px-6 py-3 bg-gold-600 hover:bg-gold-500 rounded-lg font-semibold transition-colors"
            >
              Go to Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generations.map((gen) => (
              <div
                key={gen._id}
                className="group relative bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedGeneration(gen)}
              >
                {/* Thumbnail - First Image */}
                <div className="aspect-square relative overflow-hidden bg-neutral-800">
                  {gen.imageUrls.length > 0 ? (
                    <img
                      src={gen.imageUrls[0]}
                      alt={gen.productType || gen.category || 'Generated'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                      <span className="text-white text-sm font-medium">Click to view all images</span>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-base truncate pr-2">
                      {gen.productType || gen.category || gen.type}
                    </h3>
                    <span className="text-neutral-400 text-xs whitespace-nowrap">
                      {formatDate(gen.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-400 text-sm">
                      {gen.category || gen.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-gold-500/50 text-gold-300 bg-gold-500/10">
                      {gen.imageUrls.length} {gen.imageUrls.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Generation Detail Modal - Shows all images */}
      {selectedGeneration && !selectedImageUrl && (
        <>
          <style>{`
            .modal-scrollable::-webkit-scrollbar {
              display: none;
            }
            .modal-scrollable {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999] overflow-y-auto modal-scrollable"
            onClick={() => setSelectedGeneration(null)}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Close Button - positioned below navbar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGeneration(null);
              }}
              className="fixed right-3 sm:right-6 p-2.5 sm:p-3 bg-white hover:bg-neutral-200 rounded-full text-black transition-all duration-200 hover:scale-110 active:scale-95 z-[100000] shadow-2xl flex items-center justify-center"
              style={{ top: '70px', minWidth: '48px', minHeight: '48px', width: '48px', height: '48px' }}
              title="Close"
              aria-label="Close modal"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="flex flex-col items-center min-h-screen pt-[120px] sm:pt-28 pb-12 px-4 sm:px-6">
              <div
                className="relative max-w-6xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Studio Deliverables Style Title */}
                <h2 className="font-serif-display text-4xl sm:text-5xl text-center mb-8 sm:mb-16 text-white tracking-tighter">
                  Studio <span className="italic text-neutral-400">Deliverables</span>
                </h2>

                {/* Info Bar */}
                <div className="flex flex-col items-center gap-6 mb-12 sm:mb-20 w-full">
                  {/* Product / Category Info */}
                  <div className="flex items-center justify-center gap-3 text-sm text-neutral-400 flex-wrap">
                    {selectedGeneration.category && (
                      <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-medium uppercase tracking-widest">
                        {selectedGeneration.category}
                      </span>
                    )}
                    {selectedGeneration.productType && (
                      <span className="px-3 py-1 rounded-full bg-white/5 text-neutral-300 text-xs font-medium uppercase tracking-widest">
                        {selectedGeneration.productType}
                      </span>
                    )}
                    <span>{formatDate(selectedGeneration.createdAt)}</span>
                    <span>•</span>
                    <span>{selectedGeneration.imageUrls.length} {selectedGeneration.imageUrls.length === 1 ? 'image' : 'images'}</span>
                    {selectedGeneration.quality && (
                      <>
                        <span>•</span>
                        <span>{selectedGeneration.quality}</span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons - Studio Deliverables Style */}
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    <button
                      onClick={() => handleDeleteClick(selectedGeneration._id)}
                      className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 font-bold py-3 px-8 rounded-full transition-all flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedGeneration(null)}
                      className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 font-bold py-3 px-8 rounded-full transition-all flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Close
                    </button>
                  </div>
                </div>

                {/* Gallery Grid - Matching GeneratedImageGallery style */}
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedGeneration.imageUrls.map((url, index) => {
                      const isCover = index === 0;
                      const title = isCover ? 'Hero Composition' : `Neural Frame ${index}`;

                      return (
                        <div
                          key={index}
                          className="group relative rounded-2xl overflow-hidden glass-card shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                          onClick={() => setSelectedImageUrl(url)}
                        >
                          <img
                            src={url}
                            alt={isCover ? 'AI-generated hero shot' : `Generated model frame ${index}`}
                            className="w-full h-auto object-contain transition-transform duration-700 ease-in-out group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Download Button on hover */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(url, index); }}
                            aria-label={`Download ${title}`}
                            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-gold-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-xl border border-white/10"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>

                          {/* Bottom Gradient Overlay with Title */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white p-6 text-left pt-20">
                            <p className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Asset Frame</p>
                            <p className="font-serif-display italic text-xl">{title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Full Image Preview Modal */}
      {selectedImageUrl && (
        <>
          <style>{`
            .modal-scrollable::-webkit-scrollbar {
              display: none;
            }
            .modal-scrollable {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100001] overflow-y-auto modal-scrollable flex items-center justify-center"
            onClick={() => setSelectedImageUrl(null)}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Close Button - positioned below navbar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageUrl(null);
              }}
              className="fixed right-3 sm:right-6 p-2.5 sm:p-3 bg-white hover:bg-neutral-200 rounded-full text-black transition-all duration-200 hover:scale-110 active:scale-95 z-[100002] shadow-2xl flex items-center justify-center"
              style={{ top: '70px', minWidth: '48px', minHeight: '48px', width: '48px', height: '48px' }}
              title="Close"
              aria-label="Close image preview"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div
              className="relative max-w-5xl w-full px-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full mb-6 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImageUrl}
                  alt="Full preview"
                  className="w-full h-auto max-h-[90vh] object-contain"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const index = selectedGeneration?.imageUrls.indexOf(selectedImageUrl) ?? 0;
                    handleDownload(selectedImageUrl, index);
                  }}
                  className="px-6 py-3 bg-gold-600 hover:bg-gold-500 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => setSelectedImageUrl(null)}
                  className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-semibold transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100003] flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Generation?</h3>
                <p className="text-neutral-400 text-sm mt-1">All images in this generation will be deleted. This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setGenerationToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
