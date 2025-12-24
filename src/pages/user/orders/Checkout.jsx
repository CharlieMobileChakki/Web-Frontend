

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { userorder } from "../../../store/slices/OrderSlice";
import { userdeletecart } from "../../../store/slices/CartSlice";
import AddressModal from "../../../components/user/AddressModal";
import { toast } from "react-toastify";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { selectedCartItems = [], userAddress: initialAddress, totalAmount = 0 } =
        location.state || {};

    const [selectedAddress, setSelectedAddress] = useState(initialAddress);
    const [showContinue, setShowContinue] = useState(false);
    const [user, setUser] = useState(null);



    // 🧠 Load user and default address
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);

            // ✅ If no address from cart, use 0th (first) address
            if (!initialAddress && storedUser.addresses?.length > 0) {
                setSelectedAddress(storedUser.addresses[0]);
                setShowContinue(true); // enable continue button
            }
        }
    }, [initialAddress]);


    // useEffect(() => {
    //     const storedUser = JSON.parse(localStorage.getItem("user"));
    //     if (storedUser) setUser(storedUser);
    // }, []);

    const taxPrice = Math.round(totalAmount * 0.09);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.warning("⚠️ Please select a delivery address.");
            return;
        }

        if (!selectedAddress._id) {
            toast.error("❌ Invalid address selected.");
            return;
        }

        const taxPrice = Math.round(totalAmount * 0.09);
        const totalPrice = totalAmount + taxPrice;

        // Format order data according to API spec
        const orderData = {
            orderItems: selectedCartItems.map((item) => ({
                product: item.product?._id || item._id,
                name: item.name || item.product?.name || "",
                quantity: item.quantity || 1,
                price: item.price || item.product?.price || 0,
                sellingPrice: item.sellingPrice || item.product?.sellingPrice || 0,
                image: item.image || item.product?.images?.[0] || item.product?.image || ""
            })),
            addressId: selectedAddress._id, // ✅ Send addressId instead of full address object
            paymentMethod: "COD", // ✅ Default to COD as per API
            itemsPrice: totalAmount,
            taxPrice,
            shippingPrice: 0,
            totalPrice,
        };

        console.log("📦 Creating order with data:", orderData);

        try {
            const result = await dispatch(userorder(orderData)).unwrap();
            console.log("✅ Order created:", result);

            // Clear cart after successful order
            await dispatch(userdeletecart());

            toast.success("✅ Order placed successfully!");
            navigate("/ordersuccess", {
                state: {
                    orderId: result._id,
                    orderDetails: result,
                },
            });
        } catch (err) {
            console.error("❌ Order failed:", err);
            toast.error(err?.message || "❌ Order failed, please try again.");
        }
    };



    return (
        <div className="flex flex-col md:flex-row bg-gray-50 px-6 py-4">
            <div className="flex-1 bg-white shadow rounded-md p-6 mb-4 md:mb-0 md:mr-4">
                <div className="border-b pb-3 mb-4">
                    <p className="text-gray-800 font-medium mt-2">
                        {user?.name}{" "}
                        <span className="text-gray-500 ml-2">{user?.phone}</span>
                    </p>
                </div>

                <AddressModal
                    onSelect={(addr) => {
                        setSelectedAddress(addr);
                        setShowContinue(true);
                    }}
                />


                <div>
                    <h2 className="text-blue-600 font-semibold text-sm mb-2">
                        ORDER SUMMARY ({selectedCartItems.length} items)
                    </h2>

                    {selectedCartItems.map((item) => {
                        const itemPrice = item.sellingPrice || item.product?.sellingPrice || 0;
                        const itemTotal = itemPrice * item.quantity;

                        return (
                            <div
                                key={item._id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            item.image ||
                                            item.product?.images?.[0] ||
                                            item.product?.image ||
                                            "https://via.placeholder.com/150"
                                        }
                                        alt={item.name || item.product?.name}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            {item.name || item.product?.name}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            ₹{itemPrice} × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">Price</label>
                                    <p className="font-semibold text-gray-800">₹{itemTotal}</p>
                                </div>
                            </div>
                        );
                    })}




                    {showContinue && selectedAddress && (
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-orange-500 cursor-pointer text-white text-sm px-4 py-2 rounded hover:bg-orange-600"
                            >
                                Continue
                            </button>
                        </div>
                    )}



                </div>

            </div>

            <div className="w-full md:w-1/3 bg-white shadow rounded-md p-6">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                    PRICE DETAILS
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Price ({selectedCartItems.length} items)</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Platform Fee</span>
                        <span>₹{taxPrice}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                        <span>Total Payable</span>
                        <span>₹{totalAmount + taxPrice}</span>
                    </div>
                    <p className="text-green-600 text-xs mt-2">
                        You will save extra on this order 🎉
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

