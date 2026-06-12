import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import { getProductId } from "../utils/productUtils";

const brandFilters = [
  { label: "Tất cả", value: "ALL" },
  { label: "iPhone", value: "IPHONE" },
  { label: "Samsung", value: "SAMSUNG" },
  { label: "Oppo", value: "OPPO" },
];

const FeaturedPhones = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { products: phones, isLoading, error } = useProducts("smartphone");

  const filteredPhones = useMemo(() => {
    if (activeFilter === "ALL") return phones.slice(0, 6);

    return phones
      .filter((phone) => phone.brandName?.toUpperCase() === activeFilter)
      .slice(0, 6);
  }, [activeFilter, phones]);

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
          {brandFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={getButtonClass(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading ? (
          <div className="col-span-full py-8 text-center text-gray-500">
            Đang tải sản phẩm...
          </div>
        ) : error ? (
          <div className="col-span-full py-8 text-center text-red-500">
            {error}
          </div>
        ) : filteredPhones.length > 0 ? (
          filteredPhones.map((item) => {
            const productId = getProductId(item);

            return (
              <Link to={`/product/${productId}`} key={productId} className="block">
                <ProductCard product={item} />
              </Link>
            );
          })
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
