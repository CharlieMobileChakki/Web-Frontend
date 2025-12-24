import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../store/slices/adminSlice/LoginSlice";
import { adminLoginSchema } from "../../utils/validations/ValidationSchemas"; // <-- schema import

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Mobile */}
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              maxLength={10}
              className="w-full pl-10 pr-3 py-2 border rounded-md"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Key className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full pl-10 pr-3 py-2 border rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {error && (
            <p className="text-center text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#C54142] cursor-pointer text-white py-2 rounded-md font-semibold
              hover:bg-[#a83232] transition disabled:opacity-60"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
