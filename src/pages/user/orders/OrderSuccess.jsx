import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, totalPrice } = location.state || {};

    console.log(totalPrice,"dfjkjfd")
    return (
        <div className="flex flex-col items-center justify-center  py-20 bg-gray-50 px-6">
            <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
                <h1 className="text-2xl font-bold text-green-600 mb-3">
                    🎉 Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-2">
                    Your order has been confirmed and will be delivered soon.
                </p>

                {orderId && (
                    <p className="text-gray-700 font-semibold mb-4">
                        Order ID: <span className="text-blue-600">{orderId}</span>
                    </p>
                )}

                <p className="text-gray-800 font-semibold mb-6">
                    Total Paid: ₹{totalPrice}
                </p>

                <button
                    onClick={() => navigate("/my-orders")}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    View My Orders
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
