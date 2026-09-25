import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const correctPin = process.env.ADMIN_SECRET_KEY || "taphoa123456";

    if (pin !== correctPin) {
      return NextResponse.json({ error: "Mã PIN không chính xác!" }, { status: 401 });
    }

    // Thiết lập cookie admin_session tồn tại trong 7 ngày
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

// Hỗ trợ Đăng xuất
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}