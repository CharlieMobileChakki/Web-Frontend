


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    userGetProfile,
    userAddAddress,
    userUpdateAddress,
    userDeleteAddress,
} from "../../store/slices/ProfileSlice";

const AddressModal = ({ onSelect }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.profile?.data);
    const addresses = user?.addresses || [];

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddress, setEditAddress] = useState(null);

    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        label: "Home",
    });

    useEffect(() => {
        dispatch(userGetProfile());
    }, [dispatch]);

    // open modal
    const handleOpenModal = (address = null) => {
        if (address) {
            setEditAddress(address);
            setFormData({
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                zipCode: address.zipCode || "",
                label: address.label || "Home",
            });
        } else {
            setEditAddress(null);
            setFormData({
                street: "",
                city: "",
                state: "",
                zipCode: "",
                label: "Home",
            });
        }
        setIsModalOpen(true);
    };

    // input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // add/update address
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editAddress?._id) {
                await dispatch(
                    userUpdateAddress({ addressId: editAddress._id, payload: formData })
                ).unwrap();
            } else {
                await dispatch(userAddAddress(formData)).unwrap();
            }
            await dispatch(userGetProfile());
            setIsModalOpen(false);
        } catch (err) {
            console.error("Save address error:", err);
        }
    };

    // delete address
    const handleDelete = async (id) => {
        try {
            await dispatch(userDeleteAddress(id)).unwrap();
            await dispatch(userGetProfile());
            if (selectedAddress?._id === id) {
                setSelectedAddress(null);
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="bg-white rounded-md border shadow-sm mb-5">
            {/* Header */}
            <div className="bg-[#2874F0] text-white px-5 py-3 flex justify-between items-center rounded-t-md">
                <h2 className="font-medium text-base tracking-wide">
                    2 DELIVERY ADDRESS
                </h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="text-white underline text-sm hover:text-gray-100"
                >
                    + Add New Address
                </button>
            </div>

            {/* Address List */}
            <div className="p-5 space-y-4">
                {addresses.length > 0 ? (
                    addresses.map((addr, idx) => (
                        <div
                            key={addr?._id || idx}
                            className={`border rounded-md px-4 py-3 flex justify-between items-start transition-all ${selectedAddress?._id === addr?._id
                                ? "border-[#2874F0] bg-blue-50"
                                : "border-gray-300 bg-white"
                                }`}
                        >
                            <div className="flex gap-3 items-start w-full">
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddress?._id === addr?._id}
                                    onChange={() => {
                                        setSelectedAddress(addr);
                                        onSelect && onSelect(addr); // ✅ informs Checkout
                                    }}
                                    className="accent-[#2874F0] mt-1"
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        {addr?.street}, {addr?.city}, {addr?.state} - {addr?.zipCode}
                                    </p>
                                    {addr?.label && (
                                        <span className="text-xs text-gray-500">
                                            ({addr.label})
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <button
                                    onClick={() => handleOpenModal(addr)}
                                    className="text-[#2874F0] text-xs cursor-pointer font-medium hover:underline"
                                >
                                    EDIT
                                </button>
                                <button
                                    onClick={() => handleDelete(addr?._id)}
                                    className="text-red-500 text-xs cursor-pointer font-medium hover:underline"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No addresses added yet.</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#00000075] flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h3 className="text-lg font-semibold mb-4">
                            {editAddress ? "Edit Address" : "Add New Address"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                name="street"
                                placeholder="Address (Street / Locality)"
                                value={formData.street}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-1/2 border px-3 py-2 rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-1/2 border px-3 py-2 rounded"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="PIN Code"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#2874F0] text-white rounded hover:bg-[#1f5fd1]"
                                >
                                    {editAddress ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressModal;

