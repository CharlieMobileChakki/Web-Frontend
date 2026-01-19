import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllBookings,
  adminUpdateBookingStatus,
} from "../../../store/slices/adminSlice/AdminBookingSlice";
import { FaEye, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";
import Pagination from "../../../components/admin/Pagination";

const BookingManagement = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.adminBooking);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((bookings?.length || 0) / itemsPerPage);

  useEffect(() => {
    dispatch(adminGetAllBookings());
  }, [dispatch]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedBooking) return;
    setStatusUpdating(true);
    try {
      await dispatch(
        adminUpdateBookingStatus({ id: selectedBooking._id, status: newStatus })
      ).unwrap();
      toast.success(`Booking status updated to ${newStatus}`);
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      toast.error(err || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
        <button
          onClick={() => dispatch(adminGetAllBookings())}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="text-center py-10">Loading bookings...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No bookings found.</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-6 py-3 text-left">Booking ID</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Service</th>
                    <th className="px-6 py-3 text-left">Date & Time</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        #{booking._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.name}
                        </div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                        {booking.serviceType}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.timeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00000080] bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update Section */}
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Current Status</span>
                  <div
                    className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Update Status:</span>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={statusUpdating}
                    className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Grid Layout for Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> Customer Info
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-900">Name:</span>{" "}
                      {selectedBooking.name}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Phone:</span>{" "}
                      {selectedBooking.phone}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">User ID:</span>{" "}
                      {selectedBooking.user?._id || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" /> Service Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-900">Type:</span>{" "}
                      <span className="capitalize">{selectedBooking.serviceType}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Date:</span>{" "}
                      {new Date(selectedBooking.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Time Slot:</span>{" "}
                      {selectedBooking.timeSlot}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Booked on:</span>{" "}
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" /> Delivery Address
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  <p className="font-medium mb-1">
                    {selectedBooking.address?.label}
                  </p>
                  <p className="leading-relaxed">
                    {selectedBooking.address?.formattedAddress}
                  </p>
                  {selectedBooking.address?.location?.coordinates && (
                    <div className="mt-3 text-xs text-gray-500">
                      Coordinates: {selectedBooking.address.location.coordinates[1]},{" "}
                      {selectedBooking.address.location.coordinates[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
