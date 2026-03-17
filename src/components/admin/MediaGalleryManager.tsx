"use client";

import { useState, useEffect, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import {
  UploadCloud, Trash2, Image as ImageIcon, Film, Loader2, Star,
  GripVertical, ChevronUp, ChevronDown, FolderOpen
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface MediaItem {
  id: string;
  url: string;
  mediaType: string;
  sortOrder: number;
  createdAt: string;
}

interface MediaGalleryManagerProps {
  amuletId: string;
  onPrimaryChange?: (url: string) => void;
}

export function MediaGalleryManager({ amuletId, onPrimaryChange }: MediaGalleryManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryMedia, setLibraryMedia] = useState<MediaItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/media?amuletId=${amuletId}`);
      const data = await res.json();
      if (data.media) {
        setMedia(data.media);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  }, [amuletId]);

  useEffect(() => {
    if (amuletId && amuletId !== "new") {
      fetchMedia();
    } else {
      setLoading(false);
    }
  }, [amuletId, fetchMedia]);

  // Upload to Cloudinary → save to DB
  const handleUploadSuccess = async (result: any) => {
    setUploading(false);
    if (!result?.info?.secure_url) return;

    const url = result.info.secure_url;
    const isVideo = result.info.resource_type === "video";

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amuletId,
          url,
          mediaType: isVideo ? "VIDEO" : "IMAGE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("图片上传成功！");
        fetchMedia();
        if (media.length === 0 && onPrimaryChange) {
          onPrimaryChange(url);
        }
      } else {
        toast.error(data.error || "上传失败");
      }
    } catch {
      toast.error("服务器响应异常");
    }
  };

  // Add existing image from library
  const handleAddFromLibrary = async (url: string) => {
    if (media.length >= 5) {
      toast.error("最多 5 张图片");
      return;
    }
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amuletId, url, mediaType: "IMAGE" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("已从图库添加！");
        fetchMedia();
        setShowLibrary(false);
        if (media.length === 0 && onPrimaryChange) onPrimaryChange(url);
      } else {
        toast.error(data.error || "添加失败");
      }
    } catch {
      toast.error("请求失败");
    }
  };

  // Load Cloudinary library (all media in DB)
  const loadLibrary = async () => {
    setShowLibrary(true);
    setLibraryLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.media) {
        // Filter out items already in current amulet
        const currentUrls = new Set(media.map(m => m.url));
        setLibraryMedia(data.media.filter((m: MediaItem) => !currentUrls.has(m.url)));
      }
    } catch {
      toast.error("加载图库失败");
    } finally {
      setLibraryLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("确定要删除这张图片吗？")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("已删除");
        fetchMedia();
      } else {
        toast.error(data.error || "删除失败");
      }
    } catch {
      toast.error("删除请求异常");
    }
  };

  // Move item up/down (reorder)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const newList = [...media];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setMedia(newList); // optimistic update

    try {
      const res = await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amuletId,
          orderedIds: newList.map(m => m.id),
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (onPrimaryChange && newList[0]) onPrimaryChange(newList[0].url);
      } else {
        toast.error("排序失败");
        fetchMedia(); // rollback
      }
    } catch {
      toast.error("排序请求异常");
      fetchMedia();
    }
  };

  if (amuletId === "new") {
    return (
      <div className="mt-4 p-4 bg-[#1a1814]/50 rounded-lg border border-[#c4a265]/10 text-center">
        <p className="text-xs text-[#a39783]">💡 请先保存产品资料，然后再管理多图 Gallery。</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-[#0d0c0b] rounded-lg border border-[#c4a265]/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs uppercase text-[#c4a265] tracking-widest font-mono flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5" />
          产品 Gallery ({media.length}/5)
        </h4>
        {media.length < 5 && (
          <button
            type="button"
            onClick={loadLibrary}
            className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono text-[#c4a265] border border-[#c4a265]/30 rounded hover:bg-[#c4a265]/10 transition-colors"
          >
            <FolderOpen className="w-3 h-3" />
            从图库选择
          </button>
        )}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-[#c4a265] animate-spin" />
        </div>
      ) : (
        <div className="space-y-2 mb-3">
          {media.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-lg border border-[#c4a265]/15 bg-[#1a1814]/60 group hover:border-[#c4a265]/40 transition-colors"
            >
              {/* Sort Controls */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-0.5 text-[#a39783] hover:text-[#c4a265] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <GripVertical className="w-3.5 h-3.5 text-[#a39783]/30 mx-auto" />
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === media.length - 1}
                  className="p-0.5 text-[#a39783] hover:text-[#c4a265] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="relative w-14 h-14 rounded-md overflow-hidden border border-[#c4a265]/20 bg-[#0d0c0b] shrink-0">
                {item.mediaType === "VIDEO" ? (
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted />
                ) : (
                  <Image src={item.url} alt={`图片 ${idx + 1}`} fill sizes="56px" className="object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {idx === 0 && (
                    <span className="bg-[#c4a265] text-[#0d0c0b] px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5 shrink-0">
                      <Star className="w-2.5 h-2.5" /> 主图
                    </span>
                  )}
                  {item.mediaType === "VIDEO" && (
                    <span className="bg-purple-600/80 text-white px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5 shrink-0">
                      <Film className="w-2.5 h-2.5" /> Video
                    </span>
                  )}
                  <span className="text-[10px] text-[#a39783] font-mono truncate">#{idx + 1}</span>
                </div>
                <p className="text-[9px] text-[#a39783]/50 font-mono truncate mt-0.5">{item.url.split('/').pop()}</p>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded transition-all shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          {media.length < 5 && (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "siam_amulet_preset"}
              onOpen={() => setUploading(true)}
              onSuccess={handleUploadSuccess}
              onError={() => setUploading(false)}
              onClose={() => setUploading(false)}
              options={{
                sources: ['local', 'url', 'camera'],
                multiple: false,
                maxFiles: 1,
                resourceType: "auto",
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
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-[#c4a265]/25 bg-[#1a1814]/30 hover:border-[#c4a265]/50 hover:bg-[#1a1814]/60 transition-all cursor-pointer disabled:opacity-50 group"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 text-[#c4a265] animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 text-[#c4a265]/50 group-hover:text-[#c4a265] transition-colors" />
                      <span className="text-[10px] text-[#a39783] font-mono group-hover:text-[#c4a265] transition-colors">上传新图片</span>
                    </>
                  )}
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>
      )}

      {/* Library Picker Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowLibrary(false)}>
          <div className="bg-[#1a1814] border border-[#c4a265]/30 rounded-xl max-w-2xl w-full max-h-[70vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-[#c4a265]/20">
              <h3 className="text-sm font-bold text-[#c4a265] font-mono">📁 Cloudinary 图库</h3>
              <button type="button" onClick={() => setShowLibrary(false)} className="text-[#a39783] hover:text-white text-lg">✕</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[55vh]">
              {libraryLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-[#c4a265] animate-spin" />
                </div>
              ) : libraryMedia.length === 0 ? (
                <p className="text-center text-[#a39783] py-8 text-sm">图库暂无可用图片</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {libraryMedia.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddFromLibrary(item.url)}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-[#c4a265] transition-all group cursor-pointer"
                    >
                      <Image src={item.url} alt="Library" fill sizes="150px" className="object-cover" />
                      <div className="absolute inset-0 bg-[#c4a265]/0 group-hover:bg-[#c4a265]/20 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-[#c4a265] px-2 py-1 rounded">选择</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-[9px] text-[#a39783]/60 font-mono">
        第一张自动设为主图 · 上下箭头调整顺序 · 最多 5 张 · 支持从图库选择
      </p>
    </div>
  );
}
