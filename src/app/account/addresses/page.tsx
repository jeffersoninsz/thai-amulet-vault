import { MapPin } from "lucide-react";

export default function AddressesPage() {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase">Delivery Addresses</h2>
                    <p className="text-[#a39783] text-sm mt-2">Manage your global shipping destinations.</p>
                </div>
                <button className="px-6 py-2 bg-[#c4a265] text-[#0d0c0b] text-sm font-bold uppercase tracking-widest rounded hover:bg-[#d5b57d] transition-colors">
                    + New Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center p-16 text-[#a39783] border border-dashed border-[#c4a265]/20 bg-[#1a1814]/30 rounded-lg col-span-full">
                    <MapPin className="w-12 h-12 text-[#c4a265]/50 mb-4" />
                    <p className="font-serif italic text-lg text-[#d4c5b0]">No addresses configured.</p>
                </div>
            </div>
        </div>
    );
}
