import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import {
  getProductCategory,
  getProductId,
  sortByPrice,
} from "../../utils/productUtils";

const categoryOptions = [
  { id: "smartphone", label: "Điện thoại" },
  { id: "laptop", label: "Laptop" },
  { id: "accessory", label: "Phụ kiện" },
];

const priceRanges = [
  { id: "under10", label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { id: "10to20", label: "Từ 10 - 20 triệu", min: 10000000, max: 20000000 },
  { id: "20to30", label: "Từ 20 - 30 triệu", min: 20000000, max: 30000000 },
  { id: "over30", label: "Trên 30 triệu", min: 30000000, max: 999999999 },
];

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  const { products, isLoading, error } = useProducts();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleCategoryChange = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((item) => item !== catId) : [...prev, catId],
    );
  };

  const handlePriceChange = (priceId) => {
    setSelectedPrices((prev) =>
      prev.includes(priceId)
        ? prev.filter((item) => item !== priceId)
        : [...prev, priceId],
    );
  };

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const filtered = products.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const brandName = item.brandName?.toLowerCase() || "";
      const matchKeyword =
        normalizedKeyword.length === 0 ||
        title.includes(normalizedKeyword) ||
        brandName.includes(normalizedKeyword);

      const itemCategory = getProductCategory(item);
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(itemCategory);

      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((priceId) => {
          const range = priceRanges.find((itemRange) => itemRange.id === priceId);
          return (item.price || 0) >= range.min && (item.price || 0) <= range.max;
        });

      return matchKeyword && matchCategory && matchPrice;
    });

    return sortByPrice(filtered, sortOrder);
  }, [keyword, products, selectedCategories, selectedPrices, sortOrder]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f6f8]">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-black mb-2">
            Kết quả tìm kiếm cho: <span className="text-[#ffc107]">"{keyword}"</span>
          </h1>
          <p className="text-gray-400">Tìm thấy {filteredProducts.length} sản phẩm phù hợp</p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-[14px]">Loại Sản Phẩm</h3>
              <div className="space-y-3">
                {categoryOptions.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="w-4 h-4 text-[#e30019] rounded-[3px] border-gray-300 focus:ring-[#e30019] cursor-pointer"
                    />
                    <span className="text-gray-600 group-hover:text-[#e30019] transition-colors text-[14px] font-medium">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-[14px]">Mức giá</h3>
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(range.id)}
                      onChange={() => handlePriceChange(range.id)}
                      className="w-4 h-4 text-[#e30019] rounded-[3px] border-gray-300 focus:ring-[#e30019] cursor-pointer"
                    />
                    <span className="text-gray-600 group-hover:text-[#e30019] transition-colors text-[14px] font-medium">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-[14px]">Sắp xếp</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortSearchPrice"
                    value="asc"
                    checked={sortOrder === "asc"}
                    onChange={() => setSortOrder("asc")}
                    className="w-4 h-4 text-[#e30019] border-gray-300 focus:ring-[#e30019] cursor-pointer"
                  />
                  <span className="text-gray-600 group-hover:text-[#e30019] transition-colors text-[14px] font-medium">Giá thấp đến cao</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortSearchPrice"
                    value="desc"
                    checked={sortOrder === "desc"}
                    onChange={() => setSortOrder("desc")}
                    className="w-4 h-4 text-[#e30019] border-gray-300 focus:ring-[#e30019] cursor-pointer"
                  />
                  <span className="text-gray-600 group-hover:text-[#e30019] transition-colors text-[14px] font-medium">Giá cao đến thấp</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-96 flex items-center justify-center text-gray-500">
              Đang tải kết quả tìm kiếm...
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-100 p-12 text-center h-96 flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((item) => {
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-gray-500">Thử kiểm tra lại lỗi chính tả hoặc dùng từ khóa chung chung hơn nhé.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedPrices([]);
                }}
                className="mt-6 px-6 py-2 bg-[#ffc107] text-gray-900 font-bold rounded-full hover:bg-[#e0a800] transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
