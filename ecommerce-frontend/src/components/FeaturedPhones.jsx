import { useState } from "react";
import ProductCard from "./ProductCard";
import { dummyPhones } from "../data/mockData";

const FeaturedPhones = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredPhones =
    activeFilter === "ALL"
      ? dummyPhones
      : dummyPhones.filter((phone) => phone.brand === activeFilter);

  const getButtonClass = (filterName) => {
    return activeFilter === filterName
      ? "bg-black text-white px-4 py-1.5 rounded-full font-semibold transition-colors"
      : "border border-gray-300 text-gray-600 px-4 py-1.5 rounded-full hover:border-black hover:text-black transition-colors";
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-black text-gray-900 uppercase">
          Điện Thoại Mới Nổi Bật
        </h2>

        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={getButtonClass("ALL")}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter("IPHONE")}
            className={getButtonClass("IPHONE")}
          >
            iPhone
          </button>
          <button
            onClick={() => setActiveFilter("SAMSUNG")}
            className={getButtonClass("SAMSUNG")}
          >
            Samsung
          </button>
          <button
            onClick={() => setActiveFilter("OPPO")}
            className={getButtonClass("OPPO")}
          >
            Oppo
          </button>
        </div>
      </div>

      {/* Render danh sách đã được lọc (filteredPhones) thay vì mảng gốc (dummyPhones) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredPhones.length > 0 ? (
          filteredPhones.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-500">
            Hiện chưa có sản phẩm nào thuộc hãng này.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPhones;
