import { getAmulets } from "@/api/db";
import AdminClient from "./AdminClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Package } from "lucide-react";

export default async function AdminVaultPage() {
  const amulets = await getAmulets();
  const session = await getServerSession(authOptions);
  const tokenName = session?.user?.name || "SystemAdmin";

  return (
    <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-[#c4a265]" />
          库存大盘 (The Vault)
        </h2>
        <p className="text-[#a39783] text-sm tracking-wide">
          Manage holy artifacts, update stock, and control visibility.
        </p>
      </div>

      <div className="bg-[#1a1814]/50 rounded-xl p-4 md:p-8 border border-[#c4a265]/10 shadow-2xl">
        <AdminClient amulets={amulets} serverEmployeeName={tokenName} />
      </div>
    </div>
  );
}
