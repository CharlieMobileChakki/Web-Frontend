import React from "react";
import { FolderOpen } from "lucide-react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full whitespace-nowrap text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-gray-50 transition duration-150">
                                {/* Category with Image */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            {cat.image ? (
                                                <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FolderOpen size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-medium text-gray-900">{cat.name}</div>
                                    </div>
                                </td>

                                {/* Title */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {cat.title || '-'}
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(cat.createdAt).toLocaleDateString("en-GB")}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(cat)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(cat._id)}
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
                        ))}
                    </tbody>
                </table>
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <FolderOpen size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No categories found</p>
                </div>
            )}
        </div>
    );
};

export default CategoryTable;
