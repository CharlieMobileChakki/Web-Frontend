import React from "react";

const ContactTable = ({ contacts }) => {
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

    return (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full sm:min-w-[800px] lg:min-w-[1000px] border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left text-xs sm:text-sm">
                        <th className="p-1 sm:p-2 border">Name</th>
                        <th className="p-1 sm:p-2 border">Mobile</th>
                        <th className="p-1 sm:p-2 border hidden md:table-cell">Message</th>
                        <th className="p-1 sm:p-2 border">Submitted</th>
                    </tr>
                </thead>

                <tbody>
                    {contacts?.map((contact) => (
                        <tr key={contact._id} className="text-xs sm:text-sm hover:bg-gray-50">
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

                            <td className="p-1 sm:p-2 border text-gray-600">
                                {formatDate(contact.createdAt)}
                            </td>
                        </tr>
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
