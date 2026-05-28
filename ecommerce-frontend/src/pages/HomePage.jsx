import HeroSection from "../components/HeroSection";
import FlashDeals from "../components/FlashDeals";
import FeaturedPhones from "../components/FeaturedPhones";
import FeaturedLaptops from "../components/FeaturedLaptops";
import Accessories from "../components/Accessories"; // Mới thêm
import Recommendations from "../components/Recommendations"; // Mới thêm

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FlashDeals />
      <FeaturedPhones />
      <FeaturedLaptops />
      <Accessories />
      <Recommendations />
    </div>
  );
};

export default HomePage;
