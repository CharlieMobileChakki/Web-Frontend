import React from "react";
import HeroSection from "./HeroSection";
import ProductHome from "./ProductHome";
import Categories from "./Categories";
import AboutSection from "./AboutSection";
import Features from "./Features";
import WhyChoose from "./WhyChoose";
import Testimonials from "./Testimonials";
import DownloadAppSection from "./DownloadAppSection";

const Home = () => {
  return (
    <div className="">
      <HeroSection />
      <Categories />
      {/* <Features /> */}
      <WhyChoose />
      <ProductHome />
      <AboutSection />
      <Testimonials />
      <DownloadAppSection />
    </div>
  );
};

export default Home;
