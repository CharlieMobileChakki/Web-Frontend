import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { adminUpdateContactStatus, adminDeleteContact, adminGetAllContacts } from "../../../store/slices/adminSlice/AdminContactSlice";
import { toast } from "react-toastify";
// import { MessageSquare } from "lucide-react";
import { MessageSquare } from "lucide-react";
import Pagination from "../../../components/admin/Pagination";
const ContactTable = ({ contacts }) => {
    const dispatch = useDispatch();
    const [editingId, setEditingId] = useState(null);
    const [statusForm, setStatusForm] = useState({ status: '', adminRemark: '' });



    // ✅ Pagination
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(contacts.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentContacts = contacts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setEditingId(null); // page change pe edit close
    };


    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        const badges = {
            new: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            in_progress: 'bg-purple-100 text-purple-700',
            resolved: 'bg-teal-100 text-teal-700',
            rejected: 'bg-red-100 text-red-700',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const handleEdit = (contact) => {
        setEditingId(contact._id);
        setStatusForm({
            status: contact.status,
            adminRemark: contact.adminRemark || ''
        });
    };

    const handleUpdate = async (id) => {
        try {
            await dispatch(adminUpdateContactStatus({ id, data: statusForm })).unwrap();
            toast.success("✅ Contact status updated successfully!");
            setEditingId(null);
            dispatch(adminGetAllContacts());
        } catch (error) {
            toast.error(error || "❌ Failed to update contact");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
            try {
                await dispatch(adminDeleteContact(id)).unwrap();
                toast.success("✅ Contact deleted successfully!");
                dispatch(adminGetAllContacts());
            } catch (error) {
                toast.error(error || "❌ Failed to delete contact");
            }
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full whitespace-nowrap text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SR No.</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Remark</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {/* {contacts?.map((contact) => ( */}
                        {currentContacts?.map((contact, index) => (
                            <React.Fragment key={contact._id}>
                                <tr className="hover:bg-gray-50 transition duration-150">
                                    {/* Name */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900"> {startIndex + index + 1}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{contact.name}</div>
                                    </td>

                                    {/* Mobile */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {contact.mobile}
                                    </td>

                                    {/* Message */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="max-w-md">
                                            <p className="line-clamp-2">{contact.message}</p>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
                                            {contact.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>

                                    {/* Admin Remark */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="max-w-xs">
                                            {contact.adminRemark ? (
                                                <p className="line-clamp-2 italic">{contact.adminRemark}</p>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No remark</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Submitted Date */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDate(contact.createdAt)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact._id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Edit Form Row */}
                                {editingId === contact._id && (
                                    <tr className="bg-blue-50">
                                        <td colSpan="8" className="p-6 border-t border-gray-200">
                                            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Contact Status</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                                        <select
                                                            value={statusForm.status}
                                                            onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="resolved">Resolved</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Remark</label>
                                                        <textarea
                                                            value={statusForm.adminRemark}
                                                            onChange={(e) => setStatusForm({ ...statusForm, adminRemark: e.target.value })}
                                                            placeholder="Add internal notes or remarks..."
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                                            rows="3"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 pt-4 border-t">
                                                    <button
                                                        onClick={() => handleUpdate(contact._id)}
                                                        className="px-6 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] font-medium transition shadow-sm"
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition shadow-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* ✅ Pagination UI */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={contacts.length || 0}
                itemsPerPage={itemsPerPage}
            />

            {contacts?.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No contact submissions found</p>
                </div>
            )}
        </div>
    );
};

export default ContactTable;
