import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { userorderbyid } from "../../../store/slices/OrderSlice";

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        console.log("Dispatching order id:", id);
        if (id) dispatch(userorderbyid(id));
    }, [id, dispatch]);

    if (loading) return <p className="p-6 text-center">Loading order...</p>;
    if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
    if (!orderDetails) return <p className="p-6 text-center">Order not found.</p>;

    const {
        _id,
        user,
        shippingAddress,
        orderItems = [],
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
        orderStatus,
        createdAt,
    } = orderDetails;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-md my-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
                Order ID: {_id}
            </h2>
            <p className="text-gray-600 mb-2">
                Status: <strong>{orderStatus}</strong>
            </p>
            <p className="text-gray-600 mb-2">
                Payment: <strong>{paymentMethod}</strong>
            </p>
            <p className="text-gray-600 mb-4">
                Date: {new Date(createdAt).toLocaleString()}
            </p>

            {/* 🔹 Customer Info */}
            {user && (
                <div className="border-t border-b py-3 mb-4">
                    <p className="font-semibold text-gray-800 mb-1">
                        Customer: {user.name} ({user.mobile})
                    </p>
                </div>
            )}

            {/* 🔹 Shipping Address */}
            {shippingAddress && (
                <div className="mb-4 text-sm text-gray-700">
                    <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
                    <p>{shippingAddress.street}</p>
                    <p>
                        {shippingAddress.city}, {shippingAddress.state} -{" "}
                        {shippingAddress.zipCode}
                    </p>
                    <p>{shippingAddress.country}</p>
                </div>
            )}

            {/* 🔹 Items */}
            <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Items in Order</h3>
                <div className="space-y-2">
                    {orderItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between border-b pb-2 text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <span className="text-gray-800">{item.name}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-600">
                                    Qty: <strong>{item.quantity}</strong>
                                </p>
                                <p className="font-semibold text-gray-800">
                                    ₹{item.price * item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔹 Summary */}
            <div className="border-t pt-3 text-sm">
                <div className="flex justify-between">
                    <span>Items Price</span>
                    <span>₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{taxPrice}</span>
                </div>
                <div className="flex justify-between font-semibold text-base mt-2">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
