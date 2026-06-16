import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "admin") return <Navigate to="/admin" replace />;

  return <Outlet />;
}

export default UserRoute;