import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import {
  getProductId,
  hasAnyTag,
  isAccessoryProduct,
} from "../utils/productUtils";

const accessoryFilters = [
  { label: "Tất cả", value: "ALL" },
  { label: "Tai Nghe", value: "HEADPHONE", tags: ["headphone"] },
  { label: "Sạc Dự Phòng", value: "POWERBANK", tags: ["powerbank"] },
  { label: "Chuột & Phím", value: "MOUSE_KEYBOARD", tags: ["mouse", "keyboard"] },
];

const Accessories = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { products, isLoading, error } = useProducts();

  const filteredAccessories = useMemo(() => {
    const accessories = products.filter(isAccessoryProduct);
    const currentFilter = accessoryFilters.find((item) => item.value === activeFilter);

    if (!currentFilter?.tags) return accessories.slice(0, 6);

    return accessories
      .filter((item) => hasAnyTag(item, currentFilter.tags))
      .slice(0, 6);
  }, [activeFilter, products]);

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

        <div className="flex flex-wrap gap-2 text-sm">
          {accessoryFilters.map((filter) => (
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
        ) : filteredAccessories.length > 0 ? (
          filteredAccessories.map((item) => {
            const productId = getProductId(item);

            return (
              <Link to={`/product/${productId}`} key={productId} className="block">
                <ProductCard product={item} />
              </Link>
            );
          })
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
