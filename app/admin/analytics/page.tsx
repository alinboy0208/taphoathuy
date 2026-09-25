import { prisma } from "@/lib/prisma";
import RevenueChart from "./RevenueChart";
import { TrendingUp } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const completedItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "COMPLETED",
      },
    },
    include: {
      product: true,
      order: true,
    },
  });

  // 1. Tính tổng doanh thu và tiền vốn toàn thời gian
  const totalRevenue = completedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalCost = completedItems.reduce(
    (acc, item) => acc + item.costPrice * item.quantity,
    0
  );
  const totalProfit = totalRevenue - totalCost;

  // 2. Gom dữ liệu doanh thu & lợi nhuận theo từng tháng (T1, T2,... T12)
  const monthlyStatsMap: Record<string, { revenue: number; profit: number }> = {};

  completedItems.forEach((item) => {
    const date = new Date(item.order.createdAt);
    const monthKey = `Tháng ${date.getMonth() + 1}`;

    if (!monthlyStatsMap[monthKey]) {
      monthlyStatsMap[monthKey] = { revenue: 0, profit: 0 };
    }

    const itemRevenue = item.price * item.quantity;
    const itemCost = item.costPrice * item.quantity;

    monthlyStatsMap[monthKey].revenue += itemRevenue;
    monthlyStatsMap[monthKey].profit += itemRevenue - itemCost;
  });

  // Chuyển Map thành mảng để Recharts đọc
  const chartData = Object.entries(monthlyStatsMap).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    profit: data.profit,
  }));

  // 3. Top sản phẩm bán chạy nhất
  const productStatsMap: Record<
    string,
    { name: string; quantity: number; revenue: number }
  > = {};

  completedItems.forEach((item) => {
    if (!productStatsMap[item.productId]) {
      productStatsMap[item.productId] = {
        name: item.product.name,
        quantity: 0,
        revenue: 0,
      };
    }
    productStatsMap[item.productId].quantity += item.quantity;
    productStatsMap[item.productId].revenue += item.price * item.quantity;
  });

  const topProducts = Object.values(productStatsMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Báo Cáo Doanh Thu</h1>
            <p className="text-xs text-slate-500">Biểu đồ tăng trưởng và xếp hạng sản phẩm</p>
          </div>
          <a
            href="/admin/orders"
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            ← Về Danh Sách Đơn
          </a>
        </header>

        {/* 3 Thẻ chỉ số tổng */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Tổng Doanh Thu</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">
              {totalRevenue.toLocaleString()} đ
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Tiền Vốn Gốc</div>
            <div className="text-2xl font-bold text-slate-600 mt-2">
              {totalCost.toLocaleString()} đ
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border shadow-sm border-emerald-200 bg-emerald-50/40">
            <div className="text-xs font-semibold text-emerald-700 uppercase">Lợi Nhuận Gộp</div>
            <div className="text-2xl font-bold text-emerald-600 mt-2">
              {totalProfit.toLocaleString()} đ
            </div>
          </div>
        </div>

        {/* KHUNG BIỂU ĐỒ ĐƯỜNG (LINE GRAPH) */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-indigo-600" />
             <span>Biểu Đồ Doanh Thu & Lợi Nhuận Qua Từng Tháng</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Đơn vị tính: VNĐ (k = nghìn đồng)
          </p>
          <RevenueChart data={chartData} />
        </div>

        {/* Bảng Top bán chạy */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-bold text-base text-slate-800 mb-4">
             Top Sản Phẩm Bán Chạy Nhất
          </h3>

          {topProducts.length === 0 ? (
            <div className="text-sm text-slate-500 py-4 text-center">
              Chưa có dữ liệu từ đơn hàng hoàn thành.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500 text-xs uppercase bg-slate-50">
                    <th className="py-2.5 px-3">Hạng</th>
                    <th className="py-2.5 px-3">Mặt hàng</th>
                    <th className="py-2.5 px-3 text-center">Đã bán</th>
                    <th className="py-2.5 px-3 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {topProducts.map((p, idx) => (
                    <tr key={p.name} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-500">#{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{p.name}</td>
                      <td className="py-3 px-3 text-center font-bold text-amber-600">
                        {p.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        {p.revenue.toLocaleString()} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}