/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider1 from "../../../assets/Banner/b3.jpg";
import Slider2 from "../../../assets/Banner/b2.jpg";
import Slider3 from "../../../assets/Banner/b1.jpg";
import Slider4 from "../../../assets/Banner/b4.png";
import bg1 from "../../../assets/Banner/S1.png";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star, ArrowRight } from "lucide-react";

// Professional Brand Palette: Amber, Gold, Deep Brown, Warm White
const slides = [
  {
    id: 1,
    title: "Wholesome Gluten-Free Atta",
    subtitle:
      "Enjoy wholesome gluten-free atta crafted for better digestion and overall wellness. Freshly milled, naturally pure, and perfect for a healthy lifestyle.",
    btnText: "Book Now",
    img: Slider1,
    badge: "100% Pure & Fresh",
  },
  {
    id: 2,
    title: "Healthy Sugar-Free Atta",
    subtitle:
      "Low GI atta made from a blend of 12 wholesome grains — light on the stomach, well-balanced, and perfect for everyday nutrition.",
    btnText: "Book Now",
    img: Slider2,
    badge: "Premium Quality",
  },

  {
    id: 3,
    title: "Fresh Atta at Your Doorstep",
    subtitle:
      "Order freshly ground atta made right at your doorstep in Jaipur. Choose your grains, watch them being milled, and enjoy 100% pure, hygienic, and fresh flour every day.",
    btnText: "Book Now",
    img: Slider3,
    badge: "Jaipur Only",
  },
  {
    id: 4,
    title: "Cold-Milled Atta Technology",
    subtitle:
      "Using advanced cold-milling technology, we grind fresh atta at your doorstep in Jaipur—locking in nutrients, flavor, and purity for complete wellness.",
    btnText: "Book Now",
    img: Slider4,
    badge: "Cold Milled Technology",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);


  return (
    // <div className={`relative w-full overflow-hidden bg-[#FDFBF7] font-sans selection:bg-amber-100 selection:text-amber-900" style={{ background: "url(${bg1}) no-repeat center center/cover" }`}>
    <div
      className="relative w-full overflow-hidden bg-[#FDFBF7] font-sans selection:bg-amber-100 selection:text-amber-900"
      style={{
        background: `url(${bg1}) no-repeat center center / cover`,
      }}
    >


      {/* Background Texture & Gradients */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-100 rounded-full blur-[80px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-8 pb-16 lg:py-15">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[550px]">

          {/* Content Section */}
          <div className="flex-1 w-full max-w-2xl text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6 md:space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-sm mx-auto lg:mx-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-800 tracking-wide uppercase">
                    {slides[activeSlide].badge}
                  </span>
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-7xl font-extrabold leading-[1.15] text-amber-950 tracking-tight">
                  {slides[activeSlide].title.split(" ")[0] + " "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-600 to-orange-700">
                    {slides[activeSlide].title.split(" ").slice(1).join(" ")}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                  {slides[activeSlide].subtitle}
                </p>

                {/* Buttons */}
                <div className="flex flex-row gap-4 justify-center lg:justify-start pt-2">
                  <button
                    onClick={() => navigate("/createbooking")}
                    className="flex-1 sm:flex-none group relative px-4 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white font-bold text-sm sm:text-lg shadow-lg hover:shadow-orange-200/50 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {slides[activeSlide].btnText}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </button>

                  <button
                    onClick={() => navigate("/allproducts")}
                    className="flex-1 sm:flex-none px-4 py-3 sm:px-8 sm:py-4 rounded-xl bg-white text-amber-900 font-bold text-sm sm:text-lg border-2 border-amber-100 hover:border-amber-300 hover:bg-amber-50 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    View Products
                  </button>
                </div>



              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image Section */}
          <div className="flex-1 w-full relative perspective-1000 ">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.1, x: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex justify-center items-center"
              >
                {/* Organic Shape Blob Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 to-orange-50 rounded-full blur-3xl opacity-60 transform scale-110 -z-10 animate-pulse-slow"></div>

                <motion.img
                  src={slides[activeSlide].img}
                  alt="Mobile Chakki Product"
                  className="w-full max-w-[400px] rounded-2xl md:max-w-[500px] lg:max-w-[600px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Floating Badge on Image */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -bottom-4 -right-4 md:bottom-10 md:right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-amber-100 hidden sm:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Freshness</p>
                      <p className="text-sm font-bold text-gray-900">Guaranteed</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index
                ? "w-8 bg-amber-600"
                : "w-2 bg-amber-200 hover:bg-amber-400"
                }`}
            />
          ))}
        </div>

        {/* Side Arrows */}
        {/* <button onClick={prevSlide} className="hidden lg:flex absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full items-center justify-center text-amber-900 shadow-lg border border-amber-100 transition-all hover:scale-110 z-20">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="hidden lg:flex absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full items-center justify-center text-amber-900 shadow-lg border border-amber-100 transition-all hover:scale-110 z-20">
          <ChevronRight size={24} />
        </button> */}

      </div>
    </div>
  );
};

export default HeroSection;
