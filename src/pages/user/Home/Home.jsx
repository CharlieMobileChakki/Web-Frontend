import React from "react";
import HeroSection from "./HeroSection";
import ProductHome from "./ProductHome";
import Categories from "./Categories";
import WhoWeAre from "./WhoWeAre";
// import Features from "./Features";
// import Testimonials from "./Testimonials"
import WhyChoose from "./WhyChoose";
import DownloadAppSection from "./DownloadAppSection";

const Home = () => {
  return (
    <div className="">
      <HeroSection />
      <Categories />
      {/* <Features /> */}
      <WhyChoose />
      <ProductHome />
      <WhoWeAre />
      {/* <Testimonials /> */}
      <DownloadAppSection />
    </div>
  );
};

export default Home;
