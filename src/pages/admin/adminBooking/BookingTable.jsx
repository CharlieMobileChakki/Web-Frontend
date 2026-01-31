import React, { useState } from "react";
import { FaRegFileArchive } from "react-icons/fa";
import Pagination from "../../../components/admin/Pagination";

const BookingTable = ({ bookings = [], onView }) => {
    if (!bookings || bookings.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <FaRegFileArchive size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No bookings found</p>
            </div>
        );
    }



    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // ✅ Pagination Logic
    const totalPages = Math.ceil((bookings?.length || 0) / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBookings = (bookings || []).slice(
        startIndex,
        startIndex + itemsPerPage
    );
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full whitespace-nowrap text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Sr No.
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Booking ID
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Mobile
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {currentBookings.map((booking, index) => (
                            <tr
                                key={booking?._id || index}
                                className="hover:bg-gray-50 transition duration-150"
                            >
                                <td className="px-6 py-4 font-medium text-gray-700">
                                    {startIndex + index + 1}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {booking?._id}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {booking?.user?.name || "N/A"}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {booking?.user?.mobile || "N/A"}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {booking?.createdAt
                                        ? new Date(booking.createdAt).toLocaleDateString("en-IN")
                                        : "N/A"}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onView?.(booking)}
                                        className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* Pagination outside of scroll container */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={bookings.length || 0}
                itemsPerPage={itemsPerPage}
            />

        </>
    );
};

export default BookingTable;
