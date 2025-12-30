import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { adminUpdateContactStatus, adminDeleteContact, adminGetAllContacts } from "../../../store/slices/adminSlice/AdminContactSlice";
import { toast } from "react-toastify";

const ContactTable = ({ contacts }) => {
    const dispatch = useDispatch();
    const [editingId, setEditingId] = useState(null);
    const [statusForm, setStatusForm] = useState({ status: '', adminRemark: '' });

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
            new: 'bg-green-100 text-green-700 border-green-300',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            in_progress: 'bg-purple-100 text-purple-700 border-purple-300',
            resolved: 'bg-teal-100 text-teal-700 border-teal-300',
            rejected: 'bg-red-100 text-red-700 border-red-300',
        };
        return badges[status] || 'bg-gray-100 text-gray-700 border-gray-300';
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
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full sm:min-w-[1000px] lg:min-w-[1400px] border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left text-xs sm:text-sm">
                        <th className="p-1 sm:p-2 border">Name</th>
                        <th className="p-1 sm:p-2 border">Mobile</th>
                        <th className="p-1 sm:p-2 border hidden md:table-cell">Message</th>
                        <th className="p-1 sm:p-2 border">Status</th>
                        <th className="p-1 sm:p-2 border hidden lg:table-cell">Admin Remark</th>
                        <th className="p-1 sm:p-2 border">Submitted</th>
                        <th className="p-1 sm:p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {contacts?.map((contact) => (
                        <React.Fragment key={contact._id}>
                            <tr className="text-xs sm:text-sm hover:bg-gray-50">
                                <td className="p-1 sm:p-2 border">
                                    <div className="font-medium text-gray-800">{contact.name}</div>
                                </td>

                                <td className="p-1 sm:p-2 border text-gray-700">
                                    {contact.mobile}
                                </td>

                                <td className="p-1 sm:p-2 border text-gray-600 hidden md:table-cell">
                                    <div className="max-w-md">
                                        <p className="line-clamp-2">{contact.message}</p>
                                    </div>
                                </td>

                                <td className="p-1 sm:p-2 border">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusBadge(contact.status)}`}>
                                        {contact.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>

                                <td className="p-1 sm:p-2 border text-gray-600 hidden lg:table-cell">
                                    <div className="max-w-xs">
                                        {contact.adminRemark ? (
                                            <p className="line-clamp-2 text-xs italic">{contact.adminRemark}</p>
                                        ) : (
                                            <span className="text-gray-400 text-xs">No remark</span>
                                        )}
                                    </div>
                                </td>

                                <td className="p-1 sm:p-2 border text-gray-600">
                                    {formatDate(contact.createdAt)}
                                </td>

                                <td className="p-1 sm:p-2 border">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(contact)}
                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact._id)}
                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Edit Form Row */}
                            {editingId === contact._id && (
                                <tr className="bg-blue-50">
                                    <td colSpan="7" className="p-4 border">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Status</label>
                                                <select
                                                    value={statusForm.status}
                                                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded"
                                                >
                                                    <option value="new">New</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Admin Remark</label>
                                                <textarea
                                                    value={statusForm.adminRemark}
                                                    onChange={(e) => setStatusForm({ ...statusForm, adminRemark: e.target.value })}
                                                    placeholder="Add internal notes or remarks..."
                                                    className="w-full px-3 py-2 border rounded"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(contact._id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
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

            {contacts?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No contact submissions found
                </div>
            )}
        </div>
    );
};

export default ContactTable;
