import React, { useState, useEffect } from "react";
import { Phone, Key, Timer } from "lucide-react";
import Bg from "../../assets/Banner/S1.png";
import Logo from "../../assets/logo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { signInSchema } from "../../utils/validations/ValidationSchemas";
import { useDispatch } from "react-redux";
import { SendOtpLogin, verifyOtpAndSignin } from "../../store/slices/AuthSlice";

const SignInUser = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
  })

  const token = localStorage.getItem("token")

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

  // 🔹 Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setErrors({})
      await signInSchema.validateAt("phone", formData);

      await dispatch(SendOtpLogin(formData.phone)).unwrap();
      setShowOtp(true);
      setTimer(60); // Start 1-minute timer (60 seconds)
      setCanResend(false);
    } catch (error) {
      let errorMessage = error?.message || error;
      if (typeof errorMessage === "string" && errorMessage.toLowerCase().includes("not found")) {
        errorMessage = "Account not found. Please sign up first.";
      } else if (typeof errorMessage === "string" && (errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("user"))) {
        // Catching generic invalid user/phone errors
        errorMessage = "We couldn't find an account with this number. Please Sign Up.";
      }
      setErrors({ phone: errorMessage });
    }
  };

  // 🔄 Resend OTP
  const handleResendOtp = async () => {
    try {
      setErrors({});
      await dispatch(SendOtpLogin(formData.phone)).unwrap();
      setTimer(60); // Restart timer
      setCanResend(false);
    } catch (error) {
      let errorMessage = error?.message || "Failed to resend OTP. Please try again.";
      setErrors({ phone: errorMessage });
    }
  };



  // handlechange normal fields
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }))
    try {

      await signInSchema.validateAt(name, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }))

    }

  }


  // 🔹 Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {

      const payload = {
        mobile: formData.phone,
        otp: formData.otp,
      }

      await dispatch(verifyOtpAndSignin(payload)).unwrap();

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/");
      }
    } catch (error) {
      let errorMessage = error?.message || "Invalid OTP";
      if (errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("incorrect")) {
        errorMessage = "Incorrect OTP. Please check and try again.";
      }
      setErrors({ otp: errorMessage });
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
          Sign In
        </h2>

        <form
          onSubmit={showOtp ? handleVerifyOtp : handleSendOtp}
          className="space-y-4"
        >
          {/* Phone Input */}
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-[#b08943]" size={18} />
            <input
              type="tel"
              value={formData.phone}
              name="phone"
              onChange={handleChange}
              placeholder="Enter 10-digit phone"
              className="w-full pl-10 pr-3 py-2 border rounded-lg bg-[#fffaf3] "

            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* OTP Input */}
          {showOtp && (
            <div className="relative">
              <Key className="absolute left-3 top-2.5 text-[#b08943]" size={18} />
              <input
                type="number"
                value={formData.otp}
                name="otp"
                onChange={handleChange}
                placeholder="4-digit OTP"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-[#fffaf3] 
                  ${errors.otp ? "border-red-500" : "border-[#e6d9b5]"} 
                  focus:outline-none focus:ring-2 focus:ring-[#d4a94d]`}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
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
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#d4a94d] cursor-pointer text-white py-2 rounded-lg font-semibold 
              hover:bg-[#b08943] transition"
          >
            {showOtp ? "Verify OTP And SignIn" : "Send OTP"}
          </button>

          <p
            onClick={() => navigate("/signup")}
            className="text-sm text-gray-600 text-center cursor-pointer hover:text-[#7a5410] mt-2"
          >
            New Register? <span className="font-semibold">Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInUser;
