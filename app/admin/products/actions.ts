"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Thêm sản phẩm mới
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = (formData.get("imageUrl") as string) || null;

  await prisma.product.create({
    data: {
      name,
      category,
      costPrice,
      price,
      imageUrl,
      isActive: true,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

// 2. Chỉnh sửa thông tin sản phẩm
export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = (formData.get("imageUrl") as string) || null;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      costPrice,
      price,
      imageUrl,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

// 3. Ẩn / Hiện sản phẩm (Sửa lỗi không nhận trạng thái)
export async function toggleProductStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const currentStatusStr = formData.get("currentStatus") as string;
  // Ép kiểu chuỗi "true" thành boolean chuẩn
  const isCurrentlyActive = currentStatusStr === "true";

  await prisma.product.update({
    where: { id },
    data: {
      isActive: !isCurrentlyActive,
    },
  });

  // Revalidate cả trang quản trị lẫn trang mua hàng ngoài trang chủ
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// 4. Xóa sản phẩm
export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.log("Không thể xóa sản phẩm đã có trong đơn hàng cũ, tự chuyển sang ẩn:", error);
    // Nếu sản phẩm đã có đơn hàng trong quá khứ, SQLite có thể chặn xóa cascade, ta chuyển sang ẩn
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
}