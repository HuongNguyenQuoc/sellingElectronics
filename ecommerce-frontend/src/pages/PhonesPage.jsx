import { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Nhập Link từ react-router-dom
import { dummyAll } from "../data/mockData";

const PhonesPage = () => {
  const allPhones = useMemo(() => {
    return dummyAll.filter((item) => item.tags.includes("smartphone"));
  }, []);

  const availableBrands = useMemo(() => {
    const brands = allPhones.map((phone) => phone.brandName);
    return [...new Set(brands)];
  }, [allPhones]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const priceRanges = [
    { id: "under10", label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { id: "10to20", label: "Từ 10 - 20 triệu", min: 10000000, max: 20000000 },
    { id: "20to30", label: "Từ 20 - 30 triệu", min: 20000000, max: 30000000 },
    { id: "over30", label: "Trên 30 triệu", min: 30000000, max: 999999999 },
  ];

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (priceId) => {
    setSelectedPrices((prev) =>
      prev.includes(priceId) ? prev.filter((p) => p !== priceId) : [...prev, priceId]
    );
  };

  const filteredPhones = useMemo(() => {
    let result = allPhones.filter((phone) => {
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(phone.brandName);
      
      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((priceId) => {
          const range = priceRanges.find((r) => r.id === priceId);
          return phone.price >= range.min && phone.price <= range.max;
        });

      return matchBrand && matchPrice;
    });

    result.sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

    return result;
  }, [allPhones, selectedBrands, selectedPrices, sortOrder]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getOriginalPrice = (price, discountPercentage) => {
    if (!discountPercentage) return price;
    return price / (1 - discountPercentage / 100);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <div className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop')" }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
          <h1 className="text-5xl font-black mb-4">Điện thoại thông minh</h1>
          <p className="text-gray-300 max-w-xl text-lg">Khám phá các thiết bị di động với công nghệ tiên tiến nhất. Định hình lại giới hạn của một chiếc smartphone.</p>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Lọc */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            
            {/* THƯƠNG HIỆU */}
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

            {/* MỨC GIÁ */}
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

            {/* SẮP XẾP */}
            <div>
              <h3 className="font-bold text-[#002f4b] mb-4 uppercase tracking-wider text-[15px]">Sắp xếp</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortPrice"
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
                    name="sortPrice"
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

        {/* Lưới Sản phẩm */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả sản phẩm <span className="text-gray-400 text-base font-normal">({filteredPhones.length} thiết bị)</span>
            </h2>
          </div>

          {filteredPhones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhones.map((phone) => (
                <Link 
                  to={`/product/${phone.id}`} 
                  key={phone.id} 
                  className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative flex flex-col group cursor-pointer block"
                >
                  
                  {/* Badge % Giảm giá */}
                  {phone.discountPercentage > 0 && (
                    <div className="absolute top-0 right-0 bg-[#e30019] text-white text-[13px] font-bold px-3 py-1.5 rounded-bl-[16px] rounded-tr-[19px] z-10">
                      -{phone.discountPercentage}%
                    </div>
                  )}

                  {/* Ảnh sản phẩm */}
                  <div className="w-full aspect-square overflow-hidden flex items-center justify-center pt-2">
                    <img 
                      src={phone.thumbnail} 
                      alt={phone.title} 
                      className="object-contain w-[85%] h-[85%] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="mt-4 flex flex-col flex-grow text-left">
                    <span className="text-[12px] font-bold text-[#8f9bb3] uppercase tracking-wide">
                      {phone.brandName}
                    </span>
                    
                    <h3 className="text-[15px] font-semibold text-[#002f4b] mt-1 line-clamp-2 min-h-[44px]">
                      {phone.title}
                    </h3>
                    
                    {/* Đánh giá sao - ĐÃ ÁP DỤNG LOGIC ĐỔ ĐẦY THEO PHẦN TRĂM */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, index) => {
                          const fillPercent = Math.min(Math.max((phone.rating || 0) - index, 0), 1) * 100;
                          return (
                            <div key={index} className="relative w-3.5 h-3.5">
                              {/* Ngôi sao nền màu xám */}
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-0 left-0 w-3.5 h-3.5 text-gray-200">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                              </svg>
                              {/* Lớp phủ ngôi sao màu vàng */}
                              <div 
                                className="absolute top-0 left-0 overflow-hidden h-full" 
                                style={{ width: `${fillPercent}%` }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#ffc107]">
                                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-[13px] text-[#8f9bb3]">
                        ({phone.reviews?.length || 0})
                      </span>
                    </div>

                    <div className="mt-3 mb-4 flex flex-col">
                      {phone.discountPercentage > 0 ? (
                        <span className="text-[13px] text-[#8f9bb3] line-through font-medium">
                          {formatPrice(getOriginalPrice(phone.price, phone.discountPercentage))}
                        </span>
                      ) : (
                        <span className="h-[20px]"></span>
                      )}
                      
                      <span className="text-[20px] font-bold text-[#e30019]">
                        {formatPrice(phone.price)}
                      </span>
                    </div>

                    <button className="w-full mt-auto bg-[#ffc107] hover:bg-[#e0a800] text-[#002f4b] text-[15px] font-bold py-2.5 rounded-lg transition-colors">
                      MUA NGAY
                    </button>
                  </div>

                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-96 flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">🔍</span>
              <h3 className="text-xl font-bold text-gray-900">Không tìm thấy sản phẩm phù hợp</h3>
              <button 
                onClick={() => { setSelectedBrands([]); setSelectedPrices([]); }}
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

export default PhonesPage;