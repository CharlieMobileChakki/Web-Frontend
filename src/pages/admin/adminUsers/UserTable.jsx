import React from "react";
import { FaEye } from "react-icons/fa";

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
        // Debugging: Log first user to see structure
        if (users && users.length > 0 && user._id === users[0]._id) {
            console.log("First User Data:", user);
        }

        const addresses = user.addresses;

        // Case 1: No addresses array
        if (!addresses || addresses.length === 0) {
            // Check singular address field just in case
            if (user.address) {
                if (typeof user.address === 'string') return 'Address ID Only';
                return user.address.formattedAddress || `${user.address.city || ''}, ${user.address.state || ''}`;
            }
            return 'No Address';
        }

        // Case 2: Addresses are strings (IDs)
        if (typeof addresses[0] === 'string') {
            return 'Address IDs Only (Not Populated)';
        }

        // Case 3: Addresses are objects
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
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full min-w-[1000px] border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-100 text-left text-xs sm:text-sm text-gray-700">
                        <th className="p-3 border font-semibold">Name</th>
                        <th className="p-3 border font-semibold">Mobile</th>
                        <th className="p-3 border font-semibold hidden md:table-cell">Role</th>
                        <th className="p-3 border font-semibold hidden lg:table-cell">Address</th>
                        <th className="p-3 border font-semibold hidden sm:table-cell">Reviews</th>
                        <th className="p-3 border font-semibold">Created</th>
                        <th className="p-3 border font-semibold text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users?.map((user) => (
                        <tr key={user._id} className="text-xs sm:text-sm hover:bg-gray-50 transition">
                            <td className="p-3 border">
                                <div className="font-medium text-gray-800">{user.name}</div>
                            </td>

                            <td className="p-3 border text-gray-700">
                                {user.mobile}
                            </td>

                            <td className="p-3 border hidden md:table-cell">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {user.role}
                                </span>
                            </td>

                            <td className="p-3 border text-gray-600 hidden lg:table-cell max-w-[200px] truncate" title={getDefaultAddress(user)}>
                                {getDefaultAddress(user)}
                            </td>

                            <td className="p-3 border text-center hidden sm:table-cell">
                                <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700">
                                    {user.reviews?.length || 0}
                                </span>
                            </td>

                            <td className="p-3 border text-gray-600">
                                {formatDate(user.createdAt)}
                            </td>

                            <td className="p-3 border text-center">
                                <button
                                    onClick={() => onView(user)}
                                    className="text-blue-600 hover:text-blue-800 transition flex items-center justify-center gap-1 mx-auto"
                                    title="View Details"
                                >
                                    <FaEye /> <span className="hidden sm:inline">View</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {users?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No users found
                </div>
            )}
        </div>
    );
};

export default UserTable;
