import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { dummyFlashDeals } from "../data/mockData";

const FlashDeals = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  // LOGIC ĐỒNG BỘ THỜI GIAN VỚI TRANG FLASH SALE CHI TIẾT
  useEffect(() => {
    const initTimer = () => {
      const storedEndTime = localStorage.getItem("flashSaleEndTime");
      const now = Date.now();
      
      // Nếu đã có mốc kết thúc và chưa qua thời gian đó
      if (storedEndTime && parseInt(storedEndTime) > now) {
        return parseInt(storedEndTime);
      }
      
      // Nếu chưa có hoặc đã hết giờ -> Đặt lại mốc 3 tiếng mới
      const newEndTime = now + 3 * 60 * 60 * 1000;
      localStorage.setItem("flashSaleEndTime", newEndTime);
      return newEndTime;
    };

    let endTime = initTimer();

    const timerInterval = setInterval(() => {
      const now = Date.now();
      let remaining = Math.floor((endTime - now) / 1000);

      // Nếu đếm lùi về 0 thì tự động quay vòng lại 3 tiếng
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-[#f8f9fa] rounded-3xl p-6 lg:p-8 border border-gray-200">
        {/* Header Flash Deal */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            <h2 className="text-2xl font-black text-[#e30019] flex items-center gap-2 uppercase tracking-tight">
              {/* Icon Tia Sét */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Flash Deals Chớp Nhoáng
            </h2>

            {/* Bộ đếm ngược thời gian đồng bộ */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500 font-bold uppercase text-xs">
                Hết hạn sau:
              </span>
              <div className="flex gap-1.5 items-center">
                <span className="bg-black text-white font-bold px-2 py-1 rounded w-8 text-center">
                  {hours}
                </span>
                <span className="font-bold text-black">:</span>
                <span className="bg-black text-white font-bold px-2 py-1 rounded w-8 text-center">
                  {minutes}
                </span>
                <span className="font-bold text-black">:</span>
                <span className="bg-black text-white font-bold px-2 py-1 rounded w-8 text-center">
                  {seconds}
                </span>
              </div>
            </div>
          </div>

          {/* NÚT CHUYỂN TRANG */}
          <Link
            to="/flash-sale"
            className="text-sm font-bold text-gray-500 hover:text-[#e30019] transition-colors flex items-center gap-1"
          >
            Xem thêm deals hời <span className="text-lg"></span>
          </Link>
        </div>

        {/* Lưới danh sách TỐI ĐA 6 SẢN PHẨM */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dummyFlashDeals.slice(0, 6).map((item) => (
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
    </section>
  );
};

export default FlashDeals;