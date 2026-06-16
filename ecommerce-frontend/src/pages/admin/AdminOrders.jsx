import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

// --- HÀM CHUẨN HÓA TIẾNG VIỆT (LOẠI BỎ DẤU) ---
const removeAccents = (str) => {
  if (!str) return "";
  return str
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
  
  // State lưu trữ dữ liệu từ API
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý dialog
  const [statusModal, setStatusModal] = useState({ isOpen: false, orderId: null, nextStatus: "", statusText: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // --- LẤY DỮ LIỆU TỪ API ---
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/orders/my-orders');
      // Giả sử backend trả về mảng trực tiếp, nếu bọc trong response.data.data thì bạn thêm .data nhé
      setOrders(response.data); 
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      alert("Không thể tải danh sách đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC LỌC DỮ LIỆU ĐA NĂNG ---
  const filteredOrders = orders.filter((order) => {
    // 1. Tìm theo tên hoặc mã đơn 
    const normalizedSearch = removeAccents(searchTerm.toLowerCase());
    const normalizedOrderId = removeAccents(order._id?.toLowerCase()); // Dùng _id từ MongoDB
    const normalizedFullName = removeAccents(order.shippingAddress?.fullName?.toLowerCase());

    const matchesSearch = 
      normalizedOrderId.includes(normalizedSearch) ||
      normalizedFullName.includes(normalizedSearch);
    
    // 2. Lọc theo trạng thái
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    // 3. Lọc theo khoảng thời gian đặt hàng (Giả định backend trả về createdAt)
    const orderTime = new Date(order.createdAt).getTime(); 
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
    .reduce((sum, order) => sum + (order.totalCost || 0), 0);

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
        return { text: status, bg: "bg-gray-100", textCol: "text-gray-700" };
    }
  };

  // --- LOGIC DIALOG & API CẬP NHẬT TRẠNG THÁI ---
  const openStatusModal = (orderId, nextStatus, statusText) => {
    setStatusModal({ isOpen: true, orderId, nextStatus, statusText });
  };

  const closeStatusModal = () => {
    if(!isUpdating) {
      setStatusModal({ isOpen: false, orderId: null, nextStatus: "", statusText: "" });
    }
  };

  const confirmUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      // Gọi API PATCH cập nhật status
      await api.patch(`/orders/${statusModal.orderId}/status`, { 
        status: statusModal.nextStatus 
      });

      // Cập nhật lại state local (tránh phải gọi lại API fetchOrders cho nhẹ server)
      setOrders(prev => prev.map(order => 
        order._id === statusModal.orderId ? { ...order, status: statusModal.nextStatus } : order
      ));
      
      closeStatusModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* HEADER TÁC VỤ */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Quản lý Đơn hàng</h1>
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
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Doanh thu (Đã giao)</p>
          <p className="text-2xl font-black text-yellow-400 mt-2">{totalRevenue.toLocaleString("vi-VN")} ₫</p>
        </div>
      </div>

      {/* BỘ LỌC VÀ TÌM KIẾM */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
         {/* ... (Phần tìm kiếm giữ nguyên như trước) ... */}
         <div className="relative w-full xl:max-w-xs">
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"/>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"/>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="DELIVERED">Đã giao</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-4 px-6">Mã Đơn</th>
                  <th className="py-4 px-6">Khách Hàng</th>
                  <th className="py-4 px-6">Ngày Đặt</th>
                  <th className="py-4 px-6 text-right">Tổng Tiền</th>
                  <th className="py-4 px-6 text-center">Trạng Thái</th>
                  <th className="py-4 px-6 text-center w-32">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusUI = getStatusDisplay(order.status);
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-800">{order.shippingAddress?.fullName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{order.shippingAddress?.phone}</div>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")} {/* Giả sử backend có createdAt */}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-gray-900">
                          {order.totalCost.toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${statusUI.bg} ${statusUI.textCol}`}>
                            {statusUI.text}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {order.status === "PROCESSING" && (
                              <button onClick={() => openStatusModal(order._id, "SHIPPED", "Đang giao")} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                                {/* SVG Icon Shipped */} 🚚
                              </button>
                            )}

                            {order.status === "SHIPPED" && (
                              <button onClick={() => openStatusModal(order._id, "DELIVERED", "Đã giao")} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                {/* SVG Icon Delivered */} ✅
                              </button>
                            )}

                            <Link to={`/admin/orders/${order._id}`} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                              {/* SVG Icon Chi tiết */} 👁️
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DIALOG XÁC NHẬN CHUYỂN TRẠNG THÁI */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeStatusModal}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 z-10">
            <h3 className="text-lg font-bold">Xác nhận cập nhật</h3>
            <p className="mt-2 text-sm text-gray-600">
              Bạn có chắc muốn chuyển đơn này sang trạng thái <strong>{statusModal.statusText}</strong>?
            </p>
            <div className="mt-6 flex gap-3">
              <button disabled={isUpdating} onClick={closeStatusModal} className="flex-1 py-2 bg-gray-100 rounded-xl">Hủy</button>
              <button 
                disabled={isUpdating} 
                onClick={confirmUpdateStatus} 
                className="flex-1 py-2 bg-red-600 text-white rounded-xl flex justify-center items-center"
              >
                {isUpdating ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
