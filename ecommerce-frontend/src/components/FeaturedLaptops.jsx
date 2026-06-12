import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import { getProductId } from "../utils/productUtils";

const FeaturedLaptops = () => {
  const { products: laptops, isLoading, error } = useProducts("laptop");
  const visibleLaptops = laptops.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-gray-900 uppercase">
          Laptop Học Tập & Làm Việc Bán Chạy
        </h2>
        <span className="text-sm font-bold text-yellow-600 uppercase">
          Hỗ trợ trả góp 0%
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-full py-8 text-center text-gray-500">
              Đang tải sản phẩm...
            </div>
          ) : error ? (
            <div className="col-span-full py-8 text-center text-red-500">
              {error}
            </div>
          ) : visibleLaptops.length > 0 ? (
            visibleLaptops.map((item) => {
              const productId = getProductId(item);

              return (
                <Link to={`/product/${productId}`} key={productId} className="block">
                  <ProductCard product={item} />
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              Hiện chưa có laptop nào.
            </div>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden flex-1 group">
            <div className="z-10">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Campaign Week
              </span>
              <h3 className="text-white font-bold mt-2 text-lg">
                Tuần Lễ Laptop Gaming AI
              </h3>
              <p className="text-gray-400 text-[11px] mt-1 mb-4">
                Hỗ trợ tặng thẳng Combo chuột cơ, bàn rê trị giá 2.500.000đ dành
                cho mọi sinh viên CNTT khi đặt mua!
              </p>
              <button className="bg-yellow-400 text-gray-900 text-xs font-bold py-1.5 px-4 rounded-md transition-transform duration-300 hover:scale-105 shadow-sm">
                Xem Chi Tiết Ưu Đãi
              </button>
            </div>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://dlcdnwebimgs.asus.com/gain/3D4F5A2C-B2D1-4E6E-9E8D-6F8F39D5C4F6/w717/h525')",
              }}
            ></div>
          </div>

          <div className="bg-yellow-400 rounded-xl p-5 flex flex-col justify-center cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
            <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-1">
              Đặc Quyền VIP
            </span>
            <h3 className="text-gray-900 font-bold text-sm">
              Ưu Đãi Chủ Thẻ Tín Dụng VPBank
            </h3>
            <p className="text-gray-800 text-xs mt-1">
              Code: <span className="font-bold">VPBANK1M</span>
            </p>
            <p className="text-red-600 font-black text-lg mt-2">
              GIẢM NGAY 1.000.000đ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLaptops;
