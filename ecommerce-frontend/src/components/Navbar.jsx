import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../api/cartService";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchCartCount = async () => {
    if (!localStorage.getItem("token")) {
      setCartCount(0);
      return;
    }

    try {
      const cart = await getCart();
      const nextCartCount = (cart?.items || []).reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );
      setCartCount(nextCartCount);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchCartCount);

    window.addEventListener("cart-changed", fetchCartCount);
    window.addEventListener("storage", fetchCartCount);

    return () => {
      window.removeEventListener("cart-changed", fetchCartCount);
      window.removeEventListener("storage", fetchCartCount);
    };
  }, [user, location.pathname]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);

    if (userData.role === "admin") {
      navigate("/admin");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    setUser(null);
    navigate("/");
  };

  // Hàm tự phân luồng cho các mục Gợi ý và Liên hệ
  const handleNavigateAndScroll = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y });
      }
    }
  };

  // Hàm kiểm tra đường dẫn hiện tại để bôi đỏ menu
  const getMenuClass = (path) => {
    return `cursor-pointer transition-colors font-bold ${
      location.pathname === path ? "text-red-600" : "hover:text-gray-900"
    }`;
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <RouterLink to="/" className="flex items-center gap-2">
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                TechVolt
              </span>
              <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded">
                Electronics
              </span>
            </RouterLink>

            {/* Menu Điều Hướng */}
            <ul className="hidden md:flex items-center gap-8 text-xs text-gray-600 tracking-wide">
              {/* Nhóm 1: Chuyển sang Trang riêng biệt */}
              <li>
                <RouterLink
                  to="/flash-sale"
                  className={getMenuClass("/flash-sale")}
                >
                  DEALS HOT
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/phones" className={getMenuClass("/phones")}>
                  PHONES
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/laptops" className={getMenuClass("/laptops")}>
                  LAPTOPS
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/accessories"
                  className={getMenuClass("/accessories")}
                >
                  PHỤ KIỆN
                </RouterLink>
              </li>

              {/* Nhóm 2: Trượt xuống section ở Trang chủ */}
              <li>
                <span
                  onClick={() => handleNavigateAndScroll("recommendations")}
                  className="cursor-pointer font-bold hover:text-gray-900 transition-colors"
                >
                  GỢI Ý RIÊNG
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleNavigateAndScroll("contact")}
                  className="cursor-pointer font-bold hover:text-gray-900 transition-colors"
                >
                  LIÊN HỆ
                </span>
              </li>
            </ul>

            {/* Khu vực Tìm kiếm & Icon */}
            <div className="flex items-center gap-6">
              {/* Đã thu nhỏ w-72 thành w-56 để tránh tràn dòng menu */}
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="Tìm điện thoại, laptop..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim() !== "") {
                      navigate(
                        `/search?keyword=${encodeURIComponent(e.target.value)}`,
                      );
                    }
                  }}
                  className="border border-gray-300 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 w-56 transition-all placeholder:text-gray-400 font-normal"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 absolute right-4 top-2.5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>

              {/* Icon Giỏ hàng */}
              <RouterLink
                to="/cart"
                className="relative cursor-pointer text-gray-700 hover:text-yellow-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </RouterLink>

              {/* Nút Đơn hàng của tôi (Nằm giữa Giỏ hàng và Đăng nhập) */}
              {user ? (
                <RouterLink
                  to="/orders"
                  className="cursor-pointer text-gray-700 hover:text-yellow-500 transition-colors"
                  title="Đơn hàng của tôi"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </RouterLink>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="cursor-pointer text-gray-700 hover:text-yellow-500 transition-colors"
                  title="Vui lòng đăng nhập để xem đơn hàng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </button>
              )}

              {/* Đăng nhập/Profile */}
              <div
                onClick={() =>
                  user ? handleLogout() : setIsAuthModalOpen(true)
                }
                className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900 group"
                title={user ? "Nhấn để đăng xuất" : "Nhấn để đăng nhập"}
              >
                {user ? (
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-xs border border-gray-200">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                )}

                <span className="text-sm font-semibold hidden sm:block max-w-[120px] truncate">
                  {user ? user.name : "Đăng nhập"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Navbar;
