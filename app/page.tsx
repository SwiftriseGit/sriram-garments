import TopBar from "@/components/TopBar";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturesBanner from "@/components/FeaturesBanner";
import NewArrivals from "@/components/NewArrivals";
import PromoBanners from "@/components/PromoBanners";
import OfferBanner from "@/components/OfferBanner";
import ShopByCategory from "@/components/ShopByCategory";
import StyleMoment from "@/components/StyleMoment";
import BestSellers from "@/components/BestSellers";
import SeasonSaleBanner from "@/components/SeasonSaleBanner";
import Testimonials from "@/components/Testimonials";
import FollowUs from "@/components/FollowUs";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <TopBar />
      <SiteHeader />

      <main>
        {/* Hero Banner */}
        <HeroSection />

        {/* Category Cards: Men, Women, Kids, Offers */}
        <CategoryCards />

        {/* Features Strip */}
        <FeaturesBanner />

        {/* New Arrivals Product Grid */}
        <NewArrivals />

        {/* Promo Banners: Premium Shirts + Trendy T-Shirts */}
        <PromoBanners />

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

        {/* Features Strip */}
        <FeaturesBanner />

        {/* Testimonials */}
        <Testimonials />

        {/* Follow Us */}
        <FollowUs />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
