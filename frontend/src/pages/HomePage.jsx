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
import ShopFor from "../components/ShopFor";
import SellingPartners from "../components/SellingPartners";
import Slogan from "../components/Slogan";
import BackToTop from "../components/BackToTop";
import Footer from "../components/Footer"; 

const HomePage = () => {
  return (
    <>
      <Navbar />
        <HeroSlider />
      <div className="container mx-auto px-4">
        <NewArrivals />
        <SpotlightProducts />
        <Categories />
        <TopPicks />
        <ShopByGroovy />
        <Banners />
        <VideoSection />
        <NoPrint />
        <ShopFor />
        <Slogan />    
      </div>
      <SellingPartners />
      <Footer />
      <BackToTop />
    </>
  );
};

export default HomePage;
