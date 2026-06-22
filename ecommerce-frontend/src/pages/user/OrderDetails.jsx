import { Link, useParams, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import api from '../../api/axiosConfig'
import { getProductId } from "../../utils/productUtils";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/orders/${id}`);

      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f4f6f8] flex items-center justify-center font-sans">
        <p className="text-gray-500 font-medium">Đang tải đơn hàng...</p>
      </div>
    );
  }

  // Nếu không tìm thấy đơn hàng
  if (!order) {
    return (
      <div className="min-h-[70vh] bg-[#f4f6f8] flex flex-col items-center justify-center font-sans">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-gray-500 mb-6">Đơn hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button onClick={() => navigate("/orders")} className="px-6 py-2.5 bg-[#e30019] text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm">
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }


  // Cấu hình Timeline Trạng thái
  const STEPS = [
    { key: "PLACED", label: "Đã đặt hàng" },
    { key: "PROCESSING", label: "Đang xử lý" },
    { key: "SHIPPED", label: "Đang giao hàng" },
    { key: "DELIVERED", label: "Giao thành công" }
  ];

  // Xác định bước hiện tại
  let currentStepIndex = 0;
  if (order.status === "PROCESSING") currentStepIndex = 1;
  if (order.status === "SHIPPED") currentStepIndex = 2;
  if (order.status === "DELIVERED") currentStepIndex = 3;

  const isCancelled = order.status === "CANCELLED";

  // Định dạng thời gian
  const formattedOrderDate = new Date(order.createdAt).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-24 pt-8 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nút Quay lại & Tiêu đề */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <button 
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#e30019] transition-colors font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            TRỞ LẠI
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng:</span>
            <span className="text-lg font-bold text-gray-900 uppercase">{order._id}</span>
            <span className="text-gray-300">|</span>
            <span className={`text-sm font-bold uppercase tracking-wide ${isCancelled ? "text-red-600" : "text-[#e30019]"}`}>
              {isCancelled ? "Đã hủy" : STEPS[currentStepIndex].label}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* KHỐI 1: TIMELINE TRẠNG THÁI (Chỉ hiện nếu không bị hủy) */}
          {!isCancelled ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto mt-4">
                {/* Thanh ngang nền */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                {/* Thanh ngang tiến độ */}
                <div 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#e30019] rounded-full z-0 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                ></div>

                {/* Các mốc thời gian */}
                {STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                        isCompleted ? "bg-[#e30019] border-red-100 text-white" : "bg-gray-200 border-white text-gray-400"
                      }`}>
                        {isCompleted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium absolute top-10 whitespace-nowrap ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-14 text-center text-sm font-medium text-gray-500">
                Thời gian đặt hàng: {formattedOrderDate}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-700">Đơn hàng đã bị hủy</h3>
                  <p className="text-sm text-red-600/80 mt-0.5">Nếu bạn đã thanh toán, tiền sẽ được hoàn lại trong vòng 3-5 ngày làm việc.</p>
                </div>
              </div>
              <div className="text-sm font-medium text-red-600/80 bg-red-100/50 px-3 py-1.5 rounded-lg border border-red-100">
                Thời gian đặt: {formattedOrderDate}
              </div>
            </div>
          )}

          {/* KHỐI 2 & 3: ĐỊA CHỈ VÀ THANH TOÁN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Địa chỉ nhận hàng */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Địa chỉ nhận hàng
              </h3>
              <div className="space-y-1.5 pl-7">
                <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                Phương thức thanh toán
              </h3>
              <div className="pl-7 space-y-2">
                <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
                <p className="text-xs text-gray-500">Thanh toán khi nhận hàng (Nếu là COD) hoặc đã thanh toán qua thẻ.</p>
              </div>
            </div>
          </div>

          {/* KHỐI 4: DANH SÁCH SẢN PHẨM & TỔNG TIỀN */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Danh sách Item */}
            <div className="p-6 space-y-6">
              {order.items.map((item, index) => {
                const productId = getProductId(item.product);
                const productImage = (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                );

                return (
                  <div key={index} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    {productId ? (
                      <Link to={`/product/${productId}`} className="w-20 h-20 bg-white border border-gray-200 rounded-lg p-1.5 flex-shrink-0 hover:border-gray-300 transition-colors">
                        {productImage}
                      </Link>
                    ) : (
                      <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg p-1.5 flex-shrink-0">
                        {productImage}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {productId ? (
                        <Link to={`/product/${productId}`} className="text-[15px] font-semibold text-gray-900 hover:text-[#e30019] line-clamp-2 transition-colors">
                          {item.name}
                        </Link>
                      ) : (
                        <span className="text-[15px] font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </span>
                      )}
                      <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-gray-500">
                        <span>Phân loại: {item.colorSelected}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="text-[15px] font-semibold text-gray-900 sm:text-right w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chi tiết tính tiền */}
            <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex justify-end">
              <div className="w-full sm:w-80 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng tiền hàng</span>
                  <span className="font-medium text-gray-900">{order.totalCost.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-200">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-gray-900">Thành tiền</span>
                  <span className="text-2xl font-bold text-[#e30019]">{order.totalCost.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
