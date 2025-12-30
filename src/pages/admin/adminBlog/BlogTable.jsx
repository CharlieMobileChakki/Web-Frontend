import React from "react";
import { FaEdit, FaTrash, FaCalendar, FaUser } from "react-icons/fa";

const BlogTable = ({ blogs, onEdit, onDelete }) => {
    if (!blogs || blogs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No blogs found. Click "+ Add Blog" to create one.
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full min-w-[1000px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                {blog.image ? (
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="h-12 w-12 rounded object-cover"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">No Image</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                    {blog.title}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {blog.description || blog.excerpt}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                    <FaUser className="mr-2 text-gray-400" />
                                    {blog.author || "Admin"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-900">
                                    <FaCalendar className="mr-2 text-gray-400" />
                                    {formatDate(blog.date || blog.createdAt)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {blog.category || "General"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.status === "published" || blog.isPublished
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {blog.status === "published" || blog.isPublished
                                        ? "Published"
                                        : "Draft"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onEdit(blog)}
                                    className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                                    title="Edit"
                                >
                                    <FaEdit size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                `Are you sure you want to delete "${blog.title}"?`
                                            )
                                        ) {
                                            onDelete(blog._id);
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

export default BlogTable;
