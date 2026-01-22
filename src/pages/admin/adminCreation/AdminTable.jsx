import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminTable = ({ admins, onEdit, onDelete }) => {
    if (!admins || admins.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No admins found. Click "+ Add Admin" to create one.
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full min-w-[1000px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                        </th>

                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {admin.name || admin.fullName}
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {admin.phone || admin.phoneNumber || "N/A"}
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
    );
};

export default AdminTable;
