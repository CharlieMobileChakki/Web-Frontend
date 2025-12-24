import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usergetwishlist, userremovewishlist } from "../../../store/slices/WishlistSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyWishlist = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.wishlist);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(usergetwishlist());
    }, [dispatch]);

    const handleRemove = async (productId) => {
        try {
            const result = await dispatch(userremovewishlist({ productId })).unwrap();
            toast.success("Removed from wishlist 💔");
        } catch (err) {
            toast.error("Failed to remove item. Please try again.");
        }
    };
    return (
        <>
            <section className=" bg-gray-50">
                <div className=" container mx-auto  p-6">
                    <h1 className="text-2xl font-semibold mb-6">My Wishlist 💖</h1>

                    {loading && <p className="text-gray-500">Loading wishlist...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && items.length === 0 && (
                        <p className="text-gray-500">Your wishlist is empty.</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item?._id || item?.productId?._id}
                                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                            >
                                <img
                                    src={item?.productId?.images?.[0] || "/placeholder.png"}

                                    alt={item?.productId?.name}
                                    className="w-full h-48 object-cover rounded-md cursor-pointer"
                                    onClick={() => navigate(`/products/${item?.productId?._id}`)}
                                />
                                <h2 className="text-lg font-semibold mt-3">
                                    {item?.productId?.name}
                                    onClick={() => navigate(`/products/${item?.productId?._id}`)}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    ₹{(item?.productId?.sellingPrice || item?.productId?.price)?.toLocaleString()}

                                </p>

                                <button
                                    onClick={() => handleRemove(item?.productId?._id)}
                                    className="mt-3 bg-red-500 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-red-600 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </>

    );
};

export default MyWishlist;
