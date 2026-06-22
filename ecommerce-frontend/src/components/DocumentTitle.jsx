import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const getPageTitle = (pathname) => {
  if (pathname === "/") return "TechVolt";

  const exactTitles = {
    "/phones": "Điện thoại | TechVolt",
    "/laptops": "Laptop | TechVolt",
    "/accessories": "Phụ kiện | TechVolt",
    "/flash-sale": "Flash Sale | TechVolt",
    "/search": "Tìm kiếm | TechVolt",
    "/cart": "Giỏ hàng | TechVolt",
    "/checkout": "Thanh toán | TechVolt",
    "/orders": "Đơn hàng của tôi | TechVolt",
    "/admin": "Tổng quan | TechVolt Admin",
    "/admin/products": "Sản phẩm | TechVolt Admin",
    "/admin/products/add": "Thêm sản phẩm | TechVolt Admin",
    "/admin/orders": "Đơn hàng | TechVolt Admin",
    "/admin/chat": "Tin nhắn | TechVolt Admin",
  };

  if (exactTitles[pathname]) return exactTitles[pathname];
  if (pathname.startsWith("/product/")) return "Chi tiết sản phẩm | TechVolt";
  if (pathname.startsWith("/orders/")) return "Chi tiết đơn hàng | TechVolt";
  if (pathname.startsWith("/admin/products/edit/")) return "Sửa sản phẩm | TechVolt Admin";
  if (pathname.startsWith("/admin/orders/")) return "Chi tiết đơn hàng | TechVolt Admin";

  return "TechVolt";
};

const DocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getPageTitle(pathname);
  }, [pathname]);

  return null;
};

export default DocumentTitle;
