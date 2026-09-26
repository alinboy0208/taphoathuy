import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderListClient from "./OrderListClient";
import { Package, TrendingUp, LogOut } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  async function updateOrderStatus(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    const newStatus = formData.get("status") as string;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/analytics");
  }
  async function logout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-none">
                  Quản Lý Đơn Hàng
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Theo dõi đơn mới, chốt giao hàng & xuất bill nhiệt 80mm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-1 bg-slate-100/80 border border-slate-200/60 rounded-2xl gap-1">
              <a
                href="/admin/products"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-700 hover:bg-white transition-all shadow-xs"
              >
                <Package className="w-4 h-4 text-amber-600" />
                <span>Món Hàng</span>
              </a>

              <a
                href="/admin/analytics"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 hover:bg-white transition-all shadow-xs"
              >
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Thống Kê</span>
              </a>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer active:scale-95"
                title="Đăng xuất quản trị"
              >
                <LogOut className="w-4 h-4" />
                <span>Thoát</span>
              </button>
            </form>
          </div>

        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <OrderListClient orders={orders} updateOrderStatus={updateOrderStatus} />
      </div>
    </div>
  );
}
