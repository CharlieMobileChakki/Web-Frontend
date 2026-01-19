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
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contact Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage customer inquiries and support requests</p>
                </div>

                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-600">Total Contacts: </span>
                    <span className="font-bold text-blue-600">{meta?.total || 0}</span>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Total</div>
                        <div className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.total}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wide">New</div>
                        <div className="text-2xl sm:text-3xl font-bold text-green-700">{stats.new}</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="text-xs text-yellow-600 font-semibold mb-1 uppercase tracking-wide">Pending</div>
                        <div className="text-2xl sm:text-3xl font-bold text-yellow-700">{stats.pending}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wide">In Progress</div>
                        <div className="text-2xl sm:text-3xl font-bold text-purple-700">{stats.in_progress}</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wide">Resolved</div>
                        <div className="text-2xl sm:text-3xl font-bold text-teal-700">{stats.resolved}</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wide">Rejected</div>
                        <div className="text-2xl sm:text-3xl font-bold text-red-700">{stats.rejected}</div>
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Search contacts..."
                        />
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleStatusFilter('')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.status === '' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleStatusFilter('new')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.status === 'new' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            New
                        </button>
                        <button
                            onClick={() => handleStatusFilter('pending')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.status === 'pending' ? 'bg-yellow-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => handleStatusFilter('in_progress')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.status === 'in_progress' ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => handleStatusFilter('resolved')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.status === 'resolved' ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Resolved
                        </button>
                        <button
                            onClick={() => handleStatusFilter('rejected')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filters.status === 'rejected' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Rejected
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-6">
                    <ContactTable contacts={contacts} />

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <button
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page === 1}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 font-medium">
                                Page {meta.page} of {meta.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page === meta.totalPages}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactManagement;
