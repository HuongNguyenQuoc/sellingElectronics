const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thống kê doanh thu</h1>
      
      {/* Lưới các thẻ số liệu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</p>
          <p className="text-3xl font-black text-gray-900">125.400.000đ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Đơn hàng mới</p>
          <p className="text-3xl font-black text-gray-900">42</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Sản phẩm sắp hết</p>
          <p className="text-3xl font-black text-[#e30019]">8</p>
        </div>
      </div>

      {/* Khu vực biểu đồ hoặc danh sách tóm tắt */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center">
        <p className="text-gray-400">Khu vực hiển thị Biểu đồ doanh thu sẽ nằm ở đây</p>
      </div>
    </div>
  );
};

export default AdminDashboard;