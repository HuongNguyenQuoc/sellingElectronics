import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { dummyAll } from "../data/mockData";

const SearchPage = () => {
  // Lấy từ khóa từ URL (VD: /search?keyword=iphone)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  // Các tùy chọn bộ lọc
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

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleCategoryChange = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handlePriceChange = (priceId) => {
    setSelectedPrices((prev) =>
      prev.includes(priceId) ? prev.filter((p) => p !== priceId) : [...prev, priceId]
    );
  };

  // Logic lọc và tìm kiếm cực mạnh
  const filteredProducts = useMemo(() => {
    let result = dummyAll.filter((item) => {
      // 1. Lọc theo từ khóa (khớp tên hoặc tên hãng)
      const matchKeyword = 
        item.title.toLowerCase().includes(keyword.toLowerCase()) || 
        item.brandName.toLowerCase().includes(keyword.toLowerCase());

      // 2. Lọc theo loại sản phẩm
      // Quy ước: nếu tag chứa 'smartphone' -> Điện thoại, 'laptop' -> Laptop, còn lại -> Phụ kiện
      let itemCategory = "accessory";
      if (item.tags.includes("smartphone")) itemCategory = "smartphone";
      else if (item.tags.includes("laptop")) itemCategory = "laptop";

      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(itemCategory);
      
      // 3. Lọc theo mức giá
      const matchPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((priceId) => {
          const range = priceRanges.find((r) => r.id === priceId);
          return item.price >= range.min && item.price <= range.max;
        });

      return matchKeyword && matchCategory && matchPrice;
    });

    // 4. Sắp xếp
    result.sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

    return result;
  }, [keyword, selectedCategories, selectedPrices, sortOrder]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getOriginalPrice = (price, discountPercentage) => {
    if (!discountPercentage) return price;
    return price / (1 - discountPercentage / 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f6f8]">
      {/* Hero Banner Minimalist */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-black mb-2">
            Kết quả tìm kiếm cho: <span className="text-[#ffc107]">"{keyword}"</span>
          </h1>
          <p className="text-gray-400">Tìm thấy {filteredProducts.length} sản phẩm phù hợp</p>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Lọc */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            
            {/* LOẠI SẢN PHẨM */}
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

            {/* MỨC GIÁ */}
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

            {/* SẮP XẾP */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-[14px]">Sắp xếp</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortPrice"
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
                    name="sortPrice"
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

        {/* Lưới Sản phẩm */}
        <main className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((item) => (
                <Link 
                  to={`/product/${item.id}`} 
                  key={item.id} 
                  className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative flex flex-col group cursor-pointer block"
                >
                  
                  {/* Badge % Giảm giá */}
                  {item.discountPercentage > 0 && (
                    <div className="absolute top-0 right-0 bg-[#e30019] text-white text-[13px] font-bold px-3 py-1.5 rounded-bl-[16px] rounded-tr-[19px] z-10">
                      -{item.discountPercentage}%
                    </div>
                  )}

                  {/* Ảnh sản phẩm */}
                  <div className="w-full aspect-square overflow-hidden flex items-center justify-center pt-2">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="object-contain w-[85%] h-[85%] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="mt-4 flex flex-col flex-grow text-left">
                    <span className="text-[12px] font-bold text-[#8f9bb3] uppercase tracking-wide">
                      {item.brandName}
                    </span>
                    
                    <h3 className="text-[15px] font-semibold text-[#002f4b] mt-1 line-clamp-2 min-h-[44px]">
                      {item.title}
                    </h3>
                    
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
                        ({item.reviews?.length || 0})
                      </span>
                    </div>

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
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-96 flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">🔍</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-gray-500">Thử kiểm tra lại lỗi chính tả hoặc dùng từ khóa chung chung hơn nhé.</p>
              <button 
                onClick={() => { setSelectedCategories([]); setSelectedPrices([]); }}
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