import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../api/cartService";

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};

const getProduct = (item) => {
  return typeof item.product === "object" && item.product !== null ? item.product : null;
};

const CartPage = () => {
  const hasToken = Boolean(localStorage.getItem("token"));
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(hasToken);
  const [updatingItemId, setUpdatingItemId] = useState("");
  const navigate = useNavigate();

  const cartItems = useMemo(() => cart?.items || [], [cart]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price || 0) + "đ";

  const fetchCart = async () => {
    try {
      const nextCart = await getCart();
      setCart(nextCart);
    } catch (err) {
      alert(getErrorMessage(err, "Không tải được giỏ hàng."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasToken) {
      void Promise.resolve().then(fetchCart);
    }
  }, [hasToken]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
      return;
    }

    setSelectedItems(cartItems.map((item) => item._id));
  };

  const getVariantStock = (item) => {
    const product = getProduct(item);
    const variant = product?.variants?.find(
      (productVariant) => productVariant.color === item.colorSelected,
    );

    return variant?.stock || 0;
  };

  const handleQuantityChange = async (item, type) => {
    const maxStock = getVariantStock(item);
    let nextQuantity = item.quantity;

    if (type === "minus" && nextQuantity > 1) nextQuantity -= 1;
    if (type === "plus" && nextQuantity < maxStock) nextQuantity += 1;

    if (nextQuantity === item.quantity) return;

    try {
      setUpdatingItemId(item._id);
      const nextCart = await updateCartItem(item._id, nextQuantity);
      setCart(nextCart);
    } catch (err) {
      alert(getErrorMessage(err, "Không cập nhật được số lượng sản phẩm."));
    } finally {
      setUpdatingItemId("");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const nextCart = await removeCartItem(itemId);
      setCart(nextCart);
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    } catch (err) {
      alert(getErrorMessage(err, "Không xóa được sản phẩm khỏi giỏ hàng."));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) return;

    try {
      await Promise.all(selectedItems.map((itemId) => removeCartItem(itemId)));
      setSelectedItems([]);
      await fetchCart();
    } catch (err) {
      alert(getErrorMessage(err, "Không xóa được các sản phẩm đã chọn."));
    }
  };

  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => {
      const product = getProduct(item);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    const checkoutItems = cartItems
      .filter((item) => selectedItems.includes(item._id))
      .map((item) => {
        const product = getProduct(item);

        return {
          cartItemId: item._id,
          product: product?._id,
          title: product?.title,
          thumbnail: product?.thumbnail,
          price: product?.price || 0,
          quantity: item.quantity,
          colorSelected: item.colorSelected,
        };
      });

    navigate("/checkout", {
      state: {
        checkoutItems,
        totalAmount,
        isBuyNow: false,
      },
    });
  };

  if (!hasToken) {
    return (
      <div className="bg-[#f4f6f8] min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vui lòng đăng nhập để xem giỏ hàng
        </h2>
        <Link
          to="/"
          className="px-8 py-3 bg-[#e30019] text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          VỀ TRANG CHỦ
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#f4f6f8] min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#f4f6f8] min-h-[70vh] flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-32 h-32 text-gray-300 mb-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500 mb-8">
          Hãy mua sắm để lấp đầy giỏ hàng nhé!
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-[#e30019] text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-32 pt-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black text-black uppercase mb-6 tracking-wide border-l-4 border-[#e30019] pl-3">
          Giỏ Hàng Của Bạn
        </h1>

        <div className="hidden lg:grid grid-cols-12 gap-4 bg-white p-4 rounded-xl shadow-sm mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider items-center">
          <div className="col-span-5 pl-12">
            <span>Sản Phẩm</span>
          </div>
          <div className="col-span-2 text-center">Đơn Giá</div>
          <div className="col-span-2 text-center">Số Lượng</div>
          <div className="col-span-2 text-center">Số Tiền</div>
          <div className="col-span-1 text-center">Thao Tác</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
            <input
              type="checkbox"
              checked={
                selectedItems.length === cartItems.length &&
                cartItems.length > 0
              }
              onChange={handleSelectAll}
              className="w-5 h-5 accent-[#e30019] cursor-pointer"
            />
            <span className="bg-[#e30019] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Mall
            </span>
            <span className="font-bold text-black uppercase">
              TechVolt Official Store
            </span>
          </div>

          {cartItems.map((item, index) => {
            const product = getProduct(item);
            const variantText = `Phân loại: ${item.colorSelected}`;
            const maxStock = getVariantStock(item);
            const isUpdating = updatingItemId === item._id;

            if (!product) {
              return (
                <div key={item._id} className="p-6 text-sm text-gray-500 border-b border-gray-100">
                  Sản phẩm trong giỏ hàng không còn tồn tại.
                </div>
              );
            }

            return (
              <div
                key={item._id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-6 items-center transition-colors ${
                  index !== cartItems.length - 1
                    ? "border-b border-gray-100"
                    : ""
                } hover:bg-gray-50`}
              >
                <div className="col-span-1 lg:col-span-5 flex items-start lg:items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelectItem(item._id)}
                    className="w-5 h-5 accent-[#e30019] cursor-pointer mt-3 lg:mt-0"
                  />
                  <Link
                    to={`/product/${product._id}`}
                    className="w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 border border-gray-200 rounded-lg p-1 bg-white hover:border-[#ffc107] transition-colors"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      to={`/product/${product._id}`}
                      className="text-base font-semibold text-gray-900 hover:text-[#e30019] line-clamp-2 transition-colors"
                    >
                      {product.title}
                    </Link>
                    <span className="text-sm text-gray-500 mt-1">
                      {variantText}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      Còn lại: {maxStock}
                    </span>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-2 lg:gap-0 mt-2 lg:mt-0">
                  <span className="lg:hidden text-gray-500 text-sm">
                    Đơn giá:
                  </span>
                  <div className="text-center">
                    <div className="text-black font-semibold">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 flex justify-between lg:justify-center items-center mt-2 lg:mt-0">
                  <span className="lg:hidden text-gray-500 text-sm">
                    Số lượng:
                  </span>
                  <div className="inline-flex items-center bg-white rounded-md border border-gray-300">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleQuantityChange(item, "minus")}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={item.quantity}
                      className="w-10 h-8 text-center font-medium text-sm bg-transparent focus:outline-none text-black border-x border-gray-200"
                    />
                    <button
                      type="button"
                      disabled={isUpdating || item.quantity >= maxStock}
                      onClick={() => handleQuantityChange(item, "plus")}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 flex justify-between lg:justify-center items-center mt-2 lg:mt-0">
                  <span className="lg:hidden text-gray-500 text-sm">
                    Số tiền:
                  </span>
                  <div className="text-[#e30019] font-bold text-lg">
                    {formatPrice(product.price * item.quantity)}
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-1 flex justify-end lg:justify-center mt-2 lg:mt-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="text-gray-500 hover:text-[#e30019] text-sm font-semibold transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === cartItems.length &&
                    cartItems.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-[#e30019] cursor-pointer"
                />
                <span className="text-black font-semibold text-sm sm:text-base">
                  Chọn Tất Cả ({cartItems.length})
                </span>
              </label>
              <button
                type="button"
                onClick={handleDeleteSelected}
                className={`text-sm font-medium transition-colors ${selectedItems.length > 0 ? "text-gray-900 hover:text-[#e30019]" : "text-gray-400 cursor-not-allowed"}`}
                disabled={selectedItems.length === 0}
              >
                Xóa mục đã chọn
              </button>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    Tổng thanh toán ({selectedItems.length} Sản phẩm):
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-[#e30019]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <span className="text-xs text-[#ffc107] font-bold mt-1 tracking-wide uppercase">
                  Tiết kiệm được thêm nhờ áp dụng voucher
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className={`px-8 sm:px-12 py-3 sm:py-4 font-black rounded-xl uppercase transition-all shadow-md text-sm sm:text-base ${
                  selectedItems.length > 0
                    ? "bg-[#e30019] hover:bg-red-700 text-white active:scale-95 shadow-red-500/30"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Mua Hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
