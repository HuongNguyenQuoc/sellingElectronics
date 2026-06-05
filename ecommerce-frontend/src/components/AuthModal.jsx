import { useState } from "react";
import { loginUser, registerUser } from "../api/authService";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // Trạng thái chuyển đổi giữa form Đăng nhập và Đăng ký
  const [isLoginView, setIsLoginView] = useState(true);

  // Trạng thái hiển thị mật khẩu (Con mắt)
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  // Hàm giả lập Đăng nhập thành công
  const resetForm = () => {
    setName("");
    setEmailOrPhone("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginView) {
      try {
        const response = await loginUser(emailOrPhone, password);
        onLoginSuccess(response);
        resetForm();
        onClose();
      } catch (error) {
        alert(error.response?.data?.message || "Login failed.");
      }
    } else {
      try {
        await registerUser(name, emailOrPhone, password);
        alert("Registration successful! Please log in.");
        resetForm();
        setIsLoginView(true);
      } catch (error) {
        alert(error.response?.data?.message || "Registration failed.");
      }
    }
  };
  /*
    const mockUser = {
      name: "Khách hàng VIP",
      email: "khachhang@gmail.com"
    };
    onLoginSuccess(mockUser); 
    onClose(); 
  }; */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Lớp nền đen mờ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Khung Form Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Nút X đóng form */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-8">
          {/* Tiêu đề */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {isLoginView ? "Xin Chào! 👋" : "Tạo Tài Khoản ✨"}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLoginView
                ? "Đăng nhập để nhận ưu đãi riêng cho bạn"
                : "Tham gia TechVolt ngay hôm nay"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  HỌ VÀ TÊN
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                EMAIL HOẶC SỐ ĐIỆN THOẠI
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Nhập email hoặc SĐT..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Ô Mật Khẩu */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                MẬT KHẨU
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..." /* Đã thêm dòng này */
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />

                {/* Nút bật/tắt con mắt */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Nút Submit */}
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl px-4 py-3.5 mt-4 transition-transform active:scale-95 shadow-md"
            >
              {isLoginView ? "ĐĂNG NHẬP" : "ĐĂNG KÝ TÀI KHOẢN"}
            </button>
          </form>

          {/* Nút chuyển đổi Đăng nhập / Đăng ký */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLoginView ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="font-bold text-yellow-500 hover:text-yellow-600 underline decoration-2 underline-offset-2 focus:outline-none"
            >
              {isLoginView ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
