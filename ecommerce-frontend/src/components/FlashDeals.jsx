import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { dummyFlashDeals } from "../data/mockData";

const FlashDeals = () => {
  const [timeLeft, setTimeLeft] = useState(10800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 10800;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
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
            <h2 className="text-2xl font-black text-red-600 flex items-center gap-2 uppercase tracking-tight">
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

            {/* Bộ đếm ngược thời gian (Đã gắn biến động) */}
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

          <a
            href="#"
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            Xem thêm deals hời
          </a>
        </div>

        {/* Lưới danh sách 6 sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dummyFlashDeals.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
