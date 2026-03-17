import React, { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ImageFile } from '../types';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile) => void;
  initialPreview?: string | null;
  enableAnimation?: boolean;
  aspectRatio?: string;
  title?: string;
  subtitle?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  initialPreview = null,
  enableAnimation = false,
  aspectRatio = 'aspect-[4/3]',
  title = 'UPLOAD PHOTO',
  subtitle = 'Drag & drop or click to select a file'
}) => {
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(initialPreview);
  }, [initialPreview]);

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      toast.error(`File size (${fileSizeMB}MB) exceeds the ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller image.`, {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultUrl = reader.result as string;
      const base64String = resultUrl.split(',')[1];
      if (base64String) {
        onImageUpload({ base64: base64String, mimeType: file.type, previewUrl: resultUrl });
        setPreview(resultUrl);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAreaClick();
    }
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} cursor-pointer group`}
      onClick={handleAreaClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload product image"
    >
      <div className={`relative w-full h-full rounded-lg bg-neutral-800/50 border-2 border-dashed ${isDragging ? 'border-gold-500 bg-gold-500/5' : 'border-neutral-700 group-hover:border-gold-500'} flex flex-col items-center justify-center text-center p-4 transition-all duration-300 ${preview && enableAnimation ? 'animate-pulse-preview' : ''}`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          aria-hidden="true"
        />
        {preview ? (
          <div className="w-full h-full rounded-md overflow-hidden relative">
            <img src={preview} alt="Product preview" className="w-full h-full object-contain" />
            <div className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <p className="text-sm text-white font-semibold">{isDragging ? 'Drop image here' : 'Click or press Enter to change image'}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 text-neutral-400">
            <CameraIcon className={`w-10 h-10 transition-colors ${isDragging ? 'text-gold-500' : 'text-neutral-500 group-hover:text-gold-500'}`} />
            <p className="font-semibold text-lg text-neutral-200">{isDragging ? 'DROP HERE' : title}</p>
            <p className="text-xs">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
};