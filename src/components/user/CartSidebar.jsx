

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
    usergetcart,
    userremoveitems,
    userupdateitems,
    userdeletecart,
} from "../../store/slices/CartSlice";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, loading } = useSelector((state) => state.cart);

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(usergetcart());
    }, [dispatch]);

    useEffect(() => {
        if (cart?.items) {
            setSelectedItems(cart.items.map((i) => i._id));
        }
    }, [cart]);

    const handleIncrease = (item) => {
        dispatch(userupdateitems({ itemId: item._id, quantity: item.quantity + 1 }));
    };

    const handleDecrease = (item) => {
        if (item.quantity <= 1) return;
        dispatch(userupdateitems({ itemId: item._id, quantity: item.quantity - 1 }));
    };

    const handleRemove = (item) => {
        dispatch(userremoveitems({ itemId: item._id }));
        setSelectedItems((prev) => prev.filter((id) => id !== item._id));
    };

    const handleClearAll = () => {
        dispatch(userdeletecart());
        setSelectedItems([]);
    };

    const handleCheckout = () => {
        const selectedCartItems =
            cart?.items?.filter((item) => selectedItems.includes(item._id)) || [];

        if (!selectedCartItems.length) {
            alert("Please select at least one item to proceed.");
            return;
        }

        const totalAmount = selectedCartItems.reduce(
            (sum, item) => sum + (item.sellingPrice || 0) * (item.quantity || 1),
            0
        );

        onClose(); // close sidebar
        navigate("/checkout", {
            state: { selectedCartItems, totalAmount },
        });
    };

    const cartItems = cart?.items || [];

    // Calculate total using cart.subtotal from API or fallback to calculation
    const totalAmount = cart?.subtotal || cartItems
        .filter((item) => selectedItems.includes(item._id))
        .reduce(
            (sum, item) => sum + (item?.sellingPrice || 0) * (item?.quantity || 1),
            0
        );

    return (
        <div
            className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-[9999]
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
                <button onClick={onClose}>
                    <IoClose size={24} />
                </button>
            </div>

            {/* Cart Items */}
            <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : cartItems?.length > 0 ? (
                    cartItems?.map((item) => {
                        // Debug: log item structure
                        // console.log("Cart item:", item);

                        return (
                            <div
                                key={item?._id}
                                className="flex items-center justify-between gap-3 mb-4 border-b pb-3"
                            >
                                <img
                                    src={item?.image || item?.product?.image || item?.product?.images?.[0] || "/placeholder.jpg"}
                                    alt={item?.name || item?.product?.name || "Product"}
                                    className="w-16 h-16 object-cover rounded"
                                />

                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {item?.name || item?.product?.name || " "}
                                    </p>
                                    {item?.nameSuffix && (
                                        <p className="text-xs text-gray-400">{item.nameSuffix}</p>
                                    )}
                                    <p className="text-sm text-gray-600 mt-1">
                                        ₹{item?.sellingPrice || 0} × {item.quantity}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        ₹{(item?.sellingPrice || 0) * (item?.quantity || 1)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDecrease(item)}
                                                className="px-3 py-1 bg-gray-200 cursor-pointer rounded hover:bg-gray-300 font-semibold"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 font-semibold">{item?.quantity}</span>
                                            <button
                                                onClick={() => handleIncrease(item)}
                                                className="px-3 py-1 bg-gray-200 cursor-pointer rounded hover:bg-gray-300 font-semibold"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item)}
                                                className="text-red-500 ps-4 cursor-pointer text-sm hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 mt-8">Your cart is empty 😔</p>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-white">
                {cartItems?.length > 0 ? (
                    <>
                        <div className="flex justify-between mb-3 font-semibold">
                            <span>Total:</span>
                            <span>₹{totalAmount?.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleClearAll}
                                className="w-1/2 bg-gray-500 cursor-pointer text-white py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="w-1/2 bg-[#DA352D] cursor-pointer text-white py-2 rounded-md hover:bg-red-600 transition"
                            >
                                Checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;

