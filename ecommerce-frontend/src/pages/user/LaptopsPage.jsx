import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import {
  getProductId,
  getUniqueBrands,
  sortByPrice,
} from "../../utils/productUtils";

const priceRanges = [
  { id: "under10", label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { id: "10to20", label: "Từ 10 - 20 triệu", min: 10000000, max: 20000000 },
  { id: "20to30", label: "Từ 20 - 30 triệu", min: 20000000, max: 30000000 },
  { id: "over30", label: "Trên 30 triệu", min: 30000000, max: 999999999 },
];

const LaptopsPage = () => {
  const { products: allLaptops, isLoading, error } = useProducts("laptop");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const availableBrands = useMemo(() => getUniqueBrands(allLaptops), [allLaptops]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand],
    );
  };

  const handlePriceChange = (priceId) => {
    setSelectedPrices((prev) =>
      prev.includes(priceId)
        ? prev.filter((item) => item !== priceId)
        : [...prev, priceId],
    );
  };

  const filteredLaptops = useMemo(() => {
    const filtered = allLaptops.filter((laptop) => {
      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(laptop.brandName);
      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((priceId) => {
          const range = priceRanges.find((item) => item.id === priceId);
          return (laptop.price || 0) >= range.min && (laptop.price || 0) <= range.max;
        });

      return matchBrand && matchPrice;
    });

    return sortByPrice(filtered, sortOrder);
  }, [allLaptops, selectedBrands, selectedPrices, sortOrder]);

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-[center_30%] bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026&auto=format&fit=crop')" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
          <h1 className="text-5xl font-black mb-4">Laptop & MacBook</h1>
          <p className="text-gray-300 max-w-xl text-lg">
            Nâng tầm hiệu suất làm việc và giải trí với các dòng máy tính xách tay cấu hình khủng, thiết kế mỏng nhẹ hàng đầu.
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="mb-8">
              <h3 className="font-bold text-[#002f4b] mb-4 uppercase tracking-wider text-[15px]">Thương hiệu</h3>
              <div className="space-y-3">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="w-4 h-4 text-[#007bff] rounded-[3px] border-gray-300 focus:ring-[#007bff] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-[#4a5568] group-hover:text-gray-900 transition-colors text-[14px] uppercase">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-[#002f4b] mb-4 uppercase tracking-wider text-[15px]">Mức giá</h3>
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(range.id)}
                      onChange={() => handlePriceChange(range.id)}
                      className="w-4 h-4 text-[#007bff] rounded-[3px] border-gray-300 focus:ring-[#007bff] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-[#4a5568] group-hover:text-gray-900 transition-colors text-[14px]">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#002f4b] mb-4 uppercase tracking-wider text-[15px]">Sắp xếp</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortLaptopPrice"
                    value="asc"
                    checked={sortOrder === "asc"}
                    onChange={() => setSortOrder("asc")}
                    className="w-4 h-4 text-[#007bff] border-gray-300 focus:ring-[#007bff] cursor-pointer"
                  />
                  <span className="text-[#4a5568] group-hover:text-gray-900 transition-colors text-[14px]">Giá thấp đến cao</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortLaptopPrice"
                    value="desc"
                    checked={sortOrder === "desc"}
                    onChange={() => setSortOrder("desc")}
                    className="w-4 h-4 text-[#007bff] border-gray-300 focus:ring-[#007bff] cursor-pointer"
                  />
                  <span className="text-[#4a5568] group-hover:text-gray-900 transition-colors text-[14px]">Giá cao đến thấp</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả Laptop <span className="text-gray-400 text-base font-normal">({filteredLaptops.length} thiết bị)</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-96 flex items-center justify-center text-gray-500">
              Đang tải sản phẩm...
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-100 p-12 text-center h-96 flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : filteredLaptops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLaptops.map((laptop) => {
                const productId = getProductId(laptop);

                return (
                  <Link to={`/product/${productId}`} key={productId} className="block">
                    <ProductCard product={laptop} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-96 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-gray-900">Không tìm thấy sản phẩm phù hợp</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedPrices([]);
                }}
                className="mt-6 px-6 py-2 bg-[#ffc107] text-gray-900 font-bold rounded-full hover:bg-[#e0a800] transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LaptopsPage;
