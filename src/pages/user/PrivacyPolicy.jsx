// src/pages/PrivacyPolicy.jsx
import React from "react";
import { BannerSection } from "../../components/user/BannerSection";
import bgImage from "../../assets/Banner/S1.png";
const PrivacyPolicy = () => {
  return (

    <>
      <BannerSection
        title="Privacy Policy"
        subtitle="Fast, Fresh, and Reliable Delivery to Your Doorstep"
        bgImage={bgImage}
        className="bg-center"
      />

      <div className="bg-[#fffdf7] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#7a5410] mb-6">
            Privacy Policy </h1> <p className="mb-4 text-gray-700">
            At <strong>Mobile Chakki</strong>, we take your privacy seriously.
            We are committed to protecting your personal data while providing
            you with safe, healthy, and quality food products recommended for
            every age group. This Privacy Policy explains how we handle your
            information when you interact with our website, mobile application,
            and related services. </p>

          ```
          <h2 className="text-[#7a5410] mt-6 mb-2">
            1. Information We Collect
          </h2>
          <p className="mb-4 text-gray-700">
            We collect the following information to ensure smooth order
            processing and a better customer experience:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Personal details: name, contact number, email address</li>
            <li>Delivery details: residential or workplace address</li>
            <li>Payment and billing details (securely processed)</li>
            <li>Order and purchase history</li>
            <li>Device and technical data (IP, browser, operating system)</li>
          </ul>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            2. How We Use Your Information
          </h2>
          <p className="mb-4 text-gray-700">
            We use your data only for purposes that enhance your shopping journey:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>To deliver fresh, healthy products on time</li>
            <li>To recommend suitable products for different age groups</li>
            <li>To process secure payments and manage transactions</li>
            <li>To respond to queries and provide customer support</li>
            <li>To send special offers, nutrition tips, and seasonal updates (if opted in)</li>
            <li>To improve our website, app, and services based on customer needs</li>
          </ul>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            3. Data Security
          </h2>
          <p className="mb-4 text-gray-700">
            Your trust matters to us. We apply strict security measures,
            including encryption and access controls, to protect your personal
            data from unauthorized access, misuse, or loss.
            We never sell your information to third parties.
          </p>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            4. Sharing of Information
          </h2>
          <p className="mb-4 text-gray-700">
            Your information may be shared only with trusted partners, including:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Delivery partners ensuring timely doorstep delivery</li>
            <li>Payment gateways to securely process transactions</li>
            <li>Service providers who help us improve user experience</li>
            <li>
              Legal authorities, if required to comply with law or protect rights
            </li>
          </ul>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            5. Cookies & Personalization
          </h2>
          <p className="mb-4 text-gray-700">
            We use cookies to remember your preferences, recommend products
            tailored for your family’s health needs, and provide a smoother
            browsing experience. You may disable cookies in your browser settings,
            but certain features of our site may not function properly.
          </p>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            6. Children’s Privacy
          </h2>
          <p className="mb-4 text-gray-700">
            Our products are suitable for all age groups, but our services
            are intended for use by adults making purchases for themselves
            or their families. We do not knowingly collect personal information
            from children under 13. If you believe a child has provided us
            personal data, please contact us to remove it.
          </p>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            7. Your Rights
          </h2>
          <p className="mb-4 text-gray-700">
            You have the right to access, update, or request deletion of your
            personal information. You can also choose to opt out of marketing
            communications at any time.
          </p>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            8. Updates to This Policy
          </h2>
          <p className="mb-4 text-gray-700">
            We may revise this Privacy Policy occasionally to reflect changes
            in laws, technology, or our business. Any updates will be shared
            here with a revised “last updated” date.
          </p>

          <h2 className="text-[#7a5410] mt-6 mb-2">
            9. Contact Us
          </h2>
          <p className="text-gray-700">
            For questions, feedback, or concerns about our Privacy Policy,
            please reach out:
          </p>
          <p className="text-gray-700 mt-2">
            📧 <span className="text-[#7a5410] font-medium">support@mobilechakki.com</span>
            <br />
            📍 Mobile Chakki, FoodTech Pvt Ltd, India
          </p>
        </div>
      </div>
    </>



  );
};

export default PrivacyPolicy;
