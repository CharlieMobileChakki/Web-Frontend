import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userorderbyid } from "../../../store/slices/OrderSlice";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [params] = useSearchParams();

    const orderId = params.get("order_id"); // 🔹 URL se aayega

    const { orderDetails, loading } = useSelector((state) => state.order);

    useEffect(() => {
        if (orderId) {
            dispatch(userorderbyid(orderId));
        }
    }, [orderId, dispatch]);

    if (loading || !orderDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
                Loading your order details...
            </div>
        );
    }

    // 🔹 Extract order details safely
    const totalPrice = orderDetails.totalPrice;
    const paymentMethod = orderDetails.paymentGateway || "Cashfree";
    const orderStatus = orderDetails.orderStatus;
    const itemsPrice = orderDetails.itemsPrice;
    const taxPrice = orderDetails.taxPrice;

    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 px-6">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg w-full">

                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-green-600 mb-3">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your order has been confirmed and will be delivered soon.
                </p>

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">

                    {/* Order ID */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="text-lg font-semibold text-blue-600 break-all">
                            {orderDetails.orderId}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Status</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                            {orderStatus}
                        </span>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Payment Method</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-blue-100 text-blue-800">
                            💳 {paymentMethod}
                        </span>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Items Price</span>
                            <span className="font-medium">₹{itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">₹{taxPrice}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-300">
                            <span className="text-gray-800 font-semibold">Total Paid</span>
                            <span className="text-xl font-bold text-green-600">₹{totalPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
