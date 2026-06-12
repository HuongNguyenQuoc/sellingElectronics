import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import { getProductId } from "../utils/productUtils";

const Recommendations = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { products, isLoading, error } = useProducts();

  const recommendedProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [products]);

  const displayedProducts = isExpanded
    ? recommendedProducts
    : recommendedProducts.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#f8f9fa] rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-2">
            GỢI Ý RIÊNG Dành Cho Bạn
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Dựa trên lịch sử xem hàng, thói quen và cấu hình yêu thích của riêng
            bạn
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-500">
          {isLoading ? (
            <div className="col-span-full py-8 text-center text-gray-500">
              Đang tải sản phẩm gợi ý...
            </div>
          ) : error ? (
            <div className="col-span-full py-8 text-center text-red-500">
              {error}
            </div>
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((item) => {
              const productId = getProductId(item);

              return (
                <Link to={`/product/${productId}`} key={productId} className="block">
                  <ProductCard product={item} />
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              Hiện chưa có sản phẩm gợi ý.
            </div>
          )}
        </div>

        {recommendedProducts.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
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
