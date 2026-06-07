import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  // Lấy role từ bộ nhớ (bạn có thể mock role="admin" trong AuthModal)
  const role = localStorage.getItem("role");

  // Nếu là admin -> cho phép truy cập
  if (role === "admin") {
    return <Outlet />;
  }

  // Nếu không phải -> Đá văng về trang chủ
  return <Navigate to="/" replace />;
};

export default AdminRoute;