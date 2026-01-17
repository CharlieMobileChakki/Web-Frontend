import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usercreatebooking } from "../../../store/slices/BookingSlice";
import { BookingSchema } from "../../../utils/validations/ValidationSchemas";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Calendar, Phone, User, Package, Clock } from "lucide-react";
import AddressModal from "../../../components/user/AddressModal";

const CreateBooking = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        mobile: user?.phone || user?.mobile || "",
        serviceType: "",
        date: "",
        timeSlot: "",
        address: "", // Stores selected address ID
    });

    const [errors, setErrors] = useState({});
    const [showPopup, setShowPopup] = useState(false);


    // ✅ Restore booking data if exists
    useEffect(() => {
        const savedData = localStorage.getItem("tempBookingData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setFormData((prev) => ({
                    ...prev,
                    ...parsedData,
                    // Ensure we prefer the logged-in user's details if they differ, 
                    // or keep the saved ones if they were entered manually?
                    // Let's keep the saved name/mobile if user was guest but keep user details if available now.
                    name: user?.name || parsedData.name,
                    mobile: user?.phone || user?.mobile || parsedData.mobile,
                }));
                // Clear temp data after restoring
                localStorage.removeItem("tempBookingData");
                toast.info("Restored your previous booking details!");
            } catch (error) {
                console.error("Error restoring booking data:", error);
            }
        }
    }, [user]);

    // ✅ validate specific field in real time
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const [isServiceable, setIsServiceable] = useState(true);

    // ✅ Handle Address Selection
    const handleAddressSelect = (address) => {
        setFormData((prev) => ({ ...prev, address: address._id }));
        setErrors((prev) => ({ ...prev, address: "" }));

        // Geofencing Check (Jaipur Only)
        // Normalize string to handle case sensitivity
        const city = address?.city?.trim().toLowerCase();
        if (city === "jaipur") {
            setIsServiceable(true);
            toast.info("Address Selected: Service Available ✅");
        } else {
            setIsServiceable(false);
            toast.warn("Currently we only serve in Jaipur 🚧");
        }
    };

    // ✅ on submit validate all fields
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Guest Flow checks
        if (!user) {
            // Save current form state
            localStorage.setItem("tempBookingData", JSON.stringify(formData));
            localStorage.setItem("redirectAfterLogin", "/createbooking");

            toast.info("Please login to complete your booking. Your details have been saved.");
            setTimeout(() => navigate("/signin"), 1500);
            return;
        }

        // Manual Validation
        const newErrors = {};
        if (!formData.name) newErrors.name = "Please enter your full name";
        if (!formData.mobile) newErrors.mobile = "Please enter your phone number";
        if (!formData.serviceType) newErrors.serviceType = "Please select a service type";
        if (!formData.date) newErrors.date = "Please choose a date";
        if (!formData.timeSlot) newErrors.timeSlot = "Please select a time slot";
        if (!formData.address) newErrors.address = "Please select a delivery address";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            name: formData.name,
            phone: formData.mobile,
            serviceType: formData.serviceType,
            date: formData.date,
            timeSlot: formData.timeSlot,
            address: formData.address,
        };

        try {
            const resultAction = await dispatch(usercreatebooking(payload));

            if (usercreatebooking.fulfilled.match(resultAction)) {
                toast.success("✅ Booking created successfully!");
                setShowPopup(true);
            } else {
                toast.error(resultAction.payload?.message || "❌ Failed to create booking!");
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


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                        Create Booking
                    </h1>
                    <p className="text-gray-600">Schedule your service with us</p>
                </div>

                {/* 🚧 Geofencing Banner */}
                {!isServiceable && (
                    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded shadow-md" role="alert">
                        <p className="font-bold">Service Not Available</p>
                        <p>Sorry, we currently only provide services in <strong>Jaipur</strong>. Please select a Jaipur address to proceed.</p>
                    </div>
                )}

                {!isServiceable ? null : (
                    <div className="grid md:grid-cols-1 gap-6">


                        <div
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                                <h2 className="text-xl font-bold text-white text-center">
                                    Booking Details
                                </h2>
                            </div>

                            <div className="p-8 space-y-6">

                                {/* Address Selection with AddressModal */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                        Select Address
                                    </label>
                                    <AddressModal onSelect={handleAddressSelect} showStateField={false} />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>

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
                                        <option value="aata">🌾 Aata (Flour)</option>
                                        <option value="spices">🌶️ Spices</option>
                                        <option value="others">📦 Other</option>
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
                                            Time Slot
                                        </label>
                                        <select
                                            name="timeSlot"
                                            value={formData.timeSlot}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                        >
                                            <option value="">Select Time Slot</option>
                                            <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                            <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                                            <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                        </select>
                                        {errors.timeSlot && <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
