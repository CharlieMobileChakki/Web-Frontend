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

const CreateBooking = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));

    // console.log(user, "dsgfjhs userrrrrrrrrr")
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
            // remove only that field’s error if it becomes valid
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldPath];
                return newErrors;
            });
        } catch (err) {
            // add/update only that field’s error
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

        // ✅ map flat name to nested Yup path
        const fieldPath = ["street", "city", "state", "zipCode", "country"].includes(name)
            ? `address.manualAddress.${name}`
            : name;

        await validateSingleField(updatedData, fieldPath);
    };

    // ✅ on submit validate all fields
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔒 AUTH CHECK: Redirect if not logged in
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

        // get location
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
            user: user?._id, // ✅ Include logged-in user's ID here
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
                setShowPopup(true); // ✅ show success popup
            } else {
                toast.error("❌ Failed to create booking!");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("⚠️ An unexpected error occurred.");
            // OPTIONAL: If error implies auth failure
            // navigate("/login");
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    // Check if city is NOT Jaipur (case insensitive) AND city has been selected/typed
    const city = formData.address.manualAddress.city?.trim().toLowerCase();
    const isOutsideJaipur = city && city !== "jaipur";

    if (isOutsideJaipur) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">We're Currently in Jaipur! 🏙️</h2>
                        <p className="text-gray-600 mb-6">It looks like you're outside our current service area. But don't worry, we have great options for you in Jaipur!</p>

                        <Slider {...sliderSettings} className="mb-8">
                            <div className="p-4">
                                <div className="bg-green-100 h-48 rounded-xl flex items-center justify-center text-green-800 font-bold text-xl">
                                    Fresh Grinding in Jaipur 🏪
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="bg-yellow-100 h-48 rounded-xl flex items-center justify-center text-yellow-800 font-bold text-xl">
                                    Premium Spices Available 🌶️
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="bg-blue-100 h-48 rounded-xl flex items-center justify-center text-blue-800 font-bold text-xl">
                                    Doorstep Delivery 🚚
                                </div>
                            </div>
                        </Slider>

                        <button
                            onClick={() => handleChange({ target: { name: 'city', value: 'Jaipur' } })}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Show Booking Options in Jaipur
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    Create Booking
                </h2>

                {/* Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* Mobile */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // ✅ allow only digits
                            if (value.length <= 10) { // ✅ max 10 digits
                                handleChange({ target: { name: "mobile", value } });
                            }
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                    />

                    {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                </div>

                {/* Service Type */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Service Type</label>
                    <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none"
                    >
                        <option value="" disabled>
                            Choose Type
                        </option>
                        <option value="grinding">Grinding</option>
                        <option value="spices">Spices</option>
                        <option value="aata">Aata</option>
                    </select>
                    {errors.serviceType && (
                        <p className="text-red-500 text-sm">{errors.serviceType}</p>
                    )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none"
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none"
                        />
                        {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
                    </div>
                </div>

                {/* Address */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">
                    Address Details
                </h3>

                <div className="space-y-3">
                    {/* City Selection - Replaces Text Input */}
                    <div>
                        <label className="block text-gray-700 mb-1">City</label>
                        <select
                            name="city"
                            value={formData.address.manualAddress.city}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none"
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
                            <input
                                type="text"
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData.address.manualAddress[field]}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none"
                            />
                            {errors[`address.manualAddress.${field}`] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors[`address.manualAddress.${field}`]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full cursor-pointer mt-6 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                    Book Now
                </button>
            </form>


            {/* ✅ Success Popup Modal with Blurred Background */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center transform transition-all scale-100">
                        <h3 className="text-xl font-semibold text-green-600 mb-2">
                            Booking Successful 🎉
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Your booking has been created successfully.
                        </p>


                        <button
                            onClick={() => navigate(`/my-bookings/${user?._id}`)}
                            className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 transition"
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
