import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// --- LAYOUTS & GUARDS ---
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import DocumentTitle from "./components/DocumentTitle";

// --- PAGES KHÁCH HÀNG ---
import HomePage from "./pages/user/HomePage";
import MyOrders from "./pages/user/MyOrders";
import OrderDetails from "./pages/user/OrderDetails";
import ProductDetail from "./pages/user/ProductDetail";
import CartPage from "./pages/user/CartPage";
import PhonesPage from "./pages/user/PhonesPage";
import LaptopsPage from "./pages/user/LaptopsPage";
import AccessoriesPage from "./pages/user/AccessoriesPage";
import FlashDeal from "./pages/user/FlashDeal";
import SearchPage from "./pages/user/SearchPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminChat from "./pages/admin/AdminChat";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";

function App() {
  return (
    <BrowserRouter>
      <DocumentTitle />
      <Routes>
        {/* ================================================== */}
        {/* LUỒNG 1: GIAO DIỆN KHÁCH HÀNG (Có Navbar & Footer) */}
        {/* ================================================== */}
        <Route element={<UserRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/phones" element={<PhonesPage />} />
            <Route path="/laptops" element={<LaptopsPage />} />
            <Route path="/accessories" element={<AccessoriesPage />} />
            <Route path="/flash-sale" element={<FlashDeal />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        {/* ================================================== */}
        {/* LUỒNG 2: GIAO DIỆN ADMIN (Có Sidebar, Cần Quyền)   */}
        {/* ================================================== */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminAddProduct />} />
            <Route path="products/edit/:id" element={<AdminEditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
