


import React from "react";
import whychoose from "../../../assets/Banner/whychoose.jpg";
import { Wheat, ShieldCheck, Leaf, Truck } from "lucide-react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Card
const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color} mb-4`}>
            <Icon className="text-white w-6 h-6" />
        </div>
        <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

const WhyChoose = () => {
    const features = [
        {
            icon: Wheat,
            title: "Fresh Chakki Atta",
            description: "100% whole wheat flour ground fresh with no maida added.",
            color: "bg-orange-500",
        },
        {
            icon: Leaf,
            title: "Organic & Pure",
            description: "Naturally sourced grains retaining full nutrition.",
            color: "bg-green-500",
        },
        {
            icon: ShieldCheck,
            title: "Premium Quality",
            description: "Strict quality checks for your family’s health.",
            color: "bg-blue-500",
        },
        {
            icon: Truck,
            title: "Doorstep Delivery",
            description: "Fresh atta delivered straight to your home.",
            color: "bg-purple-500",
        },
    ];




    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-gray-900">
                        Why Choose <span className="text-red-600">MobileChakki</span>?
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Experience the true taste of health with our fresh and premium quality products.
                    </p>
                    <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 rounded"></div>
                </div>

                {/* ===== MOBILE VIEW ===== */}
                <div className="block lg:hidden">
                    {/* Image */}
                    <img
                        src={whychoose}
                        alt="Mobile Chakki"
                        className="w-full rounded-2xl mb-8"
                    />

                    {/* Slider */}
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        slidesPerView={1}
                        spaceBetween={16}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,   // sm & below
                            },
                            768: {
                                slidesPerView: 3,   // md
                            },
                            512: {
                                slidesPerView: 2,   // lg
                            },
                        }}
                    >






                        {features.map((item, i) => (
                            <SwiperSlide key={i}>
                                <FeatureCard {...item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* ===== DESKTOP VIEW ===== */}
                <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
                    {/* Left Image */}
                    <img
                        src={whychoose}
                        alt="Mobile Chakki"
                        className="w-full rounded-3xl"
                    />

                    {/* Right Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        {features.map((item, i) => (
                            <FeatureCard key={i} {...item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
