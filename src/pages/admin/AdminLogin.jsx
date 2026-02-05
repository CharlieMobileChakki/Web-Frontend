import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Key, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { adminLogin } from "../../store/slices/adminSlice/LoginSlice";
import { adminLoginSchema } from "../../utils/validations/ValidationSchemas";
import { adminGetAllAdmins } from "../../store/slices/adminSlice/AdminCreationSlice";
import Logo from "../../assets/logo.jpeg";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.adminAuth);

  /* ------------------ Real-Time Validation Function ------------------ */
  const validateField = async (field, value) => {
    try {
      await adminLoginSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  /* ---------------------- Handle Input Change ---------------------- */
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // real-time validate
    validateField(name, value);
  };

  /* ---------------------- Form Submit ---------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await adminLoginSchema.validate(formData, { abortEarly: false });

      const result = await dispatch(adminLogin(formData)).unwrap();
      localStorage.setItem("AdminToken", result.token);

      dispatch(adminGetAllAdmins())
      navigate("/dashboard");

    } catch (err) {
      if (err.inner) {
        // Show all validation errors
        const newErrors = {};
        err.inner.forEach((e) => (newErrors[e.path] = e.message));
        setErrors(newErrors);
      } else {
        console.log("Login API Error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FDF8F8]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C54142]/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[100px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(197,65,66,0.1)] border border-white/50">
          {/* Header / Logo */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 5 }}
              className="bg-white p-3 rounded-2xl shadow-sm mb-4 border border-gray-100"
            >
              <img src={Logo} alt="Logo" className="w-16 h-16 object-contain" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Please sign in to your administrator account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Mobile Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Mobile Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#C54142] text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile"
                  maxLength={10}
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border ${errors.mobile ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-[#C54142]'} rounded-xl outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-[#C54142]/5`}
                />
              </div>
              <AnimatePresence>
                {errors.mobile && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-[10px] font-medium ml-1"
                  >
                    {errors.mobile}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#C54142] text-gray-400">
                  <Key size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border ${errors.password ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-[#C54142]'} rounded-xl outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-[#C54142]/5`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-[10px] font-medium ml-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-[11px] text-gray-400">
                <ShieldCheck size={14} className="mr-1 text-green-500" />
                Secured Session
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-center text-xs font-semibold"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#C54142] to-[#B42D25] text-white py-4 rounded-xl font-bold
                                shadow-[0_10px_20px_-5px_rgba(197,65,66,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(197,65,66,0.4)]
                                transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} MobileChakki Admin. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
