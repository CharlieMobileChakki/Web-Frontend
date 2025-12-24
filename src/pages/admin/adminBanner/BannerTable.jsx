import React from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const BannerTable = ({ banners, onEdit, onDelete }) => {
    if (!banners || banners.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No banners found. Click "+ Add Banner" to create one.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
                <div
                    key={banner._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                    {/* Banner Image */}
                    <div className="relative h-48 bg-gray-200">
                        {banner.image ? (
                            <img
                                src={banner.image}
                                alt={banner.title || "Banner"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                            <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${banner.isActive || banner.status === "active"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-500 text-white"
                                    }`}
                            >
                                {banner.isActive || banner.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>

                    {/* Banner Details */}
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                            {banner.title || "Untitled Banner"}
                        </h3>

                        {banner.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {banner.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            {banner.link && (
                                <div className="flex items-center">
                                    <span className="font-medium">Link:</span>
                                    <span className="ml-1 truncate max-w-[150px]">
                                        {banner.link}
                                    </span>
                                </div>
                            )}

                            {banner.order !== undefined && (
                                <div className="flex items-center">
                                    <span className="font-medium">Order:</span>
                                    <span className="ml-1">{banner.order}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-3 border-t">
                            <button
                                onClick={() => onEdit(banner)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
                                title="Edit"
                            >
                                <FaEdit />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            `Are you sure you want to delete "${banner.title || "this banner"}"?`
                                        )
                                    ) {
                                        onDelete(banner._id);
                                    }
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition"
                                title="Delete"
                            >
                                <FaTrash />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BannerTable;
