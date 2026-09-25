import { prisma } from "@/lib/prisma";
import { createProduct } from "./actions";
import ProductTableClient from "./ProductTableClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Thanh tiêu đề */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quản Lý Sản Phẩm</h1>
            <p className="text-xs text-slate-500">Thêm mặt hàng mới, chỉnh sửa giá bán và quản lý kho</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/admin/orders"
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              ← Về Đơn Hàng
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Form nhập món mới */}
          <div className="bg-white p-5 rounded-xl border shadow-sm h-fit">
            <h2 className="font-bold text-base text-slate-800 mb-3">+ Thêm Mặt Hàng Mới</h2>
            <form action={createProduct} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ví dụ: Nước suối Aquafina 500ml"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Danh mục *</label>
                <select
                  name="category"
                  className="w-full border rounded-lg p-2 bg-white outline-none"
                >
                  <option value="Nuoc uong">Nước uống & Giải khát</option>
                  <option value="Banh keo">Bánh kẹo & Snack</option>
                  <option value="Do dong goi">Đồ khô & Đóng gói</option>
                  <option value="Gia vi">Gia vị & Khác</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Giá vốn (gốc) *</label>
                  <input
                    type="number"
                    name="costPrice"
                    required
                    placeholder="3500"
                    className="w-full border rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Giá bán ra *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="5000"
                    className="w-full border rounded-lg p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Link hình ảnh (URL)</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://..."
                  className="w-full border rounded-lg p-2 outline-none text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg mt-2 transition"
              >
                Lưu Vào Danh Mục
              </button>
            </form>
          </div>

          {/* Cột phải: Bảng danh sách hàng hóa có nút Sửa */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-5">
            <h2 className="font-bold text-base text-slate-800 mb-4">
               Danh Sách Mặt Hàng ({products.length})
            </h2>

            <ProductTableClient products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}