import React, { useState, useEffect } from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import downloadAppImg1 from "../../../assets/download app/1.jpeg";
import downloadAppImg2 from "../../../assets/download app/2.jpeg";
import downloadAppImg3 from "../../../assets/download app/3.jpeg";
import downloadAppImg4 from "../../../assets/download app/4.jpeg";
import downloadAppImg5 from "../../../assets/download app/5.jpeg";

const DownloadAppSection = () => {
    // Sample app screenshots - you can replace these with actual screenshots
    const appImages = [
        {
            id: 1,
            src: downloadAppImg1,
            alt: "Mobile Chakki Home Screen",
            title: "Browse Products"
        },
        {
            id: 2,
            src: downloadAppImg2,
            alt: "Product Details",
            title: "Product Details"
        },
        {
            id: 3,
            src: downloadAppImg3,
            alt: "Shopping Cart",
            title: "Easy Checkout"
        },
        {
            id: 4,
            src: downloadAppImg4,
            alt: "Order Tracking",
            title: "Track Orders"
        },
        {
            id: 5,
            src: downloadAppImg5,
            alt: "User Profile",
            title: "Manage Profile"
        }
    ];



    const [hideSideImages, setHideSideImages] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;

            const shouldHide =
                (w >= 300 && w < 500) ||
                (w >= 1024 && w < 1280);

            setHideSideImages(shouldHide);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [direction, setDirection] = useState(0);

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % appImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, appImages.length]);

    const goToNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % appImages.length);
        setIsAutoPlaying(false);
    };

    const goToPrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + appImages.length) % appImages.length);
        setIsAutoPlaying(false);
    };

    const getImageIndex = (offset) => {
        return (currentIndex + offset + appImages.length) % appImages.length;
    };

    return (
        <section className="relative py-20 overflow-hidden">
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
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-amber-200/50 p-6 md:p-12"
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
                                Order fresh Aata, grains, and spices directly from your phone.
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
                                    href="https://play.google.com/store/apps/details?id=com.mobilechakki"
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

                        {/* Right - 3D Carousel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex-1 w-full"
                        >

                            <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center perspective-1000">
                                {/* Carousel Container */}
                                {/* All Images Mapped for Continuous Transition */}



                                {appImages.map((image, index) => {
                                    // Calculate position relative to current index
                                    let position = (index - currentIndex) % appImages.length;
                                    if (position < 0) position += appImages.length;
                                    // Normalize to -2, -1, 0, 1, 2 range relative to center
                                    if (position > appImages.length / 2) position -= appImages.length;

                                    // Determine styles based on position
                                    const isCenter = position === 0;
                                    const isLeft = position === -1;
                                    const isRight = position === 1;
                                    const isHidden = Math.abs(position) >= 2;


                                    const shouldHideThis =
                                        hideSideImages && (isLeft || isRight || isHidden);

                                    if (shouldHideThis) return null;


                                    return (
                                        <motion.div
                                            key={image.id}
                                            initial={false}
                                            animate={{
                                                x: isCenter ? "0%" : isLeft ? "-80%" : isRight ? "80%" : "0%",
                                                scale: isCenter ? 1 : isLeft || isRight ? 0.7 : 0.4,
                                                opacity: isCenter ? 1 : isLeft || isRight ? 0.6 : 0,
                                                zIndex: isCenter ? 20 : isLeft || isRight ? 10 : 0
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer w-[260px] sm:w-[280px] md:w-[320px]"
                                            style={{
                                                pointerEvents: isHidden ? "none" : "auto"
                                            }}
                                            onClick={() => {
                                                if (isLeft) goToPrev();
                                                if (isRight) goToNext();
                                            }}
                                        >
                                            <div className={`relative transition-all duration-300 ${isCenter ? 'group' : 'group hover:scale-105'}`}>
                                                <img
                                                    src={image.src}
                                                    alt={image.alt}
                                                    className={`
                                                            rounded-3xl shadow-2xl transition-all duration-300 object-cover
                                                            ${isCenter
                                                            ? "w-48 sm:w-56 md:w-64 lg:w-80 border-4 border-white/70"
                                                            : "w-24 sm:w-28 md:w-32 lg:w-40 border-2 border-white/50 grayscale-[50%] group-hover:grayscale-0"
                                                        }
                                                        `}
                                                />

                                                {/* Glow/Overlay Effects */}
                                                {isCenter && (
                                                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-orange-500/20 rounded-3xl"></div>
                                                )}
                                                {(isLeft || isRight) && (
                                                    <div className="absolute inset-0 bg-black/10 rounded-3xl group-hover:bg-transparent transition-colors duration-300"></div>
                                                )}

                                                {/* Title Badge (Center Only) */}
                                                {isCenter && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full shadow-lg text-sm font-bold whitespace-nowrap"
                                                    >
                                                        {image.title}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {/* Navigation Buttons */}
                                <button
                                    onClick={goToPrev}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-amber-700 p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-amber-700 p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                                </button>

                                {/* Dots Indicator */}

                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DownloadAppSection;
