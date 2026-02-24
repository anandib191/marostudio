import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HomeIcon } from './icons/HomeIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Generation {
  _id: string;
  type: 'photoshoot' | 'marketing';
  originalImage: string;
  generatedImage: string;
  prompt: string;
  createdAt: string;
  creditsUsed: number;
}

export const MyGenerationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'photoshoot' | 'marketing'>('all');

  useEffect(() => {
    fetchGenerations();
  }, [selectedType]);

  const fetchGenerations = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/generations?type=${selectedType}`, {
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

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download image');
    }
  };

  const handleDelete = async (generationId: string) => {
    if (!window.confirm('Are you sure you want to delete this generation?')) {
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/user/generations/${generationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGenerations(prev => prev.filter(g => g._id !== generationId));
        toast.success('Generation deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete generation');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete generation');
    }
  };

  const filteredGenerations = generations.filter(gen => {
    if (selectedType === 'all') return true;
    return gen.type === selectedType;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="Back to Home"
              >
                <HomeIcon className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-white">My Generations</h1>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-neutral-900 rounded-lg p-1">
              {(['all', 'photoshoot', 'marketing'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedType === type
                      ? 'bg-gold-500 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'photoshoot' ? 'Photoshoot' : 'Marketing'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-neutral-400 text-lg mb-4">
              {selectedType === 'all' 
                ? "You haven't generated any images yet" 
                : `No ${selectedType} generations found`
              }
            </div>
            <button
              onClick={() => navigate('/studio')}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-white font-semibold rounded-lg transition-colors"
            >
              Start Creating
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGenerations.map((generation) => (
              <div
                key={generation._id}
                className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-gold-500/50 transition-all duration-300"
              >
                {/* Images */}
                <div className="grid grid-cols-2 gap-2 p-4">
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-400 font-medium">Original</p>
                    <img
                      src={generation.originalImage}
                      alt="Original"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-400 font-medium">Generated</p>
                    <img
                      src={generation.generatedImage}
                      alt="Generated"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 border-t border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      generation.type === 'photoshoot'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {generation.type === 'photoshoot' ? 'Photoshoot' : 'Marketing'}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {generation.creditsUsed} credits
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-300 mb-3 line-clamp-2">
                    {generation.prompt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      {new Date(generation.createdAt).toLocaleDateString()}
                    </span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(generation.generatedImage, `${generation.type}-${generation._id}.jpg`)}
                        className="p-2 text-neutral-400 hover:text-gold-400 transition-colors"
                        title="Download"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(generation._id)}
                        className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
