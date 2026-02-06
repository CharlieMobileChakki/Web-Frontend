
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userorder } from "../../../store/slices/OrderSlice";
import { getAllAddresses, deleteAddress } from "../../../store/slices/AddressSlice";
import AddressModal from "../../../components/user/AddressModal";
import { toast } from "react-toastify";
import { MapPin, CreditCard, ShoppingBag, Plus, Trash2, Edit2, ChevronRight, Info, ShieldCheck } from "lucide-react";
import BackButton from "../../../components/common/BackButton";
import { load } from "@cashfreepayments/cashfree-js";

const Checkout = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [cashfree, setCashfree] = useState(null);
    const { selectedCartItems = [], userAddress: initialAddress, totalAmount = 0 } = location.state || {};
    const { list: addresses, loading: addressLoading } = useSelector((state) => state.address);
    const [selectedAddress, setSelectedAddress] = useState(initialAddress);
    const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment

    useEffect(() => {
        const initCashfree = async () => {
            const cf = await load({ mode: "production" });
            setCashfree(cf);
        };
        initCashfree();
    }, []);

    useEffect(() => {
        dispatch(getAllAddresses());
    }, [dispatch]);

    useEffect(() => {
        if (!selectedAddress && addresses?.length > 0) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [addresses, selectedAddress]);

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
                shippingAddress: selectedAddress._id,
                shippingPrice: 0,
                taxPrice: 0,
            };

            const result = await dispatch(userorder(orderData)).unwrap();
            const sessionId = result?.payment_session_id;
            const orderId = result?.orderId;
            const mongoOrderId = result?.order?._id;

            if (!orderId || !sessionId) {
                toast.error("❌ Order creation failed. Please try again.");
                return;
            }

            if (orderId && mongoOrderId) {
                localStorage.setItem(`ORDER_MAP_${orderId}`, mongoOrderId);
            }

            if (!cashfree) {
                toast.error("❌ Payment system not ready");
                return;
            }

            cashfree.checkout({ paymentSessionId: sessionId, redirectTarget: "_self" });

        } catch (err) {
            toast.error(`❌ ${err?.message || "Payment initiation failed"}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
                if (selectedAddress?._id === id) setSelectedAddress(null);
                toast.success("Address deleted");
            } catch {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <BackButton />

                {/* Stepper Header */}
                <div className="mb-12 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between relative px-2">
                        <div className="absolute left-0 top-1/2 w-full h-[2px] bg-gray-200 -z-10 -translate-y-1/2"></div>
                        <div
                            className="absolute left-0 top-1/2 h-[2px] bg-blue-500 -z-10 -translate-y-1/2 transition-all duration-500"
                            style={{ width: currentStep === 1 ? '50%' : '100%' }}
                        ></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                                <MapPin size={16} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Address</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStep === 2 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                                <CreditCard size={16} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* DELIVERY ADDRESS BOX */}
                        <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${currentStep === 1 ? 'opacity-100' : 'opacity-80'}`}>
                            <div className="p-6">
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2 mb-4">
                                    <MapPin size={18} className="text-blue-600" />
                                    Delivery Address
                                </h2>

                                <div className="space-y-4">
                                    {/* Subtitle / Selected Info (Compact) */}
                                    {selectedAddress && (
                                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
                                            <div className="bg-blue-600 text-white p-2 rounded-lg">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-xs uppercase tracking-tight">{selectedAddress.label || "HOME"}</p>
                                                <p className="text-[10px] text-gray-500 font-bold">{selectedAddress.name} • {selectedAddress.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* THE LIST BOX */}
                                    <div className="border border-gray-200 rounded-xl overflow-hidden mt-6 shadow-sm">
                                        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Delivery Address</span>
                                            <AddressModal
                                                onSelect={(newAddr) => setSelectedAddress(newAddr)}
                                                trigger={
                                                    <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                                                        <Plus size={12} /> Add New Address
                                                    </button>
                                                }
                                            />
                                        </div>

                                        <div className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr._id}
                                                    className={`p-4 flex gap-4 items-start cursor-pointer transition-colors ${selectedAddress?._id === addr._id ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}
                                                    onClick={() => setSelectedAddress(addr)}
                                                >
                                                    <div className="pt-1">
                                                        <input
                                                            type="radio"
                                                            checked={selectedAddress?._id === addr._id}
                                                            onChange={() => setSelectedAddress(addr)}
                                                            className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
                                                        />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-bold text-gray-900">{addr.name}</p>
                                                            <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">{addr.label || "HOME"}</span>
                                                            <p className="text-xs text-gray-500 font-bold ml-2">{addr.phone}</p>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                            {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <AddressModal
                                                            onSelect={(updatedAddr) => setSelectedAddress(updatedAddr)}
                                                            editAddress={addr}
                                                            trigger={
                                                                <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">EDIT</button>
                                                            }
                                                        />
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(addr._id); }}
                                                            className="text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest"
                                                        >
                                                            DELETE
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {addresses.length === 0 && (
                                                <div className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No Addresses Found</div>
                                            )}
                                        </div>
                                    </div>

                                    {currentStep === 1 && selectedAddress && (
                                        <button
                                            onClick={() => setCurrentStep(2)}
                                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:scale-[1.01] active:scale-95 mt-4"
                                        >
                                            Deliver to this address
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT SECTION */}
                        <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${currentStep === 2 ? 'opacity-100' : 'opacity-60 grayscale-[0.5]'}`}>
                            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                                <CreditCard size={18} className="text-blue-600" />
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Payment Method</h2>
                            </div>

                            {currentStep === 2 && (
                                <div className="p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/50 cursor-pointer">
                                            <div className="absolute top-2 right-4 text-2xl">💳</div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">Online Payment</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">UPI / Cards / Net Banking</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative p-5 rounded-2xl border-2 border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                                <div>
                                                    <p className="font-black text-gray-400 text-sm">Pay on Delivery</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Unavailable</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handleOnlinePayment}
                                            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl uppercase tracking-tighter hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                                        >
                                            Place Order — ₹{totalAmount}
                                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                            <ShieldCheck size={14} className="text-blue-500" />
                                            Secure Checkout • 100% Tax Compliant
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 sticky top-8 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                                <ShoppingBag size={18} className="text-gray-600" />
                                <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest">Order Summary</h3>
                            </div>

                            <div className="p-5 overflow-y-auto max-h-[400px] custom-scrollbar space-y-4">
                                {selectedCartItems.map((item) => {
                                    const price = item.sellingPrice || item.product?.sellingPrice || 0;
                                    return (
                                        <div key={item._id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 p-1 flex-shrink-0">
                                                <img
                                                    src={item.image || item.product?.images?.[0] || item.product?.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{item.name || item.product?.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-black text-blue-600 mt-1">₹{price * item.quantity}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-6 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em]">Subtotal</span>
                                    <span className="text-sm font-black text-gray-900">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em]">Shipping</span>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Free Delivery</span>
                                </div>

                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-[0.2em] mb-4">You save extra on this order</p>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">Total Payable</span>
                                            <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{totalAmount}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-sm">Inclusive of all taxes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3">
                                    <Info size={16} className="text-gray-400 shrink-0" />
                                    <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                                        Orders are processed within 24 hours. Please check your delivery address once more.
                                    </p>
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
