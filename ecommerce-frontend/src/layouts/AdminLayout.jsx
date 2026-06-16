import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  // --- STATE QUẢN LÝ DIALOG ĐĂNG XUẤT ---
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Hàm tạo CSS tự động: Nếu đang ở trang nào (isActive) thì bôi vàng, ngược lại thì màu xám
  const navClass = ({ isActive }) =>
    isActive
      ? "block px-4 py-3 rounded-xl bg-gray-800 text-yellow-400 font-bold transition-all shadow-sm"
      : "block px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all font-medium";

  // Mở modal cảnh báo đăng xuất
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  // Đóng modal khi bấm hủy
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  // Xử lý khi ấn xác nhận đăng xuất (Hiện tại chỉ đóng modal, không chuyển trang)
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    // Hiện tại chỉ làm giao diện frontend, giữ nguyên không chuyển trang
    setIsLogoutModalOpen(false);
    navigate("/", { replace: true }); // Without Replace, when user hit Back won't be back the home page.
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      {/* CỘT TRÁI: Sidebar Menu */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-xl z-10">
        {/* Logo Admin */}
        <div className="h-20 flex items-center justify-center border-b border-gray-700">
          <span className="text-2xl font-black tracking-tight text-white">
            TechVolt
          </span>
          <span className="bg-[#e30019] text-white text-[10px] font-bold px-2 py-0.5 ml-2 rounded uppercase tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Danh sách Menu */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavLink to="/admin" end className={navClass}>
            Thống kê doanh thu
          </NavLink>

          <NavLink to="/admin/products" className={navClass}>
            Quản lý sản phẩm
          </NavLink>

          <NavLink to="/admin/orders" className={navClass}>
            Quản lý đơn hàng
          </NavLink>

          <NavLink to="/admin/chat" className={navClass}>
            Chat
          </NavLink>
        </nav>

        {/* NÚT ĐĂNG XUẤT (Nằm cố định ở cuối thanh Sidebar) */}
        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-950/30 hover:text-red-400 transition-all font-medium text-left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* CỘT PHẢI: Nội dung các trang Admin */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ================= DIALOG CẢNH BÁO ĐĂNG XUẤT CHỦ ĐẠO MÀU ĐỎ ================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp nền mờ */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeLogoutModal}
          ></div>

          {/* Khung nội dung Dialog */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
            <div className="p-6">
              <div className="flex gap-4 items-start">
                {/* Icon Đăng xuất màu đỏ */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </div>

                {/* Nội dung text thông báo */}
                <div className="mt-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Đăng xuất hệ thống
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Bạn có chắc chắn muốn đăng xuất phiên làm việc của Admin
                    không?
                  </p>
                </div>
              </div>
            </div>

            {/* Các nút bấm thao tác */}
            <div className="p-5 pt-2 flex gap-3">
              <button
                onClick={closeLogoutModal}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-200"
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

export default AdminLayout;
