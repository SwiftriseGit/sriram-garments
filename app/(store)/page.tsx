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
import { getBannerSettings } from "@/actions/banners";

export default async function Home() {
  const bannerSettings = await getBannerSettings();

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

      {/* Offer: Buy 2 Get 1 Free (Dynamic & Toggleable) */}
      {bannerSettings.offerBanner.enabled && (
        <OfferBanner data={bannerSettings.offerBanner} />
      )}

      {/* Shop By Category */}
      <ShopByCategory />

      {/* Style for Every Moment */}
      <StyleMoment />

      {/* Best Sellers */}
      <BestSellers />

      {/* Season Sale (Dynamic & Toggleable) */}
      {bannerSettings.seasonSaleBanner.enabled && (
        <SeasonSaleBanner data={bannerSettings.seasonSaleBanner} />
      )}

      {/* Testimonials */}
      <Testimonials />

      {/* Follow Us */}
      <FollowUs />
    </>
  );
}
