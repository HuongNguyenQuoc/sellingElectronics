import Accessories from "../../components/Accessories";
import ChatWidget from "../../components/ChatWidget";
import FeaturedLaptops from "../../components/FeaturedLaptops";
import FeaturedPhones from "../../components/FeaturedPhones";
import FlashDeals from "../../components/FlashDeals";
import HeroSection from "../../components/HeroSection";
import Recommendations from "../../components/Recommendations";

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
