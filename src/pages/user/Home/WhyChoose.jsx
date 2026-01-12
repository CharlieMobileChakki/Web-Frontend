import React from "react";
import BannerImg from "../../../assets/Banner/hero-services-img.webp";
import { Wheat, ShieldCheck, Leaf, Truck, HeartPulse } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:-translate-y-1">
        <div className={`p-3 rounded-xl ${color} mb-4`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
);

const WhyChoose = () => {
    const features = [
        {
            icon: Wheat,
            title: "Fresh Chakki Atta",
            description: "100% whole wheat flour grounded fresh. Absolutely no maida added for pure goodness.",
            color: "bg-orange-500",
        },
        {
            icon: Leaf,
            title: "Organic & Pure",
            description: "Made from the choicest natural grains, retaining all parts for maximum nutrition and taste.",
            color: "bg-green-500",
        },
        {
            icon: ShieldCheck,
            title: "Premium Quality",
            description: "We ensure top-notch quality standards to help maintain your overall health and vitality.",
            color: "bg-blue-500",
        },
        {
            icon: Truck,
            title: "Doorstep Delivery",
            description: "Enjoy the convenience of having fresh, high-quality atta delivered seamlessly to your home.",
            color: "bg-purple-500",
        },
    ];

    return (
        <section className="relative py-20 px-4 md:px-8 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Why Choose <span className="text-red-600">MobileChakki?</span>
                    </h2>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        Experience the true taste of health with our fresh, organic, and premium quality products.
                    </p>
                    <div className="mt-6 mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content - Image */}
                    <div className="relative order-2 lg:order-1">
                        {/* Decorative blob behind image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src={BannerImg}
                                alt="MobileChakki Fresh Atta"
                                className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 max-w-[200px]">
                                <div className="flex items-center gap-3 mb-1">
                                    <HeartPulse className="text-red-500 w-5 h-5" />
                                    <span className="font-bold text-gray-800">Healthy Choice</span>
                                </div>
                                <p className="text-xs text-gray-500">Recommended for a balanced diet.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Features Grid */}
                    <div className="grid sm:grid-cols-2 gap-6 order-1 lg:order-2">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;