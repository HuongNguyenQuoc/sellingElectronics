const AdminProducts = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div className="min-h-[400px] flex items-center justify-center bg-gray-50/50">
          <p className="text-gray-400">Bảng danh sách sản phẩm sẽ được render tại đây</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;