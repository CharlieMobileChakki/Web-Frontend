
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { userorder } from "../../../store/slices/OrderSlice";
import { userdeletecart } from "../../../store/slices/CartSlice";
import AddressModal from "../../../components/user/AddressModal";
import { toast } from "react-toastify";
import { CheckCircle, MapPin, CreditCard, ShieldCheck, Truck, ShoppingBag, ChevronRight, Plus } from "lucide-react";
import BackButton from "../../../components/common/BackButton"; // Import BackButton
import { load } from "@cashfreepayments/cashfree-js";




const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();


    const [cashfree, setCashfree] = useState(null);

    useEffect(() => {
        const initCashfree = async () => {
            const cf = await load({
                mode: "production", // testing me "sandbox"
            });
            setCashfree(cf);
        };
        initCashfree();
    }, []);

    const handleOnlinePayment = async () => {
        if (!selectedAddress || !selectedAddress._id) {
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
                    address: selectedAddress.address,
                    city: selectedAddress.city,
                    postalCode: selectedAddress.postalCode,
                    country: selectedAddress.country,
                },
                shippingPrice: 0,
                taxPrice: 0,
            };

            console.log("📦 Creating order with payload:", orderData);

            const result = await dispatch(userorder(orderData)).unwrap();

            console.log("✅ Order creation response:", result);

            // Extract response fields according to API documentation
            const sessionId = result?.payment_session_id;
            const orderId = result?.orderId;
            const mongoOrderId = result?.order?._id;

            // Validate response structure
            if (!orderId) {
                console.error("❌ Missing orderId in response:", result);
                toast.error("❌ Order creation failed - Invalid response");
                return;
            }

            if (!sessionId) {
                console.error("❌ Missing payment_session_id in response:", result);
                toast.error("❌ Payment session not received from server");
                return;
            }

            // Store MongoDB order ID mapping for later use
            if (orderId && mongoOrderId) {
                localStorage.setItem(`ORDER_MAP_${orderId}`, mongoOrderId);
                console.log(`💾 Stored mapping: ${orderId} -> ${mongoOrderId}`);
            }

            if (!cashfree) {
                toast.error("❌ Payment system not ready - Please refresh the page");
                return;
            }

            console.log(`🚀 Initiating Cashfree checkout for order: ${orderId}`);

            const checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: "_self",
            };

            // Open Cashfree checkout
            cashfree.checkout(checkoutOptions);

        } catch (err) {
            console.error("❌ Online payment error:", err);
            const errorMessage = err?.message || err?.error || "Unable to start online payment";
            toast.error(`❌ ${errorMessage}`);
        }
    };




    const { selectedCartItems = [], userAddress: initialAddress, totalAmount = 0 } =
        location.state || {};

    const [selectedAddress, setSelectedAddress] = useState(initialAddress);
    const [user, setUser] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment

    // 🧠 Load user and default address
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);

            // ✅ If no address from cart, use 0th (first) address
            if (!initialAddress && storedUser.addresses?.length > 0) {
                const defaultAddr = storedUser.addresses.find(a => a.isDefault) || storedUser.addresses[0];
                setSelectedAddress(defaultAddr);
            }
        }
    }, [initialAddress]);



    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <BackButton />
                {/* Stepper Header */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                        <div className={`absolute left-0 top-1/2 h-1 bg-green-500 -z-10 rounded-full transition-all duration-300`} style={{ width: currentStep === 1 ? '50%' : '100%' }}></div>

                        {/* Step 1 */}
                        <div className={`flex flex-col items-center gap-2 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${currentStep === 1 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-green-500'}`}>
                                {currentStep > 1 ? <CheckCircle size={20} /> : <MapPin size={20} />}
                            </div>
                            <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-2">Address</span>
                        </div>

                        {/* Step 2 */}
                        <div className={`flex flex-col items-center gap-2 ${currentStep === 2 ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${currentStep === 2 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-300'}`}>
                                <CreditCard size={20} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-2">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: STEPS */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* ADDRESS SECTION */}
                        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${currentStep === 1 ? 'opacity-100 ring-2 ring-blue-500 ring-offset-2' : 'opacity-60'}`}>
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <MapPin className="text-blue-600" size={20} />
                                    Delivery Address
                                </h2>
                                {currentStep === 2 && (
                                    <button onClick={() => setCurrentStep(1)} className="text-blue-600 text-sm font-semibold hover:underline">
                                        Change
                                    </button>
                                )}
                            </div>

                            {currentStep === 1 && (
                                <div className="p-6">


                                    <div className="mb-6">
                                        {selectedAddress ? (
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start">

                                                <div>
                                                    <p className="font-semibold text-gray-900 mb-0.5">{selectedAddress.name || "Home"}</p>

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                                <p className="text-gray-500 mb-2">No address selected</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className=" flex-col-12 w-full   gap-4 items-center justify-between">
                                        <AddressModal
                                            onSelect={(addr) => setSelectedAddress(addr)}
                                            showStateField={true}
                                            trigger={
                                                <button className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                                                    <Plus size={18} />
                                                    {selectedAddress ? "Change Address" : "Add New Address"}
                                                </button>
                                            }
                                        />


                                    </div>
                                </div>

                            )}

                            <div className="px-6 pb-6">

                                {selectedAddress && selectedAddress._id && (
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                                    >
                                        Deliver Here
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ORDER REVIEW & PAYMENT */}
                        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${currentStep === 2 ? 'opacity-100 ring-2 ring-blue-500 ring-offset-2' : 'opacity-60'}`}>
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <CreditCard className="text-blue-600" size={20} />
                                    Payment Method
                                </h2>
                            </div>

                            {currentStep === 2 && (
                                <div className="p-6">
                                    <div className="space-y-4 mb-8">

                                        <div
                                            className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 flex items-center justify-between cursor-pointer"

                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Online Payment</p>
                                                    <p className="text-sm text-gray-600">UPI / Card / Netbanking</p>
                                                </div>
                                            </div>
                                            <span className="text-2xl">💳</span>
                                        </div>


                                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3 opacity-60 cursor-not-allowed">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                            <div>
                                                <p className="font-semibold text-gray-500">Online Payment</p>
                                                <p className="text-xs text-gray-400">Temporarily unavailable</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleOnlinePayment}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 shadow-xl shadow-green-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Place Order — ₹{totalAmount} <ChevronRight size={20} />
                                    </button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-xs text-center">
                                        <ShieldCheck size={14} className="text-green-500" />
                                        <span>Secure Checkout with 100% Buyer Protection</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-4 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <ShoppingBag size={18} className="text-gray-500" />
                                    Order Summary
                                </h3>
                            </div>

                            <div className="p-5 max-h-[300px] overflow-y-auto custom-scrollbar space-y-4">
                                {selectedCartItems.map((item) => {
                                    const price = item.sellingPrice || item.product?.sellingPrice || 0;
                                    return (
                                        <div key={item._id} className="flex gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img
                                                    src={item.image || item.product?.images?.[0] || item.product?.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name || item.product?.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-gray-900 mt-1">₹{price * item.quantity}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-base text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-base text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>



                                <div className="border-t border-gray-200 my-3"></div>

                                <p className="text-[10px] text-green-600 font-medium tracking-wide">YOU SAVE EXTRA ON THIS ORDER</p>
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-800 text-lg">Total</span>
                                    <div className="text-right">
                                        <p className="font-extrabold text-2xl text-blue-600">₹{totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
