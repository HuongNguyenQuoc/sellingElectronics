import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// CHÚ Ý: Đảm bảo đường dẫn import ProductCard này đúng
import ProductCard from "../../components/ProductCard"; 
import { dummyFlashDeals } from "../../data/mockData";

const FlashDeal = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const initTimer = () => {
      const storedEndTime = localStorage.getItem("flashSaleEndTime");
      const now = Date.now();
      
      if (storedEndTime && parseInt(storedEndTime) > now) {
        return parseInt(storedEndTime);
      }
      
      const newEndTime = now + 3 * 60 * 60 * 1000;
      localStorage.setItem("flashSaleEndTime", newEndTime);
      return newEndTime;
    };

    let endTime = initTimer();

    const timerInterval = setInterval(() => {
      const now = Date.now();
      let remaining = Math.floor((endTime - now) / 1000);

      if (remaining <= 0) {
        endTime = now + 3 * 60 * 60 * 1000;
        localStorage.setItem("flashSaleEndTime", endTime);
        remaining = 3 * 60 * 60;
      }
      
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-16">
      
      {/* ================= PHẦN 1: HERO BANNER (ĐẾM NGƯỢC NÂNG CẤP) ================= */}
      <div className="relative p-10 lg:p-16 flex flex-col items-center justify-center overflow-hidden border-b-4 border-[#ffc107]">
        
        {/* Ảnh nền cực chất */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        
        {/* Lớp phủ Gradient đen để làm nổi bật chữ */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1320] via-[#0b1320]/80 to-black/60"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Nhãn */}
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
            <span className="text-[#ffc107] text-sm font-bold uppercase tracking-widest drop-shadow-md">
              Flash Sale Đang Diễn Ra
            </span>
            <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight mb-10 text-center drop-shadow-[0_0_15px_rgba(227,0,25,0.8)]">
            SIÊU SALE <span className="text-[#e30019]">CHỚP NHOÁNG</span>
          </h2>

          {/* Đồng hồ Glassmorphism */}
          <div className="flex items-center gap-3 lg:gap-5 mb-4">
             
             {/* Giờ */}
             <div className="flex flex-col items-center">
               <div className="w-20 h-24 lg:w-24 lg:h-28 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                 <span className="text-4xl lg:text-6xl font-black text-white">{hours}</span>
               </div>
               <span className="text-gray-300 text-xs font-bold mt-3 uppercase tracking-widest">Giờ</span>
             </div>
             
             <span className="text-4xl lg:text-5xl text-[#ffc107] font-black mb-7 animate-pulse drop-shadow-lg">:</span>
             
             {/* Phút */}
             <div className="flex flex-col items-center">
               <div className="w-20 h-24 lg:w-24 lg:h-28 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                 <span className="text-4xl lg:text-6xl font-black text-white">{minutes}</span>
               </div>
               <span className="text-gray-300 text-xs font-bold mt-3 uppercase tracking-widest">Phút</span>
             </div>
             
             <span className="text-4xl lg:text-5xl text-[#ffc107] font-black mb-7 animate-pulse drop-shadow-lg">:</span>
             
             {/* Giây */}
             <div className="flex flex-col items-center">
               <div className="w-20 h-24 lg:w-24 lg:h-28 bg-[#e30019]/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-[#e30019]/50 shadow-[0_0_25px_rgba(227,0,25,0.4)]">
                 <span className="text-4xl lg:text-6xl font-black text-[#ffc107] drop-shadow-md">{seconds}</span>
               </div>
               <span className="text-gray-300 text-xs font-bold mt-3 uppercase tracking-widest">Giây</span>
             </div>

          </div>
        </div>
      </div>

      {/* ================= PHẦN 2: LƯỚI SẢN PHẨM ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase">Tất Cả Sản Phẩm Sale</h2>
            <p className="text-sm text-gray-500 mt-1">Nhanh tay, số lượng sản phẩm giảm giá có hạn!</p>
          </div>
        </div>

        {/* Lưới 5 sản phẩm dùng chuẩn ProductCard y hệt trang chủ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dummyFlashDeals.map((item) => (
            <Link 
              to={`/product/${item.id}`} 
              key={item.id} 
              className="block"
            >
              <ProductCard product={item} />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FlashDeal;