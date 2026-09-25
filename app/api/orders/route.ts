import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, note, cart } = body;

    if (!customerName || !phone || !address || !cart || cart.length === 0) {
      return NextResponse.json(
        { error: "Vui lòng điền đủ thông tin bắt buộc!" },
        { status: 400 }
      );
    }

    // 1. Lấy thông tin giá vốn (costPrice) và giá bán thật từ database để bảo mật
    const productIds = cart.map((item: any) => item.product.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 2. Tính tổng tiền đơn hàng dựa trên giá trong database (tránh khách can thiệp giá ở trình duyệt)
    let totalAmount = 0;
    const orderItemsData = cart.map((item: any) => {
      const dbProd = productMap.get(item.product.id);
      if (!dbProd) throw new Error("Sản phẩm không hợp lệ");

      const itemTotal = dbProd.price * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: dbProd.id,
        quantity: item.quantity,
        price: dbProd.price,
        costPrice: dbProd.costPrice, // Lưu giá vốn để thống kê lợi nhuận sau này
      };
    });

    // 3. Tạo đơn hàng và các mục hàng trong một giao dịch
    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        note: note || "",
        totalAmount,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Lỗi khi tạo đơn:", error);
    return NextResponse.json(
      { error: "Không thể xử lý đơn hàng lúc này" },
      { status: 500 }
    );
  }
}