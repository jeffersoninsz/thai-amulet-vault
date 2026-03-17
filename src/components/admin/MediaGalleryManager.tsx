"use client";

import { useState, useEffect, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, Trash2, Image as ImageIcon, Film, Loader2, Star, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface MediaItem {
    id: string;
    url: string;
    mediaType: string;
    altText: string | null;
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
                toast.success("媒体上传成功！");
                fetchMedia();
                if (media.length === 0 && onPrimaryChange) {
                    onPrimaryChange(url);
                }
            } else {
                toast.error(data.error || "上传失败");
            }
        } catch (err) {
            toast.error("服务器响应异常");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("确定要删除这张媒体文件吗？")) return;

        try {
            const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("已删除");
                fetchMedia();
            } else {
                toast.error(data.error || "删除失败");
            }
        } catch (err) {
            toast.error("删除请求异常");
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
            </div>

            {/* Media Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 text-[#c4a265] animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                    {media.map((item, idx) => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-[#c4a265]/20 bg-[#1a1814] aspect-square">
                            {item.mediaType === "VIDEO" ? (
                                <video
                                    src={item.url}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    muted
                                />
                            ) : (
                                <Image
                                    src={item.url}
                                    alt={item.altText || `Media ${idx + 1}`}
                                    fill
                                    sizes="100px"
                                    className="object-cover"
                                />
                            )}

                            {/* Overlay badges */}
                            <div className="absolute top-1 left-1 flex gap-1">
                                {idx === 0 && (
                                    <span className="bg-[#c4a265] text-[#0d0c0b] px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5">
                                        <Star className="w-2.5 h-2.5" /> 主图
                                    </span>
                                )}
                                {item.mediaType === "VIDEO" && (
                                    <span className="bg-purple-600/80 text-white px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5">
                                        <Film className="w-2.5 h-2.5" /> Video
                                    </span>
                                )}
                            </div>

                            {/* Delete button */}
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Upload Slot */}
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
                                    className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#c4a265]/30 bg-[#1a1814]/50 hover:border-[#c4a265]/60 hover:bg-[#1a1814] transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-5 h-5 text-[#c4a265] animate-spin" />
                                    ) : (
                                        <>
                                            <UploadCloud className="w-5 h-5 text-[#c4a265]/50 mb-1" />
                                            <span className="text-[8px] text-[#a39783] font-mono">添加</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </CldUploadWidget>
                    )}
                </div>
            )}

            <p className="text-[9px] text-[#a39783]/60 font-mono">
                第一张图片自动设为产品主图。支持图片和视频文件。最多 5 张。
            </p>
        </div>
    );
}
