import React, { useState } from "react";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import Pagination from "../../../components/admin/Pagination";

const ReviewsTable = ({ reviews = [], onEdit, onDelete, loading, onPageChange }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    // Paginated reviews
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

    // Change page
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        if (onPageChange) onPageChange(); // close edit modal
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#2c3e50] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-1/3">
                                    Comment
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        Loading reviews...
                                    </td>
                                </tr>
                            ) : currentReviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            ) : (
                                currentReviews.map((review, index) => (
                                    <tr key={review._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                            {review.product?.name || "Unknown Product"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {review.user?.name || "Unknown User"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-yellow-500">
                                                {review.rating} <FaStar className="ml-1" size={12} />
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs"
                                            title={review.comment}
                                        >
                                            {review.comment}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => onEdit(review)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(review._id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={reviews.length}
                    itemsPerPage={itemsPerPage}
                />

            )}
        </>
    );
};

export default ReviewsTable;
