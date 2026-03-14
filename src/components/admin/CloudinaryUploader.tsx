"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export function CloudinaryUploader({ onUploadSuccess, currentImageUrl, label = "Upload Image" }: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (result: any) => {
    setIsUploading(false);
    if (result?.info?.secure_url) {
      onUploadSuccess(result.info.secure_url);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xs uppercase text-[#a39783] tracking-widest font-mono">
        {label}
      </span>
      
      <div className="flex items-center gap-6 p-4 rounded-xl border-2 border-dashed border-[#c4a265]/30 bg-[#1a1814]/50 transition-colors hover:border-[#c4a265]/60 hover:bg-[#1a1814]">
        
        {/* Preview Area */}
        <div className="relative w-24 h-24 rounded-lg bg-[#0d0c0b] border border-[#c4a265]/20 overflow-hidden flex items-center justify-center shrink-0">
          {currentImageUrl ? (
            <Image 
              src={currentImageUrl} 
              alt="Preview" 
              fill 
              className="object-cover opacity-80"
              sizes="96px"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-[#a39783]/30" />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-[#0d0c0b]/80 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#c4a265] animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Action */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "siam_amulet_preset"}
            onOpen={() => setIsUploading(true)}
            onSuccess={handleUploadSuccess}
            onError={() => setIsUploading(false)}
            onClose={() => setIsUploading(false)}
            options={{
              sources: ['local', 'url', 'camera'],
              multiple: false,
              maxFiles: 1,
              styles: {
                  palette: {
                      window: "#0d0c0b",
                      windowBorder: "#c4a265",
                      tabIcon: "#c4a265",
                      menuIcons: "#d4c5b0",
                      textDark: "#0d0c0b",
                      textLight: "#d4c5b0",
                      link: "#c4a265",
                      action: "#c4a265",
                      inactiveTabIcon: "#a39783",
                      error: "#ef4444",
                      inProgress: "#c4a265",
                      complete: "#22c55e",
                      sourceBg: "#1a1814"
                  },
              }
            }}
          >
            {({ open }) => {
              return (
                <button
                  type="button"
                  onClick={() => open()}
                  disabled={isUploading}
                  className="px-6 py-2 bg-transparent border border-[#c4a265]/50 text-[#c4a265] hover:bg-[#c4a265] hover:text-[#0d0c0b] text-sm font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(196,162,101,0.1)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UploadCloud className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Select File to Upload"}
                </button>
              );
            }}
          </CldUploadWidget>
          <p className="text-[10px] text-[#a39783] mt-3 max-w-[200px] leading-tight font-mono">
            Optimized automatically via Cloudinary CDN. (Max 10MB)
          </p>
        </div>

      </div>
    </div>
  );
}
