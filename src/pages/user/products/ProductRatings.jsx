import React, { useState } from "react";
import { Star, Pencil, Trash2, X, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { usercreatereviews, userdeletereviews, userupdatereviews } from "../../../store/slices/ReviewSlice";
import { toast } from "react-toastify";

const ProductRatings = ({ reviews = [], productId }) => {
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
    const [showAllReviews, setShowAllReviews] = useState(false);

    if (!reviews) reviews = [];

    // Get the user object stored in localStorage
    const userData = localStorage.getItem("user");

    // Parse it to JSON
    const userObj = userData ? JSON.parse(userData) : null;

    // Get the name
    const username = userObj?.name || "You";


    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
            : "0.0";

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));

    const totalRatings = reviews.length;


    // ✅ Updated handleSubmit with toast
    const handleSubmit = async () => {
        if (newReview.rating === 0 || !newReview.comment.trim()) {
            toast.error("Please add a rating and comment.");
            return;
        }

        try {
            await dispatch(
                usercreatereviews({
                    id: productId,
                    reviewData: {
                        rating: newReview.rating,
                        comment: newReview.comment,
                    },
                })
            ).unwrap();

            toast.success("Thank you for your review! ⭐");
            setNewReview({ rating: 0, comment: "" });
            setShowForm(false);
        } catch (error) {
            toast.error("Failed to submit review. Please try again.");
        }
    };

    // ✅ Editing State
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ rating: 0, comment: "" });

    // ✏️ Handle Edit Click
    const handleEditClick = (review) => {
        setEditingId(review._id);
        setEditData({ rating: review.rating, comment: review.comment });
    };

    // 💾 Handle Update Submit
    const handleUpdate = async (reviewId) => {
        if (editData.rating === 0 || !editData.comment.trim()) {
            toast.error("Rating and comment cannot be empty.");
            return;
        }

        try {
            await dispatch(userupdatereviews({ id: reviewId, reviewData: editData })).unwrap();
            toast.success("Review updated successfully! ✅");
            setEditingId(null);
        } catch (error) {
            toast.error("Failed to update review.");
        }
    };

    // 🗑️ Handle Delete
    const handleDelete = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await dispatch(userdeletereviews(reviewId)).unwrap();
                toast.success("Review deleted successfully. 🗑️");
            } catch (error) {
                toast.error("Failed to delete review.");
            }
        }
    };

    // ✅ Only show 3 reviews unless user clicks "See More"
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Ratings & Reviews</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm font-semibold"
                >
                    {showForm ? "Cancel" : "Rate Product"}
                </button>
            </div>

            {/* ⭐ Rating Summary */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="text-center sm:text-left">
                    <div className="text-4xl font-bold text-green-600">{avgRating} ★</div>
                    <p className="text-gray-600 text-sm">
                        {totalRatings} Ratings & {totalRatings} Reviews
                    </p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 w-full sm:w-auto">
                    {ratingCounts.map(({ star, count }) => {
                        const percentage = totalRatings ? ((count / totalRatings) * 100).toFixed(0) : 0;
                        return (
                            <div key={star} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                                <span className="w-4">{star}★</span>
                                <div className="flex-1 bg-gray-200 h-2 rounded-full">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="w-10 text-right text-gray-500">{count || 0}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Review Form */}
            {showForm && (
                <div className="border p-4 rounded-lg bg-gray-50 mb-6">
                    <h3 className="text-sm font-semibold mb-2">Rate this product</h3>

                    <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={24}
                                onClick={() => setNewReview({ ...newReview, rating: s })}
                                className={`cursor-pointer ${newReview.rating >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                        ))}
                    </div>

                    <textarea
                        className="w-full border rounded-lg p-2 text-sm focus:ring-1 focus:ring-[#A98C43]"
                        rows="3"
                        placeholder="Share your experience..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />

                    <button
                        onClick={handleSubmit}
                        className="mt-3 px-4 py-2 bg-[#A98C43] text-white rounded-lg hover:bg-[#b59955]"
                    >
                        Submit Review
                    </button>
                </div>
            )}



            {/* User Reviews */}
            <div className="space-y-6">
                {displayedReviews.map((r) => {
                    // 🛡️ Safe check for Review Owner (Handle both populated object & string ID)
                    const reviewUserId = r.user?._id || r.user;
                    // Check for _id (MongoDB default) or id (sometimes used in frontend auth state)
                    const currentUserId = userObj?._id || userObj?.id;

                    const isOwner = currentUserId === reviewUserId;
                    const authorName = r.user?.name || (isOwner ? userObj?.name : "Anonymous");

                    return (
                        <div key={r._id} className="border-b border-gray-100 pb-4 last:border-none">

                            {/* Review Header: Rating, Name, Actions */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                                        {editingId === r._id ? editData.rating : r.rating} <Star size={12} />
                                    </span>
                                    <span className="font-medium text-gray-800 text-sm">
                                        {authorName}
                                        {isOwner && <span className="text-gray-400 text-xs font-normal ml-1">(You)</span>}
                                    </span>
                                </div>

                                {/* 🛠️ Edit/Delete Buttons (Only for Owner) */}
                                {isOwner && (
                                    <div className="flex gap-2">
                                        {editingId === r._id ? (
                                            <>
                                                <button onClick={() => handleUpdate(r._id)} className="text-green-600 hover:bg-green-50 p-1 rounded transition">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:bg-gray-100 p-1 rounded transition">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(r)} className="text-blue-600 hover:bg-blue-50 p-1 rounded transition" title="Edit">
                                                    <Pencil size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:bg-red-50 p-1 rounded transition" title="Delete">
                                                    <Trash2 size={15} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Review Content */}
                            {editingId === r._id ? (
                                <div className="space-y-2 mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={20}
                                                onClick={() => setEditData({ ...editData, rating: s })}
                                                className={`cursor-pointer ${editData.rating >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full border rounded-lg p-2 text-sm focus:ring-1 focus:ring-[#A98C43] min-h-[80px]"
                                        value={editData.comment}
                                        onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-700 text-sm mb-2 leading-relaxed">{r.comment}</p>
                            )}
                        </div>
                    );
                })}

                {/* See More / Show Less Toggle */}
                {reviews.length > 3 && (
                    <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="text-sm text-gray-800 hover:underline cursor-pointer"
                    >
                        {showAllReviews ? "Show Less" : "See More Reviews"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductRatings;
