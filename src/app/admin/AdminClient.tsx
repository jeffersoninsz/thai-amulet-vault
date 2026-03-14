"use client";

import { Amulet } from "@/types/amulet";
import { useState, useTransition } from "react";
import { updateAmuletAction, createAmuletAction, deleteAmuletAction } from "@/app/actions";
import { CloudinaryUploader } from "@/components/admin/CloudinaryUploader";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AdminClient({
  amulets,
  serverEmployeeName,
}: {
  amulets: Amulet[];
  serverEmployeeName: string;
}) {
  const [employee] = useState(serverEmployeeName);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>(
    {},
  );
  const itemsPerPage = 50;

  const filteredList = amulets.filter(
    (a) =>
      a.nameZh.includes(searchFilter) ||
      a.nameEn.includes(searchFilter) ||
      a.monkOrTemple.includes(searchFilter),
  );
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const displayList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCloudinarySuccess = (url: string, amuletId: string) => {
    setUploadedImages((prev) => ({ ...prev, [amuletId]: url }));
  };

  async function handleSave(formData: FormData, id: string) {
    setLoading(true);
    try {
      const result = await updateAmuletAction(id, formData);
      if (result.success) {
        toast.success("档案更新成功！");
        // 清理本地上传缓存，确保下次编辑使用服务器最新数据
        setUploadedImages(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setEditingId(null);
      } else {
        toast.error("更新失败，请检查数据格式");
      }
    } catch (error) {
      console.error("HandleSave error:", error);
      toast.error("服务器响应异常，请稍后再试");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: FormData) {
    setLoading(true);
    try {
      const result = await createAmuletAction(formData);
      if (result.success) {
        toast.success("新圣物创建成功！");
        setUploadedImages(prev => {
          const next = { ...prev };
          delete next["new"];
          return next;
        });
        setIsCreating(false);
        setCurrentPage(1);
      } else {
        toast.error("创建失败：" + (result.error || "未知原因"));
      }
    } catch (error) {
      console.error("HandleCreate error:", error);
      toast.error("创建过程中发生意外错误");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`⚠️ 危险操作！\n\n您确定要永久删除 [ ${name} ] 吗？此操作无法撤销。`)) {
      return;
    }
    startTransition(async () => {
      await deleteAmuletAction(id);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#f5ebd7] flex items-baseline gap-3">
          资料库后台
          <span className="text-xs sm:text-sm text-[#a39783] font-sans font-normal">
            操作人: {employee}
          </span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="搜索档案/高僧..."
            value={searchFilter}
            onChange={handleSearch}
            className="w-full sm:w-64 px-4 py-2 bg-[#1a1814] border border-[#c4a265]/30 rounded text-[#d4c5b0] focus:ring-1 focus:ring-[#c4a265] outline-none"
          />
          <div className="text-sm px-4 py-2 bg-[#c4a265]/20 text-[#c4a265] rounded flex items-center justify-center whitespace-nowrap">
            总数: {amulets.length}
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-4 py-2 bg-[#c4a265] text-[#0d0c0b] font-bold rounded shadow-lg shadow-[#c4a265]/20 hover:bg-[#d5b57d] hover:scale-105 transition-all text-sm whitespace-nowrap"
          >
            {isCreating ? "取消新增" : "➕ 新增佛牌档案"}
          </button>
        </div>
      </div>

      <div className="bg-[#1a1814] border border-[#c4a265]/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#c4a265]/10 text-[#c4a265] text-sm">
                <th className="p-4 border-b border-[#c4a265]/20 w-24">原图/封面</th>
                <th className="p-4 border-b border-[#c4a265]/20">名称 (ZH/EN)</th>
                <th className="p-4 border-b border-[#c4a265]/20 w-48">高僧/寺庙</th>
                <th className="p-4 border-b border-[#c4a265]/20 w-32">年份</th>
                <th className="p-4 border-b border-[#c4a265]/20 w-32">材质 (ZH)</th>
                <th className="p-4 border-b border-[#c4a265]/20 w-32">库存/结缘价</th>
                <th className="p-4 border-b border-[#c4a265]/20 text-center w-24">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#d4c5b0]">
              {isCreating && (
                <tr className="border-b border-[#c4a265]/30 bg-[#c4a265]/5">
                  <RenderEditForm
                    amulet={{ id: "new" }}
                    employee={employee}
                    loading={loading}
                    uploadedImages={uploadedImages}
                    handleFileUpload={(url: string) => handleCloudinarySuccess(url, "new")}
                    handleSave={handleCreate}
                    setEditingId={() => setIsCreating(false)}
                    colSpan={7}
                    isNew={true}
                  />
                </tr>
              )}
              {displayList.map((amulet) => (
                <tr key={amulet.id} className="border-b border-[#c4a265]/10 hover:bg-[#c4a265]/5 transition-colors">
                  <td className="p-4">
                    <div className="relative w-12 h-16 rounded overflow-hidden opacity-80 border border-[#c4a265]/10 bg-[#0d0c0b]">
                      <Image
                        src={uploadedImages[amulet.id] || amulet.imageUrl || "/images/placeholder-amulet.png"}
                        alt={amulet.nameEn || "Amulet"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {editingId === amulet.id ? (
                    <RenderEditForm
                      amulet={amulet}
                      employee={employee}
                      loading={loading}
                      uploadedImages={uploadedImages}
                      handleFileUpload={(url: string) => handleCloudinarySuccess(url, amulet.id)}
                      handleSave={(fd: FormData) => handleSave(fd, amulet.id)}
                      setEditingId={setEditingId}
                      colSpan={7}
                    />
                  ) : (
                    <>
                      <td className="p-4 font-medium" title={amulet.nameZh}>
                        <div className="line-clamp-2">{amulet.nameZh}</div>
                        <div className="text-xs text-[#a39783] mt-1 line-clamp-1">{amulet.nameEn}</div>
                      </td>
                      <td className="p-4 text-[#a39783]">{amulet.monkOrTemple}</td>
                      <td className="p-4">{amulet.year}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-[#c4a265]/10 rounded border border-[#c4a265]/20 text-xs">
                          {amulet.materialZh}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className={`font-mono ${amulet.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                          余 {amulet.stock}
                        </div>
                        <div className="text-xs text-[#d5b57d] mt-1">${(amulet.price || 0).toFixed(2)}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setEditingId(amulet.id)}
                            className="px-3 py-1 bg-[#1a1814] text-[#c4a265] border border-[#c4a265]/30 rounded hover:bg-[#c4a265] hover:text-[#0d0c0b] transition-colors text-xs"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(amulet.id, amulet.nameZh)}
                            disabled={isPending}
                            className="px-3 py-1 bg-[#1a1814] text-red-500 border border-red-900/50 rounded hover:bg-red-500 hover:text-white transition-colors text-xs disabled:opacity-50"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {displayList.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-[#a39783]">
                    没有找到相关档案
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden flex flex-col">
          {isCreating && (
            <div className="border-b border-[#c4a265]/30 bg-[#c4a265]/5 p-4">
              <RenderEditForm
                amulet={{ id: "new" }}
                employee={employee}
                loading={loading}
                uploadedImages={uploadedImages}
                handleFileUpload={(url: string) => handleCloudinarySuccess(url, "new")}
                handleSave={handleCreate}
                setEditingId={() => setIsCreating(false)}
                isNew={true}
              />
            </div>
          )}
          {displayList.map((amulet) => (
            <div key={amulet.id} className="border-b border-[#c4a265]/20 p-4">
              {editingId === amulet.id ? (
                <div className="-mx-4 -my-4 p-4 bg-[#0d0c0b]">
                  <RenderEditForm
                    amulet={amulet}
                    employee={employee}
                    loading={loading}
                    uploadedImages={uploadedImages}
                    handleFileUpload={(url: string) => handleCloudinarySuccess(url, amulet.id)}
                    handleSave={(fd: FormData) => handleSave(fd, amulet.id)}
                    setEditingId={setEditingId}
                  />
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="relative w-20 h-24 rounded overflow-hidden opacity-90 border border-[#c4a265]/20 bg-[#0d0c0b] shrink-0">
                    <Image
                      src={uploadedImages[amulet.id] || amulet.imageUrl || "/images/placeholder-amulet.png"}
                      alt={amulet.nameEn || "Amulet"}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[#f5ebd7] font-medium line-clamp-2 text-sm leading-tight">
                        {amulet.nameZh}
                      </h3>
                      <p className="text-[#a39783] text-xs mt-1 truncate">
                        {amulet.nameEn} · {amulet.monkOrTemple}
                      </p>
                      <div className="flex gap-3 text-xs mt-1">
                        <span className={`font-mono ${amulet.stock > 0 ? "text-green-500" : "text-red-500"}`}>余 {amulet.stock}</span>
                        <span className="text-[#d5b57d]">${(amulet.price || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2 gap-2">
                      <button
                        onClick={() => setEditingId(amulet.id)}
                        className="px-3 py-1.5 bg-[#1a1814] text-[#c4a265] border border-[#c4a265]/30 rounded hover:bg-[#c4a265] hover:text-[#0d0c0b] transition-colors text-xs font-semibold"
                      >
                        编辑档案
                      </button>
                      <button
                        onClick={() => handleDelete(amulet.id, amulet.nameZh)}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-[#1a1814] text-red-500 border border-red-900/50 rounded hover:bg-red-500 hover:text-white transition-colors text-xs font-semibold disabled:opacity-50"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {displayList.length === 0 && (
            <div className="text-center p-8 text-[#a39783]">
              没有找到相关档案
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-[#1a1814] border border-[#c4a265]/30 rounded text-[#c4a265] disabled:opacity-50 hover:bg-[#c4a265]/10 transition-colors text-sm"
          >
            上一页
          </button>
          <span className="text-[#a39783] text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-[#1a1814] border border-[#c4a265]/30 rounded text-[#c4a265] disabled:opacity-50 hover:bg-[#c4a265]/10 transition-colors text-sm"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}

function RenderEditForm({
  amulet,
  employee,
  loading,
  uploadedImages,
  handleFileUpload,
  handleSave,
  setEditingId,
  colSpan,
  isNew = false,
}: any) {
  const currentImgUrl = uploadedImages[amulet.id] || amulet.imageUrl || "/images/siam_treasure_placeholder.png";

  const formContent = (
    <form
      action={handleSave}
      className="space-y-5 bg-[#0d0c0b] p-4 sm:p-6 rounded-lg border border-[#c4a265]/30 w-full text-sm"
    >
      <input type="hidden" name="imageUrl" value={currentImgUrl} />
      <input type="hidden" name="employee" value={employee} />

      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col items-center justify-center p-4 bg-[#1a1814] border border-dashed border-[#c4a265]/40 rounded-lg sm:w-1/3">
          <CloudinaryUploader 
            currentImageUrl={currentImgUrl}
            onUploadSuccess={handleFileUpload}
            label="佛牌高清实拍图"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#a39783] block mb-1">中文名称</label>
              <input
                name="nameZh"
                defaultValue={amulet.nameZh}
                className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#a39783] block mb-1">英文名称 (English)</label>
              <input
                name="nameEn"
                defaultValue={amulet.nameEn}
                className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#a39783] block mb-1">高僧/寺庙</label>
              <input
                name="monkOrTemple"
                defaultValue={amulet.monkOrTemple}
                className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[#a39783] block mb-1">材质(中)</label>
                <input name="materialZh" defaultValue={amulet.materialZh} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[#a39783] block mb-1">材质(英)</label>
                <input name="materialEn" defaultValue={amulet.materialEn} className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-[#a39783] block mb-1">年份</label>
                <input
                  name="year"
                  defaultValue={amulet.year}
                  className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#a39783] block mb-1">价格 $</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={amulet.price || 0}
                  className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#a39783] block mb-1">批发价(B2B) $</label>
                <input
                  type="number"
                  step="0.01"
                  name="wholesalePrice"
                  defaultValue={amulet.wholesalePrice || ''}
                  className="w-full bg-[#1a1814] border border-blue-900/50 rounded p-2 text-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#a39783] block mb-1">库存 / MOQ</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    defaultValue={amulet.stock || 0}
                    className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none"
                  />
                  <input
                    type="number"
                    name="moq"
                    placeholder="MOQ"
                    defaultValue={amulet.moq || 1}
                    className="w-full bg-[#1a1814] border border-blue-900/50 rounded p-2 text-blue-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-2 mb-4 bg-blue-900/10 border border-blue-900/30 p-3 rounded">
            <label className="flex items-center gap-2 text-sm text-blue-400 cursor-pointer w-full font-mono">
              <input
                type="checkbox"
                name="isB2bOnly"
                defaultChecked={amulet.isB2bOnly}
                className="w-4 h-4 accent-blue-500 bg-transparent border-blue-900"
              />
              B2B Exclusive Catalog (Hide from retail customers)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#a39783] block mb-1">文献资料 (中文)</label>
              <textarea
                name="descZh"
                defaultValue={amulet.descZh}
                rows={3}
                className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none resize-y"
              ></textarea>
            </div>
            <div>
              <label className="text-xs text-[#a39783] block mb-1">Description (EN)</label>
              <textarea
                name="descEn"
                defaultValue={amulet.descEn}
                rows={3}
                className="w-full bg-[#1a1814] border border-[#c4a265]/30 rounded p-2 text-[#d4c5b0] outline-none resize-y"
              ></textarea>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-5 py-2 border border-[#c4a265]/30 text-[#a39783] rounded-lg hover:bg-[#1a1814] transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#c4a265] text-[#0d0c0b] font-bold rounded-lg hover:bg-[#d5b57d] disabled:opacity-50 transition-colors shadow-lg shadow-[#c4a265]/20"
            >
              {loading ? (isNew ? "创建中..." : "保存中...") : (isNew ? "✨ 确认创建" : "✅ 保存修改")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  if (colSpan) {
    return <td colSpan={colSpan} className="p-2 sm:p-4">{formContent}</td>;
  }
  return formContent;
}
