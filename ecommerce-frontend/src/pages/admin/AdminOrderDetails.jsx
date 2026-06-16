import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosConfig"; 

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedOrder = location.state?.orderData;
  const [order, setOrder] = useState(passedOrder || null);
  const [isLoading, setIsLoading] = useState(!passedOrder);

  const [statusModal, setStatusModal] = useState({ isOpen: false, nextStatus: "", statusText: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!passedOrder && id) {
      const fetchOrderDetails = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/orders/${id}`); 
          setOrder(response.data);
        } catch (error) {
          console.error("Lỗi khi tải chi tiết đơn hàng:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [id, passedOrder]);

  const getStatusText = (status) => {
    if (status === "PROCESSING") return "Đang xử lý";
    if (status === "SHIPPED") return "Đang giao";
    if (status === "DELIVERED") return "Đã giao";
    if (status === "CANCELLED") return "Đã hủy";
    return status || "Không rõ";
  };

  const handleStatusChange = (newStatus) => {
    setStatusModal({ 
      isOpen: true, 
      nextStatus: newStatus, 
      statusText: getStatusText(newStatus) 
    });
  };

  const closeStatusModal = () => {
    if (!isUpdating) {
      setStatusModal({ isOpen: false, nextStatus: "", statusText: "" });
    }
  };

  const confirmUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      // Lấy ID an toàn (hỗ trợ cả _id của mongo và id thường)
      const orderIdToUpdate = order._id || order.id;
      await api.patch(`/${orderIdToUpdate}/status`, { 
        status: statusModal.nextStatus 
      });
      setOrder(prev => ({ ...prev, status: statusModal.nextStatus }));
      closeStatusModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PROCESSING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "SHIPPED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "DELIVERED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">Đang tải dữ liệu chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-sm text-gray-500 mb-6">Mã đơn hàng không hợp lệ hoặc đã bị xóa khỏi hệ thống.</p>
        <button 
          onClick={() => navigate("/admin/orders")} 
          className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
        >
          Quay lại danh sách đơn
        </button>
      </div>
    );
  }

  // SỬA LỖI 1: Lấy ID an toàn hỗ trợ cả order._id và order.id
  const displayId = order._id || order.id || "UNKNOWN";
  const shortOrderId = String(displayId).slice(-6).toUpperCase();

  // SỬA LỖI 2: Đảm bảo order.items luôn là mảng để hàm .map() không bao giờ crash
  const orderItems = Array.isArray(order.items) ? order.items : [];

  // SỬA LỖI 3: Đảm bảo totalCost luôn là số
  const safeTotalCost = Number(order.totalCost) || 0;

  return (
    <div className="space-y-6 font-sans relative">
      
      {/* THANH ĐIỀU HƯỚNG TRÊN & THAO TÁC NHANH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/admin/orders")}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">Đơn hàng #{shortOrderId}</h1>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase border ${getStatusBadgeClass(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Thời gian đặt hàng: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "Không xác định"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
          <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Trạng thái:</span>
          <select
            value={order.status || ""}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="DELIVERED">Đã giao</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* THÔNG TIN KHÁCH HÀNG & PHƯƠNG THỨC THANH TOÁN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Khối Thông tin khách hàng */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-900">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Thông tin người nhận hàng
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-1">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Tên khách hàng</p>
              <p className="font-semibold text-gray-800">{order.shippingAddress?.fullName || 'Không có tên'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Số điện thoại</p>
              <p className="font-semibold text-gray-800">{order.shippingAddress?.phone || 'Không có sđt'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">Địa chỉ giao hàng</p>
              <p className="font-semibold text-gray-800 leading-relaxed">
                {order.shippingAddress?.address || ""}, {order.shippingAddress?.city || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Khối Thanh toán */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-900">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            Giao dịch & Thanh toán
          </h3>
          <div className="text-sm space-y-4 pt-1">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Hình thức mua hàng</p>
              <p className="font-semibold text-gray-800 uppercase">{order.paymentMethod || 'COD'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Trạng thái tiền</p>
              <p className={`font-semibold ${order.status === "DELIVERED" ? "text-emerald-600" : "text-amber-600"}`}>
                {order.status === "DELIVERED" ? "Đã thu tiền thành công" : "Chưa hoàn thành quyết toán"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH CHI TIẾT CÁC MÓN HÀNG ĐƯỢC MUA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Danh mục sản phẩm mua</h3>
        </div>
        
        <div className="divide-y divide-gray-100 px-6">
          {orderItems.length > 0 ? orderItems.map((item, index) => {
            
            // SỬA LỖI 4: Nếu item.product là Object do Backend populate thì lấy _id của nó. Tránh lỗi .slice()
            const rawProductId = typeof item.product === 'object' && item.product !== null 
              ? (item.product._id || item.product.id) 
              : item.product;
              
            const shortProductId = rawProductId ? String(rawProductId).slice(-6).toUpperCase() : "N/A";
            
            // Ép kiểu an toàn cho giá tiền
            const safePrice = Number(item.price) || 0;
            const safeQty = Number(item.quantity) || 1;
            
            return (
              <div key={index} className="py-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-xl p-1 flex-shrink-0">
                    <img 
                      src={item.image || "https://placehold.co/100x100?text=No+Image"} 
                      alt={item.name || "Sản phẩm"} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name || "Sản phẩm không xác định"}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                      <span>Phân loại: {item.colorSelected || "Mặc định"}</span>
                      <span>Mã SP: {shortProductId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-12 w-full sm:w-auto text-sm border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                  <div className="text-gray-500">
                    {safePrice.toLocaleString("vi-VN")} ₫ <span className="text-xs text-gray-400 mx-1">x</span> {safeQty}
                  </div>
                  <div className="font-bold text-gray-900 text-right min-w-[80px]">
                    {(safePrice * safeQty).toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="py-8 text-center text-gray-500 text-sm">Đơn hàng không có sản phẩm nào</div>
          )}
        </div>

        {/* KHỐI TỔNG KẾT DOANH THU ĐƠN HÀNG */}
        <div className="bg-gray-50/40 p-6 border-t border-gray-100 flex justify-end">
          <div className="w-full sm:w-72 space-y-3 text-sm">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Tổng giá trị hàng</span>
              <span className="text-gray-900">{safeTotalCost.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Giao hàng (Vận chuyển)</span>
              <span className="text-emerald-600 font-semibold">Miễn phí</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-800">Doanh thu thực nhận</span>
              <span className="text-xl font-bold text-red-600">
                {safeTotalCost.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DIALOG XÁC NHẬN CHUYỂN TRẠNG THÁI ================= */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeStatusModal}></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                
                <div className="mt-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Cập nhật đơn hàng</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Bạn có chắc muốn duyệt đơn hàng <span className="font-bold text-gray-800">#{shortOrderId}</span> và chuyển trạng thái sang <span className="font-bold text-red-600">"{statusModal.statusText}"</span>?
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 pt-2 flex gap-3">
              <button 
                disabled={isUpdating}
                onClick={closeStatusModal} 
                className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                disabled={isUpdating}
                onClick={confirmUpdateStatus} 
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isUpdating ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrderDetails;