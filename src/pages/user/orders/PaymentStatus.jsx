import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { UserPaymentVerify } from "../../../services/NetworkServices";
import { userdeletecart } from "../../../store/slices/CartSlice";

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [verifying, setVerifying] = useState(true);
    const [paymentData, setPaymentData] = useState(null);

    const orderId = searchParams.get("order_id"); // MC-ORD-xxxx

    useEffect(() => {
        if (!orderId) {
            toast.error("❌ Invalid payment response - Order ID missing");
            navigate("/");
            return;
        }

        const verifyPayment = async () => {
            try {
                setVerifying(true);
                console.log(`🔍 Verifying payment for order: ${orderId}`);

                const response = await UserPaymentVerify(orderId);
                const { paymentStatus, orderId: verifiedOrderId, amount, orderStatus } = response?.data || {};

                console.log("✅ Payment verification response:", response?.data);

                // Store payment data to display
                setPaymentData({
                    paymentStatus,
                    orderId: verifiedOrderId || orderId,
                    amount,
                    orderStatus
                });

                if (paymentStatus === "SUCCESS") {
                    toast.success("✅ Payment Successful!");

                    // Clear cart after successful payment
                    try {
                        await dispatch(userdeletecart()).unwrap();
                        console.log("🗑️ Cart cleared successfully");
                    } catch (cartError) {
                        console.error("⚠️ Failed to clear cart:", cartError);
                        // Don't block if cart clearing fails
                    }
                } else if (paymentStatus === "FAILED") {
                    toast.error("❌ Payment Failed");
                } else if (paymentStatus === "CANCELLED") {
                    toast.warning("⚠️ Payment Cancelled");
                } else if (paymentStatus === "PENDING") {
                    toast.warning("⚠️ Payment is still pending");
                }

            } catch (err) {
                console.error("❌ Payment verification error:", err);
                const errorMessage = err?.response?.data?.message || "Payment verification failed";
                toast.error(`❌ ${errorMessage}`);
                setPaymentData({
                    paymentStatus: "FAILED",
                    orderId: orderId,
                    error: errorMessage
                });
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [orderId, navigate, dispatch]);

    // Show loading state while verifying
    if (verifying) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-lg font-semibold text-gray-700">Verifying your payment...</p>
                <p className="text-sm text-gray-500">Please wait while we confirm your transaction</p>
            </div>
        );
    }

    // Show payment status after verification
    const { paymentStatus, amount, orderStatus, error } = paymentData || {};

    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 px-6">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg w-full">

                {/* Status Icon */}
                {paymentStatus === "SUCCESS" && (
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                {paymentStatus === "FAILED" && (
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}

                {paymentStatus === "PENDING" && (
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}

                {paymentStatus === "CANCELLED" && (
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}

                {/* Status Title */}
                <h1 className={`text-3xl font-bold mb-3 ${paymentStatus === "SUCCESS" ? "text-green-600" :
                        paymentStatus === "FAILED" ? "text-red-600" :
                            paymentStatus === "PENDING" ? "text-yellow-600" :
                                "text-gray-600"
                    }`}>
                    {paymentStatus === "SUCCESS" && "Payment Successful!"}
                    {paymentStatus === "FAILED" && "Payment Failed"}
                    {paymentStatus === "PENDING" && "Payment Pending"}
                    {paymentStatus === "CANCELLED" && "Payment Cancelled"}
                </h1>

                {/* Status Message */}
                <p className="text-gray-600 mb-6">
                    {paymentStatus === "SUCCESS" && "Your payment has been processed successfully."}
                    {paymentStatus === "FAILED" && (error || "Your payment could not be processed. Please try again.")}
                    {paymentStatus === "PENDING" && "Your payment is being processed. Check My Orders for updates."}
                    {paymentStatus === "CANCELLED" && "You cancelled the payment. Your cart items are still saved."}
                </p>

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">

                    {/* Order ID */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="text-lg font-semibold text-blue-600 break-all">
                            {orderId}
                        </p>
                    </div>

                    {/* Payment Status */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Payment Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${paymentStatus === "SUCCESS" ? "bg-green-100 text-green-800" :
                                paymentStatus === "FAILED" ? "bg-red-100 text-red-800" :
                                    paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                        "bg-gray-100 text-gray-800"
                            }`}>
                            {paymentStatus}
                        </span>
                    </div>

                    {/* Order Status (only for successful payments) */}
                    {paymentStatus === "SUCCESS" && orderStatus && (
                        <div className="mb-4 pb-4 border-b border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Order Status</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                {orderStatus}
                            </span>
                        </div>
                    )}

                    {/* Amount */}
                    {amount && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Amount</span>
                            <span className={`text-xl font-bold ${paymentStatus === "SUCCESS" ? "text-green-600" : "text-gray-800"
                                }`}>
                                ₹{amount}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {paymentStatus === "SUCCESS" && (
                        <>
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
                        </>
                    )}

                    {(paymentStatus === "FAILED" || paymentStatus === "CANCELLED") && (
                        <>
                            <button
                                onClick={() => navigate("/viewcart")}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                Go Home
                            </button>
                        </>
                    )}

                    {paymentStatus === "PENDING" && (
                        <>
                            <button
                                onClick={() => navigate("/my-orders")}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                            >
                                Check My Orders
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                Go Home
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusPage;
