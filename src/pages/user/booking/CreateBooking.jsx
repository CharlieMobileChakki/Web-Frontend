/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { usercreatebooking } from "../../../store/slices/BookingSlice";
import { BookingSchema } from "../../../utils/validations/ValidationSchemas";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Calendar, MapPin, Phone, User, Package, Clock } from "lucide-react";

const CreateBooking = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        serviceType: "",
        latitude: "",
        longitude: "",
        date: "",
        time: "",
        address: {
            mode: "manual",
            manualAddress: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                isDefault: true,
            },
        },
    });

    const [errors, setErrors] = useState({});
    const [showPopup, setShowPopup] = useState(false);

    // ✅ validate specific field in real time
    const validateSingleField = async (updatedData, fieldPath) => {
        try {
            await BookingSchema.validateAt(fieldPath, updatedData);
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldPath];
                return newErrors;
            });
        } catch (err) {
            setErrors((prev) => ({ ...prev, [fieldPath]: err.message }));
        }
    };

    // ✅ handle input changes with field-specific validation
    const handleChange = async (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData };

        if (["street", "city", "state", "zipCode", "country"].includes(name)) {
            updatedData = {
                ...formData,
                address: {
                    ...formData.address,
                    manualAddress: {
                        ...formData.address.manualAddress,
                        [name]: value,
                    },
                },
            };
        } else {
            updatedData[name] = value;
        }

        setFormData(updatedData);

        const fieldPath = ["street", "city", "state", "zipCode", "country"].includes(name)
            ? `address.manualAddress.${name}`
            : name;

        await validateSingleField(updatedData, fieldPath);
    };

    // ✅ on submit validate all fields
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to create a booking");
            navigate("/login");
            return;
        }

        try {
            await BookingSchema.validate(formData, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const errObj = {};
            validationError.inner.forEach((err) => {
                errObj[err.path] = err.message;
            });
            setErrors(errObj);
            return;
        }

        const getLocation = () =>
            new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) =>
                        resolve({
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                        }),
                    () => resolve({ latitude: "", longitude: "" })
                );
            });

        const location = await getLocation();

        const formattedData = {
            ...formData,
            user: user?._id,
            serviceType:
                formData.serviceType.charAt(0).toUpperCase() +
                formData.serviceType.slice(1).toLowerCase(),
            latitude: location.latitude,
            longitude: location.longitude,
        };

        try {
            const resultAction = await dispatch(usercreatebooking(formattedData));

            if (usercreatebooking.fulfilled.match(resultAction)) {
                toast.success("✅ Booking created successfully!");
                setFormData({
                    name: "",
                    mobile: "",
                    serviceType: "",
                    latitude: "",
                    longitude: "",
                    date: "",
                    time: "",
                    address: {
                        mode: "manual",
                        manualAddress: {
                            street: "",
                            city: "",
                            state: "",
                            zipCode: "",
                            country: "",
                            isDefault: true,
                        },
                    },
                });
                setErrors({});
                setShowPopup(true);
            } else {
                toast.error("❌ Failed to create booking!");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("⚠️ An unexpected error occurred.");
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    // Check if city is NOT Jaipur
    const city = formData.address.manualAddress.city?.trim().toLowerCase();
    const isOutsideJaipur = city && city !== "jaipur";

    // Services data for slider
    const services = [
        {
            title: "Fresh Grinding Service",
            description: "Get your grains freshly ground at your doorstep in Jaipur",
            icon: "🌾",
            color: "from-amber-400 to-orange-500",
        },
        {
            title: "Premium Spices",
            description: "Authentic and fresh spices delivered to your home",
            icon: "🌶️",
            color: "from-red-400 to-pink-500",
        },
        {
            title: "Quality Aata (Flour)",
            description: "Freshly milled flour for healthier meals",
            icon: "🍞",
            color: "from-yellow-400 to-amber-500",
        },
        {
            title: "Doorstep Delivery",
            description: "Fast and reliable delivery across Jaipur",
            icon: "🚚",
            color: "from-blue-400 to-cyan-500",
        },
    ];

    if (isOutsideJaipur) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            We're Currently Serving Jaipur! 🏙️
                        </h2>
                        <p className="text-orange-100 text-lg">
                            Explore our premium services available in Jaipur
                        </p>
                    </div>

                    {/* Services Slider */}
                    <div className="p-8">
                        <Slider {...sliderSettings}>
                            {services.map((service, index) => (
                                <div key={index} className="px-4 py-6">
                                    <div className={`bg-gradient-to-br ${service.color} rounded-2xl p-8 text-white shadow-xl transform transition-all hover:scale-105`}>
                                        <div className="text-center">
                                            <div className="text-7xl mb-4">{service.icon}</div>
                                            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                                            <p className="text-lg opacity-90">{service.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>

                        {/* Info Section */}
                        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Why Choose Us in Jaipur?</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Fresh grinding at your doorstep</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Premium quality spices and flour</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Same-day delivery available</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Trusted by thousands of customers</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => handleChange({ target: { name: 'city', value: 'Jaipur' } })}
                            className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Book Service in Jaipur
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                        Create Booking
                    </h1>
                    <p className="text-gray-600">Schedule your service with us</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                        <h2 className="text-2xl font-bold text-white text-center">
                            Booking Details
                        </h2>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                <Phone className="w-5 h-5 text-green-500" />
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 10) {
                                        handleChange({ target: { name: "mobile", value } });
                                    }
                                }}
                                placeholder="10-digit mobile number"
                                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                            />
                            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                        </div>

                        {/* Service Type */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                <Package className="w-5 h-5 text-purple-500" />
                                Service Type
                            </label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            >
                                <option value="" disabled>Choose Service Type</option>
                                <option value="grinding">🌾 Grinding</option>
                                <option value="spices">🌶️ Spices</option>
                                <option value="aata">🍞 Aata (Flour)</option>
                            </select>
                            {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                    <Calendar className="w-5 h-5 text-orange-500" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                />
                                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                    <Clock className="w-5 h-5 text-pink-500" />
                                    Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                />
                                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-blue-100">
                            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
                                <MapPin className="w-6 h-6 text-red-500" />
                                Address Details
                            </h3>

                            <div className="space-y-4">
                                {/* City Selection */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">City</label>
                                    <select
                                        name="city"
                                        value={formData.address.manualAddress.city}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    >
                                        <option value="">Select City</option>
                                        <option value="Jaipur">Jaipur</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors[`address.manualAddress.city`] && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors[`address.manualAddress.city`]}
                                        </p>
                                    )}
                                </div>

                                {["street", "state", "zipCode", "country"].map((field) => (
                                    <div key={field}>
                                        <label className="block text-gray-700 font-medium mb-2 capitalize">
                                            {field === "zipCode" ? "ZIP Code" : field}
                                        </label>
                                        <input
                                            type="text"
                                            name={field}
                                            placeholder={`Enter ${field === "zipCode" ? "ZIP code" : field}`}
                                            value={formData.address.manualAddress[field]}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                        {errors[`address.manualAddress.${field}`] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors[`address.manualAddress.${field}`]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Book Now
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center transform transition-all scale-100 animate-bounce-in">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-green-600 mb-3">
                            Booking Successful!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Your booking has been created successfully.
                        </p>
                        <button
                            onClick={() => navigate(`/my-bookings/${user?._id}`)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl w-full hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg"
                        >
                            View My Bookings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateBooking;
