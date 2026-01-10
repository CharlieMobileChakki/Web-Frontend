import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mohan Singh",
    location: "Noida",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "MobileChakki ka atta hamesha fresh aur quality mein best hota hai. Delivery bhi time par hoti hai.",
    rating: 5,
  },
  {
    name: "Narender Kumar Gupta",
    location: "Pitampura",
    img: "https://randomuser.me/api/portraits/men/44.jpg",
    review:
      "Main hamesha yahin se order karta hoon. Sahi price aur asli organic products milte hain.",
    rating: 5,
  },
  {
    name: "Pooja Sharma",
    location: "Jaipur",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
    review:
      "Bahut hi achha experience tha. Aata bilkul ghar jaisa pissa hua aur packaging bhi safe thi.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [slidesToShow, setSlidesToShow] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow, // ✅ Dynamic state
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false, // Optional: cleaner look on mobile
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Customers Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            "Hamare customers ki khushi hi hamari asli pehchaan hai"
          </p>
        </div>

        {/* Testimonials Carousel */}
        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="px-4">
              <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 text-red-200">
                  <Quote size={48} fill="currentColor" />
                </div>

                {/* Profile Image */}


                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < item.rating ? "#f59e0b" : "none"}
                      stroke={i < item.rating ? "#f59e0b" : "#d1d5db"}
                      className="transition-colors duration-300"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{item.review}"
                </p>

                {/* Customer Info */}
                <div className="border-t border-gray-100 pt-4 w-full">
                  <h4 className="font-bold text-xl text-gray-900">{item.name}</h4>
                  <span className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
