"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type MonthlyData = {
  month: string;
  revenue: number;
  profit: number;
};

export default function RevenueChart({ data }: { data: MonthlyData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-slate-400 py-12 text-sm">
        Chưa có dữ liệu theo tháng để hiển thị biểu đồ.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
          />
          <Tooltip
            formatter={(value: any) => [`${Number(value).toLocaleString()} đ`]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          
          {/* Đường Doanh thu (Màu xanh dương) */}
          <Line
            type="monotone"
            dataKey="revenue"
            name="Doanh thu"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />

          {/* Đường Lợi nhuận (Màu xanh lá) */}
          <Line
            type="monotone"
            dataKey="profit"
            name="Lợi nhuận"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}