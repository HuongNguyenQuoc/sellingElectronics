const Footer = () => {
  return (
    <footer className="bg-[#e4e2e1] pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Cột 1: Thông tin công ty */}
          <div>
            <div className="mb-4">
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                TechVolt{" "}
              </span>
              <span className="text-2xl font-black text-yellow-600 tracking-tight">
                Electronics
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Nền tảng thương mại điện tử mua sắm sản phẩm số chính hãng thế hệ
              mới, phân phối độc quyền thiết bị công nghệ hàng đầu khu vực Đông
              Nam Á.
            </p>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <span className="font-bold text-gray-800">📍 Trụ sở:</span> Số
                141 Chiến Thắng, Phường Thanh Liệt, TP.Hà Nội
              </p>
              <p>
                <span className="font-bold text-gray-800">
                  📞 Hotline hỗ trợ:
                </span>{" "}
                1900 8129 (Miễn phí)
              </p>
              <p>
                <span className="font-bold text-gray-800">
                  ✉️ Hòm thư điện tử:
                </span>{" "}
                hotro@techvolt.com.vn
              </p>
            </div>
          </div>

          {/* Cột 2: Hỗ trợ khách hàng */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">
              Hỗ trợ khách hàng
            </h3>
            <ul className="text-sm text-gray-500 space-y-4">
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Trung tâm bảo hành đổi mới
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Chính sách giao nhận hỏa tốc
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Hướng dẫn trả góp lãi suất 0%
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Tra cứu hóa đơn và vận đơn
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Hỗ trợ xử lý lỗi kỹ thuật
              </li>
            </ul>
          </div>

          {/* Cột 3: Về TechVolt */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">
              Về TechVolt
            </h3>
            <ul className="text-sm text-gray-500 space-y-4">
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Câu chuyện thương hiệu
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Cơ hội thực tập & việc làm
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Điều khoản bảo mật thông tin
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Chương trình liên minh đối tác
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Quan hệ cổ đông chiến lược
              </li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">
              Đăng ký nhận tin
            </h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Nhận tin VIP trước mọi người khác về đợt Flash Sale tiếp theo và
              nhận mã giảm giá 100k đầu tiên.
            </p>
          </div>
        </div>

        {/* Dòng Copyright dưới cùng */}
        <div className="border-t border-gray-300 pt-6 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 TechVolt Electronics. Mọi quyền được bảo hộ và quản lý.
          </p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6 text-xs font-semibold text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer transition-colors">
              VPBank Partner
            </span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">
              Apple Authorized Retailer
            </span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">
              Samsung Premium Distributor
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
