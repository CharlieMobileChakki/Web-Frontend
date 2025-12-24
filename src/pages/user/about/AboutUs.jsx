import React from "react";
import { ShoppingBag, Truck, Shield, FileCheck } from "lucide-react";
import FAQ from "../FAQ";
import { BannerSection } from "../../../components/user/BannerSection";

import bgImage from "../../../assets/Banner/S1.png"
import Certificates from "../../../components/user/Certificates";







const AboutUs = () => {
  return (

    <>

      <BannerSection
        title="About Us"
        subtitle="Doorstep grinding & organic food delivery for a healthier tomorrow"
        bgImage={bgImage}
        className="bg-left-bottom"
      />

      <div className="bg-[#fffaf3] min-h-screen py-10 px-6 md:px-16">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-[#7a5410] mb-8">
          About Mobile Chakki
        </h1>

        {/* Overview */}
        <section className="max-w-5xl mx-auto mb-12 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Mobile Chakki is an{" "}
            <span className="font-semibold text-[#7a5410]">
              app-based doorstep grain grinding and organic food delivery
            </span>{" "}
            platform. We deliver high-quality atta, grains, spices, and health
            blends quickly, focusing on purity, transparency, and customer
            convenience.
          </p>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white p-6 shadow-md rounded-2xl border border-[#e6d9b5] flex flex-col items-center text-center">
            <ShoppingBag className="text-[#b08943]" size={40} />
            <h3 className="text-xl font-semibold mt-4 text-[#7a5410]">
              Pure Products
            </h3>
            <p className="text-gray-600 mt-2">
              100% natural, chemical-free atta, grains, spices, and superfoods.
            </p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-2xl border border-[#e6d9b5] flex flex-col items-center text-center">
            <Truck className="text-[#b08943]" size={40} />
            <h3 className="text-xl font-semibold mt-4 text-[#7a5410]">
              Doorstep Delivery
            </h3>
            <p className="text-gray-600 mt-2">
              EV vans arrive at your home and grind fresh grains live in front of
              you.
            </p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-2xl border border-[#e6d9b5] flex flex-col items-center text-center">
            <Shield className="text-[#b08943]" size={40} />
            <h3 className="text-xl font-semibold mt-4 text-[#7a5410]">
              Safe & Certified
            </h3>
            <p className="text-gray-600 mt-2">
              All products follow FSSAI and food safety certifications.
            </p>
          </div>
        </section>




        {/* Certificates Section */}
        <Certificates />



        {/* FAQ Component */}
        <FAQ   />
      </div>
    </>

  );
};

export default AboutUs;

 
