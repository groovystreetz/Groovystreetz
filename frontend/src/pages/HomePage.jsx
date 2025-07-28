import React from "react";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider"; // Assuming you have a HeroSection component
import Categories from "../components/Categories";
import TopPicks from "../components/TopPicks";
import ShopByGroovy from "../components/ShopByGroovy";
import NewArrivals from "../components/NewArrivals";
import SpotlightProducts from "../components/SpotlightProducts";
import Banners from "../components/BannerSection"; // Assuming you have a Banners component
import VideoSection from "../components/VideoSection"; // Assuming you have a VideoSection component
import NoPrint from "../components/NoPrint";
import SellingPartners from "../components/SellingPartners";
import Footer from "../components/Footer"; 

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <HeroSlider />
        <NewArrivals />
        <SpotlightProducts />
        <Categories />
        <TopPicks />
        <ShopByGroovy />
        <SpotlightProducts />
        <Banners />
        <VideoSection />
        <NoPrint />
      </div>
      <SellingPartners />
      <Footer />
    </>
  );
};

export default HomePage;
