import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import BackButton from "../../../components/common/BackButton";
import { load } from "@cashfreepayments/cashfree-js";
import { userorder } from "../../../store/slices/OrderSlice";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const state = location.state || {};

    const {
        selectedCartItems = [],
        userAddress: selectedAddress = {},
        totalAmount = 0,
        taxPrice = 0,
    } = state;


    const [cashfree, setCashfree] = useState(null);


    useEffect(() => {
        const initCashfree = async () => {
            const cf = await load({ mode: "sandbox" });
            setCashfree(cf);
        };
        initCashfree();
    }, []);


    // 🔹 MAIN ONLINE PAYMENT HANDLER
    const handlePayment = async () => {
        if (!selectedAddress || !selectedAddress.name) {
            toast.warning("⚠️ Please select a delivery address.");
            return;
        }

        try {
            const orderData = {
                orderItems: selectedCartItems.map((item) => ({
                    product: item.product?._id || item.product || item._id,
                    variantId: item.variantId || item.variant?._id,
                    quantity: item.quantity || 1,
                })),
                shippingAddress: {
                    name: selectedAddress.name,
                    phone: selectedAddress.phone,
                    address: selectedAddress.address || selectedAddress.street,
                    city: selectedAddress.city,
                    postalCode: selectedAddress.postalCode,
                    country: selectedAddress.country,
                },
                shippingPrice: 0,
                taxPrice: taxPrice,
            };

            console.log("📦 Creating order with data:", orderData);

            const result = await dispatch(userorder(orderData)).unwrap();

            console.log("✅ Order creation response:", result);

            const sessionId = result?.payment_session_id;
            const orderId = result?.orderId;
            const mongoOrderId = result?.order?._id;

            // Store MongoDB order ID mapping for later use
            if (orderId && mongoOrderId) {
                localStorage.setItem(`ORDER_MAP_${orderId}`, mongoOrderId);
                console.log(`💾 Stored mapping: ${orderId} -> ${mongoOrderId}`);
            }

            if (!sessionId) {
                toast.error("❌ Payment session not received from server");
                return;
            }

            if (!cashfree) {
                toast.error("❌ Payment system not ready");
                return;
            }

            // Open Cashfree checkout
            cashfree.checkout({
                paymentSessionId: sessionId,
                redirectTarget: "_self"
            });

        } catch (err) {
            console.error("❌ Payment error:", err);
            toast.error(err?.message || "Unable to initiate payment");
        }
    };

    return (
        <div className="bg-gray-50 px-6 py-4  ">
            <BackButton />
            <div className="flex flex-col md:flex-row">

                {/* LEFT SIDE - PAYMENT METHOD */}
                <div className="flex-1 bg-white shadow rounded-md p-6 mb-4 md:mb-0 md:mr-4">
                    <h2 className="text-blue-600 font-semibold text-sm mb-4">
                        PAYMENT METHOD
                    </h2>

                    <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-gray-900">Online Payment</p>
                            <p className="text-sm text-gray-600">UPI / Card / Netbanking</p>
                        </div>
                        <span className="text-2xl">💳</span>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="mt-6 w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition font-semibold"
                    >
                        Confirm & Pay ₹{totalAmount}
                    </button>
                </div>

                {/* RIGHT SIDE - ORDER SUMMARY */}
                <div className="w-full md:w-1/3 bg-white shadow rounded-md p-6">
                    <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                        ORDER SUMMARY
                    </h3>

                    {/* Address */}
                    {selectedAddress && (
                        <div className="mb-4 text-sm border-b pb-3">
                            <p className="font-semibold text-gray-800 mb-1">
                                Delivery Address:
                            </p>
                            <p className="text-gray-600">
                                {selectedAddress.address || selectedAddress.street},{" "}
                                {selectedAddress.city}
                            </p>
                            <p className="text-gray-600">
                                {selectedAddress.country}
                            </p>
                        </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2 border-b pb-3 mb-3">
                        {selectedCartItems.map((item) => (
                            <div key={item._id} className="flex justify-between text-sm">
                                <span>
                                    {item.name || item.product?.name} × {item.quantity}
                                </span>
                                <span>
                                    ₹{(item.price || item.product?.sellingPrice || 0) * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="space-y-2 text-sm">

                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
