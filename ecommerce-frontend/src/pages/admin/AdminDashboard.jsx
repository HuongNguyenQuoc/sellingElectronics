import { useState, useMemo } from "react";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { dummyAll } from "../../data/mockData";

// ================= DỮ LIỆU MOCK THEO CHUẨN INTERFACE IOrder =================
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth(); 

const mockOrders = [
  // THÁNG HIỆN TẠI (Tính doanh thu cho status: 'SHIPPED')
  // Tổng doanh thu 100.000.000đ -> Điện thoại 53%, Laptop 32%, Phụ kiện 15%
  { 
    _id: "ORD-D01", userId: "user_6", status: "SHIPPED", paymentMethod: "COD", totalCost: 53000000, createdAt: new Date(currentYear, currentMonth, 1).getTime(),
    shippingAddress: { fullName: "Vũ F", phone: "0906", address: "Số 1 Hà Nội", city: "Hà Nội" },
    items: [{ product: "11", name: "iPhone 15 Pro Max 256GB", image: "https://placehold.co/100x100?text=SP", quantity: 20, price: 2650000, colorSelected: "Vàng" }] 
  },
  { 
    _id: "ORD-D02", userId: "user_7", status: "SHIPPED", paymentMethod: "Momo", totalCost: 20000000, createdAt: new Date(currentYear, currentMonth, 2).getTime(),
    shippingAddress: { fullName: "Bùi G", phone: "0907", address: "Quận 1", city: "HCM" },
    items: [{ product: "12", name: "MacBook Air M2 2022", image: "https://placehold.co/100x100?text=SP", quantity: 10, price: 2000000, colorSelected: "Bạc" }] 
  },
  { 
    _id: "ORD-D03", userId: "user_8", status: "SHIPPED", paymentMethod: "COD", totalCost: 12000000, createdAt: new Date(currentYear, currentMonth, 3).getTime(),
    shippingAddress: { fullName: "Đặng H", phone: "0908", address: "Hải Châu", city: "Đà Nẵng" },
    items: [{ product: "14", name: "Asus Zenbook 14 OLED", image: "https://placehold.co/100x100?text=SP", quantity: 8, price: 1500000, colorSelected: "Đen" }] 
  },
  { 
    _id: "ORD-D04", userId: "user_9", status: "SHIPPED", paymentMethod: "Thẻ Tín Dụng", totalCost: 10000000, createdAt: new Date(currentYear, currentMonth, 4).getTime(),
    shippingAddress: { fullName: "Ngô I", phone: "0909", address: "Ninh Kiều", city: "Cần Thơ" },
    items: [{ product: "15", name: "Tai nghe Bluetooth Sony", image: "https://placehold.co/100x100?text=SP", quantity: 25, price: 400000, colorSelected: "Đen" }] 
  },
  { 
    _id: "ORD-D05", userId: "user_10", status: "SHIPPED", paymentMethod: "COD", totalCost: 5000000, createdAt: new Date(currentYear, currentMonth, 5).getTime(),
    shippingAddress: { fullName: "Đỗ K", phone: "0910", address: "Lê Chân", city: "Hải Phòng" },
    items: [{ product: "16", name: "Chuột không dây Logitech", image: "https://placehold.co/100x100?text=SP", quantity: 10, price: 500000, colorSelected: "Trắng" }] 
  },

  // CÁC THÁNG TRƯỚC (Để vẽ biểu đồ cột 12 tháng)
  { 
    _id: "ORD-M01", userId: "user_1", status: "SHIPPED", paymentMethod: "COD", totalCost: 19290000, createdAt: new Date(currentYear, 0, 15).getTime(),
    shippingAddress: { fullName: "Nguyễn Văn A", phone: "0901", address: "Cầu Giấy", city: "Hà Nội" }, items: [] 
  },
  { 
    _id: "ORD-M02", userId: "user_2", status: "SHIPPED", paymentMethod: "Thẻ Tín Dụng", totalCost: 38580000, createdAt: new Date(currentYear, 1, 20).getTime(),
    shippingAddress: { fullName: "Trần B", phone: "0902", address: "Quận 3", city: "HCM" }, items: [] 
  },
  { 
    _id: "ORD-M03", userId: "user_3", status: "SHIPPED", paymentMethod: "Momo", totalCost: 5990000, createdAt: new Date(currentYear, 2, 10).getTime(),
    shippingAddress: { fullName: "Lê C", phone: "0903", address: "Sơn Trà", city: "Đà Nẵng" }, items: [] 
  },
  { 
    _id: "ORD-M04", userId: "user_4", status: "SHIPPED", paymentMethod: "COD", totalCost: 12000000, createdAt: new Date(currentYear, 3, 5).getTime(),
    shippingAddress: { fullName: "Phạm D", phone: "0904", address: "Bình Thủy", city: "Cần Thơ" }, items: [] 
  },

  // TRẠNG THÁI KHÁC (Chờ xử lý, Đã hủy)
  { 
    _id: "ORD-P01", userId: "user_11", status: "PROCESSING", paymentMethod: "COD", totalCost: 12000000, createdAt: new Date(currentYear, currentMonth, 6).getTime(),
    shippingAddress: { fullName: "Lý M", phone: "0911", address: "Quận 5", city: "HCM" }, items: [] 
  },
  { 
    _id: "ORD-C01", userId: "user_12", status: "CANCELLED", paymentMethod: "COD", totalCost: 19290000, createdAt: new Date(currentYear, currentMonth, 2).getTime(),
    shippingAddress: { fullName: "Tô N", phone: "0912", address: "Thanh Xuân", city: "Hà Nội" }, items: [] 
  }
];
// =========================================================================

// BẢNG 3 MÀU CHO 3 DANH MỤC: Điện thoại (Xanh), Laptop (Cam), Phụ kiện (Lục)
const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

const AdminDashboard = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  
  const defaultStartDate = `${yyyy}-${mm}-01`; 
  const defaultEndDate = `${yyyy}-${mm}-${dd}`;

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedYear, setSelectedYear] = useState(yyyy);

  // 1. LỌC ĐƠN HÀNG THEO THỜI GIAN (Đổi orderDate thành createdAt)
  const filteredOrders = useMemo(() => {
    const startTimestamp = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : 0;
    const endTimestamp = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
    return mockOrders.filter(order => order.createdAt >= startTimestamp && order.createdAt <= endTimestamp);
  }, [startDate, endDate]);

  // 2. TÍNH TOÁN 4 Ô KPI (Đổi orderStatus thành status, totalAmount thành totalCost)
  // GHI CHÚ: Doanh thu tính riêng cho các đơn có status === "SHIPPED"
  const stats = useMemo(() => {
    let revenue = 0, completed = 0, cancelled = 0, pending = 0;
    filteredOrders.forEach(order => {
      if (order.status === "SHIPPED") { revenue += order.totalCost; completed++; }
      else if (order.status === "CANCELLED") { cancelled++; }
      else if (order.status === "PROCESSING") { pending++; }
    });
    return { revenue, completed, cancelled, pending };
  }, [filteredOrders]);

  // 3. BIỂU ĐỒ KHU VỰC (AREA CHART - Lấy data từ SHIPPED)
  const lineChartData = useMemo(() => {
    const dataMap = {};
    const shippedOrders = filteredOrders.filter(o => o.status === "SHIPPED");
    
    shippedOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
      if (!dataMap[dateStr]) dataMap[dateStr] = 0;
      dataMap[dateStr] += order.totalCost;
    });

    return Object.keys(dataMap)
      .sort((a, b) => { 
        const [dayA, monthA] = a.split('/');
        const [dayB, monthB] = b.split('/');
        return new Date(yyyy, monthA - 1, dayA) - new Date(yyyy, monthB - 1, dayB);
      })
      .map(date => ({ date, "Doanh thu": dataMap[date] }));
  }, [filteredOrders, yyyy]);

  // 4. BIỂU ĐỒ CỘT (ĐỎ)
  const barChartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: `Thg ${i + 1}`, "Doanh thu": 0
    }));

    mockOrders.forEach(order => {
      if (order.status === "SHIPPED") {
        const d = new Date(order.createdAt);
        if (d.getFullYear() === selectedYear) {
          months[d.getMonth()]["Doanh thu"] += order.totalCost;
        }
      }
    });
    return months;
  }, [selectedYear]);

  // 5. BIỂU ĐỒ TRÒN & TOP 5 SẢN PHẨM (Đọc dữ liệu theo giao diện IOrderItem)
  const { pieChartData, topProducts, totalPieValue } = useMemo(() => {
    const catMap = { "Điện thoại": 0, "Laptop": 0, "Phụ kiện": 0 };
    const prodMap = {};

    filteredOrders.filter(o => o.status === "SHIPPED").forEach(order => {
      if (!order.items) return;

      order.items.forEach(item => {
        // Tái sử dụng ảnh từ file mockData.js (dummyAll) nếu item.image bị rỗng
        const productData = dummyAll?.find(p => String(p.id) === String(item.product));
        const itemThumb = item.image || productData?.thumbnail || productData?.images?.[0] || "https://placehold.co/100x100?text=SP";
        
        const itemRevenue = item.price * item.quantity;
        
        // Nhận diện Category để đưa vào biểu đồ tròn
        let category = "Phụ kiện";
        if (['11'].includes(String(item.product))) category = "Điện thoại";
        else if (['12', '14'].includes(String(item.product))) category = "Laptop";
        
        if (catMap[category] !== undefined) {
          catMap[category] += itemRevenue;
        }

        // Tạo mảng nhóm Top 5
        if (!prodMap[item.product]) {
          prodMap[item.product] = { 
            id: item.product, title: item.name, thumbnail: itemThumb, 
            sold: 0, revenue: 0 
          };
        }
        prodMap[item.product].sold += item.quantity;
        prodMap[item.product].revenue += itemRevenue;
      });
    });

    const pieData = Object.keys(catMap).map(key => ({ name: key, value: catMap[key] }));
    const totalPieValue = pieData.reduce((sum, item) => sum + item.value, 0);

    const top5 = Object.values(prodMap)
      .sort((a, b) => b.sold - a.sold) 
      .slice(0, 5); 

    return { pieChartData: pieData, topProducts: top5, totalPieValue };
  }, [filteredOrders]);

  const formatCurrency = (value) => new Intl.NumberFormat("vi-VN").format(value) + " ₫";

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER & BỘ LỌC (GIỮ NGUYÊN UI) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Thống kê kinh doanh</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng quan dòng tiền và hiệu suất bán hàng.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-xl shadow-sm border border-gray-100 gap-2 items-center">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Từ</span>
            <input 
              type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none"
            />
          </div>
          <span className="text-gray-300">-</span>
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Đến</span>
            <input 
              type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* KHỐI 4 KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-md border border-gray-800 flex flex-col justify-center relative overflow-hidden">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide relative z-10">Tổng Doanh Thu</p>
          <p className="text-3xl font-black text-yellow-400 mt-2 relative z-10">{formatCurrency(stats.revenue)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Đơn Hoàn Thành
          </p>
          <p className="text-3xl font-black text-gray-900 mt-2">{stats.completed}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Đơn Đang Xử Lý
          </p>
          <p className="text-3xl font-black text-amber-500 mt-2">{stats.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Đơn Đã Hủy
          </p>
          <p className="text-3xl font-black text-rose-600 mt-2">{stats.cancelled}</p>
        </div>
      </div>

      {/* BIỂU ĐỒ KHU VỰC: GÓC CẠNH (LINEAR) VÀ CÓ MÀU NỀN */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-6">Biến động doanh thu theo ngày</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineChartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `${val / 1000000}M`} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Area type="linear" dataKey="Doanh thu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BIỂU ĐỒ CỘT: DOANH THU 12 THÁNG (ĐỎ) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">Doanh thu tổng quan theo tháng</h3>
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <button onClick={() => setSelectedYear(prev => prev - 1)} className="text-gray-500 hover:text-red-600 font-bold p-1">&lt;</button>
            <span className="text-sm font-semibold text-gray-700 w-20 text-center">Năm {selectedYear}</span>
            <button onClick={() => setSelectedYear(prev => prev + 1)} className="text-gray-500 hover:text-red-600 font-bold p-1">&gt;</button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280'}} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `${val / 1000000}M`} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f9fafb'}} formatter={(value) => formatCurrency(value)} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="Doanh thu" fill="#e30019" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BIỂU ĐỒ TRÒN & TOP 5 SẢN PHẨM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Biểu đồ Tròn */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-2">Cơ cấu doanh thu</h3>
          <p className="text-xs text-gray-400 mb-6">(Dựa trên bộ lọc thời gian)</p>
          
          <div className="flex flex-col h-full">
            <div className="h-[220px]">
              {pieChartData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {pieChartData.filter(d => d.value > 0).map((entry, index) => {
                        const originalIndex = pieChartData.findIndex(p => p.name === entry.name);
                        return <Cell key={`cell-${index}`} fill={PIE_COLORS[originalIndex]} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">Không có dữ liệu</div>
              )}
            </div>

            {/* HIỂN THỊ % VÀ DOANH THU CHI TIẾT */}
            <div className="mt-4 flex flex-col gap-3 px-2">
              {pieChartData.map((entry, index) => {
                const percent = totalPieValue > 0 ? Math.round((entry.value / totalPieValue) * 100) : 0;
                return (
                  <div key={entry.name} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                      <span className="font-semibold text-gray-700">{entry.name}</span>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="text-gray-500 font-medium w-24 text-right">{formatCurrency(entry.value)}</span>
                      <span className="font-black text-gray-900 w-12 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top 5 Bán Chạy */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-2">Top 5 Bán Chạy Nhất</h3>
          <p className="text-xs text-gray-400 mb-6">Xếp hạng theo số lượng bán ra</p>
          
          <div className="flex-1 flex flex-col gap-4">
            {topProducts.length > 0 ? topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="w-8 flex-shrink-0 text-center font-black text-xl text-gray-300">
                  #{index + 1}
                </div>
                <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg p-1 flex-shrink-0">
                  <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{product.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">Đã bán: <span className="font-bold text-[#e30019]">{product.sold}</span> chiếc</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400 mb-0.5">Mang lại</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">Chưa có giao dịch thành công</div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;