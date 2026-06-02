import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { dummyAll } from "../data/mockData";

const AccessoriesPage = () => {
  const allAccessories = useMemo(() => {
    return dummyAll.filter((item) => 
      item.tags.includes("headphone") || 
      item.tags.includes("mouse") || 
      item.tags.includes("keyboard") || 
      item.tags.includes("powerbank") || 
      item.tags.includes("webcam") ||
      item.tags.includes("smartwatch")
    );
  }, []);

  const availableBrands = useMemo(() => {
    const brands = allAccessories.map((item) => item.brandName);
    return [...new Set(brands)];
  }, [allAccessories]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  // CẬP NHẬT MỐC GIÁ CHO PHỤ KIỆN
  const priceRanges = [
    { id: "under1", label: "Dưới 1 triệu", min: 0, max: 1000000 },
    { id: "1to3", label: "Từ 1 - 3 triệu", min: 1000000, max: 3000000 },
    { id: "3to5", label: "Từ 3 - 5 triệu", min: 3000000, max: 5000000 },
    { id: "over5", label: "Trên 5 triệu", min: 5000000, max: 999999999 },
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

  const filteredAccessories = useMemo(() => {
    let result = allAccessories.filter((item) => {
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brandName);
      const matchPrice = selectedPrices.length === 0 || selectedPrices.some((priceId) => {
        const range = priceRanges.find((r) => r.id === priceId);
        return item.price >= range.min && item.price <= range.max;
      });
      return matchBrand && matchPrice;
    });

    result.sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));
    return result;
  }, [allAccessories, selectedBrands, selectedPrices, sortOrder]);

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "đ";

  // Hàm tính giá cũ như các trang khác
  const getOriginalPrice = (price, discountPercentage) => {
    if (!discountPercentage) return price;
    return price / (1 - discountPercentage / 100);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Banner: Minimalist Desk Setup */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542903660-eedba2cda473?q=80&w=2070&auto=format&fit=crop')",
            backgroundPosition: "center 80%" 
          }}
        ></div>
        
        {/* Lớp phủ Gradient để chữ nổi bật mà ảnh vẫn sáng */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <h1 className="text-5xl font-black text-white mb-4">Phụ kiện công nghệ</h1>
          <p className="text-gray-100 max-w-xl text-lg font-medium">Bổ trợ hoàn hảo cho hệ sinh thái thiết bị của bạn với các món phụ kiện tinh tế.</p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-[#002f4b] mb-4 uppercase text-[15px]">Thương hiệu</h3>
            <div className="space-y-3 mb-8">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} className="w-4 h-4 text-[#007bff] rounded-[3px] border-gray-300 cursor-pointer" />
                  <span className="text-[#4a5568] text-[14px] uppercase">{brand}</span>
                </label>
              ))}
            </div>
            
            <h3 className="font-bold text-[#002f4b] mb-4 uppercase text-[15px]">Mức giá</h3>
            <div className="space-y-3 mb-8">
              {priceRanges.map((range) => (
                <label key={range.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={selectedPrices.includes(range.id)} onChange={() => handlePriceChange(range.id)} className="w-4 h-4 text-[#007bff] rounded-[3px] border-gray-300 cursor-pointer" />
                  <span className="text-[#4a5568] text-[14px]">{range.label}</span>
                </label>
              ))}
            </div>

            <h3 className="font-bold text-[#002f4b] mb-4 uppercase text-[15px]">Sắp xếp</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="sort" checked={sortOrder === "asc"} onChange={() => setSortOrder("asc")} className="w-4 h-4 text-[#007bff] cursor-pointer" />
                <span className="text-[#4a5568] text-[14px]">Giá thấp đến cao</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="sort" checked={sortOrder === "desc"} onChange={() => setSortOrder("desc")} className="w-4 h-4 text-[#007bff] cursor-pointer" />
                <span className="text-[#4a5568] text-[14px]">Giá cao đến thấp</span>
              </label>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tất cả sản phẩm <span className="text-gray-400 text-base font-normal">({filteredAccessories.length} thiết bị)</span></h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAccessories.map((item) => (
              <Link 
                to={`/product/${item.id}`}
                key={item.id} 
                className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-all relative flex flex-col group cursor-pointer block"
              >
                {/* Badge % Giảm giá */}
                {item.discountPercentage > 0 && (
                  <div className="absolute top-0 right-0 bg-[#e30019] text-white text-[13px] font-bold px-3 py-1.5 rounded-bl-[16px] rounded-tr-[19px] z-10">
                    -{item.discountPercentage}%
                  </div>
                )}

                <div className="w-full aspect-square overflow-hidden flex items-center justify-center pt-2">
                  <img src={item.thumbnail} alt={item.title} className="object-contain w-[85%] h-[85%] group-hover:scale-105 transition-transform" />
                </div>
                
                <div className="mt-4 flex flex-col flex-grow text-left">
                  <span className="text-[12px] font-bold text-[#8f9bb3] uppercase tracking-wide">{item.brandName}</span>
                  <h3 className="text-[15px] font-semibold text-[#002f4b] mt-1 line-clamp-2 min-h-[44px]">{item.title}</h3>
                  
                  {/* Đánh giá sao động */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => {
                        const fillPercent = Math.min(Math.max((item.rating || 0) - index, 0), 1) * 100;
                        return (
                          <div key={index} className="relative w-3.5 h-3.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-0 left-0 w-3.5 h-3.5 text-gray-200">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                            <div className="absolute top-0 left-0 overflow-hidden h-full" style={{ width: `${fillPercent}%` }}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#ffc107]">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-[13px] text-[#8f9bb3]">
                      ({item.reviews?.length || 0})
                    </span>
                  </div>

                  {/* Giá tiền và Giá gốc */}
                  <div className="mt-3 mb-4 flex flex-col">
                    {item.discountPercentage > 0 ? (
                      <span className="text-[13px] text-[#8f9bb3] line-through font-medium">
                        {formatPrice(getOriginalPrice(item.price, item.discountPercentage))}
                      </span>
                    ) : (
                      <span className="h-[20px]"></span>
                    )}
                    <span className="text-[20px] font-bold text-[#e30019]">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <button className="w-full mt-auto bg-[#ffc107] hover:bg-[#e0a800] text-[#002f4b] text-[15px] font-bold py-2.5 rounded-lg transition-colors">
                    MUA NGAY
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccessoriesPage;