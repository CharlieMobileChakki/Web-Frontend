import React from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import LogoImg from "../../../assets/logo.jpeg";
const DownloadAppSection = () => {
    return (
        <section className="bg-[#ffffff] py-10 my-10 rounded-xl shadow-md  container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-6">

                {/* Left Content */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#7a5410]">
                        Download the Mobile Chakki App
                    </h2>
                    <p className="mt-2 text-gray-700">
                        Order fresh atta, grains, and spices directly from your phone.
                        Stay healthy with doorstep delivery!
                    </p>
                    <div className="flex gap-4 mt-4 justify-center md:justify-start">
                        <a
                            href="https://play.google.com/store"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            <FaGooglePlay size={20} /> Google Play
                        </a>
                        <a
                            href="https://www.apple.com/app-store/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            <FaApple size={22} /> App Store
                        </a>
                    </div>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src={LogoImg}
                        alt="Mobile App"
                        className="w-56 md:w-72  "
                    />
                </div>
            </div>
        </section>
    );
};

export default DownloadAppSection;
