import { useState } from "react";
import { Link } from "react-router-dom";
// Import toàn bộ dữ liệu từ file mockData
import { dummyAll } from "../../data/mockData";

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // --- STATE QUẢN LÝ DIALOG XÓA ---
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });

  const getProductType = (tags) => {
    const safeTags = tags || [];
    if (safeTags.includes("smartphone")) return "Điện thoại";
    if (safeTags.includes("laptop")) return "Laptop";
    return "Phụ kiện"; 
  };

  const getStatusDetails = (stockArray) => {
    const safeStock = stockArray || [0];
    const total = safeStock.reduce((acc, curr) => acc + curr, 0);
    if (total === 0) {
      return { text: "Hết hàng", badgeClass: "bg-red-100 text-red-700" };
    }
    if (total <= 20) {
      return { text: "Sắp hết", badgeClass: "bg-orange-100 text-orange-700" };
    }
    return { text: "Còn hàng", badgeClass: "bg-green-100 text-green-700" };
  };

  const filteredProducts = dummyAll.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const productType = getProductType(product.tags);
    const matchesType = selectedType === "all" || 
      (selectedType === "phone" && productType === "Điện thoại") ||
      (selectedType === "laptop" && productType === "Laptop") ||
      (selectedType === "accessory" && productType === "Phụ kiện");

    const safeStock = product.stock || [0];
    const totalStock = safeStock.reduce((a, b) => a + b, 0);
    let statusKey = "instock";
    if (totalStock === 0) statusKey = "outofstock";
    else if (totalStock <= 20) statusKey = "lowstock";
    const matchesStatus = selectedStatus === "all" || selectedStatus === statusKey;

    return matchesSearch && matchesType && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // --- LOGIC XỬ LÝ NÚT XÓA ---
  const handleDeleteClick = (id, title) => {
    // Mở Dialog thay vì dùng window.confirm
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = () => {
    console.log(`Đã xóa sản phẩm ID: ${deleteModal.id}`);
    // Ở đây sau này bạn sẽ gọi API xóa thực tế
    // Xóa xong thì đóng Dialog
    setDeleteModal({ isOpen: false, id: null, title: "" });
  };

  const cancelDelete = () => {
    // Đóng Dialog không làm gì cả
    setDeleteModal({ isOpen: false, id: null, title: "" });
  };

  return (
    <div className="space-y-8 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Danh sách sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý, thêm mới và cập nhật thông tin hàng hóa.</p>
        </div>
        <Link 
          to="/admin/products/add" 
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm sản phẩm
        </Link>
      </div>

      {/* THANH TÌM KIẾM VÀ LỌC */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-gray-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all cursor-pointer"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="phone">Điện thoại</option>
            <option value="laptop">Laptop</option>
            <option value="accessory">Phụ kiện</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all cursor-pointer"
          >
            <option value="all">Tất cả tình trạng</option>
            <option value="instock">Còn hàng</option>
            <option value="lowstock">Sắp hết</option>
            <option value="outofstock">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* BẢNG SẢN PHẨM */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="py-4 px-6 text-center w-24">Ảnh</th>
                <th className="py-4 px-6">Tên sản phẩm</th>
                <th className="py-4 px-6">Danh Mục</th>
                <th className="py-4 px-6 text-right">Giá</th>
                <th className="py-4 px-6 text-center">Màu sắc</th>
                <th className="py-4 px-6 text-center">Kho</th>
                <th className="py-4 px-6 text-center">Tình trạng</th>
                <th className="py-4 px-6 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((product) => {
                  const status = getStatusDetails(product.stock);
                  const safeColors = product.colors || ["Mặc định"];
                  const safeStock = product.stock || [0];

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-6 text-center">
                        <div className="w-14 h-14 rounded-xl border border-gray-200 overflow-hidden bg-white mx-auto flex items-center justify-center p-1">
                          <img 
                            src={product.thumbnail || product.images?.[0]} 
                            alt={product.title} 
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Image" }}
                          />
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800 line-clamp-1">{product.title}</div>
                      </td>
                      
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {getProductType(product.tags)}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-800">
                        {product.price?.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="py-4 px-6 text-center text-xs font-medium">
                        <div className="flex flex-col gap-1.5 justify-center h-full items-center">
                          {safeColors.map((color, idx) => (
                            <span key={idx} className="block bg-gray-100 text-gray-600 rounded px-2 py-0.5 whitespace-nowrap">
                              {color}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-xs font-bold text-gray-700">
                        <div className="flex flex-col gap-1.5 justify-center h-full">
                          {safeStock.map((qty, idx) => (
                            <span key={idx} className="block py-0.5">
                              {qty}
                            </span>
                          ))}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${status.badgeClass} whitespace-nowrap`}>
                          {status.text}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6 text-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa sản phẩm"
                          >
                            <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product.id, product.title)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào phù hợp với điều kiện lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <span className="text-sm text-gray-500">
              Đang xem <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> đến <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, filteredProducts.length)}</span> trong <span className="font-semibold text-gray-800">{filteredProducts.length}</span> sản phẩm
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold border transition-colors ${
                    currentPage === index + 1
                      ? "bg-yellow-400 border-yellow-400 text-gray-900 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DIALOG XÁC NHẬN XÓA TÙY CHỈNH (THIẾT KẾ MỚI MƯỢT MÀ HƠN) */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp nền mờ (Click vào đây sẽ đóng modal) */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={cancelDelete}
          ></div>

          {/* Nội dung Dialog */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
            <div className="p-6">
              <div className="flex gap-4 items-start">
                {/* Icon Thùng rác đỏ */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
                
                {/* Text */}
                <div className="mt-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Xóa sản phẩm</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Bạn muốn xóa <span className="font-bold text-gray-800">{deleteModal.title}</span>. Hành động này không thể hoàn tác, bạn có chắc chắn không?
                  </p>
                </div>
              </div>
            </div>

            {/* Các nút bấm */}
            <div className="p-5 pt-2 flex gap-3">
              <button 
                onClick={cancelDelete} 
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;