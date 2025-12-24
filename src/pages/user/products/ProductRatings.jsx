import React, { useState } from "react";
import { Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { usercreatereviews } from "../../../store/slices/ReviewSlice";
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

    console.log(username, "username");


    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
            : "0.0";

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));

    const totalRatings = reviews.length;
    const reviewImages = reviews.map((r) => r.image).filter(Boolean).slice(0, 5);

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

            {/* Review Images */}
            {reviewImages.length > 0 && (
                <div className="flex gap-2 mb-6 flex-wrap">
                    {reviewImages.map((img, idx) => (
                        <img key={idx} src={img} alt="review" className="w-16 h-16 object-cover rounded-lg border" />
                    ))}
                    {reviews.length > 5 && (
                        <div className="w-16 h-16 flex items-center justify-center border rounded-lg bg-gray-100 text-sm text-gray-600">
                            +{reviews.length - 5}
                        </div>
                    )}
                </div>
            )}

            {/* User Reviews */}
            <div className="space-y-6">
                {displayedReviews.map((r) => (
                    <div key={r._id} className="border-b border-gray-100 pb-4 last:border-none">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                                {r.rating} <Star size={12} />
                            </span>
                            <span className="font-medium text-gray-800 text-sm">
                                {username || "Terrific purchase"}
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{r.comment}</p>
                    </div>
                ))}

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
