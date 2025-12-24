
import React, { useState, useEffect } from "react";
import { Phone, Key, User, Timer } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Bg from "../../assets/Banner/S1.png";
import Logo from "../../assets/logo.jpeg";
import { signUpSchema } from "../../utils/validations/ValidationSchemas";
import { useDispatch, useSelector } from "react-redux";
import { sendOtpSignup, verifyOtpAndSignup } from "../../store/slices/AuthSlice";

const SignUpUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
    otp: "",

  });

  const [errors, setErrors] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [canResend, setCanResend] = useState(false);

  // ⏱️ Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // 🔹 Handle normal fields
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    try {
      await signUpSchema.validateAt(name, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };






  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await signUpSchema.validateAt("phone", formData);
      setErrors({});
      // Send both mobile and name as per API docs
      await dispatch(sendOtpSignup({ mobile: formData.phone, name: formData.userName })).unwrap();
      setShowOtp(true);
      setTimer(300); // Start 5-minute timer (300 seconds)
      setCanResend(false);
    } catch (err) {
      setErrors({ phone: err.message || err });
    }
  };

  // 🔄 Resend OTP
  const handleResendOtp = async () => {
    try {
      // Send both mobile and name as per API docs for resend too
      await dispatch(sendOtpSignup({ mobile: formData.phone, name: formData.userName })).unwrap();
      setTimer(300); // Restart timer
      setCanResend(false);
      setErrors({});
    } catch (err) {
      setErrors({ phone: err.message || "Failed to resend OTP" });
    }
  };



  // Step 2: Verify OTP + Complete Signup
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        mobile: formData.phone,
        otp: formData.otp,
        name: formData.userName, // Passed to thunk for local state patching if needed
      };

      await dispatch(verifyOtpAndSignup(payload)).unwrap();
      // console.log("Signup completed ✅");
      navigate("/");
    } catch (err) {
      setErrors({ otp: err.message || "Invalid OTP" });
    }
  };

  return (
    <div
      className="flex justify-center items-center   bg-cover bg-center p-5 sm:p-0"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="bg-[#fffaf3]/95 backdrop-blur-sm shadow-lg rounded-2xl p-6 my-20 w-full max-w-sm border border-[#e6d9b5]">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img
              src={Logo}
              alt="Website Logo"
              className="w-26 object-cover border-2 border-[#e6d9b5] shadow-md"
            />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-[#7a5410]">
          Sign Up
        </h2>






        {/* 🔹 Single Form Signup Flow */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!showOtp) {
              handleSendOtp(e); // First step: send OTP
            } else {
              handleVerifyOtp(e); // Final step: verify OTP + signup
            }
          }}
          className="space-y-4"
        >
          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-[#b08943]" size={18} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-[#fffaf3] ${errors.phone ? "border-red-500" : "border-[#e6d9b5]"
                } focus:outline-none focus:ring-2 focus:ring-[#d4a94d]`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {showOtp && (
            <>
              {/* OTP */}
              <div className="relative">
                <Key className="absolute left-3 top-2.5 text-[#b08943]" size={18} />
                <input
                  type="number"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-[#fffaf3] ${errors.otp ? "border-red-500" : "border-[#e6d9b5]"
                    } focus:outline-none focus:ring-2 focus:ring-[#d4a94d]`}
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                {/* Resend OTP Button */}
                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className={`text-sm font-semibold ${canResend
                      ? "text-[#d4a94d] cursor-pointer hover:text-[#b08943]"
                      : "text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {canResend ? "Resend OTP" : "Resend OTP"}
                  </button>
                  {timer > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Timer size={14} />
                      <span>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}


          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-[#b08943]" size={18} />
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-[#fffaf3] ${errors.userName ? "border-red-500" : "border-[#e6d9b5]"
                } focus:outline-none focus:ring-2 focus:ring-[#d4a94d]`}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>




          <button
            type="submit"
            className="w-full bg-[#d4a94d] cursor-pointer text-white py-2 rounded-lg font-semibold hover:bg-[#b08943] transition"
          >
            {loading ? "Processing..." : showOtp ? "Verify OTP & Sign Up" : "Send OTP"}
          </button>
        </form>

        {/* 🔹 Error & Feedback */}
        {loading && (
          <p className="text-blue-500 text-sm text-center mt-2">
            Processing signup...
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {typeof error === "string"
              ? error
              : "Something went wrong. Please try again."}
          </p>
        )}






        <p
          onClick={() => navigate("/signin")}
          className="text-sm text-gray-600 text-center cursor-pointer hover:text-[#7a5410] mt-4"
        >
          Already Registered? <span className="font-semibold">Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUpUser;
