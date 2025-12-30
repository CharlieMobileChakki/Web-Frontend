


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
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India", // Default
        label: "Home",
        landmark: "",
        isDefault: false
    });

    useEffect(() => {
        dispatch(userGetProfile());
    }, [dispatch]);

    // open modal
    const handleOpenModal = (address = null) => {
        if (address) {
            setEditAddress(address);
            setFormData({
                name: address.name || user?.name || "",
                phone: address.phone || user?.phone || "",
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                zipCode: address.zipCode || "",
                country: address.country || "India",
                label: address.label || "Home",
                landmark: address.landmark || "",
                isDefault: address.isDefault || false
            });
        } else {
            setEditAddress(null);
            setFormData({
                name: user?.name || "",
                phone: user?.phone || "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "India",
                label: "Home",
                landmark: "",
                isDefault: false
            });
        }
        setIsModalOpen(true);
    };

    // input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // add/update address
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct formatted address
        const fullAddress = `${formData.street}, ${formData.landmark ? formData.landmark + ", " : ""}${formData.city}, ${formData.state} - ${formData.zipCode}, ${formData.country}`;

        // Payload matching the new address API specification
        const payload = {
            label: formData.label || "Home",
            name: formData.name,
            phone: formData.phone,
            street: formData.street,
            landmark: formData.landmark || "",
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            lat: formData.lat || 26.9124, // Default coordinates or from user location
            lng: formData.lng || 75.7873,
            googlePlaceId: formData.googlePlaceId || "",
            formattedAddress: fullAddress,
            isDefault: formData.isDefault
        };

        try {
            if (editAddress?._id) {
                await dispatch(
                    userUpdateAddress({ addressId: editAddress._id, payload })
                ).unwrap();
            } else {
                await dispatch(userAddAddress(payload)).unwrap();
            }
            await dispatch(userGetProfile());
            setIsModalOpen(false);
        } catch (err) {
            console.error("Save address error:", err);
            // Optionally show toast here if not handled globally
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
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-800">{addr?.name}</span>
                                        <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase">{addr?.label}</span>
                                        <span className="text-sm text-gray-800 ml-2">{addr?.phone}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {addr?.street}, {addr?.landmark ? addr.landmark + ", " : ""}{addr?.city}, {addr?.state} - {addr?.zipCode}
                                    </p>
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
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {editAddress ? "Edit Address" : "Add New Address"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone 10-digit"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="zipCode"
                                    placeholder="Pincode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>

                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />

                            <input
                                type="text"
                                name="street"
                                placeholder="Address (House No, Building, Street)"
                                value={formData.street}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />

                            <input
                                type="text"
                                name="landmark"
                                placeholder="Landmark (Optional)"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <div className="flex items-center gap-4">
                                <label className="text-sm text-gray-600 font-medium">Address Type:</label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="label" value="Home" checked={formData.label === 'Home'} onChange={handleChange} />
                                    <span className="text-sm">Home</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="label" value="Work" checked={formData.label === 'Work'} onChange={handleChange} />
                                    <span className="text-sm">Work</span>
                                </label>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer mt-2">
                                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} />
                                <span className="text-sm text-gray-700">Make this my default address</span>
                            </label>

                            <div className="flex justify-end space-x-3 mt-5">
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

