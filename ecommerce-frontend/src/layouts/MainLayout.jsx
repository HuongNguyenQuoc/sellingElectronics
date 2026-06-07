import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="bg-[#fbf9f8] min-h-screen">
        {/* Nội dung các trang HomePage, CartPage, v.v. sẽ đổ vào đây */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;