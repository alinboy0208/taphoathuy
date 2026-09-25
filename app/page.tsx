import { prisma } from "@/lib/prisma";
import ClientStore from "./ClientStore";
import { 
  MapPin, 
  PhoneCall, 
  Clock3, 
  Store, 
  ExternalLink, 
  ShieldCheck 
} from "lucide-react";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header cửa hàng: Xe đẩy trong vòng tròn trắng + Chữ hòa vào nền cam */}
      {/* Header cửa hàng: Tăng chiều cao và phóng to logo */}
     {/* Header cửa hàng: Logo hòa thẳng vào nền cam không viền hộp */}
      {/* Header cửa hàng: Logo to rõ, hòa màu tuyệt đối không sợ lệch viền */}
      <header className="bg-amber-500 text-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 animate-logo-fade-in">
            {/* Sử dụng ảnh gốc nền trắng kết hợp mix-blend-multiply để ăn khớp 100% màu nền cam */}
            <img
              src="/Picture1.png"
              alt="Tạp hóa Thúy"
              className="h-16 sm:h-20 w-auto object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105 shrink-0"
            />

            <div className="hidden sm:block border-l-2 border-amber-600/40 pl-4 py-1">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
                Cửa Hàng Tiện Lợi
              </h1>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Giao nhanh khu dân cư • Tiện lợi & Tiết kiệm
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ClientStore initialProducts={products} />
      </main>

      {/* Footer cuối trang */}
      {/* FOOTER HIỆN ĐẠI CÓ TÍCH HỢP BẢN ĐỒ & ICON CHUẨN LUCIDE */}
<footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80 items-center">
      
      {/* CỘT TRÁI (Chiếm 7 cột): Thông tin quán & Giờ mở cửa */}
      <div className="md:col-span-7 space-y-5">
        <div className="flex items-center gap-3">
          {/* Logo xe đẩy bo tròn đồng bộ */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
             <img 
               src="/Picture2.png" 
               alt="Logo Tạp Hóa Thúy" 
               className="w-full h-full object-cover" 
              />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">Tạp Hóa Thúy</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Store className="w-3 h-3" />
                Cửa hàng tiện lợi
              </span>
            </div>
            <p className="text-xs text-amber-400 font-medium mt-0.5">Giao nhanh khu dân cư • Tiện lợi & Tiết kiệm</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-0 md:pr-6">
          Chuyên cung cấp nhu yếu phẩm, đồ ăn vặt, nước giải khát giao tận cửa chỉ trong tích tắc. Uy tín, nhanh chóng và tận tâm.
        </p>

        {/* Cụm thông tin liên hệ với Icon Vector chuyên nghiệp */}
        <div className="space-y-3 pt-1 text-xs sm:text-sm">
          {/* Icon Địa chỉ */}
          <div className="flex items-start gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Địa chỉ quán:</span>
              <strong className="text-slate-200 font-semibold">119 ấp 5, Lê Văn Lương, Nhà Bè</strong>
            </div>
          </div>

          {/* Icon Hotline */}
          <div className="flex items-start gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <PhoneCall className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Hotline đặt hàng / Zalo:</span>
              <a 
                href="tel:0908413900" 
                className="text-amber-400 hover:text-amber-300 font-mono font-bold hover:underline transition"
              >
                0980413900
              </a>
            </div>
          </div>

          {/* Icon Thời gian hoạt động */}
          <div className="flex items-start gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
              <Clock3 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Thời gian mở cửa:</span>
              <span className="text-slate-200 font-medium">06:30 - 22:30 (Mở cửa tất cả các ngày trong tuần)</span>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI (Chiếm 5 cột): Bản đồ Google Maps bo tròn */}
      <div className="md:col-span-5">
        <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl bg-slate-800/50 backdrop-blur-sm p-1.5 transition-all duration-300 hover:border-amber-500/50">
          <div className="w-full h-48 sm:h-52 rounded-xl overflow-hidden relative">
            <iframe
              title="119 ấp 5, Lê Văn Lương, Nhà Bè"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d201.30452528882515!2d106.69849625009768!3d10.721033067624262!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fc1ca862265%3A0x334a38e9f4025ae5!2zOUIg4bqlcCA1LCBOaMOgIELDqCwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e1!3m2!1svi!2sca!4v1790352982978!5m2!1svi!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full filter saturate-100 contrast-105"
            ></iframe>
          </div>

          {/* Dải điều hướng chỉ đường bên dưới iframe */}
          <div className="px-2.5 py-2 flex justify-between items-center text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500" />
              119 ấp 5, Lê Văn Lương, Nhà Bè
            </span>
            <a
              href="https://maps.google.com/?q=9B+Ấp+5+Nhà+Bè+Hồ+Chí+Minh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 font-semibold hover:text-amber-300 transition inline-flex items-center gap-1 group-hover:translate-x-0.5"
            >
              <span>Chỉ đường</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

    </div>

    {/* DÒNG BẢN QUYỀN CHÂN TRANG */}
    <div className="pt-6 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
      <p>© {new Date().getFullYear()} Tạp Hóa Thúy. Tất cả quyền được bảo lưu.</p>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Giao hàng an tâm • Thanh toán linh hoạt</span>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}