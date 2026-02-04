import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    adminGetAllBookings,
    adminUpdateBookingStatus,
} from "../../../store/slices/adminSlice/AdminBookingSlice";
import { toast } from "react-toastify";
import AdminTable from "../../../components/admin/AdminTable";
import CommonModal from "../../../components/admin/CommonModal";
import { FaSearch, FaUser, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

const BookingOrdersTab = ({ searchParams, setSearchParams }) => {
    const dispatch = useDispatch();
    const { bookings = [], loading } = useSelector((state) => state.adminBooking);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);

    // ✅ URL se page read
    const currentPage = Number(searchParams.get("ordersPage")) || 1;

    useEffect(() => {
        dispatch(adminGetAllBookings());
    }, [dispatch]);

    const filteredBookings = bookings.filter((b) =>
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // ✅ search change -> page 1 set (Only when user types)
    useEffect(() => {
        if (searchTerm) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set("ordersPage", "1");
                return params;
            }, { replace: true });
        }
    }, [searchTerm, setSearchParams]);


    // ✅ pagination handler -> URL update
    const handlePageChange = (page) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("ordersPage", String(page));
            return params;
        });
    };
    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedBooking) return;
        setStatusUpdating(true);
        try {
            await dispatch(adminUpdateBookingStatus({ id: selectedBooking._id, status: newStatus })).unwrap();
            toast.success(`Status updated to ${newStatus}`);
            setSelectedBooking(prev => ({ ...prev, status: newStatus }));
        } catch (err) {
            toast.error(err || "Status update failed");
        } finally {
            setStatusUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Confirmed": return "bg-blue-100 text-blue-800";
            case "In Progress": return "bg-amber-100 text-amber-800";
            case "Out for Delivery": return "bg-indigo-100 text-indigo-800";
            case "Delivered": return "bg-emerald-100 text-emerald-800";
            case "Cancelled":
            case "Rejected": return "bg-rose-100 text-rose-800";
            default: return "bg-slate-100 text-slate-800";
        }
    };

    const columns = [
        { header: "Booking ID", render: (item) => <span className="font-bold text-gray-400">#{item._id?.slice(-8).toUpperCase()}</span> },
        { header: "Customer", key: "name", className: "font-semibold text-gray-800" },
        { header: "Type", key: "serviceType", className: "capitalize font-medium text-slate-500" },
        {
            header: "Date",
            render: (item) => <span className="text-gray-600">{new Date(item.date).toLocaleDateString("en-IN")}</span>
        },
        {
            header: "Status",
            render: (item) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(item.status)}`}>
                    {item.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <div className="relative w-full">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or Customer Name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* <AdminTable
                columns={columns}
                data={filteredBookings}
                loading={loading}
                onView={handleViewDetails}
            /> */}
            <AdminTable
                columns={columns}
                data={filteredBookings}
                loading={loading}
                onView={handleViewDetails}
                // ✅ URL controlled pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={6}
            />

            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Booking Details"
            >
                {selectedBooking && (
                    <div className="space-y-6">
                        {/* Status Change */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(selectedBooking.status)}`}>
                                    {selectedBooking.status}
                                </span>
                            </div>
                            <div className="flex-1 max-w-[200px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-right">Update To</p>
                                <select
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none ring-offset-2 focus:ring-2 ring-blue-500"
                                    value={selectedBooking.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    disabled={statusUpdating}
                                >
                                    {["Confirmed", "In Progress", "Out for Delivery", "Delivered", "Cancelled", "Rejected"].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
                                    <FaUser className="text-blue-500" /> Customer Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-slate-400">Name:</span> <span className="font-bold text-slate-700">{selectedBooking.name}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400">Mobile:</span> <span className="font-bold text-slate-700">{selectedBooking.phone}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400">User ID:</span> <span className="text-xs font-bold text-slate-500">#{selectedBooking.user?._id?.slice(-8)}</span></p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
                                    <FaCalendarAlt className="text-blue-500" /> Service Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-slate-400">Type:</span> <span className="font-bold text-blue-600 uppercase">{selectedBooking.serviceType}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="font-bold text-slate-700">{new Date(selectedBooking.date).toLocaleDateString("en-IN")}</span></p>
                                    <p className="flex justify-between"><span className="text-slate-400">Time Slot:</span> <span className="font-bold text-slate-700">{selectedBooking.timeSlot}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
                                <FaMapMarkerAlt className="text-rose-500" /> Delivery Location
                            </h4>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-800 mb-1">{selectedBooking.address?.label || "Selected Address"}</p>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{selectedBooking.address?.formattedAddress}</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-xl"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                )}
            </CommonModal>
        </div>
    );
};

export default BookingOrdersTab;
