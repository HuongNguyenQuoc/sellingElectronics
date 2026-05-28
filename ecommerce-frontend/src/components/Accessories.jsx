import { useState } from "react";
import ProductCard from "./ProductCard";
import { dummyAccessories } from "../data/mockData";

const Accessories = () => {
  // 1. Khởi tạo state để lưu trạng thái bộ lọc
  const [activeFilter, setActiveFilter] = useState("ALL");

  // 2. Logic lọc sản phẩm
  const filteredAccessories =
    activeFilter === "ALL"
      ? dummyAccessories
      : dummyAccessories.filter((item) => {
          // Xử lý riêng cho nút "Chuột & Phím" vì nó gom 2 brand lại
          if (activeFilter === "CHUỘT & PHÍM") {
            return item.brand === "CHUỘT GAMING" || item.brand === "BÀN PHÍM";
          }
          // Các nút khác thì lọc khớp chính xác tên brand
          return item.brand === activeFilter;
        });

  // 3. Hàm đổi màu nút bấm
  const getButtonClass = (filterName) => {
    return activeFilter === filterName
      ? "bg-black text-white px-4 py-1.5 rounded-full font-semibold transition-colors"
      : "border border-gray-300 text-gray-600 px-4 py-1.5 rounded-full hover:border-black hover:text-black transition-colors";
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-black text-gray-900 uppercase">
          Phụ Kiện Công Nghệ Hot
        </h2>

        {/* Các nút Filter đã gắn sự kiện onClick */}
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={getButtonClass("ALL")}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter("TAI NGHE")}
            className={getButtonClass("TAI NGHE")}
          >
            Tai Nghe
          </button>
          <button
            onClick={() => setActiveFilter("SẠC DỰ PHÒNG")}
            className={getButtonClass("SẠC DỰ PHÒNG")}
          >
            Sạc Dự Phòng
          </button>
          <button
            onClick={() => setActiveFilter("CHUỘT & PHÍM")}
            className={getButtonClass("CHUỘT & PHÍM")}
          >
            Chuột & Phím
          </button>
        </div>
      </div>

      {/* Render danh sách đã lọc */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredAccessories.length > 0 ? (
          filteredAccessories.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-500">
            Hiện chưa có sản phẩm nào thuộc danh mục này.
          </div>
        )}
      </div>
    </section>
  );
};

export default Accessories;
