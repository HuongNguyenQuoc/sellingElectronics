import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import axios from 'axios'
import api from '../../api/axiosConfig'

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Gộp chung lại 1 dòng cho chuẩn xác: lấy dữ liệu và hứng luôn cờ isBuyNow
  const { checkoutItems = [], totalAmount = 0, isBuyNow = false } = location.state || {};

  // State quản lý Form
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "đ";

  // Hàm xử lý khi gõ vào input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu gõ lại
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Hàm xử lý Đặt hàng
  const handleOrder = async() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên người nhận";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ giao hàng chi tiết";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await api.post("/orders", {
      items: checkoutItems.map((item) => ({
        productId: item.productId,
        image: item.thumbnail,
        quantity: item.quantity,
        price: item.price,
        colorSelected: item.colorSelected
      })),
      shippingAddress: {
        fullName: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: "Ha Noi" // bin
      },
      paymentMethod: "COD"
    });

    // Nếu không có lỗi -> Hiển thị Popup thành công
    setIsSuccess(true);
    
    // Đợi 3 giây rồi đẩy về trang chủ
    setIsSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  // Nếu truy cập thẳng vào đường dẫn /checkout mà không qua giỏ hàng
  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f4f6f8]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không có sản phẩm nào để thanh toán</h2>
        <Link to="/cart" className="text-[#e30019] font-bold hover:underline">Quay lại giỏ hàng</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-20 pt-8 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black text-black uppercase mb-8 tracking-wide border-l-4 border-[#e30019] pl-3">
          Thanh Toán Đơn Hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN */}
          <div className="col-span-1 lg:col-span-8 space-y-6">
            
            {/* Box 1: Thông tin nhận hàng */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-[#e30019] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Thông tin nhận hàng
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên người nhận"
                    className={`w-full border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e30019]/20 focus:border-[#e30019] transition-colors`}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.name}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại liên hệ"
                    className={`w-full border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e30019]/20 focus:border-[#e30019] transition-colors`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.phone}</p>}
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span></label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ví dụ: Số nhà 123, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. HCM"
                    rows="3"
                    className={`w-full border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e30019]/20 focus:border-[#e30019] transition-colors resize-none`}
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Box 2: Phương thức thanh toán */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-[#e30019] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Phương thức thanh toán
              </h2>
              
              <label className="flex items-center gap-4 p-4 border-2 border-[#e30019] bg-red-50 rounded-xl cursor-pointer">
                <input type="radio" checked readOnly className="w-5 h-5 accent-[#e30019]" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                  <span className="text-sm text-gray-500">Khách hàng kiểm tra hàng và thanh toán cho shipper.</span>
                </div>
              </label>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="col-span-1 lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                Đơn hàng của bạn ({checkoutItems.length} sản phẩm)
              </h2>

              {/* Danh sách sản phẩm thu gọn (ĐÃ CHỈNH SỬA) */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="w-16 h-16 border border-gray-200 rounded-lg p-1 bg-white flex-shrink-0">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.title}</span>
                      <span className="text-xs text-gray-500 mt-1">Phân loại: {item.colorSelected}</span>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-600 font-medium">Số lượng: {item.quantity}</span>
                        <span className="text-sm font-bold text-[#e30019]">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tính tiền */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-[#e30019]">{formatPrice(totalAmount)}</span>
                    <span className="text-[10px] text-gray-400">(Đã bao gồm VAT)</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                className="w-full mt-6 bg-[#e30019] hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-wider transition-transform active:scale-95 shadow-lg shadow-red-500/30"
              >
                ĐẶT HÀNG NGAY
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* POPUP THÔNG BÁO ĐẶT HÀNG THÀNH CÔNG */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 w-full max-w-md flex flex-col items-center text-center animate-[popIn_0.4s_ease-out_forwards]">
            
            {/* Vòng tròn tích xanh */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12 text-green-500 animate-[checkMark_0.6s_ease-in-out_forwards]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">Đặt hàng thành công!</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Cảm ơn <b>{formData.name}</b> đã mua sắm tại TechVolt.<br />
              Đơn hàng của bạn sẽ sớm được giao đến địa chỉ đã đăng ký.
            </p>
            
            {/* Hiệu ứng loading bar tự chạy */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-500 animate-[loadingBar_3s_linear_forwards]"></div>
            </div>
            <span className="text-xs text-gray-400 font-medium tracking-widest uppercase animate-pulse">
              Đang chuyển về trang chủ...
            </span>
          </div>
        </div>
      )}

      {/* Chèn trực tiếp CSS Keyframes để làm hiệu ứng Animation cho Popup */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkMark {
          0% { stroke-dasharray: 50; stroke-dashoffset: 50; }
          100% { stroke-dasharray: 50; stroke-dashoffset: 0; }
        }
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
};

export default CheckoutPage;