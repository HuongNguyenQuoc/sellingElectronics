import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dummyAll, mockOrders } from "../../data/mockData";

import axios from 'axios'
import api from '../../api/axiosConfig'

const TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "PROCESSING", label: "Đang xử lý" },
  { id: "SHIPPED", label: "Đang giao" },
  { id: "DELIVERED", label: "Đã giao" },
  { id: "CANCELLED", label: "Đã hủy" }
];

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  
  // --- STATE QUẢN LÝ DIALOG HỦY ĐƠN ---
  const [cancelModal, setCancelModal] = useState({ isOpen: false, _id: null });

const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "PROCESSING":
        return { text: "Đang xử lý", bg: "bg-amber-50", textCol: "text-amber-600", dot: "bg-amber-500" };
      case "SHIPPED":
        return { text: "Đang giao", bg: "bg-blue-50", textCol: "text-blue-600", dot: "bg-blue-500" };
      case "DELIVERED":
        return { text: "Đã giao", bg: "bg-emerald-50", textCol: "text-emerald-600", dot: "bg-emerald-500" };
      case "CANCELLED":
        return { text: "Đã hủy", bg: "bg-rose-50", textCol: "text-rose-600", dot: "bg-rose-500" };
      default:
        return { text: status, bg: "bg-gray-100", textCol: "text-gray-600", dot: "bg-gray-500" };
    }
  };



  // --- LOGIC MỞ/ĐÓNG/XÁC NHẬN DIALOG ---
  const openCancelModal = (_id) => {
    setCancelModal({ isOpen: true, _id });
  };

  const closeCancelModal = () => {
    setCancelModal({ isOpen: false, _id: null });
  };

  const confirmCancelOrder = async() => {
    
    console.log(`Đã xác nhận hủy đơn hàng: ${cancelModal._id}`);
    // Tích hợp API hủy đơn hàng tại đây...
    try {
      // 1. Dùng PATCH và gửi body { status: "CANCELLED" }
      await api.patch(`/orders/${cancelModal._id}/status`, {
        status: "CANCELLED" // Đảm bảo chuỗi này khớp với enum trong Model của bạn
      }); 
      
      // 2. Cập nhật lại UI ngay lập tức
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === cancelModal._id 
            // Lưu ý: Nếu backend trả về trường tên là 'status' thay vì 'orderStatus', 
            // bạn cần đổi lại thành status: "CANCELLED" cho đồng bộ.
            ? { ...order, status: "CANCELLED" } 
            : order
        )
      );
      
      // 3. Đóng modal
      closeCancelModal();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      alert("Không thể hủy đơn hàng lúc này. Vui lòng thử lại!");
    }
  };

  useEffect(() =>{
      const fetchOrders = async() =>{
        try{
          setLoading(true);
          const res = await api.get("/orders/my-orders");

          setOrders(res.data);

        }catch(error){
          console.error(error);
        }finally{
          setLoading(false);
        }
      }

      fetchOrders();
  },[]);

  const filteredOrders = orders.filter(order => 
    activeTab === "ALL" ? true : order.status === activeTab
  );

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-32 pt-8 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-900 uppercase mb-6 tracking-wide border-l-4 border-[#e30019] pl-3">
          Đơn Hàng Của Tôi
        </h1>

        {/* TABS */}
        <div className="bg-white rounded-xl mb-6 shadow-sm overflow-x-auto flex border border-gray-100 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-4 text-[15px] font-medium transition-colors text-center border-b-2 ${
                activeTab === tab.id
                  ? "border-[#ee4d2d] text-[#ee4d2d]"
                  : "border-transparent text-gray-600 hover:text-[#ee4d2d]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DANH SÁCH ĐƠN HÀNG */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const statusUI = getStatusDisplay(order.status);
              
              return (
                <div key={order._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* Header Card */}
                  <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900 tracking-wider">#{order._id}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide ${statusUI.bg} ${statusUI.textCol}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusUI.dot}`}></span>
                      {statusUI.text}
                    </div>
                  </div>

                  {/* Danh sách Item */}
                  <div className="p-6 space-y-6">
                    {order.items.map((item, index) => {
                      return (
                        <div key={index} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                          <Link to={`/product/${item.product}`} className="w-20 h-20 bg-white border border-gray-200 rounded-lg p-1.5 flex-shrink-0 hover:border-gray-300 transition-colors">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </Link>
                          
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.product}`} className="text-[15px] font-semibold text-gray-900 hover:text-[#e30019] line-clamp-2 transition-colors">
                              {item.name}
                            </Link>
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

                  {/* Footer Card */}
                  <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
                      <span className="text-sm font-medium text-gray-600">Thành tiền:</span>
                      <span className="text-xl font-bold text-[#e30019]">{order.totalCost.toLocaleString("vi-VN")} ₫</span>
                    </div>
                    
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                      {order.status === "PROCESSING" && (
                        <button 
                          onClick={() => openCancelModal(order._id)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Hủy đơn hàng
                        </button>
                      )}
                      <Link 
                        to={`/orders/${order._id}`} 
                        className="w-full sm:w-auto text-center px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#e30019] hover:bg-red-700 transition-colors shadow-sm"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-gray-300 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-800">Chưa có đơn hàng nào</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">Bạn chưa có đơn hàng nào trong trạng thái này.</p>
              <Link to="/" className="px-6 py-2.5 bg-[#e30019] text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>
        
      </div>

      {/* ================= DIALOG XÁC NHẬN HỦY ĐƠN HÀNG ================= */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Lớp nền mờ, click ra ngoài để đóng */}
          <div 
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={closeCancelModal}
          ></div>

          {/* Nội dung Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex gap-4 items-start">
                {/* Icon Cảnh báo */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                {/* Text */}
                <div className="mt-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận hủy đơn hàng</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Bạn có chắc chắn muốn hủy đơn hàng <span className="font-bold text-gray-800">#{cancelModal._id}</span> không? Hành động này sẽ không thể hoàn tác.
                  </p>
                </div>
              </div>
            </div>

            {/* Các nút bấm */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={closeCancelModal} 
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmCancelOrder} 
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#e30019] rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrders;