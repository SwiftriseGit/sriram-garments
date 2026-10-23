import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturesBanner from "@/components/FeaturesBanner";
import NewArrivals from "@/components/NewArrivals";
import OfferBanner from "@/components/OfferBanner";
import ShopByCategory from "@/components/ShopByCategory";
import StyleMoment from "@/components/StyleMoment";
import BestSellers from "@/components/BestSellers";
import SeasonSaleBanner from "@/components/SeasonSaleBanner";
import Testimonials from "@/components/Testimonials";
import FollowUs from "@/components/FollowUs";

export default function Home() {
  return (
    <>
      {/* Hero Banner */}
      <HeroSection />

      {/* Category Cards: Men, Offers */}
      <CategoryCards />

      {/* Features Strip */}
      <FeaturesBanner />

      {/* New Arrivals Product Grid */}
      <NewArrivals />

      {/* Features Strip (repeated as in design) */}
      <FeaturesBanner />

      {/* Offer: Buy 2 Get 1 Free */}
      <OfferBanner />

      {/* Shop By Category */}
      <ShopByCategory />

      {/* Style for Every Moment */}
      <StyleMoment />

      {/* Best Sellers */}
      <BestSellers />

      {/* Season Sale */}
      <SeasonSaleBanner />


      {/* Testimonials */}
      <Testimonials />

      {/* Follow Us */}
      <FollowUs />
    </>
  );
}
