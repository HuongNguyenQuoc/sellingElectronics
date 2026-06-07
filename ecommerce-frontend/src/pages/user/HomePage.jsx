import HeroSection from "../../components/HeroSection";
import FlashDeals from "../../components/FlashDeals";
import FeaturedPhones from "../../components/FeaturedPhones";
import FeaturedLaptops from "../../components/FeaturedLaptops";
import Accessories from "../../components/Accessories";
import Recommendations from "../../components/Recommendations";
import Footer from "../../components/Footer";
import ChatWidget from "../../components/ChatWidget";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <div id="deals-hot">
        <FlashDeals />
      </div>

      <div id="phones">
        <FeaturedPhones />
      </div>

      <div id="laptops">
        <FeaturedLaptops />
      </div>

      <div id="accessories">
        <Accessories />
      </div>

      <div id="recommendations">
        <Recommendations />
      </div>
      <ChatWidget />
    </div>
  );
};

export default HomePage;
