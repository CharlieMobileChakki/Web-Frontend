import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

// Payment Method Logos
import Visa from "../../assets/footer/Visa.png";
import MasterCard from "../../assets/footer/Mastercard.svg";
import PayPal from "../../assets/footer/PayPal.svg";
import paytm from "../../assets/footer/paytm.png";
import Bg from "../../assets/Banner/S1.png";




export default function Footer() {
  // Footer Links Data
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: "Services", path: "/Services" },
        { name: "About Us", path: "/aboutus" },
        { name: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { name: "FAQ", path: "/faq" },
        { name: "Returns Policy", path: "/returns-policy" },
        { name: "Shipping Policy", path: "/shipping-policy" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms & Condition", path: "/terms" },
      ],
    },
    {
      title: "Contact Us",
      links: [
        {
          name: "Plot no C-45, Hawa Sadak, Riico Industrial Area, Bais Godam, Jaipur, Rajasthan 302006",

        },
        {
          name: "Phone : +91 7568207000"
        },
        {
          name: "Email : Aatawala.global@gmail.com"

        }
      ],
    },
  ];

  // Social Media Links
  const socialLinks = [
    { icon: <FaFacebook className="text-black hover:text-gray-700" />, url: "#" },
    { icon: <FaInstagram className="text-black hover:text-gray-700" />, url: "#" },
    { icon: <FaTwitter className="text-black hover:text-gray-700" />, url: "#" },
  ];

  return (
    <footer className="text-black bg-[#A78847]" style={{ backgroundImage: `url(${Bg})` }}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-1 grid grid-cols-1 md:grid-cols-4 gap-8 fs-2">
        {/* Company Info */}
        <div>
          <div className="flex items-center mb-4 mt-8">
            <h1 className="text-xl font-bold text-white-300 fontFamily-Pacifico">
              Mobile Chakki
            </h1>
          </div>
          <p className="text-sm leading-6">
            MobileChakki is your go-to app for ordering high-quality atta, grains, masalas, and other essential food products, all at the convenience of your fingertips.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 text-xl mt-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.url} className="hover:text-gray-700">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Links Sections */}
        {footerLinks.map((section, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-4 mt-8 c-black">
              {section.title}
            </h2>
            <ul className="space-y-2 text-sm">
              {section.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="hover:text-gray-700">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 pb-4 md:flex justify-between items-center text-sm text-black px-6">
        {/* Copyright */}
        <span>© {new Date().getFullYear()} Mobile Chakki. All Rights Reserved.</span>

        {/* Payment Methods */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-gray-900">We Accept:</span>
          <img src={Visa} alt="Visa" className="h-4 w-auto" />
          <img src={paytm} alt="paytm" className="h-10 w-auto" />
          <img src={PayPal} alt="PayPal" className="h-5 w-auto" />
          <img src={MasterCard} alt="MasterCard" className="h-6 w-auto" />
        </div>
      </div>
    </footer>
  );
}
