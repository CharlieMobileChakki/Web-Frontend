import React, { useState } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Pagination from "../../../components/admin/Pagination";

const AdminTable = ({ admins, onEdit, onDelete }) => {
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Pagination Logic
    const totalPages = Math.ceil((admins?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAdmins = admins?.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    if (!admins || admins.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No admins found. Click "+ Add Admin" to create one.
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SR No.
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentAdmins?.map((admin, index) => (
                            <tr key={admin._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                        {startIndex + index + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {admin.name || admin.fullName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {admin.mobile || admin.mobile || "N/A"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {admin.role || admin.role || "N/A"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {admin.createdAt
                                            ? new Date(admin.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(admin)}
                                        className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                                        title="Edit"
                                    >
                                        <FaEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    `Are you sure you want to delete ${admin.name || admin.fullName}?`
                                                )
                                            ) {
                                                onDelete(admin._id);
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-900 cursor-pointer"
                                        title="Delete"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={admins.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default AdminTable;
