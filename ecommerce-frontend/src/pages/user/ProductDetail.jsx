import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { dummyAll } from "../../data/mockData";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = dummyAll.find((item) => item.id === id);

  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0] || product.thumbnail);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-black text-black mb-4">Sản phẩm không tồn tại</h2>
        <Link to="/" className="px-6 py-2 bg-[#ffc107] text-black font-bold rounded-lg hover:bg-yellow-500">
          Về Trang Chủ
        </Link>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "đ";
  const originalPrice = product.discountPercentage 
    ? product.price / (1 - product.discountPercentage / 100) 
    : product.price;

  // ==== LOGIC TỒN KHO THEO MÀU SẮC ====
  // 1. Tìm vị trí của màu đang chọn trong mảng colors
  const colorIndex = product.colors?.indexOf(selectedColor) !== -1 ? product.colors?.indexOf(selectedColor) : 0;
  
  // 2. Lấy số lượng tồn kho tương ứng. (Hỗ trợ cả trường hợp stock là mảng hoặc số đơn lẻ cũ)
  const currentStock = Array.isArray(product.stock) ? (product.stock[colorIndex] || 0) : (product.stock || 0);

  const handleQuantityChange = (type) => {
    if (type === "minus" && quantity > 1) setQuantity(quantity - 1);
    // 3. Giới hạn số lượng tăng lên không được vượt quá tồn kho của màu hiện tại
    if (type === "plus" && quantity < currentStock) setQuantity(quantity + 1);
  };

  const handleBuyNow = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Vui lòng chọn màu sắc trước khi đặt hàng!");
      return;
    }

    // 4. Kiểm tra trước khi mua
    if (quantity > currentStock) {
      alert(`Số lượng sản phẩm trong kho không đủ! Chỉ còn ${currentStock} sản phẩm.`);
      return;
    }

    const itemToBuy = {
      ...product, 
      product: product.id, 
      quantity: quantity,
      colorSelected: selectedColor || "Mặc định"
    };

    const totalAmount = product.price * quantity;

    navigate('/checkout', { 
      state: { 
        checkoutItems: [itemToBuy], 
        totalAmount: totalAmount,
        isBuyNow: true 
      } 
    });
  };

  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Vui lòng chọn màu sắc trước khi thêm vào giỏ!");
      return;
    }

    // 4. Kiểm tra trước khi thêm giỏ hàng
    if (quantity > currentStock) {
      alert(`Số lượng sản phẩm trong kho không đủ! Chỉ còn ${currentStock} sản phẩm.`);
      return;
    }

    alert("Đã thêm vào giỏ hàng thành công! (Logic gọi API thêm giỏ hàng sẽ nằm ở đây)");
  };

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-12 pt-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:p-8 flex flex-col md:flex-row gap-10">
          
          {/* CỘT TRÁI: Khu vực Hình ảnh */}
          <div className="w-full md:w-5/12 flex flex-col gap-4">
            <div className="w-full aspect-square border-2 border-gray-100 rounded-2xl flex items-center justify-center p-4 relative bg-white">
              {product.discountPercentage > 0 && (
                <div className="absolute top-0 right-0 bg-[#e30019] text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl z-10 shadow-sm">
                  -{product.discountPercentage}%
                </div>
              )}
              <img src={mainImage} alt={product.title} className="w-[90%] h-[90%] object-contain" />
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <div 
                  key={index} 
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-xl p-1 cursor-pointer flex-shrink-0 transition-all border-2 ${
                    mainImage === img ? "border-[#e30019] shadow-sm" : "border-gray-100 hover:border-[#ffc107]"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin Sản phẩm */}
          <div className="w-full md:w-7/12 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#ffc107] text-black text-[11px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                Chính Hãng
              </span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{product.brandName}</span>
            </div>
            
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 leading-snug mb-3">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg font-bold text-[#e30019]">{product.rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const fillPercent = Math.min(Math.max(product.rating - index, 0), 1) * 100;
                  return (
                    <div key={index} className="relative w-5 h-5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-0 left-0 w-5 h-5 text-gray-200">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute top-0 left-0 overflow-hidden h-full" style={{ width: `${fillPercent}%` }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#ffc107]">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              {product.discountPercentage > 0 && (
                <span className="text-gray-400 line-through text-sm font-medium block mb-0.5">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <div className="text-2xl font-bold text-[#e30019] tracking-tight">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Lựa chọn Biến thể (Màu sắc) */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <span className="block text-sm font-semibold text-gray-800 mb-3">Màu sắc</span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setQuantity(1); // 5. Tự động reset số lượng về 1 khi người dùng đổi màu
                      }}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${
                        selectedColor === color 
                          ? "border-[#e30019] text-[#e30019] bg-red-50" 
                          : "border-gray-300 text-gray-600 hover:border-[#e30019] hover:text-[#e30019]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {/* 6. UI HIỂN THỊ SỐ LƯỢNG SẴN CÓ */}
                <div className="mt-3 text-sm text-gray-600">
                   Số lượng sẵn có: <span className="mt-3 text-sm text-gray-600">{currentStock}</span>
                </div>
              </div>
            )}

            {/* Chọn Số lượng */}
            <div className="mb-10">
              <span className="block text-sm font-semibold text-gray-800 mb-3">Số lượng</span>
              <div className="inline-flex items-center bg-white rounded-md border border-gray-300">
                <button 
                  onClick={() => handleQuantityChange("minus")}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg transition-colors"
                >
                  -
                </button>
                <input 
                  type="text" 
                  readOnly
                  value={quantity}
                  className="w-12 h-10 text-center font-normal text-base bg-transparent focus:outline-none text-gray-800"
                />
                <button 
                  onClick={() => handleQuantityChange("plus")}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Các Nút Hành Động */}
            <div className="flex gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-red-50 hover:bg-red-100 text-[#e30019] border border-[#e30019] font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-base shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                Thêm Vào Giỏ
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-[#e30019] hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 text-base shadow-md"
              >
                Mua Ngay
              </button>
            </div>

            <div className="mt-8 flex gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#e30019]"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                Freeship Toàn Quốc
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#ffc107]"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                {product.warrantyInformation}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Khung Thông số kỹ thuật chi tiết */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase border-l-4 border-[#e30019] pl-3">Mô tả sản phẩm</h2>
            <div className="text-gray-700 leading-relaxed font-medium">
              <p className="mb-4">{product.description}</p>
              <p>Sản phẩm {product.title} mang lại trải nghiệm đột phá và hiệu năng vượt trội. Thiết kế tối ưu hóa công năng và độ bền bỉ trong quá trình sử dụng.</p>
            </div>
          </div>
          
          <div className="bg-black p-8 rounded-2xl shadow-xl text-white">
            <h2 className="text-lg font-bold text-[#ffc107] mb-6 uppercase border-l-4 border-[#ffc107] pl-3">Thông số kỹ thuật</h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400 font-medium">Thương hiệu</span>
                <span className="font-semibold uppercase">{product.brandName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400 font-medium">Kích thước</span>
                <span className="font-semibold">{product.dimensions?.first} x {product.dimensions?.second}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400 font-medium">Trọng lượng</span>
                <span className="font-semibold">{product.weight}g</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-400 font-medium">Bảo hành</span>
                <span className="font-semibold text-[#e30019]">{product.warrantyInformation}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProductDetail;