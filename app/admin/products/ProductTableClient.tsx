"use client";

import { useState } from "react";
import { toggleProductStatus, deleteProduct, updateProduct } from "./actions";
import { Pencil, Eye, EyeOff, Trash2, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
};

export default function ProductTableClient({ products }: { products: Product[] }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500 text-xs uppercase bg-slate-50">
              <th className="py-2.5 px-3">Sản phẩm</th>
              <th className="py-2.5 px-3">Giá vốn</th>
              <th className="py-2.5 px-3">Giá bán</th>
              <th className="py-2.5 px-3 text-center">Trạng thái</th>
              <th className="py-2.5 px-3 text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.category}</div>
                </td>
                <td className="py-3 px-3 text-slate-500">
                  {p.costPrice.toLocaleString()} đ
                </td>
                <td className="py-3 px-3 font-bold text-amber-600">
                  {p.price.toLocaleString()} đ
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold inline-block ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.isActive ? "Đang bán" : "Tạm ẩn"}
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                  {/* Nút Sửa */}
                  <button
                    type="button"
                    onClick={() => setEditingProduct(p)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg bg-blue-50 transition"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Sửa</span>
                  </button>

                  {/* Nút Ẩn / Hiện */}
                  <form action={toggleProductStatus} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="currentStatus" value={String(p.isActive)} />
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1 text-xs font-semibold border px-2.5 py-1 rounded-lg transition ${
                        p.isActive
                          ? "text-slate-600 hover:text-slate-800 bg-slate-50 border-slate-300"
                          : "text-emerald-700 hover:text-emerald-900 bg-emerald-50 border-emerald-300"
                      }`}
                    >
                      {p.isActive ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Ẩn đi</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Hiện lại</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Nút Xóa */}
                  <form
                    action={deleteProduct}
                    className="inline"
                    onSubmit={(e) => {
                      if (!confirm(`Bạn có chắc muốn xóa món "${p.name}"?`)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 border border-red-200 px-2.5 py-1 rounded-lg bg-red-50 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup chỉnh sửa */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-1.5">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>Chỉnh Sửa Sản Phẩm</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await updateProduct(formData);
                setEditingProduct(null);
              }}
              className="space-y-3 text-sm"
            >
              <input type="hidden" name="id" value={editingProduct.id} />

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProduct.name}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Danh mục *
                </label>
                <select
                  name="category"
                  defaultValue={editingProduct.category}
                  className="w-full border rounded-lg p-2 bg-white outline-none"
                >
                  <option value="Nuoc uong">Nước uống & Giải khát</option>
                  <option value="Banh keo">Bánh kẹo & Snack</option>
                  <option value="Do dong goi">Đồ khô & Đóng gói</option>
                  <option value="Gia vi">Gia vị & Khác</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Giá vốn (gốc) *
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    required
                    defaultValue={editingProduct.costPrice}
                    className="w-full border rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Giá bán ra *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingProduct.price}
                    className="w-full border rounded-lg p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Link hình ảnh (URL)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={editingProduct.imageUrl || ""}
                  placeholder="https://..."
                  className="w-full border rounded-lg p-2 outline-none text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-1/2 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}