import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import { getProductId, isDiscountedProduct } from "../utils/productUtils";

const FlashDeals = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { products, isLoading, error } = useProducts();

  const flashDeals = useMemo(() => {
    return products.filter(isDiscountedProduct).slice(0, 6);
  }, [products]);

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-[#f8f9fa] rounded-3xl p-6 lg:p-8 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            <h2 className="text-2xl font-black text-[#e30019] flex items-center gap-2 uppercase tracking-tight">
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

          <Link
            to="/flash-sale"
            className="text-sm font-bold text-gray-500 hover:text-[#e30019] transition-colors flex items-center gap-1"
          >
            Xem thêm deals hời <span className="text-lg"></span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading ? (
            <div className="col-span-full py-8 text-center text-gray-500">
              Đang tải sản phẩm sale...
            </div>
          ) : error ? (
            <div className="col-span-full py-8 text-center text-red-500">
              {error}
            </div>
          ) : flashDeals.length > 0 ? (
            flashDeals.map((item) => {
              const productId = getProductId(item);

              return (
                <Link to={`/product/${productId}`} key={productId} className="block">
                  <ProductCard product={item} />
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              Hiện chưa có sản phẩm giảm giá.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
