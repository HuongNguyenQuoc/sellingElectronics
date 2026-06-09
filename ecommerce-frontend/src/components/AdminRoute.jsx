import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu là admin -> cho phép truy cập
  if (token && role === "admin") {
    return <Outlet />;
  }

  // Nếu không phải -> Đá văng về trang chủ
  return <Navigate to="/" replace />;
};

export default AdminRoute;
