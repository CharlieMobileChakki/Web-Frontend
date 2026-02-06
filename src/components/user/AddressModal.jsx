import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    MapPin,
    Phone,
    User,
    X,
    Check,
    Loader2,
    Globe,
    Flag
} from "lucide-react";
import {
    addAddress,
    updateAddress,
} from "../../store/slices/AddressSlice";

const AddressModal = ({ trigger, onSelect, editAddress: initialEditAddress }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => !!state.auth?.user);
    const { loading: addressLoading } = useSelector((state) => state.address);

    const [isOpen, setIsOpen] = useState(false);
    const [isFetchingPincode, setIsFetchingPincode] = useState(false);

    const emptyForm = {
        label: "Home",
        name: "",
        phone: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
    };

    const [form, setForm] = useState(emptyForm);

    // ==========================
    // Lifecycle
    // ==========================
    useEffect(() => {
        if (initialEditAddress && isOpen) {
            setForm({
                ...initialEditAddress,
                label: initialEditAddress.label || "Home",
                name: initialEditAddress.name || "",
                phone: initialEditAddress.phone || "",
                street: initialEditAddress.street || "",
                landmark: initialEditAddress.landmark || "",
                city: initialEditAddress.city || "",
                state: initialEditAddress.state || "",
                zipCode: initialEditAddress.zipCode || "",
                country: initialEditAddress.country || "India",
            });
        } else if (!initialEditAddress && isOpen) {
            setForm(emptyForm);
        }
    }, [initialEditAddress, isOpen]);

    // Pincode Auto-fill logic
    useEffect(() => {
        if (form.zipCode?.length === 6) {
            fetchLocationByPincode(form.zipCode);
        }
    }, [form.zipCode]);

    const fetchLocationByPincode = async (pincode) => {
        try {
            setIsFetchingPincode(true);
            const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await res.json();

            if (data[0].Status === "Success") {
                const postOffice = data[0].PostOffice[0];
                setForm(prev => ({
                    ...prev,
                    city: postOffice.District || prev.city,
                    state: postOffice.State || prev.state,
                }));
                toast.success(`Location found: ${postOffice.District}, ${postOffice.State}`);
            } else {
                // Keep existing values or don't alert to avoid annoyance if typing
            }
        } catch (error) {
            console.error("Pincode fetch error:", error);
        } finally {
            setIsFetchingPincode(false);
        }
    };

    // ==========================
    // Handlers
    // ==========================
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setForm(emptyForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Basic validation for numbers
        if ((name === "phone" || name === "zipCode") && value !== "" && !/^\d+$/.test(value)) return;

        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        if (!form.name || !form.phone || !form.street || !form.city || !form.zipCode) {
            return toast.error("Please fill all required fields ⚠️");
        }
        if (form.phone.length !== 10) {
            return toast.error("Phone number must be 10 digits 📱");
        }

        const payload = {
            ...form,
            lat: 26.9124,
            lng: 75.7873,
            formattedAddress: `${form.street}, ${form.city}, ${form.state}${form.zipCode ? ` - ${form.zipCode}` : ""}, ${form.country}`,
            isDefault: form.isDefault || false
        };

        try {
            if (isLoggedIn) {
                let savedData;
                if (initialEditAddress?._id) {
                    savedData = await dispatch(
                        updateAddress({ addressId: initialEditAddress._id, payload })
                    ).unwrap();
                } else {
                    savedData = await dispatch(addAddress(payload)).unwrap();
                }
                toast.success("Address saved successfully! ✅");
                if (onSelect) onSelect(savedData); // Trigger parent update
                closeModal();
            } else {
                toast.error("Please login to save addresses");
            }
        } catch (err) {
            toast.error(err || "Failed to save address");
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:text-blue-600 text-gray-900 font-bold transition-all outline-none placeholder:font-normal placeholder:text-gray-400";

    return (
        <>
            <div onClick={openModal} className="inline-block">
                {trigger}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">

                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <MapPin className="text-blue-600" />
                                    {initialEditAddress ? "Edit Address" : "Add New Address"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your delivery details below
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="p-8 space-y-5 overflow-y-auto max-h-[70vh]">
                            <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl w-fit mb-2">
                                {["Home", "Work", "Other"].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setForm(p => ({ ...p, label: l }))}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${form.label === l ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-800"}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Receiver Name"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            name="phone"
                                            maxLength={10}
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Flat / House / Street *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        name="street"
                                        value={form.street}
                                        onChange={handleChange}
                                        placeholder="Address line 1"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Zip Code *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            name="zipCode"
                                            maxLength={6}
                                            value={form.zipCode}
                                            onChange={handleChange}
                                            placeholder="302001"
                                            className={`${inputClass} ${isFetchingPincode ? 'animate-pulse bg-blue-50/50' : ''}`}
                                        />
                                        {isFetchingPincode && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500" size={16} />}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">City *</label>
                                    <div className="relative">
                                        <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="Jaipur"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">State</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            placeholder="Rajasthan"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Country</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            placeholder="India"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Landmark (Optional)</label>
                                <div className="relative">
                                    <X className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-0" size={18} /> {/* Space holder */}
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        name="landmark"
                                        value={form.landmark}
                                        onChange={handleChange}
                                        placeholder="Near Bapu Bazaar"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={addressLoading}
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                {addressLoading ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                                {initialEditAddress ? "Update Address" : "Save Address"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddressModal;
