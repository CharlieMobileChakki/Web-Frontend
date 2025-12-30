import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usergetbookings, usercancelbooking } from "../../../store/slices/BookingSlice";
import { toast } from "react-toastify";
import { Calendar, MapPin, Phone, User, Package, Clock, XCircle, CheckCircle } from "lucide-react";

export const MyBooking = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state) => state.booking);
    const [filter, setFilter] = useState("all"); // all, active, cancelled

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
                toast.success("✅ Booking cancelled successfully");
            } catch (error) {
                toast.error("❌ Failed to cancel booking");
            }
        }
    };

    // Filter bookings
    const filteredBookings = bookings?.filter((booking) => {
        if (filter === "all") return true;
        return booking.status === filter;
    });

    // Get status badge
    const getStatusBadge = (status) => {
        const badges = {
            active: {
                bg: "bg-green-100",
                text: "text-green-700",
                border: "border-green-300",
                icon: <CheckCircle className="w-4 h-4" />,
            },
            cancelled: {
                bg: "bg-red-100",
                text: "text-red-700",
                border: "border-red-300",
                icon: <XCircle className="w-4 h-4" />,
            },
            completed: {
                bg: "bg-blue-100",
                text: "text-blue-700",
                border: "border-blue-300",
                icon: <CheckCircle className="w-4 h-4" />,
            },
        };
        return badges[status] || badges.active;
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        My Bookings
                    </h1>
                    <p className="text-gray-600">
                        Manage and track all your service bookings
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-900">{bookings?.length || 0}</p>
                            </div>
                            <Package className="w-12 h-12 text-blue-500 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {bookings?.filter((b) => b.status === "active").length || 0}
                                </p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {bookings?.filter((b) => b.status === "cancelled").length || 0}
                                </p>
                            </div>
                            <XCircle className="w-12 h-12 text-red-500 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-md p-2 mb-6 inline-flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === "all"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("active")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === "active"
                                ? "bg-green-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter("cancelled")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === "cancelled"
                                ? "bg-red-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Cancelled
                    </button>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="text-gray-500 mt-4">Loading your bookings...</p>
                    </div>
                ) : filteredBookings?.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBookings.map((booking) => {
                            const statusBadge = getStatusBadge(booking.status);
                            return (
                                <div
                                    key={booking._id}
                                    className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">
                                                    {booking.serviceType}
                                                </h3>
                                                <p className="text-blue-100 text-sm">
                                                    Booking ID: {booking._id.slice(-8)}
                                                </p>
                                            </div>
                                            <span
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                                            >
                                                {statusBadge.icon}
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-semibold text-gray-800">{booking.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Mobile</p>
                                                <p className="font-semibold text-gray-800">{booking.mobile}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Booking Date</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formatDate(booking.date)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Address</p>
                                                <p className="font-semibold text-gray-800 line-clamp-2">
                                                    {booking.address?.manualAddress?.street},{" "}
                                                    {booking.address?.manualAddress?.city},{" "}
                                                    {booking.address?.manualAddress?.state} -{" "}
                                                    {booking.address?.manualAddress?.zipCode}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Created At</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formatDate(booking.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    {booking.status === "active" && (
                                        <div className="px-5 pb-5">
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-gray-700 mb-2">
                            No bookings found
                        </p>
                        <p className="text-gray-500">
                            {filter === "all"
                                ? "You don't have any bookings yet."
                                : `No ${filter} bookings available.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBooking;
