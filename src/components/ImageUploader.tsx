import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Link } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  aspectRatioClassName?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  placeholder = "Arrastra una imagen aquí o haz clic para buscar",
  aspectRatioClassName = "aspect-video"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const rawDataUrl = e.target.result;
        
        // Downscale image to fit safely in localStorage and prevent QuotaExceededError
        const img = new Image();
        img.onload = () => {
          const maxDim = 800; // max width or height for beautiful web display
          let width = img.width;
          let height = img.height;
          
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Draw image on canvas to compress
            ctx.drawImage(img, 0, 0, width, height);
            
            // Use image/jpeg with 0.75 quality for incredible compression with great visuals
            try {
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
              onChange(compressedDataUrl);
            } catch (err) {
              console.error('Error compressing image, falling back to original:', err);
              onChange(rawDataUrl);
            }
          } else {
            onChange(rawDataUrl);
          }
        };
        img.onerror = () => {
          onChange(rawDataUrl);
        };
        img.src = rawDataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      setShowUrlInput(false);
      setTempUrl('');
    }
  };

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => {
            setShowUrlInput(!showUrlInput);
            setTempUrl(value.startsWith('data:') ? '' : value);
          }}
          className="text-[9px] font-bold text-[#FF5A20] hover:underline flex items-center gap-1 uppercase tracking-wider"
        >
          <Link size={10} />
          {showUrlInput ? 'Carga Local' : 'Usar Enlace URL'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Pegar dirección de imagen (https://...)"
            className="flex-1 bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white text-xs outline-none transition-all font-mono"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 bg-[#FF5A20] text-[#0D0D0D] rounded-xl font-bold text-xs"
          >
            Ok
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-200 overflow-hidden ${aspectRatioClassName} ${
            isDragging
              ? 'border-[#FF5A20] bg-[#FF5A20]/5'
              : value
              ? 'border-white/10 bg-[#0D0D0D]'
              : 'border-white/10 hover:border-white/20 bg-[#0D0D0D] hover:bg-white/[0.01]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {value ? (
            <div className="absolute inset-0 group">
              <img
                src={value}
                alt="Uploaded"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                <div className="flex gap-2">
                  <span className="p-2 bg-[#FF5A20] text-[#0D0D0D] rounded-full text-xs font-bold shadow-lg">
                    Cambiar Imagen
                  </span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                    title="Eliminar imagen"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2 pointer-events-none">
              <div className="p-3 bg-white/5 rounded-full text-white/40">
                <UploadCloud size={20} className={isDragging ? 'text-[#FF5A20]' : ''} />
              </div>
              <div className="space-y-0.5 px-4">
                <p className="text-[10px] font-bold text-white/80">{placeholder}</p>
                <p className="text-[8px] text-white/40 uppercase tracking-widest font-mono">PNG, JPG, WEBP o GIF</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
