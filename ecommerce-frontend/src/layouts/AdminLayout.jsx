import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  // Hàm tạo CSS tự động: Nếu đang ở trang nào (isActive) thì bôi vàng, ngược lại thì màu xám
  const navClass = ({ isActive }) =>
    isActive
      ? "block px-4 py-3 rounded-xl bg-gray-800 text-yellow-400 font-bold transition-all shadow-sm"
      : "block px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all font-medium";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* CỘT TRÁI: Sidebar Menu */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-xl z-10">
        {/* Logo Admin */}
        <div className="h-20 flex items-center justify-center border-b border-gray-700">
          <span className="text-2xl font-black tracking-tight text-white">TechVolt</span>
          <span className="bg-[#e30019] text-white text-[10px] font-bold px-2 py-0.5 ml-2 rounded uppercase tracking-wider">
            ADMIN
          </span>
        </div>
        
        {/* Danh sách Menu */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {/* Thêm thuộc tính 'end' để nó không bị sáng nhầm khi vào các trang con */}
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
      </aside>

      {/* CỘT PHẢI: Nội dung các trang Admin */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Các trang con sẽ được render tại đây */}
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default AdminLayout;