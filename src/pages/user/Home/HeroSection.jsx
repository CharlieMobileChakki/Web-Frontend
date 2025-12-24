/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider1 from "../../../assets/banner/hero-services-img.webp";
import Slider2 from "../../../assets/banner/hero-services-img1.webp";
import Slider3 from "../../../assets/banner/hero-services-img2.webp";
import Slider4 from "../../../assets/banner/hero-services-img3.webp";
import Bg from "../../../assets/banner/S1.png";
import { useNavigate } from "react-router-dom";


const slides = [
  {
    title: "शुद्ध और ताज़ा आटा",
    subtitle: "मिलावट की चिंता छोड़िए—आपके सामने ताज़ा पिसाई, शुद्धता की गारंटी, हर रोटी में असली स्वाद और खुशबू।",
    btnText: "अभी आर्डर करें",
    img: Slider1,
  },
  {
    title: " सम्पूर्ण आहार",
    subtitle: "बिना गेहूं का 12 अनाजों से बना लो GI आटा—हल्का, संतुलित और पेट-भर पोषण, रोज़ के सम्पूर्ण आहार के लिए बेहतर विकल्प।",
    btnText: "अभी आर्डर करें",
    img: Slider2,
  },
  {
    title: "एक सम्पूर्ण आहार",
    subtitle: "जौ, चना, ज्वार, काला गेहूं, रागी, अजवायन, अलसी, मेथी, मूंग, मोठ, अरहर, राजमा\n12 अनाज का बिना गेहूं का LOW GI AATA—फाइबर से भरपूर, लंबे समय तक ऊर्जा और बढ़िया स्वाद के साथ।",
    btnText: "अभी ऑर्डर करें",
    img: Slider3,
  },
  {
    title: "अपनाएं ठंडी पिसाई वाला आटा",
    subtitle: "कोल्ड-मिल्ड (ठंडी पिसाई) आटा—नैचुरल पोषक तत्व और स्वाद बरकरार। लो GI, शुगर-मैनेजमेंट के लिए अनुकूल; विशेषज्ञ भी संतुलित आहार में सुझाते हैं।",
    btnText: "अभी आर्डर करें",
    img: Slider4,
  },
]
const HeroSection = () => {
  const navigate = useNavigate()
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Animation Variants
  const textVariant = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { y: -50, opacity: 0, transition: { duration: 0.6, ease: "easeIn" } },
  };

  const imageVariant = {
    hidden: { y: 80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
    exit: { y: 80, opacity: 0, transition: { duration: 0.6, ease: "easeIn" } },
  };



  const handleBooking = () => {
    navigate('/createbooking')

  }
  return (
    <div
      className="relative w-full overflow-hidden font-sans bg-gray-50"
      style={{ backgroundImage: `url(${Bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-20 lg:py-24 relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-20 min-h-[600px]">

        <AnimatePresence mode="wait">
          {/* Left Text Section */}
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-[3] md:flex-[3] text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-4 py-1 mb-4 rounded-full bg-orange-100 border border-orange-200"
            >
              <span className="text-sm font-bold text-orange-700 uppercase tracking-wider">Premium Quality</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 mb-6 tracking-tight">
              <span className="block">{slides[activeSlide].title.split(" ")[0]}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                {slides[activeSlide].title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
              {slides[activeSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleBooking}
                className="px-8 py-4 rounded-full bg-gray-900 text-white font-bold text-lg shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                {slides[activeSlide].btnText}
              </button>
              {/* <button className="px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-lg border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300">
                        Learn More
                    </button> */}
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            key={`img-${activeSlide}`}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-[2] md:flex-[2] relative flex justify-center items-center"
          >
            {/* Floating Animation */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-[400px] md:max-w-[500px]"
            >
              <img
                src={slides[activeSlide].img}
                alt={slides[activeSlide].title}
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Decorative Elements behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/40 to-transparent rounded-full blur-3xl transform scale-110 -z-10"></div>
          </motion.div>
        </AnimatePresence>

        {/* Custom Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 md:left-12 md:translate-x-0 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-3 rounded-full transition-all duration-500 ${index === activeSlide ? "w-10 bg-gray-900" : "w-3 bg-gray-400 hover:bg-gray-600"
                }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
