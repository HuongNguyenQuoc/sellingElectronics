import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import thêm Footer
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import PhonesPage from "./pages/PhonesPage";
import LaptopsPage from "./pages/LaptopsPage";
import AccessoriesPage from "./pages/AccessoriesPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar luôn ở trên cùng */}
      <Navbar />

      {/* Khu vực nội dung thay đổi theo trang */}
      <main className="bg-[#fbf9f8] min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/phones" element={<PhonesPage />} />
          <Route path="/laptops" element={<LaptopsPage />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
        </Routes>
      </main>

      {/* Footer luôn ở dưới cùng */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
