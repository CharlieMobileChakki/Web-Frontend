import React from "react";

const UserTable = ({ users }) => {
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
    const getDefaultAddress = (addresses) => {
        const defaultAddr = addresses?.find(addr => addr.isDefault);
        if (defaultAddr) {
            return `${defaultAddr.city}, ${defaultAddr.state}`;
        }
        return addresses?.[0] ? `${addresses[0].city}, ${addresses[0].state}` : 'N/A';
    };

    return (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full sm:min-w-[800px] lg:min-w-[1000px] border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left text-xs sm:text-sm">
                        <th className="p-1 sm:p-2 border">Name</th>
                        <th className="p-1 sm:p-2 border">Mobile</th>
                        <th className="p-1 sm:p-2 border hidden md:table-cell">Role</th>
                        <th className="p-1 sm:p-2 border hidden lg:table-cell">Address</th>
                        <th className="p-1 sm:p-2 border hidden sm:table-cell">Reviews</th>
                        <th className="p-1 sm:p-2 border">Created</th>
                    </tr>
                </thead>

                <tbody>
                    {users?.map((user) => (
                        <tr key={user._id} className="text-xs sm:text-sm hover:bg-gray-50">
                            <td className="p-1 sm:p-2 border">
                                <div className="font-medium text-gray-800">{user.name}</div>
                            </td>

                            <td className="p-1 sm:p-2 border text-gray-700">
                                {user.mobile}
                            </td>

                            <td className="p-1 sm:p-2 border hidden md:table-cell">
                                <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {user.role}
                                </span>
                            </td>

                            <td className="p-1 sm:p-2 border text-gray-600 hidden lg:table-cell">
                                {getDefaultAddress(user.addresses)}
                            </td>

                            <td className="p-1 sm:p-2 border text-center hidden sm:table-cell">
                                <span className="inline-block bg-gray-200 px-2 py-1 rounded text-xs">
                                    {user.reviews?.length || 0}
                                </span>
                            </td>

                            <td className="p-1 sm:p-2 border text-gray-600">
                                {formatDate(user.createdAt)}
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
