import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig"; // Import axios instance của bạn

// --- HÀM CHUẨN HÓA TIẾNG VIỆT (LOẠI BỎ DẤU) ---
const removeAccents = (str) => {
  if (!str) return "";
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const AdminOrders = () => {
  // --- TỰ ĐỘNG TÍNH TOÁN NGÀY MẶC ĐỊNH (TỪ ĐẦU THÁNG ĐẾN HÔM NAY) ---
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  
  const defaultStartDate = `${yyyy}-${mm}-01`; 
  const defaultEndDate = `${yyyy}-${mm}-${dd}`;     

  // --- CÁC STATE QUẢN LÝ ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  
  // STATE DỮ LIỆU API
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE QUẢN LÝ DIALOG CHUYỂN TRẠNG THÁI ---
  const [statusModal, setStatusModal] = useState({ isOpen: false, orderId: null, nextStatus: "", statusText: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // ====================================================================
  // 1. HÀM GET DATA: LẤY DANH SÁCH ĐƠN HÀNG TỪ API
  // ====================================================================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Thay đổi URL nếu backend của bạn prefix khác (VD: /orders/my-orders)
        const response = await api.get('/orders/my-orders'); 
        
        // Đảm bảo set mảng an toàn
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setOrders(data);
      } catch (error) {
        console.error("Lỗi tải danh sách đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- LOGIC LỌC DỮ LIỆU ĐA NĂNG ---
  const filteredOrders = orders.filter((order) => {
    const rawId = order._id || order.id || "";
    const rawName = order.shippingAddress?.fullName || "";
    
    // 1. Tìm theo tên hoặc mã đơn (HỖ TRỢ TÌM KHÔNG DẤU & KHÔNG PHÂN BIỆT HOA THƯỜNG)
    const normalizedSearch = removeAccents(searchTerm.toLowerCase());
    const normalizedOrderId = removeAccents(rawId.toLowerCase());
    const normalizedFullName = removeAccents(rawName.toLowerCase());

    const matchesSearch = 
      normalizedOrderId.includes(normalizedSearch) ||
      normalizedFullName.includes(normalizedSearch);
    
    // 2. Lọc theo trạng thái
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    // 3. Lọc theo khoảng thời gian đặt hàng
    const orderTime = order.createdAt ? new Date(order.createdAt).getTime() : 0;
    const startTimestamp = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : 0;
    const endTimestamp = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
    const matchesDate = orderTime >= startTimestamp && orderTime <= endTimestamp;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // --- LOGIC THỐNG KÊ (Chạy động theo filteredOrders) ---
  const totalOrders = filteredOrders.length;
  const processingOrders = filteredOrders.filter(o => o.status === "PROCESSING").length;
  const deliveredOrders = filteredOrders.filter(o => o.status === "DELIVERED").length;
  const totalRevenue = filteredOrders
    .filter(o => o.status === "DELIVERED")
    .reduce((sum, order) => sum + (Number(order.totalCost) || 0), 0);

  // --- ĐỊNH DẠNG MÀU SẮC ĐỒNG BỘ 4 TRẠNG THÁI ---
  const getStatusDisplay = (status) => {
    switch (status) {
      case "PROCESSING":
        return { text: "Đang xử lý", bg: "bg-amber-100", textCol: "text-amber-700" };
      case "SHIPPED":
        return { text: "Đang giao", bg: "bg-blue-100", textCol: "text-blue-700" };
      case "DELIVERED":
        return { text: "Đã giao", bg: "bg-emerald-100", textCol: "text-emerald-700" };
      case "CANCELLED":
        return { text: "Đã hủy", bg: "bg-rose-100", textCol: "text-rose-700" };
      default:
        return { text: status || "Không rõ", bg: "bg-gray-100", textCol: "text-gray-700" };
    }
  };

  // --- LOGIC DIALOG CẬP NHẬT TRẠNG THÁI ---
  const openStatusModal = (orderId, nextStatus, statusText) => {
    setStatusModal({ isOpen: true, orderId, nextStatus, statusText });
  };

  const closeStatusModal = () => {
    if (!isUpdating) {
      setStatusModal({ isOpen: false, orderId: null, nextStatus: "", statusText: "" });
    }
  };

  // ====================================================================
  // 2. HÀM UPDATE STATUS: CẬP NHẬT LÊN DATABASE
  // ====================================================================
  const confirmUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      
      // Gọi API PATCH cập nhật trạng thái (Endpoint: /:id/status)
      await api.patch(`/orders/${statusModal.orderId}/status`, { 
        status: statusModal.nextStatus 
      });

      // Cập nhật lại UI không cần reload trang
      setOrders(prev => prev.map(order => 
        (order._id || order.id) === statusModal.orderId ? { ...order, status: statusModal.nextStatus } : order
      ));
      
      closeStatusModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại mạng hoặc phân quyền!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* HEADER TÁC VỤ */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Quản lý Đơn hàng</h1>
        <p className="text-sm text-gray-500 mt-1">Theo dõi, kiểm tra thời gian đặt và điều phối quy trình vận chuyển đơn hàng.</p>
      </div>

      {/* KHỐI THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Tổng đơn hàng</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Đang xử lý</p>
          <p className="text-3xl font-black text-amber-500 mt-2">{processingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Đã giao</p>
          <p className="text-3xl font-black text-emerald-500 mt-2">{deliveredOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Doanh thu thời kỳ</p>
          <p className="text-2xl font-black text-yellow-400 mt-2">{totalRevenue.toLocaleString("vi-VN")} ₫</p>
        </div>
      </div>

      {/* THANH TÌM KIẾM, BỘ LỌC TRẠNG THÁI & BỘ LỌC THỜI GIAN */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        <div className="relative w-full xl:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-gray-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Từ</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Đến</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="DELIVERED">Đã giao</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* BẢNG HIỂN THỊ DỮ LIỆU ĐƠN HÀNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="py-4 px-6">Mã Đơn</th>
                <th className="py-4 px-6">Khách Hàng</th>
                <th className="py-4 px-6">Thời Gian Đặt</th>
                <th className="py-4 px-6 text-right">Tổng Tiền</th>
                <th className="py-4 px-6 text-center">Trạng Thái</th>
                <th className="py-4 px-6 text-center w-32">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              
              {/* TRẠNG THÁI LOADING */}
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 font-medium">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusUI = getStatusDisplay(order.status);
                  
                  // Tạo ID ngắn và ID an toàn
                  const safeId = order._id || order.id || "UNKNOWN";
                  const shortId = String(safeId).slice(-6).toUpperCase();
                  
                  // Giá trị an toàn
                  const safeTotal = Number(order.totalCost) || 0;

                  return (
                    <tr key={safeId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">{shortId}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">{order.shippingAddress?.fullName || 'Khách hàng'}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{order.shippingAddress?.phone || 'Chưa cập nhật SĐT'}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN", {
                          hour: "2-digit", minute: "2-digit",
                          day: "2-digit", month: "2-digit", year: "numeric"
                        }) : "Không rõ"}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900">
                        {safeTotal.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${statusUI.bg} ${statusUI.textCol}`}>
                          {statusUI.text}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Nút thao tác chuyển trạng thái */}
                          {order.status === "PROCESSING" && (
                            <button
                              onClick={() => openStatusModal(safeId, "SHIPPED", "Đang giao")}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chuyển sang Đang giao"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                              </svg>
                            </button>
                          )}

                          {order.status === "SHIPPED" && (
                            <button
                              onClick={() => openStatusModal(safeId, "DELIVERED", "Đã giao")}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Chuyển sang Đã giao"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}

                          {/* ========================================================= */}
                          {/* TRUYỀN DATA SANG TRANG CHI TIẾT ĐỂ KO CẦN CALL API LẠI */}
                          <Link
                            to={`/admin/orders/${safeId}`}
                            state={{ orderData: order }}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Xem chi tiết đơn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </Link>
                          {/* ========================================================= */}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào trong khoảng thời gian và điều kiện lọc đã chọn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= DIALOG XÁC NHẬN CHUYỂN TRẠNG THÁI ================= */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeStatusModal}></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
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
                    Bạn có chắc muốn duyệt đơn hàng <span className="font-bold text-gray-800">#{String(statusModal.orderId).slice(-6).toUpperCase()}</span> và chuyển trạng thái sang <span className="font-bold text-red-600">"{statusModal.statusText}"</span>?
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
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-200 disabled:opacity-50 flex justify-center items-center"
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

export default AdminOrders;
