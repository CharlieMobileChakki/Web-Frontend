import React from "react";

export const BannerSection = ({ title, subtitle, buttonText, bgImage }) => {
    return (
        <div
            className="relative w-full h-[30vh] flex items-center justify-center text-center text-white"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                // backgroundPosition: "left",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="relative z-10 px-6">
                <h1 className="text-4xl text-[#7a5410] md:text-5xl font-bold mb-4">{title}</h1>
                <p className="text-lg text-[#7a5410] md:text-xl mb-6">{subtitle}</p>
                {buttonText && (
                    <button className="bg-[#b08943] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a5410] transition">
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};
