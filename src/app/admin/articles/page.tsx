import { FileText } from "lucide-react";
import { prisma } from "@/api/db";
import AdminArticleManager from "./AdminArticleManager";

export default async function AdminArticlesPage() {
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-serif text-[#f5ebd7] tracking-widest uppercase mb-2 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#c4a265]" />
                    文章资讯 (Articles)
                </h2>
                <p className="text-[#a39783] text-sm tracking-wide">
                    Manage news, knowledge base, and ceremony announcements.
                </p>
            </div>

            <AdminArticleManager initialArticles={articles} />
        </div>
    );
}
