import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { getProductId } from "../utils/productUtils";

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getSearchText = (product) =>
  normalizeText(
    `${product?.title || ""} ${product?.brandName || ""} ${
      Array.isArray(product?.tags) ? product.tags.join(" ") : ""
    }`,
  );

const getProductPath = (product, fallbackPath) => {
  const productId = getProductId(product);
  return productId ? `/product/${productId}` : fallbackPath;
};

const HeroSection = () => {
  const { products } = useProducts();

  const promoProducts = useMemo(() => {
    const productsWithSearchText = products.map((product) => ({
      product,
      searchText: getSearchText(product),
    }));

    const findByTerms = (...terms) => {
      const normalizedTerms = terms.map(normalizeText);
      return productsWithSearchText.find(({ searchText }) =>
        normalizedTerms.every((term) => searchText.includes(term)),
      )?.product;
    };

    const gamingLaptop = productsWithSearchText.find(({ searchText }) => {
      return (
        searchText.includes("laptop") &&
        (searchText.includes("gaming") ||
          searchText.includes("rog") ||
          searchText.includes("asus"))
      );
    })?.product;

    return {
      galaxyS24: findByTerms("galaxy", "s24") || findByTerms("samsung", "s24"),
      macbookAirM3: findByTerms("macbook", "m3") || findByTerms("macbook air"),
      gamingLaptop,
    };
  }, [products]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px]">
        {/* Banner lớn bên trái (Samsung) */}
        <div className="lg:col-span-2 relative group overflow-hidden rounded-3xl bg-black">
          <img
            src="https://static.chotot.com/storage/chotot-kinhnghiem/c2c/2026/05/08a220c4-bang-gia-samsung-s24-ultra-thong-tin-moi-nhat.webp"
            alt="Samsung S24"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10 pointer-events-none"></div>

          <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center z-20 w-full md:w-3/4 lg:w-2/3">
            <span className="text-red-500 font-bold mb-2 uppercase tracking-widest text-sm drop-shadow-md">
              New Release
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
              Samsung Galaxy S24 <br /> Series
            </h2>
            <p className="text-gray-200 mb-8 max-w-sm drop-shadow-md">
              Trải nghiệm sức mạnh của AI đỉnh cao với hệ thống camera mắt thần
              bóng đêm cực nét.
            </p>
            <Link
              to={getProductPath(promoProducts.galaxyS24, "/phones")}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full w-fit transition-all transform hover:scale-105 shadow-lg"
            >
              Khám Phá Ngay
            </Link>
          </div>
        </div>

        {/* Cột bên phải gồm 2 banner nhỏ */}
        <div className="flex flex-col gap-4 h-full">
          {/* Banner nhỏ 1 (Macbook) */}
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-black group">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiF4Z2zo2EhfX5JeYwkqfUMQdgqm3cPYmuJw&s"
              alt="Macbook"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500 z-10 pointer-events-none"></div>

            <div className="absolute inset-0 p-8 flex flex-col justify-center z-20">
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                MacBook Air M3
              </h3>
              <p className="text-gray-300 text-xs mb-4 drop-shadow-md">
                Cấu hình đỉnh cao, làm việc hiệu quả hơn bao giờ hết.
              </p>
              <Link
                to={getProductPath(promoProducts.macbookAirM3, "/laptops")}
                className="text-sm font-bold border-b-2 border-white text-white w-fit hover:text-yellow-400 hover:border-yellow-400 transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>

          {/* Banner nhỏ 2 (Laptop Gaming) */}
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-black group">
            <img
              src="https://www.ankhang.vn/media/news/1503_laptop-gaming-ai-cao-cap-14-inch-acer-predator-helios-neo-14.jpg"
              alt="Gaming Laptop"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500 z-10 pointer-events-none"></div>

            <div className="absolute inset-0 p-8 flex flex-col justify-center z-20">
              <h3 className="text-xl font-bold text-white mb-2 uppercase drop-shadow-md">
                Laptop Gaming AI
              </h3>
              <p className="text-gray-300 text-xs mb-4 drop-shadow-md">
                Phá vỡ mọi giới hạn với đồ họa mạnh mẽ đỉnh cao.
              </p>
              <Link
                to={getProductPath(promoProducts.gamingLaptop, "/laptops")}
                className="text-sm font-bold border-b-2 border-white text-white w-fit hover:text-yellow-400 hover:border-yellow-400 transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
