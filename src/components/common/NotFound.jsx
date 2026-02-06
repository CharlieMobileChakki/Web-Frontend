import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 p-5 font-sans relative overflow-hidden">
            {/* Background floating elements */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-red-500/10 blur-3xl" />

            <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl p-10 md:p-14 shadow-2xl text-center max-w-lg w-full relative z-10 animate-fade-in-up">
                <div className="mb-8 flex justify-center items-center">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="w-40 h-auto rounded-2xl shadow-lg animate-float"
                    />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">Lost in the Fields?</h2>

                <p className="text-gray-600 mb-9 text-lg leading-relaxed">
                    We couldn't find the page you're looking for.
                    Let's get you back to our fresh products!
                </p>

                <button
                    className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-red-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 shadow-red-600/20"
                    onClick={() => navigate("/")}
                >
                    Back to Homepage
                </button>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-float {
                        animation: float 4s ease-in-out infinite;
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.6s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default NotFound;
