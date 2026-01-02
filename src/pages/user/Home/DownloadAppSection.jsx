import React from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { motion } from "framer-motion";
import { Smartphone, Zap, Shield, Truck } from "lucide-react";
import LogoImg from "../../../assets/logo.jpeg";

const DownloadAppSection = () => {
    return (
        <section className="relative py-20 my-16 overflow-hidden">
            {/* Light Brown/Beige Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>

            {/* Animated Pattern Overlay */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-100 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl"></div>
            </div>

            {/* Floating Decorative Orbs */}
            <motion.div
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"
            ></motion.div>
            <motion.div
                animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl"
            ></motion.div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Glassmorphism Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-amber-200/50 p-8 md:p-12"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            {/* Animated Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full shadow-md mb-6 border border-amber-200"
                            >
                                <Smartphone className="w-5 h-5 text-amber-700" />
                                <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                                    Download Now - It's Free!
                                </span>
                                <Zap className="w-5 h-5 text-amber-700 fill-amber-700" />
                            </motion.div>

                            {/* Heading with Gradient Text */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-6"
                            >
                                <span className="text-gray-800">Get the </span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-red-600">
                                    Mobile Chakki App
                                </span>
                            </motion.h2>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
                            >
                                Order fresh atta, grains, and spices directly from your phone.
                                Stay healthy with doorstep delivery!
                            </motion.p>


                            {/* App Store Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <a
                                    href="https://play.google.com/store"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-2xl font-bold text-base shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <FaGooglePlay size={24} className="text-green-600" />
                                    <div className="text-left">
                                        <div className="text-xs text-gray-500">GET IT ON</div>
                                        <div className="text-sm font-bold">Google Play</div>
                                    </div>
                                </a>
                                <a
                                    href="https://www.apple.com/app-store/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-2xl font-bold text-base shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <FaApple size={28} className="text-gray-900" />
                                    <div className="text-left">
                                        <div className="text-xs text-gray-500">Download on the</div>
                                        <div className="text-sm font-bold">App Store</div>
                                    </div>
                                </a>
                            </motion.div>
                        </div>

                        {/* Right Image with Floating Animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex-1 flex justify-center items-center relative"
                        >


                            {/* Floating Logo */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <img
                                    src={LogoImg}
                                    alt="Mobile Chakki App"
                                    className="w-40 md:w-64 lg:w-64 drop-shadow-xl rounded-3xl border-4 border-white/50"
                                />

                                {/* Decorative Ring */}

                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DownloadAppSection;
