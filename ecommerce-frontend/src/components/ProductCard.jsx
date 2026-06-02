const ProductCard = ({ product }) => {
  // Tự động tính giá cũ vì trong data chuẩn Kotlin không còn trường oldPrice
  const oldPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 relative group hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
      {/* Badge Giảm giá màu đỏ góc trên phải */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl z-10">
          -{product.discountPercentage}%
        </div>
      )}

      {/* Khung chứa ảnh sản phẩm */}
      <div className="flex justify-center items-center h-48 mb-4 overflow-hidden relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Thông tin chi tiết */}
      <div className="flex flex-col flex-grow">
        {/* Tên hãng */}
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
          {product.brandName}
        </span>

        {/* Tên sản phẩm */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
          {product.title}
        </h3>

        {/* Đánh giá sao - ĐÃ ĐỔI SANG ĐỘ ĐỔ ĐỘNG THEO RATING */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              // Tính tỉ lệ lấp đầy của ngôi sao hiện tại (từ 0 đến 100%)
              const fillPercent = Math.min(Math.max(product.rating - index, 0), 1) * 100;
              return (
                <div key={index} className="relative w-3.5 h-3.5">
                  {/* Ngôi sao nền màu xám nhạt */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-0 left-0 w-3.5 h-3.5 text-gray-200">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  {/* Lớp phủ màu vàng được giới hạn chiều rộng chính xác theo fillPercent */}
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
          <span className="text-xs text-gray-400 ml-1">
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Giá tiền */}
        <div className="mt-auto mb-4">
          {oldPrice && (
            <p className="text-xs text-gray-400 line-through mb-0.5">
              {oldPrice.toLocaleString("vi-VN")}đ
            </p>
          )}
          <p className="text-red-600 font-bold text-lg">
            {product.price.toLocaleString("vi-VN")}đ
          </p>
        </div>

        {/* Nút Mua Ngay */}
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-lg text-sm transition-colors">
          MUA NGAY
        </button>
      </div>
    </div>
  );
};

export default ProductCard;