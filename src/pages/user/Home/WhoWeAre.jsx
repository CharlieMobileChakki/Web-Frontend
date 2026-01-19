import { CheckCircle } from "lucide-react";
import img1 from '../../../assets/Banner/dtd2.jpg'


const WhoWeAre = () => {


  return (
    <section className="relative py-20 px-4 lg:px-8 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">

        {/* Left Content */}
        <div className="">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
            Who We Are
          </div>

          <h2 className="text-gray-900 leading-tight mb-6">
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

          {/* <button className="group relative px-8 py-4 bg-[#C6363E] text-white font-bold rounded-xl shadow-lg hover:bg-black hover:shadow-xl transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Learn More 
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button> */}
        </div>

        {/* Right Side - Single Image */}
        <div className="w-full lg:h-full flex items-center justify-center">
          <div className="rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-[1.02] w-full">
            <img
              src={img1}
              alt="About MobileChakki"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhoWeAre;
