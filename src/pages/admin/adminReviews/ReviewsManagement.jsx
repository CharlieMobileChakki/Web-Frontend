
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetReviews, adminDeleteReview, adminUpdateReview } from "../../../store/slices/adminSlice/AdminReviewSlice";
import { FaEdit, FaTrash, FaStar, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ReviewsManagement = () => {
    const dispatch = useDispatch();
    const { reviews, loading, updateLoading } = useSelector((state) => state.adminReview);

    const [searchTerm, setSearchTerm] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [formData, setFormData] = useState({ rating: 0, comment: "" });

    useEffect(() => {
        dispatch(adminGetReviews());
    }, [dispatch]);

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(adminDeleteReview(id))
                    .unwrap()
                    .then(() => toast.success("Review deleted successfully!"))
                    .catch((err) => toast.error(err));
            }
        });
    };

    // Handle Edit Open
    const handleEdit = (review) => {
        setSelectedReview(review);
        setFormData({ rating: review.rating, comment: review.comment });
        setEditModalOpen(true);
    };

    // Handle Edit Submit
    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(adminUpdateReview({ reviewId: selectedReview._id, data: formData }))
            .unwrap()
            .then(() => {
                toast.success("Review updated successfully!");
                setEditModalOpen(false);
            })
            .catch((err) => toast.error(err));
    };

    // Filter Reviews
    const filteredReviews = reviews.filter(
        (review) =>
            review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-[#2c3e50] font-bold mb-6 text-3xl md:text-4xl">Reviews Management</h2>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center border border-gray-200">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search by Product or User..."
                    className="w-full focus:outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#2c3e50] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-1/3">Comment</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">Loading reviews...</td>
                                </tr>
                            ) : filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">No reviews found.</td>
                                </tr>
                            ) : (
                                filteredReviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{review.product?.name || "Unknown Product"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{review.user?.name || "Unknown User"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-yellow-500">
                                                {review.rating} <FaStar className="ml-1" size={12} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs" title={review.comment}>
                                            {review.comment}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(review)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    title="Delete"
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

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000070] backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 animate-fadeIn">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Update Review</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">Rating (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-1">Comment</label>
                                <textarea
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                                >
                                    {updateLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsManagement;
