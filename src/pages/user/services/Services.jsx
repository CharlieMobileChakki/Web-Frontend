import React from 'react';
import { ShoppingBag, Truck, Leaf, Sprout } from 'lucide-react';
import { BannerSection } from '../../../components/user/BannerSection';
import bgImage from '../../../assets/Banner/S1.png';
// import Bg from "../../assets/Banner/S1.png";
export const Services = () => {
  return (
    <>
      <BannerSection
        title="Our Services"
        subtitle="Bringing Freshness and Purity to Your Doorstep"
        bgImage={bgImage}
        className="bg-center"
      />

      <div className="bg-[#fffaf3] min-h-screen py-10 px-6 md:px-16">
        <h1 className="text-4xl font-bold text-center text-[#7a5410] mb-12">
          What We Offer
        </h1>

        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 shadow-lg rounded-2xl border border-[#e6d9b5] flex flex-col items-center text-center">
            <Truck className="text-[#b08943]" size={50} />
            <h3 className="text-2xl font-semibold mt-6 text-[#7a5410]">
              Grinding services
            </h3>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Experience the freshness of live grinding with our Mobile Chakki EV van service.
              We come directly to your home and grind your selected grains in front of you,
              ensuring complete transparency, hygiene, and purity.
              <br /><br />
              This process helps retain natural nutrients and taste, giving you fresh atta
              that is healthier, chemical-free, and made exactly the way your family likes it.
            </p>
          </div>
          <div className="bg-white p-8 shadow-lg rounded-2xl border border-[#e6d9b5] flex flex-col items-center text-center">
            <ShoppingBag className="text-[#b08943]" size={50} />
            <h3 className="text-2xl font-semibold mt-6 text-[#7a5410]">
              Door-to-Door
            </h3>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Along with grinding services, we provide doorstep delivery of premium quality
              organic and natural products. From pure atta, grains, pulses, and spices to
              healthy blends, every product is carefully sourced and hygienically packed.
              <br /><br />
              Our mission is to make healthy living easy for you by delivering trusted
              grocery essentials on time—fresh, safe, and directly to your door.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-[#7a5410] mb-8">Why Choose Mobile Chakki Services?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <Leaf className="text-[#25D366]" size={40} />
              <p className="text-lg font-semibold mt-3 text-gray-800">100% Organic & Pure</p>
            </div>
            <div className="flex flex-col items-center">
              <Sprout className="text-[#25D366]" size={40} />
              <p className="text-lg font-semibold mt-3 text-gray-800">Freshly Ground On-Demand</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="text-[#25D366]" size={40} />
              <p className="text-lg font-semibold mt-3 text-gray-800">Convenient Doorstep Service</p>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="text-[#25D366]" size={40} />
              <p className="text-lg font-semibold mt-3 text-gray-800">Wide Range of Products</p>
            </div>
          </div>
        </section>

        {/* Call to Action (Optional) */}
        <section className="max-w-4xl mx-auto text-center p-8 bg-[#e6d9b5] rounded-2xl shadow-md">
          <h2 className="text-[#7a5410] mb-4">Ready for a Healthier Lifestyle?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Download our app today and experience the future of fresh and organic food delivery.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.mobilechakki"
            className="inline-block bg-[#7a5410] text-white font-bold py-3 px-8 rounded-full hover:bg-[#b08943] transition duration-300"
          >
            Download the App
          </a>
        </section>
      </div>
    </>
  );
};

