import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { UserVerifyPayment } from "../../../services/NetworkServices";
import { userdeletecart } from "../../../store/slices/CartSlice";

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [verifying, setVerifying] = useState(true);

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

                const response = await UserVerifyPayment(orderId);
                const { paymentStatus, orderStatus, amount } = response?.data || {};

                console.log("✅ Payment verification response:", response?.data);

                if (paymentStatus === "SUCCESS") {
                    toast.success("✅ Payment Successful!");

                    // Clear cart after successful payment
                    try {
                        await dispatch(userdeletecart()).unwrap();
                        console.log("🗑️ Cart cleared successfully");
                    } catch (cartError) {
                        console.error("⚠️ Failed to clear cart:", cartError);
                        // Don't block navigation if cart clearing fails
                    }

                    // Navigate to order success with order_id query param
                    navigate(`/order-success?order_id=${orderId}`);

                } else if (paymentStatus === "FAILED") {
                    toast.error("❌ Payment Failed - Please try again");
                    navigate("/viewcart");

                } else if (paymentStatus === "CANCELLED") {
                    toast.warning("⚠️ Payment Cancelled by user");
                    navigate("/viewcart");

                } else if (paymentStatus === "PENDING") {
                    toast.warning("⚠️ Payment is still pending - Check My Orders for updates");
                    navigate("/my-orders");
                } else {
                    toast.warning(`⚠️ Unknown payment status: ${paymentStatus}`);
                    navigate("/my-orders");
                }

            } catch (err) {
                console.error("❌ Payment verification error:", err);
                const errorMessage = err?.response?.data?.message || "Payment verification failed";
                toast.error(`❌ ${errorMessage}`);
                navigate("/viewcart");
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [orderId, navigate, dispatch]);

    return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg font-semibold text-gray-700">Verifying your payment...</p>
            <p className="text-sm text-gray-500">Please wait while we confirm your transaction</p>
        </div>
    );
};

export default PaymentStatusPage;
