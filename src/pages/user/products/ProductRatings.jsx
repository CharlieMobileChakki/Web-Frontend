import React, { useState } from "react";
import { Star, Pencil, Trash2, X, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usercreatereviews, userdeletereviews, userupdatereviews } from "../../../store/slices/ReviewSlice";
import { toast } from "react-toastify";
import { checkAuth } from "../../../utils/checkAuth";

const ProductRatings = ({ reviews = [], productId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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


    // ✅ Updated handleSubmit with authentication check
    const handleSubmit = async () => {
        // Check authentication first
        if (!checkAuth(navigate)) return;

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

    // 💾 Handle Update Submit with authentication check
    const handleUpdate = async (reviewId) => {
        // Check authentication first
        if (!checkAuth(navigate)) return;

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

    // 🗑️ Handle Delete with authentication check
    const handleDelete = async (reviewId) => {
        // Check authentication first
        if (!checkAuth(navigate)) return;

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
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 mb-8 border border-gray-100/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 md:mb-0">
                    Ratings & Reviews
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {showForm ? <X size={18} /> : <Pencil size={18} />}
                    {showForm ? "Cancel Review" : "Write a Review"}
                </button>
            </div>

            {/* ⭐ Rating Summary */}
            <div className="flex flex-col md:flex-row gap-12 mb-12">
                {/* Average Rating Circle */}
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl min-w-[200px]">
                    <div className="relative mb-2">
                        <div className="text-6xl font-extrabold text-[#DA352D]">{avgRating}</div>
                    </div>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={20}
                                className={`${s <= Math.round(Number(avgRating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-500 font-medium">
                        {totalRatings} {totalRatings === 1 ? "Review" : "Reviews"}
                    </p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 space-y-3 pt-2">
                    {ratingCounts.map(({ star, count }) => {
                        const percentage = totalRatings ? ((count / totalRatings) * 100).toFixed(0) : 0;
                        return (
                            <div key={star} className="flex items-center gap-4 group cursor-default">
                                <span className="w-12 text-sm font-semibold text-gray-600 flex items-center gap-1">
                                    {star} <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                </span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-[#A98C43] rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 relative"
                                        style={{ width: `${percentage}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20"></div>
                                    </div>
                                </div>
                                <span className="w-12 text-sm text-gray-500 font-medium text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Review Form */}
            {showForm && (
                <div className="mb-10 p-8 rounded-2xl bg-gray-50 border border-gray-100 animate-fadeIn">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Share your experience</h3>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setNewReview({ ...newReview, rating: s })}
                                    className={`p-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-md ${newReview.rating >= s ? "scale-110" : ""}`}
                                >
                                    <Star
                                        size={32}
                                        className={`${newReview.rating >= s ? "text-yellow-400 fill-yellow-400 filter drop-shadow-sm" : "text-gray-300"}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                        <textarea
                            className="w-full border-gray-300 rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#A98C43] focus:border-transparent transition shadow-sm resize-none"
                            rows="4"
                            placeholder="What did you like or dislike? What was your overall experience?"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-200/50 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-2.5 bg-[#A98C43] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-[#967d3b] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            )}

            {/* User Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedReviews.map((r) => {
                    // 🛡️ Safe check for Review Owner (Handle both populated object & string ID)
                    const reviewUserId = r.user?._id || r.user;
                    // Check for _id (MongoDB default) or id (sometimes used in frontend auth state)
                    const currentUserId = userObj?._id || userObj?.id;

                    const isOwner = currentUserId === reviewUserId;
                    const authorName = r.user?.name || (isOwner ? userObj?.name : "Anonymous");
                    const initial = authorName.charAt(0).toUpperCase();

                    return (
                        <div key={r._id} className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                            {/* Review Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md
                                        ${["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"][authorName.length % 5]}
                                    `}>
                                        {initial}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 text-lg">
                                                {authorName}
                                            </h4>
                                            {isOwner && (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">You</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < (editingId === r._id ? editData.rating : r.rating)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-200"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {isOwner && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editingId === r._id ? (
                                            <>
                                                <button onClick={() => handleUpdate(r._id)} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition tooltip" title="Save">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full transition tooltip" title="Cancel">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(r)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition" title="Edit">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(r._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Review Content */}
                            {editingId === r._id ? (
                                <div className="mt-4 bg-gray-50 p-4 rounded-xl animate-fadeIn">
                                    <div className="flex gap-2 mb-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setEditData({ ...editData, rating: s })}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`${editData.rating >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-[#A98C43] min-h-[100px]"
                                        value={editData.comment}
                                        onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                        placeholder="Update your review..."
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-700 leading-relaxed text-base pl-1">
                                    {r.comment || "No comment provided."}
                                </p>
                            )}
                        </div>
                    );
                })}

                {/* Empty State */}
                {reviews.length === 0 && (
                    <div className="md:col-span-2 text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-gray-900 font-medium text-lg">No reviews yet</h3>
                        <p className="text-gray-500">Be the first to share your thoughts!</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-[#A98C43] font-semibold hover:underline"
                        >
                            Write a Review
                        </button>
                    </div>
                )}
            </div>

            {/* Show More Button */}
            {reviews.length > 3 && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-200 rounded-full text-gray-700 font-semibold hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
                    >
                        {showAllReviews ? "Show Less" : "Read All Reviews"}
                        <svg className={`w-4 h-4 transition-transform duration-300 ${showAllReviews ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductRatings;
