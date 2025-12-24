import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usergetbookings, usercancelbooking } from "../../../store/slices/BookingSlice";
import { toast } from "react-toastify"; 

export const MyBooking = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state) => state.booking);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?._id) {
            dispatch(usergetbookings(user._id));
        }
    }, [dispatch]);

    // handle cancel
    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await dispatch(usercancelbooking(id)).unwrap();
                // ✅ Instantly update list without refresh
                const user = JSON.parse(localStorage.getItem("user"));
                if (user?._id) {
                    dispatch(usergetbookings(user._id));
                }
                toast.success("Booking cancelled successfully");
            } catch (error) { 
                toast.error("Failed to cancel booking", error);
            }
        }
    };

    return (
        <div className="bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                My Bookings
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading your bookings...</p>
            ) : bookings?.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
                        >
                            {/* Service Type */}
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-bold text-green-600">
                                    {booking.serviceType}
                                </h2>

                                <span
                                    className={`text-sm px-3 py-1 rounded-full ${booking.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : booking.status === "cancelled"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            {/* Booking Info */}
                            <p className="text-gray-700">
                                <strong>Name:</strong> {booking.name}
                            </p>
                            <p className="text-gray-700">
                                <strong>Mobile:</strong> {booking.mobile}
                            </p>
                            <p className="text-gray-700">
                                <strong>Date:</strong>{" "}
                                {new Date(booking.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 mb-3">
                                <strong>Address:</strong>{" "}
                                {booking.address?.manualAddress?.street},{" "}
                                {booking.address?.manualAddress?.city}
                            </p>

                            {/* Cancel button */}
                            {booking.status === "active" && (
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="w-full bg-red-500 cursor-pointer hover:bg-red-600 text-white py-2 rounded-lg transition"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    You don’t have any bookings yet.
                </p>
            )}
        </div>
    );
};
