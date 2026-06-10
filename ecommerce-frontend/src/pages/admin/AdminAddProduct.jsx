import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // --- STATE QUẢN LÝ DỮ LIỆU FORM ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [rating, setRating] = useState(""); // Trường rating mới
  const [discountPercentage, setDiscountPercentage] = useState("0"); // Mặc định là 0%
  
  // Định dạng giá tiền trực quan
  const [price, setPrice] = useState(""); // Lưu số thuần túy (VD: 1000000)
  const [displayPrice, setDisplayPrice] = useState(""); // Lưu chuỗi định dạng (VD: 1.000.000)

  const handlePriceChange = (e) => {
    // Xóa tất cả các ký tự không phải là số và dấu chấm cũ
    const rawValue = e.target.value.replace(/\./g, "");
    if (/^\d*$/.test(rawValue)) {
      setPrice(rawValue);
      // Định dạng hiển thị theo chuẩn vi-VN (dấu chấm phân cách)
      setDisplayPrice(rawValue ? Number(rawValue).toLocaleString("vi-VN") : "");
    }
  };

  // Hình ảnh chính và phụ
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState([""]); // Mảng danh sách ảnh phụ

  const handleAddImage = () => setImages([...images, ""]);
  const handleRemoveImage = (index) => {
    if (images.length > 1) setImages(images.filter((_, i) => i !== index));
  };
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };
  
  // Thông số kỹ thuật
  const [weight, setWeight] = useState("");
  const [dimFirst, setDimFirst] = useState("");
  const [dimSecond, setDimSecond] = useState("");
  const [warrantyInformation, setWarrantyInformation] = useState("");

  // Biến thế màu sắc & tồn kho
  const [variants, setVariants] = useState([{ color: "", stock: "" }]);

  const handleAddVariant = () => setVariants([...variants, { color: "", stock: "" }]);
  const handleRemoveVariant = (index) => {
    if (variants.length > 1) setVariants(variants.filter((_, i) => i !== index));
  };
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  // Từ khóa (Tags)
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // --- LOGIC KIỂM TRA VÀ LƯU SẢN PHẨM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra thủ công các trường mảng/danh sách (HTML required không kiểm tra được mảng)
    if (tags.length === 0) {
      alert("Vui lòng nhập ít nhất 1 Từ khóa (Tag) cho sản phẩm!");
      return;
    }

    const finalVariants = variants.map((variant) => ({
      color: variant.color.trim(),
      stock: Number(variant.stock),
    }));
    if (finalVariants.some((variant) => !variant.color || Number.isNaN(variant.stock))) {
      alert("Vui lòng điền đầy đủ thông tin Tên màu và Số lượng kho cho tất cả các dòng phân loại!");
      return;
    }

    const finalImages = images.map(img => img.trim()).filter(img => img !== "");
    if (finalImages.length !== images.length) {
      alert("Vui lòng điền đầy đủ liên kết URL cho tất cả các ô Ảnh chi tiết!");
      return;
    }

    // Đóng gói dữ liệu chuẩn cấu trúc Database
    const newProduct = {
      title: title.trim(),
      description: description.trim(),
      variants: finalVariants,
      price: Number(price),
      discountPercentage: Number(discountPercentage),
      rating: Number(rating),
      tags,
      brandName: brandName.trim().toUpperCase(),
      weight: Number(weight),
      dimensions: { first: dimFirst.trim(), second: dimSecond.trim() },
      warrantyInformation: warrantyInformation.trim(),
      reviews: [],
      images: finalImages,
      thumbnail: thumbnail.trim(),
    };

    try {
      setIsSubmitting(true);
      await api.post("/products", newProduct);
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      setError(getErrorMessage(err, "Thêm sản phẩm thất bại. Hãy kiểm tra token admin hoặc dữ liệu nhập."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all text-gray-800";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Thêm sản phẩm mới</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
            Hủy bỏ
          </Link>
          <button type="submit" disabled={isSubmitting} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* CHIA LÀM 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI */}
        <div className="lg:col-span-2 space-y-6">
          {/* THÔNG TIN CHUNG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin chung</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Tên sản phẩm *</label>
                <input required type="text" placeholder="VD: iPhone 15 Pro Max 256GB" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mô tả chi tiết *</label>
                <textarea required rows="4" placeholder="Nhập mô tả chi tiết tính năng sản phẩm..." value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} resize-none`}></textarea>
              </div>
            </div>
          </div>

          {/* MÀU SẮC & KHO HÀNG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Màu sắc & Tồn kho *</h2>
              <button type="button" onClick={handleAddVariant} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                + Thêm màu mới
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <input required type="text" placeholder="Tên màu (VD: Xanh Titan)" value={variant.color} onChange={e => handleVariantChange(index, "color", e.target.value)} className={inputClass} />
                  </div>
                  <div className="w-32">
                    <input required type="number" min="0" placeholder="Số lượng" value={variant.stock} onChange={e => handleVariantChange(index, "stock", e.target.value)} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => handleRemoveVariant(index)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Thông số kỹ thuật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Kích thước Dài (first) *</label>
                <input required type="text" placeholder="VD: 159.9mm" value={dimFirst} onChange={e => setDimFirst(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Kích thước Rộng (second) *</label>
                <input required type="text" placeholder="VD: 76.7mm" value={dimSecond} onChange={e => setDimSecond(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Trọng lượng (gram) *</label>
                <input required type="number" min="1" placeholder="VD: 221" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Thông tin bảo hành *</label>
                <input required type="text" placeholder="VD: Bảo hành chính hãng 12 tháng" value={warrantyInformation} onChange={e => setWarrantyInformation(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6">
          {/* GIÁ CẢ & RATING */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Giá bán & Đánh giá</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Giá bán (VND) *</label>
                {/* Ổ giá hiển thị chuỗi định dạng, bắt buộc nhập */}
                <input required type="text" placeholder="0" value={displayPrice} onChange={handlePriceChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>% Giảm giá *</label>
                  <input required type="number" min="0" max="100" placeholder="0" value={discountPercentage} onChange={e => setDiscountPercentage(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Điểm đánh giá *</label>
                  <input required type="number" min="0" max="5" step="0.1" placeholder="4.8" value={rating} onChange={e => setRating(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* HÌNH ẢNH (Có Thumbnail và mảng Images mới) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Hình ảnh sản phẩm</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Link ảnh đại diện (Thumbnail) *</label>
                <input required type="text" placeholder="Dán URL hình ảnh..." value={thumbnail} onChange={e => setThumbnail(e.target.value)} className={inputClass} />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass}>Danh sách ảnh chi tiết *</label>
                  <button type="button" onClick={handleAddImage} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    + Thêm ô ảnh
                  </button>
                </div>
                <div className="space-y-2">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input required type="text" placeholder={`URL ảnh chi tiết #${index + 1}`} value={imgUrl} onChange={e => handleImageChange(index, e.target.value)} className={inputClass} />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PHÂN LOẠI & TAGS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Phân loại hệ thống</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Thương hiệu (Brand) *</label>
                <input required type="text" placeholder="VD: IPHONE, APPLE, SAMSUNG..." value={brandName} onChange={e => setBrandName(e.target.value)} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>Từ khóa bộ lọc (Tags) *</label>
                <div className="w-full min-h-[46px] p-2 bg-gray-50 border border-gray-200 rounded-xl flex flex-wrap gap-2 items-center focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/50 transition-all">
                  {tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-xs font-bold">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">&times;</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={tags.length === 0 ? "Gõ tag rồi ấn Enter..." : ""}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none text-gray-800 px-1"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Ấn phím Enter hoặc dấu phẩy để lưu tạm từ khóa.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
};

export default AdminAddProduct;
