import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Khai báo font Montserrat
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tạp Hóa Gần Nhà - Đặt Hàng Nhanh",
  description: "Cửa hàng tạp hóa tiện lợi, giao nhanh khu dân cư",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Đưa montserrat.className trực tiếp vào body và bỏ font-sans */}
      <body
        className={`${montserrat.className} min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}