import React from 'react';
import { ShieldOff, Phone, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import { BannerSection } from '../../components/user/BannerSection';
import bgImage from '../../assets/Banner/S1.png';

const ReturnsPolicy = () => {
  return (
    <>
      <BannerSection
        title="Returns Policy"
        subtitle="Our Commitment to Quality and Freshness"
        bgImage={bgImage}
        className="bg-center"
      />

      <div className="bg-[#fffaf3] min-h-screen py-10 px-6 md:px-16">
        <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 shadow-lg rounded-2xl border border-[#e6d9b5] text-center">
          {/* Header Section */}
          <ShieldOff className="text-[#DA352D] mx-auto mb-6" size={60} />
          <h1 className="text-3xl md:text-4xl font-bold text-[#7a5410] mb-6">
            Our Promise of Purity and Satisfaction
          </h1>
     
          {/* Quality Section */}
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At <strong>Mobile Chakki</strong>, our foundation lies in purity, freshness, and trust.
            Every grain that we grind, every packet that we seal, and every order that we deliver
            reflects our commitment to bringing you <span className="text-[#7a5410] font-semibold">farm-fresh, stone-ground flour and other products</span> that retain their
            natural aroma, nutrition, and taste.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our dedicated quality team inspects and certifies every batch before dispatch, ensuring
            consistency and reliability. We work directly with trusted sources and farmers to make
            sure that every product leaving our facility meets your expectations of purity.
          </p>

          {/* Assurance Section */}
          <h2 className="text-2xl font-semibold text-[#7a5410] mb-4 mt-10">
            Why Our Customers Trust Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-1" />
              <p className="text-gray-700">
                <strong>Freshly Ground on Order:</strong> Each product is prepared after your order is confirmed, not before.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-1" />
              <p className="text-gray-700">
                <strong>Sealed for Hygiene:</strong> Our packaging ensures zero exposure to air or contamination.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-1" />
              <p className="text-gray-700">
                <strong>Direct-to-Home:</strong> We minimize handling by shipping directly from our facility to your doorstep.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-1" />
              <p className="text-gray-700">
                <strong>Trusted by Thousands:</strong> Our growing community of customers is proof of our dedication.
              </p>
            </div>
          </div>

          {/* Support Section */}
          <h2 className="text-2xl font-semibold text-[#7a5410] mt-12 mb-4">
            In Case You Need Assistance
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            While our products are crafted with care and precision, we understand that unexpected
            issues can occasionally arise — be it with packaging, delivery, or product quality.
            Please don’t hesitate to get in touch with us. Our friendly support team will ensure
            that your concern is handled promptly and fairly.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 text-[#7a5410] font-medium">
            <a
              href="https://wa.me/919529899999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full transition duration-200"
            >
              <MessageCircle size={20} /> WhatsApp
            </a>
            <a
              href="tel:+919529899999"
              className="flex items-center gap-2 bg-[#7a5410] hover:bg-[#5f3e0d] text-white py-2 px-4 rounded-full transition duration-200"
            >
              <Phone size={20} /> Call Us
            </a>
            <a
              href="mailto:aatachakki807@gmail.com"
              className="flex items-center gap-2 bg-[#da352d] hover:bg-[#b62c26] text-white py-2 px-4 rounded-full transition duration-200"
            >
              <Mail size={20} /> Email Support
            </a>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed font-semibold">
            We’ll always provide the best solution available — your happiness is our biggest reward.
          </p>

          {/* Educational Section */}
          <h2 className="text-2xl font-semibold text-[#7a5410] mt-12 mb-4">
            Understanding Our Policy
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Freshly prepared food products like ours are sensitive in nature. Once delivered,
            they cannot be resold or reused for hygiene reasons. This industry-standard policy
            ensures that you always receive products that are untouched, uncompromised, and safe.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Therefore, we maintain a <span className="font-semibold">strict no-return policy</span> after
            successful delivery. However, our support team is empowered to assist you with any genuine
            issues and provide the best resolution possible.
          </p>

          {/* Final Message */}
          <p className="text-xl text-[#7a5410] font-semibold mt-10">
            Thank you for choosing Mobile Chakki — where freshness meets trust.
          </p>
        </div>
      </div>
    </>
  );
};

export default ReturnsPolicy;
