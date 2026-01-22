import React from 'react';
import { Truck } from 'lucide-react';
import { BannerSection } from '../../components/user/BannerSection';
import bgImage from '../../assets/Banner/S1.png'; // Using an existing Banner image

const ShippingPolicy = () => {
  return (
    <>
      <BannerSection
        title="Shipping Policy"
        subtitle="Fast, Fresh, and Reliable Delivery to Your Doorstep"
        bgImage={bgImage}
        className="bg-center"
      />

      <div className="bg-[#fffaf3] min-h-screen py-10 px-6 md:px-16">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-2xl border border-[#e6d9b5] text-center">
          <Truck className="text-[#7a5410] mx-auto mb-6" size={60} />
          <h1 className="text-3xl md:text-4xl font-bold text-[#7a5410] mb-6">
            Our Shipping & Delivery Process
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At Mobile Chakki, we are dedicated to ensuring your fresh and organic products reach you efficiently and in perfect condition. Our unique doorstep grinding service and reliable delivery network are designed for your convenience.
          </p>

          <h2 className="text-2xl font-bold text-[#7a5410] mt-8 mb-4 text-left">Doorstep Grinding Service</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4 text-left">
            For our doorstep grain grinding service, our specialized EV vans will arrive at your scheduled time slot. Grains are ground fresh in front of you, ensuring unparalleled freshness and quality. This service is currently available in select areas.
          </p>

          <h2 className="text-2xl font-bold text-[#7a5410] mt-8 mb-4 text-left">Organic Product Delivery</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4 text-left">
            We deliver a wide range of organic products, including Aata, grains, spices, and health blends. All orders are processed promptly and dispatched for delivery within 1-2 business days.
          </p>

          <h3 className="text-xl font-bold text-[#7a5410] mt-6 mb-3 text-left">Delivery Times:</h3>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed mb-4 text-left">
            <li>Local Deliveries: Typically 1-3 business days.</li>
            <li>Regional Deliveries: Typically 3-5 business days.</li>
            <li>Specific delivery times will be provided at checkout based on your location.</li>
          </ul>

          <h3 className="text-xl font-bold text-[#7a5410] mt-6 mb-3 text-left">Shipping Charges:</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-4 text-left">
            Shipping charges are calculated based on your order value and delivery location. Free shipping may be available for orders exceeding a certain amount. Details will be displayed during the checkout process.
          </p>

          <h3 className="text-xl font-bold text-[#7a5410] mt-6 mb-3 text-left">Order Tracking:</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-left">
            Once your order is dispatched, you will receive a confirmation email with tracking details, allowing you to monitor the status of your delivery.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed font-semibold">
            For any shipping-related queries, please contact our customer service team.
          </p>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
