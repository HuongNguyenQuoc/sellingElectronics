import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import {
  getProductId,
  getUniqueBrands,
  isAccessoryProduct,
  sortByPrice,
} from "../../utils/productUtils";

const priceRanges = [
  { id: "under1", label: "Dưới 1 triệu", min: 0, max: 1000000 },
  { id: "1to3", label: "Từ 1 - 3 triệu", min: 1000000, max: 3000000 },
  { id: "3to5", label: "Từ 3 - 5 triệu", min: 3000000, max: 5000000 },
  { id: "over5", label: "Trên 5 triệu", min: 5000000, max: 999999999 },
];

const AccessoriesPage = () => {
  const { products, isLoading, error } = useProducts();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const allAccessories = useMemo(() => {
    return products.filter(isAccessoryProduct);
  }, [products]);

  const availableBrands = useMemo(() => getUniqueBrands(allAccessories), [allAccessories]);

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

  const filteredAccessories = useMemo(() => {
    const filtered = allAccessories.filter((item) => {
      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(item.brandName);
      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((priceId) => {
          const range = priceRanges.find((priceRange) => priceRange.id === priceId);
          return (item.price || 0) >= range.min && (item.price || 0) <= range.max;
        });

      return matchBrand && matchPrice;
    });

    return sortByPrice(filtered, sortOrder);
  }, [allAccessories, selectedBrands, selectedPrices, sortOrder]);

  return (
    <div className="flex flex-col">
      <div className="relative w-full h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542903660-eedba2cda473?q=80&w=2070&auto=format&fit=crop')",
            backgroundPosition: "center 80%",
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <h1 className="text-5xl font-black text-white mb-4">
            Phụ kiện công nghệ
          </h1>
          <p className="text-gray-100 max-w-xl text-lg font-medium">
            Bổ trợ hoàn hảo cho hệ sinh thái thiết bị của bạn với các món phụ
            kiện tinh tế.
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-[#002f4b] mb-4 uppercase text-[15px]">
              Thương hiệu
            </h3>
            <div className="space-y-3 mb-8">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="w-4 h-4 text-[#007bff] rounded-[3px] border-gray-300 cursor-pointer"
                  />
                  <span className="text-[#4a5568] text-[14px] uppercase">
                    {brand}
                  </span>
                </label>
              ))}
            </div>

            <h3 className="font-bold text-[#002f4b] mb-4 uppercase text-[15px]">
              Mức giá
            </h3>
            <div className="space-y-3 mb-8">
              {priceRanges.map((range) => (
                <label
                  key={range.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPrices.includes(range.id)}
                    onChange={() => handlePriceChange(range.id)}
                    className="w-4 h-4 text-[#007bff] rounded-[3px] border-gray-300 cursor-pointer"
                  />
                  <span className="text-[#4a5568] text-[14px]">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>

            <h3 className="font-bold text-[#002f4b] mb-4 uppercase text-[15px]">
              Sắp xếp
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sortAccessoryPrice"
                  checked={sortOrder === "asc"}
                  onChange={() => setSortOrder("asc")}
                  className="w-4 h-4 text-[#007bff] cursor-pointer"
                />
                <span className="text-[#4a5568] text-[14px]">
                  Giá thấp đến cao
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sortAccessoryPrice"
                  checked={sortOrder === "desc"}
                  onChange={() => setSortOrder("desc")}
                  className="w-4 h-4 text-[#007bff] cursor-pointer"
                />
                <span className="text-[#4a5568] text-[14px]">
                  Giá cao đến thấp
                </span>
              </label>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tất cả sản phẩm{" "}
            <span className="text-gray-400 text-base font-normal">
              ({filteredAccessories.length} thiết bị)
            </span>
          </h2>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-96 flex items-center justify-center text-gray-500">
              Đang tải sản phẩm...
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-100 p-12 text-center h-96 flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : filteredAccessories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredAccessories.map((item) => {
                const productId = getProductId(item);

                return (
                  <Link to={`/product/${productId}`} key={productId} className="block">
                    <ProductCard product={item} />
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

export default AccessoriesPage;
