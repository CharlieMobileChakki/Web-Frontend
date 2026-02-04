import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

const BookingZonesTab = ({ searchParams, setSearchParams }) => {
    // Although under development, we keep the page logic for consistency
    const currentPage = Number(searchParams.get("zonesPage")) || 1;

    const handlePageChange = (page) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("zonesPage", String(page));
            return params;
        });
    };

    return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                <FaMapMarkedAlt className="text-amber-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">Booking Zones</h2>
            <p className="text-gray-500 text-sm font-medium mb-8">Zone management feature is currently under development.</p>

            <div className="flex gap-4">
                <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider italic">Coming Soon</span>
            </div>
        </div>
    );
};

export default BookingZonesTab;
