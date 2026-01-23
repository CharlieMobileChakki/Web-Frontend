import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserVerifyPayment } from "../../../services/NetworkServices";

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);

    const orderId = searchParams.get("order_id"); // MC-ORD-xxxx

    useEffect(() => {
        if (!orderId) {
            toast.error("Invalid payment response");
            navigate("/");
            return;
        }

        const verifyPayment = async () => {
            try {
                setVerifying(true);
                const response = await UserVerifyPayment(orderId);
                const { paymentStatus, orderStatus } = response?.data || {};

                console.log("✅ Payment verification response:", response?.data);

                if (paymentStatus === "SUCCESS") {
                    toast.success("✅ Payment Successful");
                    // Navigate to order success with order_id query param
                    navigate(`/order-success?order_id=${orderId}`);

                } else if (paymentStatus === "FAILED") {
                    toast.error("❌ Payment Failed");
                    navigate("/viewcart");

                } else if (paymentStatus === "CANCELLED") {
                    toast.warning("⚠️ Payment Cancelled");
                    navigate("/viewcart");

                } else if (paymentStatus === "PENDING") {
                    toast.warning("⚠️ Payment Pending");
                    navigate("/my-orders");
                } else {
                    toast.warning("⚠️ Unknown payment status");
                    navigate("/my-orders");
                }

            } catch (err) {
                console.error("❌ Payment verification error:", err);
                toast.error(err?.response?.data?.message || "Payment verification failed");
                navigate("/viewcart");
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [orderId, navigate]);

    return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg font-semibold text-gray-700">Verifying your payment...</p>
            <p className="text-sm text-gray-500">Please wait while we confirm your transaction</p>
        </div>
    );
};

export default PaymentStatusPage;
