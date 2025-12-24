import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usergetorder } from "../../../store/slices/OrderSlice";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(usergetorder());
    }, [dispatch]);

    if (loading)
        return <p className="text-center py-10 text-gray-600">Loading your orders...</p>;
    if (error)
        return <p className="text-center text-red-500 py-10">{error}</p>;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-3">
                    My Orders
                </h1>

                {orders?.length ? (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-200 rounded-lg mb-6 p-5 hover:shadow transition-all bg-white"
                        >
                            {/* HEADER */}
                            <div className="flex flex-wrap justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Order ID:{" "}
                                        <span className="text-blue-600 font-medium cursor-pointer">
                                            #{order._id.slice(-6)}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Order Placed:{" "}
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p
                                        className={`text-sm font-semibold mb-1 ${order.status === "Delivered"
                                            ? "text-green-600"
                                            : order.status === "Cancelled"
                                                ? "text-red-500"
                                                : "text-orange-500"
                                            }`}
                                    >
                                        {order.status || "In Transit"}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/orders/${order._id}`)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                                    >
                                        Track Order
                                    </button>
                                </div>
                            </div>

                            {/* ORDER ITEMS */}
                            <div className="divide-y divide-gray-200">
                                {order.orderItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between py-4 items-center"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <h3 className="text-gray-800 font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity} | ₹{item.price}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                Expected Delivery:{" "}
                                                {new Date(order.deliveryDate || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DELIVERY ADDRESS + TOTAL */}
                            <div className="flex justify-between items-start pt-4 border-t mt-4 flex-wrap gap-4">
                                <div className="text-sm text-gray-600">
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                        Delivery Address
                                    </h4>
                                    {order.shippingAddress ? (
                                        <div>
                                            <p>{order.shippingAddress.street}</p>
                                            <p>
                                                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                                                {order.shippingAddress.zipCode}
                                            </p>
                                            <p>{order.shippingAddress.country}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No address available</p>
                                    )}
                                </div>

                                <div className="text-right">
                                    <p className="text-gray-800 font-semibold text-lg">
                                        Total: ₹{order.totalPrice}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 py-10">No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
