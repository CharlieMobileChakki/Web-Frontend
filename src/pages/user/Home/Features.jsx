// Features.jsx
import React from "react";
import { Truck, CreditCard, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-10 h-10" />,
    title: "Fast Delivery",
    desc: "Tez aur Surakshit Delivery aapke ghar tak.",
  },
  {
    icon: <CreditCard className="w-10 h-10" />,
    title: "Online Payment",
    desc: "Secure aur Easy UPI, Card & Netbanking options.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    title: "Bina Milawat",
    desc: "100% Shudh aur Fresh Quality Products.",
  },
  {
    icon: <Headphones className="w-10 h-10" />,
    title: "Customer Support",
    desc: "24x7 Madad ke liye hum hamesha uplabdh hain.",
  },
];

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Features = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <section className="py-12 bg-gradient-to-r from-[#A98C43] via-[#A98C43] to-[#C6363E]">
      <div className="container px-4 mx-auto">

        {/* Mobile View: Slider */}
        <div className="md:hidden">
          <Slider {...settings}>
            {features.map((f, idx) => (
              <div key={idx} className="px-2"> {/* Wrapper for slide padding */}
                <div className="flex flex-col items-center p-6 border border-gray-50 rounded-2xl shadow hover:shadow-lg transition bg-white/10 backdrop-blur-sm h-full">
                  <div className="mb-4 text-gray-100">{f.icon}</div>
                  <h3 className="text-lg font-bold text-gray-100">{f.title}</h3>
                  <p className="text-sm text-gray-200 mt-2 text-center">{f.desc}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop View: Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-6 border border-gray-50 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4 text-gray-100">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-100">{f.title}</h3>
              <p className="text-sm text-gray-200 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
