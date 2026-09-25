import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lastOrderId = searchParams.get("lastOrderId");

  // Lấy đơn hàng mới nhất trong hệ thống
  const latestOrder = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!latestOrder) {
    return NextResponse.json({ hasNew: false });
  }

  // Nếu chưa có mốc so sánh (lần đầu load) hoặc mã đơn mới khác với mã đơn cũ
  const isNew = lastOrderId ? latestOrder.id !== lastOrderId : false;

  return NextResponse.json({
    hasNew: isNew,
    latestOrder,
  });
}