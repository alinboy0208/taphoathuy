import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ nếu có
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Thêm sản phẩm mẫu kèm giá vốn và giá bán
  await prisma.product.createMany({
    data: [
      {
        name: "Coca Cola lon 320ml",
        category: "Nuoc uong",
        costPrice: 8000,
        price: 11000,
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
      },
      {
        name: "Cà phê G7 3-in-1 (Hộp 16 gói)",
        category: "Nuoc uong",
        costPrice: 42000,
        price: 55000,
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
      },
      {
        name: "Mì Hảo Hảo Tôm Chua Cay",
        category: "Do dong goi",
        costPrice: 3800,
        price: 5000,
        imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80",
      },
      {
        name: "Snack Khoai Tây O'Star",
        category: "Banh keo",
        costPrice: 9000,
        price: 13000,
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
      },
    ],
  });

  console.log("-> Đã nạp thành công 4 sản phẩm mẫu!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
