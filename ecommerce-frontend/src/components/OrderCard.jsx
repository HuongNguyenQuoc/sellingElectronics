const OrderCard = ({ checkoutItems = [], totalAmount = 0 }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm max-w-[280px] text-left">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-3.5 h-3.5 text-green-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Đơn hàng của bạn gồm có:
      </div>

      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
        {checkoutItems.map((item, index) => (
          <div
            key={index}
            className="flex gap-2.5 items-start pb-2.5 border-b border-gray-50 last:border-0 last:pb-0"
          >
            <div className="w-12 h-12 border border-gray-100 rounded-lg p-1 bg-white flex-shrink-0 flex items-center justify-center">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-gray-900 line-clamp-1 leading-tight">
                {item.title}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">
                Phân loại: {item.colorSelected || "Mặc định"}
              </span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[11px] text-gray-500 font-medium">
                  Số lượng: {item.quantity}
                </span>
                <span className="text-xs font-bold text-gray-950">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-dashed border-gray-200 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-500 uppercase">
          Tổng thanh toán
        </span>
        <span className="text-sm font-black text-[#e30019]">
          {formatPrice(totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
