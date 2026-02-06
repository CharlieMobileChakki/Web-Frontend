
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    userdeletecart,
    usergetcart,
    userremoveitems,
    userupdateitems,
} from "../../../store/slices/CartSlice";
import CartItem from "../../../components/user/CartItem";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../../../components/common/BackButton"; // Import BackButton

const ViewCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, loading, error } = useSelector((state) => state.cart);

    // ✅ Define missing selectors
    const userProfile = useSelector((state) => state.profile.data);
    const authUser = useSelector((state) => state.auth.user);

    // ✅ Restore state
    const [selectedItems, setSelectedItems] = useState([]);

    // Prefer profile data (fresher) over auth data
    const currentUser = userProfile || authUser;

    // Derive address from current user state
    const userAddress = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0];

    useEffect(() => {
        // ✅ Select all items only when cart is first loaded
        if (cart?.items?.length > 0 && selectedItems.length === 0) {
            setSelectedItems(cart.items.map((i) => i._id));
        }
        // ⛔ Do NOT re-run when selectedItems changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart]);



    const handleIncrease = (item) => {
        dispatch(userupdateitems({ itemId: item._id, quantity: item.quantity + 1 }));
        toast.success("Quantity increased");
    };

    const handleDecrease = (item) => {
        if (item.quantity <= 1) return;
        dispatch(userupdateitems({ itemId: item._id, quantity: item.quantity - 1 }));
        toast.success("Quantity decreased");
    };

    const handleRemove = (item) => {
        dispatch(userremoveitems({ itemId: item._id }));
        setSelectedItems((prev) => prev.filter((id) => id !== item._id));
        toast.success("Item removed from cart");
    };

    const handleClearAll = () => {
        dispatch(userdeletecart());
        setSelectedItems([]);
        toast.success("Cart cleared successfully");
    };

    const handleSelect = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handlePlaceOrder = async () => {
        const selectedCartItems =
            cart?.items?.filter((item) => selectedItems.includes(item._id)) || [];

        if (!selectedCartItems.length) {
            toast.error("Please select at least one item.");
            return;
        }

        // ⛔ Removed blocking address check to allow adding address at Checkout
        // if (!userAddress) {
        //     toast.error("Please add a delivery address.");
        //     return;
        // }

        const totalAmount = selectedCartItems.reduce(
            (sum, item) => sum + (item.sellingPrice || item.product?.sellingPrice || 0) * item.quantity,
            0
        );
        toast.success("Proceeding to checkout...");
        navigate("/checkout", {
            state: {
                selectedCartItems,
                userAddress, // Pass derived address (can be null)
                totalAmount,
            },
        });
    };

    if (loading) return <p className="text-center py-10">Loading cart...</p>;
    if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

    const cartItems = cart?.items || [];
    const totalAmount = cart?.subtotal || cartItems
        .filter((item) => selectedItems.includes(item._id))
        .reduce(
            (sum, item) =>
                sum + (item?.sellingPrice || item?.product?.sellingPrice || 0) * item.quantity,
            0
        );


    return (
        <>
            <div className="p-6">

                <BackButton />
            </div>
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto bg-gray-50 p-4 gap-4">
                {/* Back Button for mobile/desktop */}


                {/* Wrapper for desktop layout */}

                <div className="flex-1 bg-white p-4 shadow rounded max-h-[80vh] overflow-y-auto">
                    <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                        My Cart ({cartItems.length} items)
                    </h2>






                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <CartItem
                                key={item._id}
                                item={item}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={handleRemove}
                                selected={selectedItems.includes(item._id)}
                                onSelect={handleSelect}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">Your cart is empty.</p>
                    )}

                    <div className="flex justify-end mt-4 sticky gap-3 bottom-0 bg-white pt-2">
                        <button
                            onClick={handleClearAll}
                            disabled={cartItems.length === 0}
                            className="bg-gray-600 hover:bg-gray-700 cursor-pointer text-white text-sm py-2 px-4 font-semibold rounded"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={handlePlaceOrder}
                            className={`px-6 py-2 rounded cursor-pointer text-white transition ${selectedItems.length > 0
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-gray-300 cursor-not-allowed"
                                }`}
                            disabled={selectedItems.length === 0}
                        >
                            PLACE ORDER ({selectedItems.length})
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-1/3">
                    <div className="bg-white p-4 shadow rounded md:sticky top-20">
                        <h3 className="text-gray-800 font-semibold border-b pb-2 mb-2">
                            PRICE DETAILS
                        </h3>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span>Selected ({selectedItems.length} items)</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base border-t pt-2">
                                <span>Total Amount</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            {selectedItems.length > 0 && (
                                <p className="text-green-600 text-sm mt-2">
                                    You will save extra on this order 🎉
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ViewCart;
