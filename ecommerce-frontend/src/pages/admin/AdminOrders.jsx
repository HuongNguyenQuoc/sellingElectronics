const AdminOrders = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý Đơn hàng</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Bộ lọc trạng thái */}
        <div className="flex gap-6 p-4 border-b border-gray-100 text-sm font-medium text-gray-500">
          <span className="text-gray-900 border-b-2 border-yellow-400 pb-1 cursor-pointer">Tất cả</span>
          <span className="hover:text-gray-900 cursor-pointer">Chờ xác nhận</span>
          <span className="hover:text-gray-900 cursor-pointer">Đang giao</span>
          <span className="hover:text-gray-900 cursor-pointer">Đã hoàn thành</span>
        </div>
        
        <div className="min-h-[400px] flex items-center justify-center bg-gray-50/50">
          <p className="text-gray-400">Bảng danh sách đơn hàng sẽ được render tại đây</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;