import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {}; // ✅ FIXED — now state is defined

    const {
        selectedCartItems = [],
        // userAddress: selectedAddress = {},
        userAddress: selectedAddress = {},
        totalAmount = 0,
        totalPrice = 0,
        taxPrice = 0,
    } = state;

    const [paymentMethod, setPaymentMethod] = useState("UPI");

    console.log("PaymentPage received state:", state);

    const handlePayment = () => {
        toast.success(`Payment successful using ${paymentMethod}! ✅`);
        navigate("/order-success", {
            // state: {
            //     orderId: Math.floor(Math.random() * 1000000000), // temporary order ID
            //     totalPrice: finalTotal,
            // },
        });
    };

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 px-6 py-4">
            {/* LEFT SIDE - PAYMENT METHOD */}
            <div className="flex-1 bg-white shadow rounded-md p-6 mb-4 md:mb-0 md:mr-4">
                <h2 className="text-blue-600 font-semibold text-sm mb-4">
                    4 PAYMENT METHOD
                </h2>

                <div className="space-y-4">
                    {["UPI", "Credit Card", "Debit Card", "Cash on Delivery"].map(
                        (method) => (
                            <label
                                key={method}
                                className={`flex items-center justify-between border p-3 rounded cursor-pointer transition ${paymentMethod === method
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                <span className="text-gray-800 font-medium">{method}</span>
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="accent-blue-600"
                                />
                            </label>
                        )
                    )}
                </div>

                <button
                    onClick={handlePayment}
                    className="mt-6 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition font-semibold"
                >
                    Confirm & Pay ₹{totalPrice || totalAmount + taxPrice}
                </button>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="w-full md:w-1/3 bg-white shadow rounded-md p-6">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                    ORDER SUMMARY
                </h3>
                {/* ✅ Address Section */}
                {selectedAddress && selectedAddress.street ? (
                    <div className="mb-4 text-sm border-b pb-3">
                        <p className="font-semibold text-gray-800 mb-1">
                            Delivery Address:
                        </p>
                        <p className="text-gray-600">
                            {selectedAddress.street}, {selectedAddress.city},{" "}
                            {selectedAddress.state} - {selectedAddress.zipCode}
                        </p>
                        {selectedAddress.country && (
                            <p className="text-gray-600">{selectedAddress.country}</p>
                        )}
                        {selectedAddress.label && (
                            <p className="text-gray-500 text-xs mt-1">
                                ({selectedAddress.label})
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 mb-4">No delivery address selected.</p>
                )}

                {/* ✅ Items Section */}
                <div className="space-y-2 border-b pb-3 mb-3">
                    {selectedCartItems?.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between items-center text-sm"
                        >
                            <p className="text-gray-700">
                                {item.name || item.product?.name} × {item.quantity}
                            </p>
                            <p className="font-medium text-gray-800">
                                ₹
                                {(item.price || item.product?.sellingPrice || 0) *
                                    item.quantity}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ✅ Dynamic Price Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Price ({selectedCartItems?.length} items)</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (9%)</span>
                        <span>₹{taxPrice}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                        <span>Total Payable</span>
                        <span>₹{totalPrice || totalAmount + taxPrice}</span>
                    </div>
                    <p className="text-green-600 text-xs mt-2">
                        Thank you for shopping with us 🎉
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
