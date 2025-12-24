import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3">Image</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat._id} className="border-t hover:bg-gray-50">

                            <td className="p-3">
                                <img
                                    src={cat.image || "https://via.placeholder.com/40"}
                                    alt={cat.name}
                                    className="w-10 h-10 rounded object-cover"
                                />
                            </td>

                            <td className="p-3">{cat.name}</td>
                            <td className="p-3">{cat.title}</td>

                            <td className="p-3">
                                {new Date(cat.createdAt).toLocaleDateString("en-GB")}
                            </td>

                            <td className="p-3 flex justify-center gap-2">
                                <button
                                    onClick={() => onEdit(cat)}
                                    className="px-3 py-1 bg-green-700 cursor-pointer text-white rounded hover:bg-green-800"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => onDelete(cat._id)}
                                    className="px-3 py-1 bg-[#C6363E] cursor-pointer text-white rounded hover:bg-[#9b1d23]"
                                >
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
