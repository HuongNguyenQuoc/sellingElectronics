// Quan trọng: Phải import Link từ 'react-scroll' và đổi tên thành ScrollLink để không bị trùng
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom"; // Link này vẫn dùng cho logo và giỏ hàng

const Navbar = () => {
  // BẮT BUỘC PHẢI CÓ HÀM NÀY ĐỂ NÚT LIÊN HỆ HOẠT ĐỘNG
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Tính toán khoảng cách và cuộn (nhảy thẳng xuống, không có smooth)
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y });
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo (Vẫn dùng RouterLink để về trang chủ) */}
          <RouterLink to="/" className="flex items-center gap-2">
            <span className="text-3xl font-black text-gray-900 tracking-tight">
              TechVolt
            </span>
            <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded">
              Electronics
            </span>
          </RouterLink>

          {/* Menu Điều Hướng (ĐÃ ĐỔI SANG DÙNG ScrollLink) */}
          <ul className="hidden md:flex items-center gap-8 text-xs font-bold text-gray-600 tracking-wide">
            <li>
              <ScrollLink
                to="deals-hot"
                smooth={true}
                duration={500}
                offset={-100} // Bù trừ chiều cao navbar
                className="cursor-pointer hover:text-gray-900 transition-colors"
              >
                DEALS HOT
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="phones"
                smooth={true}
                duration={500}
                offset={-100}
                className="cursor-pointer hover:text-gray-900 transition-colors"
              >
                PHONES
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="laptops"
                smooth={true}
                duration={500}
                offset={-100}
                className="cursor-pointer hover:text-gray-900 transition-colors"
              >
                LAPTOPS
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="accessories"
                smooth={true}
                duration={500}
                offset={-100}
                className="cursor-pointer hover:text-gray-900 transition-colors"
              >
                PHỤ KIỆN
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="recommendations"
                smooth={true}
                duration={500}
                offset={-100}
                className="cursor-pointer hover:text-gray-900 transition-colors"
              >
                GỢI Ý RIÊNG
              </ScrollLink>
            </li>
            <li>
              {/* Nút Liên Hệ đã gọi hàm handleScroll */}
              <span
                onClick={() => handleScroll("contact")}
                className="cursor-pointer hover:text-gray-900 transition-colors"
              >
                LIÊN HỆ
              </span>
            </li>
          </ul>

          {/* Khu vực Tìm kiếm & Icon (Giữ nguyên) */}
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Tìm điện thoại, laptop..."
                className="border border-gray-300 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 w-72 transition-all placeholder:text-gray-400"
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
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                6
              </span>
            </RouterLink>

            <div className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="text-sm font-semibold hidden sm:block">
                Đăng nhập
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
