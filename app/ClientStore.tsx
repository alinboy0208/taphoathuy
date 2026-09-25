"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  PackageOpen,
  ArrowRight,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const CATEGORY_NAMES: Record<string, string> = {
  ALL: "Tất cả",
  "Nuoc uong": "Nước uống",
  "Banh keo": "Bánh kẹo",
  "Do dong goi": "Đồ khô & Mì",
  "Gia vi": "Gia vị & Khác",
};

export default function ClientStore({ initialProducts }: { initialProducts: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const categories = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.category));
    return ["ALL", ...Array.from(set)];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === "ALL" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          note,
          cart,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setCart([]);
      } else {
        alert("Lỗi khi gửi đơn hàng, vui lòng thử lại!");
      }
    } catch {
      alert("Không thể kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border text-center shadow-sm my-12">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Đặt Hàng Thành Công!</h2>
        <p className="text-gray-600 text-sm mb-6">
          Cửa hàng đã nhận được đơn và sẽ chuẩn bị giao ngay tới bạn.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setIsModalOpen(false);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-6 rounded-xl text-sm transition shadow-sm"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔍 KHU VỰC TÌM KIẾM & DANH MỤC CĂN CHÍNH GIỮA */}
      <div className="flex flex-col items-center space-y-3.5 mb-6">
        <div className="relative w-full max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3.5 my-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bánh kẹo, nước ngọt, mì tôm..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Danh mục */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none no-scrollbar flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const label = CATEGORY_NAMES[cat] || cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                  isActive
                    ? "bg-amber-500 text-white shadow-amber-500/20 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid sản phẩm */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-slate-400 shadow-sm flex flex-col items-center justify-center">
          <PackageOpen className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-sm font-medium">Không tìm thấy món nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.product.id === p.id);

            return (
              <div
                key={p.id}
                className="bg-white border border-slate-100 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition group"
              >
                <div>
                  <div className="relative w-full aspect-square bg-slate-50 rounded-lg overflow-hidden mb-2">
                    <img
                      src={p.imageUrl || "https://placehold.co/300x300?text=SP"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {CATEGORY_NAMES[p.category] || p.category}
                  </span>

                  <h3 className="font-normal text-sm sm:text-base text-slate-800 line-clamp-2 mt-1 leading-snug min-h-[2.6rem] sm:min-h-[2.8rem] flex items-center">
                     {p.name}
                  </h3>

                  <p className="text-red-600 font-bold text-xs sm:text-sm mt-1">
                    {p.price.toLocaleString()}đ
                  </p>
                </div>

                <div className="mt-2.5">
                  {inCart ? (
                    <div className="flex items-center justify-between border border-amber-300 rounded-lg overflow-hidden bg-amber-50/60">
                      <button
                        onClick={() => updateQuantity(p.id, -1)}
                        className="p-1 text-amber-700 hover:bg-amber-100 flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-amber-900">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(p.id, 1)}
                        className="p-1 text-amber-700 hover:bg-amber-100 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-1.5 sm:py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Chọn Mua</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Thanh giỏ hàng nổi */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto bg-slate-900 text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl flex justify-between items-center z-40 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">{totalItemsCount} món trong giỏ</div>
              <div className="text-base sm:text-lg font-bold text-amber-400">
                {totalAmount.toLocaleString()}đ
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 sm:px-5 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>Đặt hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal Popup đặt hàng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span>Xác nhận đặt hàng</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 mb-4 max-h-44 overflow-y-auto text-sm space-y-2 border border-slate-200">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <span className="text-slate-700">
                    {item.product.name} × <b>{item.quantity}</b>
                  </span>
                  <span className="font-semibold text-slate-900">
                    {(item.product.price * item.quantity).toLocaleString()}đ
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-base">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{totalAmount.toLocaleString()}đ</span>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Anh Huy"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Để quán gọi khi tới nơi"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Địa chỉ / Số phòng / Căn hộ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tầng, phòng hoặc tên hẻm..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Ghi chú</label>
                <input
                  type="text"
                  placeholder="Giao liền giùm mình / Mang thêm đá..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl mt-3 text-base transition shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Đang gửi đơn..." : `Gửi đơn (${totalAmount.toLocaleString()}đ)`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}