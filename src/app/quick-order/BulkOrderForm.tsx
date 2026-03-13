"use client";

import React, { useState } from "react";
import { Amulet } from "@/types/amulet";
import { useCart } from "@/contexts/CartContext";
import { Search, ChevronRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

interface Props {
    amulets: Amulet[];
}

export default function BulkOrderForm({ amulets }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const { addMultipleToCart, setIsCartOpen } = useCart();

    // Track quantities entered by the user
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isAdding, setIsAdding] = useState(false);

    // Filter out out-of-stock items, and apply simple text search
    const availableAmulets = amulets.filter((a) => {
        const isInstock = a.stock > 0;
        const matchesSearch =
            a.nameZh.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.monkOrTemple.toLowerCase().includes(searchTerm.toLowerCase());
        return isInstock && matchesSearch;
    });

    const handleQuantityChange = (id: string, val: string, stock: number) => {
        if (val === '') {
            setQuantities((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            return;
        }

        let num = parseInt(val, 10);
        if (isNaN(num)) return;

        // Prevent exceeding stock visually
        if (num > stock) {
            num = stock;
        }

        setQuantities((prev) => ({
            ...prev,
            [id]: num,
        }));
    };

    const handleBulkAdd = () => {
        const selectedIds = Object.keys(quantities);
        if (selectedIds.length === 0) {
            toast.error("未添加任何商品。请先填写需要采购的数量。", {
                style: {
                    background: '#1a1814',
                    color: '#f5ebd7',
                    border: '1px solid rgba(196, 162, 101, 0.2)',
                }
            });
            return;
        }

        setIsAdding(true);
        const newItems = [];

        for (const id of selectedIds) {
            const targetAmulet = amulets.find((a) => a.id === id);
            if (!targetAmulet) continue;

            let qtyToAdd = quantities[id];
            const minQty = targetAmulet.moq || 1;

            // Enforce MOQ on bulk add payload
            if (qtyToAdd < minQty) {
                qtyToAdd = minQty;
            }

            newItems.push({ amulet: targetAmulet, quantity: qtyToAdd });
        }

        // Call batch add
        addMultipleToCart(newItems);

        // Cleanup and notify
        toast.success(`成功将 ${newItems.length} 款商品加入进货单`, {
            style: {
                background: '#1a1814',
                color: '#f5ebd7',
                border: '1px solid rgba(196, 162, 101, 0.2)'
            },
            iconTheme: {
                primary: '#c4a265',
                secondary: '#0d0c0b',
            },
        });

        setQuantities({});
        setIsAdding(false);

        // Auto open cart drawer
        setTimeout(() => {
            setIsCartOpen(true);
        }, 500);
    }

    const selectedCount = Object.keys(quantities).length;
    const totalItemsCount = Object.values(quantities).reduce((acc, val) => acc + val, 0);

    return (
        <div className="bg-[#1a1814]/50 border border-[#c4a265]/20 rounded-lg overflow-hidden backdrop-blur-sm">
            <Toaster position="top-center" />

            {/* Table Toolbar */}
            <div className="p-4 border-b border-[#c4a265]/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0d0c0b]/80">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a39783]" />
                    <input
                        type="text"
                        placeholder="搜索款号、名称或师傅..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded pl-10 pr-4 py-2 text-[#f5ebd7] focus:outline-none focus:border-[#c4a265] placeholder:text-[#a39783]/50 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="text-sm text-[#a39783] flex-shrink-0">
                        已选: <strong className="text-[#c4a265]">{selectedCount}</strong> 款 ({totalItemsCount} 件)
                    </div>
                    <button
                        onClick={handleBulkAdd}
                        disabled={isAdding || selectedCount === 0}
                        className="w-full sm:w-auto px-6 py-2 bg-[#c4a265] text-[#0d0c0b] font-bold rounded hover:bg-[#d4c5b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAdding ? "处理中..." : "批量加入采购单"}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Product List Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0d0c0b]/50 text-[#a39783] uppercase text-xs tracking-wider font-semibold border-b border-[#c4a265]/10">
                            <th className="p-4 w-16">图片</th>
                            <th className="p-4 min-w-[200px]">圣物信息</th>
                            <th className="p-4">库存</th>
                            <th className="p-4">B2B批发价</th>
                            <th className="p-4">MOQ</th>
                            <th className="p-4 w-32">采购数量</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c4a265]/10">
                        {availableAmulets.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-[#a39783]">
                                    {searchTerm ? "未找到匹配的本所现货商品" : "暂无可用商品"}
                                </td>
                            </tr>
                        ) : (
                            availableAmulets.map((amulet) => {
                                const isSelected = !!quantities[amulet.id];
                                return (
                                    <tr
                                        key={amulet.id}
                                        className={`hover:bg-[#c4a265]/5 transition-colors ${isSelected ? 'bg-[#c4a265]/10' : ''}`}
                                    >
                                        <td className="p-4">
                                            <div className="relative w-12 h-12 rounded overflow-hidden border border-[#c4a265]/20">
                                                <Image
                                                    src={amulet.imageUrl}
                                                    alt={amulet.nameZh}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-serif text-[#f5ebd7] font-semibold text-lg leading-tight flex items-center gap-2">
                                                {amulet.nameZh}
                                                {amulet.isB2bOnly && (
                                                    <span className="text-[9px] font-sans px-1.5 py-0.5 bg-[#c4a265]/20 text-[#c4a265] rounded border border-[#c4a265]/30">
                                                        隐藏款
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-[#a39783] mt-1">
                                                {amulet.monkOrTemple} • {amulet.year}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm ${amulet.stock < 5 ? 'text-red-400' : 'text-[#a39783]'}`}>
                                                {amulet.stock} 件
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-[#c4a265]">
                                            ${(amulet.wholesalePrice || amulet.price).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-sm text-[#a39783]">
                                            {amulet.moq || 1}
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max={amulet.stock}
                                                value={quantities[amulet.id] === undefined ? "" : quantities[amulet.id]}
                                                onChange={(e) => handleQuantityChange(amulet.id, e.target.value, amulet.stock)}
                                                className={`w-20 bg-[#0d0c0b] border rounded px-2 py-1 text-center font-mono focus:outline-none transition-colors ${isSelected ? 'border-[#c4a265] text-[#c4a265]' : 'border-[#c4a265]/30 text-[#f5ebd7] focus:border-[#c4a265]'
                                                    }`}
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
