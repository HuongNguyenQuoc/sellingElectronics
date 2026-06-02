const ProductCard = ({ product }) => {
  // Tự động tính giá cũ vì trong data chuẩn Kotlin không còn trường oldPrice
  const oldPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 relative group hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
      {/* Badge Giảm giá màu đỏ góc trên phải (Đã sửa biến) */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl z-10">
          -{product.discountPercentage}%
        </div>
      )}

      {/* Khung chứa ảnh sản phẩm (Đã sửa biến thumbnail và title) */}
      <div className="flex justify-center items-center h-48 mb-4 overflow-hidden relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Thông tin chi tiết */}
      <div className="flex flex-col flex-grow">
        {/* Tên hãng (Đã sửa biến brandName) */}
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
          {product.brandName}
        </span>

        {/* Tên sản phẩm (Đã sửa biến title) */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
          {product.title}
        </h3>

        {/* Đánh giá sao (Đã lấy .length của mảng reviews) */}
        <div className="flex items-center gap-1 mb-3">
          <div className="text-yellow-400 text-xs">★★★★★</div>
          <span className="text-xs text-gray-400">
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Giá tiền (Dùng biến oldPrice tự tính) */}
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
