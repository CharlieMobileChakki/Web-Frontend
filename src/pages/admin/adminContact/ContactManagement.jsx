import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllContacts, adminGetContactStats } from "../../../store/slices/adminSlice/AdminContactSlice";
import SidebarTitle from "../../../components/admin/SidebarTitle";
import ContactTable from "./ContactTable";

export const ContactManagement = () => {
    const dispatch = useDispatch();
    const { contacts, loading, error, meta, stats } = useSelector((state) => state.adminContact);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        status: '',
    });

    useEffect(() => {
        dispatch(adminGetAllContacts(filters));
        dispatch(adminGetContactStats());
    }, [dispatch, filters]);

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleStatusFilter = (status) => {
        setFilters(prev => ({ ...prev, status, page: 1 }));
    };

    return (
        <div className="p-2 sm:p-4">
            {/* Header with Stats */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <SidebarTitle />
                <div className="text-sm sm:text-base text-gray-600">
                    Total Contacts: <span className="font-bold text-[#DA352D]">{meta?.total || 0}</span>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs text-blue-600 font-semibold mb-1">Total</div>
                        <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-xs text-green-600 font-semibold mb-1">New</div>
                        <div className="text-2xl font-bold text-green-700">{stats.new}</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="text-xs text-yellow-600 font-semibold mb-1">Pending</div>
                        <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="text-xs text-purple-600 font-semibold mb-1">In Progress</div>
                        <div className="text-2xl font-bold text-purple-700">{stats.in_progress}</div>
                    </div>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                        <div className="text-xs text-teal-600 font-semibold mb-1">Resolved</div>
                        <div className="text-2xl font-bold text-teal-700">{stats.resolved}</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-xs text-red-600 font-semibold mb-1">Rejected</div>
                        <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
                    </div>
                </div>
            )}

            {/* Status Filter */}
            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    onClick={() => handleStatusFilter('')}
                    className={`px-3 py-1 rounded text-sm ${filters.status === '' ? 'bg-[#DA352D] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    All
                </button>
                <button
                    onClick={() => handleStatusFilter('new')}
                    className={`px-3 py-1 rounded text-sm ${filters.status === 'new' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    New
                </button>
                <button
                    onClick={() => handleStatusFilter('pending')}
                    className={`px-3 py-1 rounded text-sm ${filters.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => handleStatusFilter('in_progress')}
                    className={`px-3 py-1 rounded text-sm ${filters.status === 'in_progress' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    In Progress
                </button>
                <button
                    onClick={() => handleStatusFilter('resolved')}
                    className={`px-3 py-1 rounded text-sm ${filters.status === 'resolved' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Resolved
                </button>
                <button
                    onClick={() => handleStatusFilter('rejected')}
                    className={`px-3 py-1 rounded text-sm ${filters.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Rejected
                </button>
            </div>

            {loading && <p className="text-center text-gray-500">Loading contacts...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {!loading && !error && (
                <>
                    <ContactTable contacts={contacts} />

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <button
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page === 1}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {meta.page} of {meta.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page === meta.totalPages}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ContactManagement;
