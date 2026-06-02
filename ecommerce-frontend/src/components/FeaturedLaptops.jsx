import { Link } from "react-router-dom"; // 1. IMPORT THÊM LINK TẠI ĐÂY
import ProductCard from "./ProductCard";
import { dummyLaptops } from "../data/mockData";

const FeaturedLaptops = () => {
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

      {/* Grid chia 5 cột (Màn hình lớn): 4 sản phẩm + 1 cột Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Khối danh sách sản phẩm (Chiếm 4 cột) */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dummyLaptops.map((item) => (
            /* 2. BỌC LINK RA BÊN NGOÀI PRODUCT CARD */
            <Link 
              to={`/product/${item.id}`} 
              key={item.id} 
              className="block" // Thêm block để vùng bấm bao trọn thẻ
            >
              <ProductCard product={item} />
            </Link>
          ))}
        </div>

        {/* Khối Banner Quảng Cáo (Chiếm 1 cột cuối) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Banner 1: Hình ảnh */}
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
              {/* NÚT BẤM ĐÃ BỎ ĐỔI MÀU, CHỈ GIỮ LẠI HIỆU ỨNG PHÓNG TO */}
              <button className="bg-yellow-400 text-gray-900 text-xs font-bold py-1.5 px-4 rounded-md transition-transform duration-300 hover:scale-105 shadow-sm">
                Xem Chi Tiết Ưu Đãi
              </button>
            </div>
            {/* Ảnh mờ làm nền */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://dlcdnwebimgs.asus.com/gain/3D4F5A2C-B2D1-4E6E-9E8D-6F8F39D5C4F6/w717/h525')",
              }}
            ></div>
          </div>

          {/* Banner 2: Code VIP nền vàng */}
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