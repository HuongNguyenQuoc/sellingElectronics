import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

const getProductId = (product) => product._id || product.id;

const getProductVariants = (product) => {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants;
  }

  const colors = Array.isArray(product.colors) ? product.colors : [];
  const stock = Array.isArray(product.stock) ? product.stock : [];

  if (colors.length > 0) {
    return colors.map((color, index) => ({
      color,
      stock: Number(stock[index] || 0),
    }));
  }

  return [{ color: "Mặc định", stock: Number(product.stock || 0) }];
};

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 20;

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const { data } = await api.get("/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(getErrorMessage(err, "Không tải được danh sách sản phẩm."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductType = (tags) => {
    const safeTags = tags || [];
    if (safeTags.includes("smartphone")) return "Điện thoại";
    if (safeTags.includes("laptop")) return "Laptop";
    return "Phụ kiện";
  };

  const getStatusDetails = (variants) => {
    const total = variants.reduce((acc, item) => acc + Number(item.stock || 0), 0);
    if (total === 0) {
      return { text: "Hết hàng", badgeClass: "bg-red-100 text-red-700" };
    }
    if (total <= 20) {
      return { text: "Sắp hết", badgeClass: "bg-orange-100 text-orange-700" };
    }
    return { text: "Còn hàng", badgeClass: "bg-green-100 text-green-700" };
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const productType = getProductType(product.tags);
    const matchesType = selectedType === "all" ||
      (selectedType === "phone" && productType === "Điện thoại") ||
      (selectedType === "laptop" && productType === "Laptop") ||
      (selectedType === "accessory" && productType === "Phụ kiện");

    const totalStock = getProductVariants(product).reduce((a, item) => a + Number(item.stock || 0), 0);
    let statusKey = "instock";
    if (totalStock === 0) statusKey = "outofstock";
    else if (totalStock <= 20) statusKey = "lowstock";
    const matchesStatus = selectedStatus === "all" || selectedStatus === statusKey;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteClick = (id, title) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      setIsDeleting(true);
      setError("");
      await api.delete(`/products/${deleteModal.id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => getProductId(product) !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, title: "" });
    } catch (err) {
      setError(getErrorMessage(err, "Xóa sản phẩm thất bại. Hãy kiểm tra token admin hoặc thử lại."));
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (isDeleting) return;
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

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
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((product) => {
                  const productId = getProductId(product);
                  const variants = getProductVariants(product);
                  const status = getStatusDetails(variants);

                  return (
                    <tr key={productId} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-6 text-center">
                        <div className="w-14 h-14 rounded-xl border border-gray-200 overflow-hidden bg-white mx-auto flex items-center justify-center p-1">
                          <img
                            src={product.thumbnail || product.images?.[0]}
                            alt={product.title}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Image"; }}
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
                          {variants.map((variant, idx) => (
                            <span key={`${variant.color}-${idx}`} className="block bg-gray-100 text-gray-600 rounded px-2 py-0.5 whitespace-nowrap">
                              {variant.color}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-xs font-bold text-gray-700">
                        <div className="flex flex-col gap-1.5 justify-center h-full">
                          {variants.map((variant, idx) => (
                            <span key={`${variant.color}-${idx}`} className="block py-0.5">
                              {variant.stock}
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
                            to={`/admin/products/edit/${productId}`}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa sản phẩm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(productId, product.title)}
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
                disabled={safeCurrentPage === 1}
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
                    safeCurrentPage === index + 1
                      ? "bg-yellow-400 border-yellow-400 text-gray-900 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
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

      {/* DIALOG XÁC NHẬN XÓA TÙY CHỈNH */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={cancelDelete}
          ></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
            <div className="p-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>

                <div className="mt-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Xóa sản phẩm</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Bạn muốn xóa <span className="font-bold text-gray-800">{deleteModal.title}</span>. Hành động này không thể hoàn tác, bạn có chắc chắn không?
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 pt-2 flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Đang xóa..." : "Xóa ngay"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
