import { useState } from "react";
import { Link } from "react-router-dom"; // 1. IMPORT THÊM LINK TẠI ĐÂY
import ProductCard from "./ProductCard";
import { dummyRecommended } from "../data/mockData";

const Recommendations = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Chỉ dùng mảng dummyRecommended thật.
  // Nếu false -> Cắt lấy 6 cái đầu tiên. Nếu true -> Lấy tất cả.
  const displayedProducts = isExpanded
    ? dummyRecommended
    : dummyRecommended.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#f8f9fa] rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
        {/* Header với Icon lấp lánh */}
        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-2">
            <span className="text-yellow-400 text-2xl">✨</span>
            GỢI Ý RIÊNG Dành Cho Bạn
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Dựa trên lịch sử xem hàng, thói quen và cấu hình yêu thích của riêng
            bạn
          </p>
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-500">
          {displayedProducts.map((item) => (
            /* 2. BỌC LINK RA BÊN NGOÀI PRODUCT CARD */
            <Link 
              to={`/product/${item.id}`} 
              key={item.id} 
              className="block" // Thêm block để vùng bấm (click area) bao trọn thẻ
            >
              <ProductCard product={item} />
            </Link>
          ))}
        </div>

        {/* ĐÂY LÀ LOGIC ẨN/HIỆN NÚT */}
        {/* Nút chỉ hiển thị (render) khi tổng số sản phẩm trong data > 6 */}
        {dummyRecommended.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold py-2.5 px-8 rounded-lg text-sm transition-all duration-300 active:scale-95"
            >
              {isExpanded
                ? "Ẩn bớt sản phẩm gợi ý"
                : "Xem thêm quà tặng & sản phẩm gợi ý"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommendations;