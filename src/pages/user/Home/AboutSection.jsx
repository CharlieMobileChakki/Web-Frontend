import { CheckCircle } from "lucide-react";
import img1 from '../../../assets/Banner/hero-services-img.webp'
import img2 from '../../../assets/Banner/hero-services-img1.webp'
import img3 from '../../../assets/Banner/hero-services-img2.webp'
import img4 from '../../../assets/Banner/hero-services-img3.webp'



const AboutSection = () => {
  return (
    <section className="relative py-20 px-4 lg:px-8 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* Left Content */}
        <div className="order-2 lg:order-1">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
            Who We Are
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            MobileChakki – <span className="text-[#C6363E] relative">
              Freshness
              {/* <svg className="absolute bottom-0 left-0 w-full h-3 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
              </svg> */}
            </span>
            <br /> at Your Doorstep
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            MobileChakki is your go-to app for ordering <strong>high-quality atta, grains, masalas</strong>,
            and other essential food products – delivered with freshness and care, right at your doorstep.
            We believe in purity, and that's why we grind only after you order.
          </p>

          <ul className="space-y-5 mb-10">
            {[
              { text: "Freshly ground flour, organic spices & grains.", color: "text-orange-600", bg: "bg-orange-100" },
              { text: "Easy ordering and seamless shopping experience.", color: "text-blue-600", bg: "bg-blue-100" },
              { text: "Fast doorstep delivery, ensuring quality every time.", color: "text-green-600", bg: "bg-green-100" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 group">
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${item.bg} ${item.color} transition-transform group-hover:scale-110`}>
                  <CheckCircle size={20} className="stroke-current" />
                </div>
                <span className="text-gray-700 font-medium text-lg">{item.text}</span>
              </li>
            ))}
          </ul>

          <button className="group relative px-8 py-4 bg-[#C6363E] text-white font-bold rounded-xl shadow-lg hover:bg-black hover:shadow-xl transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Learn More
              {/* Arrow Icon */}
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Right Side Images - Masonry Layout */}
        <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-12">
            <div className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
              <img src={img1} alt="About 1" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
              <img src={img3} alt="About 3" className="w-full h-48 object-cover" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
              <img src={img2} alt="About 2" className="w-full h-48 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
              <img src={img4} alt="About 4" className="w-full h-64 object-cover" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
