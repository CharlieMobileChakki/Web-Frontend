import React from "react";
import { Users } from "lucide-react";

const UserTable = ({ users, onView }) => {
    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get default address
    const getDefaultAddress = (user) => {
        const addresses = user.addresses;

        if (!addresses || addresses.length === 0) {
            if (user.address) {
                if (typeof user.address === 'string') return 'Address ID Only';
                return user.address.formattedAddress || `${user.address.city || ''}, ${user.address.state || ''}`;
            }
            return 'No Address';
        }

        if (typeof addresses[0] === 'string') {
            return 'Address IDs Only';
        }

        const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];

        if (defaultAddr.formattedAddress) return defaultAddr.formattedAddress;

        const city = defaultAddr.city || '';
        const state = defaultAddr.state || '';

        if (city && state) return `${city}, ${state}`;
        if (city) return city;
        if (defaultAddr.street) return defaultAddr.street;

        return 'Incomplete Data';
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full whitespace-nowrap text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Reviews</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {users?.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                                {/* Name */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                </td>

                                {/* Mobile */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.mobile}
                                </td>

                                {/* Role */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'admin'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>

                                {/* Address */}
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-[250px] truncate" title={getDefaultAddress(user)}>
                                    {getDefaultAddress(user)}
                                </td>

                                {/* Reviews */}
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                                        {user.reviews?.length || 0}
                                    </span>
                                </td>

                                {/* Created Date */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDate(user.createdAt)}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onView(user)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="View Details"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users?.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No users found</p>
                </div>
            )}
        </div>
    );
};

export default UserTable;
