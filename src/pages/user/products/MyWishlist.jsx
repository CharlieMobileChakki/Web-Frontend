import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usergetwishlist, userremovewishlist } from "../../../store/slices/WishlistSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

const MyWishlist = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.wishlist);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(usergetwishlist());
    }, [dispatch]);

    const handleRemove = async (productId) => {
        try {
            await dispatch(userremovewishlist({ productId })).unwrap();
            toast.success("Removed from wishlist 💔");
        } catch (err) {
            toast.error("Failed to remove item. Please try again.");
        }
    };

    return (
        <section className="  bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* 🏷️ Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        My <span className="text-[#DA352D]">Wishlist</span>
                    </h1>
                    <p className="text-gray-500 text-lg">Your curated list of favorites ❤️</p>
                    <div className="w-24 h-1 bg-[#DA352D] mx-auto mt-4 rounded-full"></div>
                </div>

                {/* 🔄 Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DA352D]"></div>
                    </div>
                )}

                {/* ❌ Error State */}
                {error && (
                    <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                {/* 🛒 Empty State */}
                {!loading && items.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={48} className="text-[#DA352D]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Seems like you haven't found anything you like yet. Browse our products and find your next favorite!
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-[#DA352D] text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-red-200 hover:shadow-xl hover:bg-[#b02a24] transition-all transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
                        >
                            Start Shopping <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* 📦 Wishlist Grid */}
                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {items.map((item) => {
                            const product = item?.productId;
                            // Safe check for product existence
                            if (!product) return null;

                            // Determine Price: Variant Price > Selling Price > Price
                            // Check if variants exist and have items
                            const variantPrice = product.variants && product.variants.length > 0 ? product.variants[0].price : null;
                            const displayPrice = variantPrice || product.sellingPrice || product.price;

                            return (
                                <div
                                    key={item._id || product._id}
                                    className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Product Image */}
                                    <div
                                        className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
                                        onClick={() => navigate(`/products/${product._id}`)}
                                    >
                                        <img
                                            src={product.images?.[0] || "/placeholder.png"}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {/* Quick Remove Button (Top Right) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(product._id);
                                            }}
                                            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                            title="Remove from Wishlist"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Product Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        >
                                            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-[#DA352D] transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <span className="text-xl font-bold text-gray-900 leading-none">
                                                    ₹{displayPrice?.toLocaleString()}
                                                </span>
                                                {/* Optional: Show original price if discounted logic exists */}
                                                {/* For now strict to user request: show first variant price */}
                                            </div>

                                            {/* Stock Status Badge */}
                                            {/* You can add stock logic here if available in product object */}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                                            <button
                                                onClick={() => navigate(`/products/${product._id}`)}
                                                className="flex-1 bg-gradient-to-r from-[#DA352D] to-[#FF4D4D] text-white py-2.5 rounded-lg font-semibold shadow-md shadow-red-100 hover:shadow-lg hover:from-[#b02a24] hover:to-[#DA352D] transition-all flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                <ShoppingBag size={18} /> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyWishlist;
