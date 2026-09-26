"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Printer,
  Check,
  X,
  Bell,
  BellOff,
  MapPin,
  Phone,
  FileText,
  Package,
  CheckCircle2,
  Receipt,
  Clock
} from "lucide-react";

export default function OrderListClient({
  orders,
  updateOrderStatus,
}: {
  orders: any[];
  updateOrderStatus: (formData: FormData) => void;
}) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const router = useRouter();
  const lastKnownOrderIdRef = useRef<string>(orders[0]?.id || "");

  useEffect(() => {
    if (orders[0]?.id) {
      lastKnownOrderIdRef.current = orders[0].id;
    }
  }, [orders]);
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const unlockAudio = () => {
      const audio = new Audio("/ding.mp3");
      audio.load();
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/admin/orders/latest?lastOrderId=${lastKnownOrderIdRef.current}`
        );
        const data = await res.json();

        if (data.hasNew && data.latestOrder) {
          lastKnownOrderIdRef.current = data.latestOrder.id;

          if (soundEnabled) {
            const audio = new Audio("/ding.mp3");
            audio.play().catch((err) => {
              console.log("Cần tương tác với trang để phát âm thanh:", err);
            });
          }
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`🔔 ĐƠN HÀNG MỚI!`, {
              body: `${data.latestOrder.customerName} vừa đặt đơn ${data.latestOrder.totalAmount?.toLocaleString()}đ`,
              icon: "/favicon.ico",
            });
          }
          router.refresh();
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra đơn mới:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [soundEnabled, router]);

  const handlePrint = (order: any) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 200);
  };
  const deliveredOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalDeliveredRevenue = deliveredOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Đơn Giao Thành Công
            </p>
            <p className="text-3xl font-black text-emerald-600 mt-1">
              {deliveredOrders.length} <span className="text-xs font-normal text-slate-400">đơn</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Doanh Thu Thực Thu
            </p>
            <p className="text-3xl font-black text-rose-600 mt-1">
              {totalDeliveredRevenue.toLocaleString("vi-VN")}đ
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-3 h-3 rounded-full ${
              soundEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
            }`}
          ></span>
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            {soundEnabled ? (
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <BellOff className="w-3.5 h-3.5 text-slate-400" />
            )}
            Chuông báo đơn:{" "}
            <span className={soundEnabled ? "text-emerald-600 font-bold" : "text-slate-400"}>
              {soundEnabled ? "Đang BẬT (Tự động phát chuông)" : "Đang TẮT"}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
            soundEnabled
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {soundEnabled ? (
            <>
              <BellOff className="w-3.5 h-3.5" />
              <span>Tắt chuông</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" />
              <span>Bật lại chuông</span>
            </>
          )}
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 shadow-xs flex flex-col items-center justify-center">
          <Package className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-sm font-medium">Chưa có đơn hàng nào phát sinh.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCompleted = order.status === "COMPLETED";
            const isCancelled = order.status === "CANCELLED";
            const isPending = !isCompleted && !isCancelled;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col md:flex-row justify-between gap-4 transition-all duration-200 hover:shadow-md ${
                  isCompleted
                    ? "border-emerald-200"
                    : isCancelled
                    ? "border-rose-200/80 bg-slate-50/50 opacity-80"
                    : "border-amber-300 ring-2 ring-amber-100/70"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-base sm:text-lg text-slate-800">
                      {order.customerName}
                    </span>

                    {order.phone && (
                      <a
                        href={`tel:${order.phone}`}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-mono flex items-center gap-1 transition"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{order.phone}</span>
                      </a>
                    )}

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isCancelled
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Đã Giao
                        </>
                      ) : isCancelled ? (
                        <>
                          <X className="w-3 h-3" /> Đã Hủy
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Chờ Giao
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      Địa chỉ: <strong className="text-slate-800 font-semibold">{order.address}</strong>
                    </span>
                  </div>
                  {order.note && (
                    <div className="text-xs text-amber-800 bg-amber-50/70 p-2 rounded-lg italic flex items-center gap-1.5 border border-amber-100">
                      <FileText className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Ghi chú: {order.note}</span>
                    </div>
                  )}
                  <div className="mt-3 bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-xs sm:text-sm">
                    <ul className="space-y-1 text-slate-700">
                      {order.items?.map((item: any) => (
                        <li key={item.id} className="flex justify-between items-center">
                          <span>
                            • {item.product?.name || "Món"} × <b>{item.quantity}</b>
                          </span>
                          <span className="text-slate-500 font-medium">
                            {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="font-black text-rose-600 mt-2.5 pt-2 border-t border-slate-200/80 text-base flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-normal">Tổng đơn:</span>
                      <span>{(order.totalAmount || 0).toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2.5 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handlePrint(order)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Bill</span>
                  </button>
                  {isPending && (
                    <div className="flex flex-row md:flex-col gap-2.5">
                      <form action={updateOrderStatus}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value="COMPLETED" />
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Hoàn thành</span>
                        </button>
                      </form>
                      <form
                        action={updateOrderStatus}
                        onSubmit={(e) => {
                          if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value="CANCELLED" />
                        <button
                          type="submit"
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Hủy đơn</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedOrder && (
        <div id="print-bill" className="hidden">
          <div className="w-[80mm] p-2 text-xs font-mono text-black leading-tight">
            <div className="text-center font-bold text-sm mb-1">TẠP HÓA GẦN NHÀ</div>
            <div className="text-center text-[10px] text-gray-500 mb-2">
              Mã đơn: #{selectedOrder.id.slice(-6).toUpperCase()}
            </div>
            <div className="border-b border-dashed border-black mb-2"></div>

            <div className="mb-1">Khách: {selectedOrder.customerName}</div>
            <div className="mb-1">SĐT: {selectedOrder.phone}</div>
            <div className="mb-1">Đ/C: {selectedOrder.address}</div>
            {selectedOrder.note && <div className="mb-1">Ghi chú: {selectedOrder.note}</div>}

            <div className="border-b border-dashed border-black my-2"></div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black">
                  <th className="py-1">Món</th>
                  <th className="text-center">SL</th>
                  <th className="text-right">T.Tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-1">{item.product?.name || "Món"}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-b border-dashed border-black my-2"></div>

            <div className="flex justify-between font-bold text-sm">
              <span>TỔNG TIỀN:</span>
              <span>{(selectedOrder.totalAmount || 0).toLocaleString()}đ</span>
            </div>

            <div className="text-center text-[10px] mt-4">
              Cảm ơn quý khách đã ủng hộ!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
