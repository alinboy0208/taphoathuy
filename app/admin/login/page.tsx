import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, ArrowRight, LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    const pin = formData.get("pin") as string;
    const correctPin = process.env.ADMIN_PIN || "taphoa123"; // Hoặc mã PIN bạn đã cài

    if (pin === correctPin) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // Lưu đăng nhập 7 ngày
        path: "/",
      });
      redirect("/admin/orders");
    } else {
      redirect("/admin/login?error=1");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-amber-500 selection:text-white">
      {/* Vòng sáng hào quang mờ phía sau tạo chiều sâu */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Khung Card Glassmorphism tối giản và sang trọng */}
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/60">
          {/* Header & Icon */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>

            <h1 className="text-xl font-black text-white tracking-tight">
              Quản Trị Viên
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Nhập mã PIN bảo mật để truy cập bảng điều khiển
            </p>
          </div>

          {/* Form nhập mã PIN */}
          <form action={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <LockKeyhole className="w-4 h-4" />
              </div>
              <input
                type="password"
                name="pin"
                required
                autoFocus
                placeholder="Nhập mã PIN..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center text-sm font-semibold tracking-widest text-white placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <span>Mở Khóa Quản Trị</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Dòng bảo mật chân trang */}
          <div className="mt-6 text-center">
            <span className="text-[11px] text-slate-500 tracking-wide">
              Hệ thống bán lẻ • Tạp hóa Thúy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}