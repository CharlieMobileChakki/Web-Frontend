
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    userGetProfile,
    userAddAddress,
    userUpdateAddress,
    userDeleteAddress,
} from "../../store/slices/ProfileSlice";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setFormData }) => {
    const [position, setPosition] = useState(null);

    const fetchAddressFromCoordinates = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();

            if (data && data.address) {
                const addr = data.address;
                setFormData(prev => ({
                    ...prev,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                    street: addr.road || addr.pedestrian || addr.suburb || "",
                    city: addr.city || addr.town || addr.village || addr.county || "",
                    state: addr.state || "",
                    zipCode: addr.postcode || "",
                    country: addr.country || "India",
                    landmark: addr.neighbourhood || addr.suburb || ""
                }));
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setFormData((prev) => ({
                ...prev,
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            }));
            fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
        locationfound(e) {
            setPosition(e.latlng);
            setFormData((prev) => ({
                ...prev,
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            }));
            fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        // Trigger location search responsibly? Or rely on the "Use My Current Location" button.
        // The original code auto-located on mount. Let's keep it but ensure we don't spam api.
        // map.locate(); 
        // Actually, let's NOT auto-locate on every mount if it disrupts editing.
        // But for "Add New", it's helpful.
        // Let's leave it as is for now or just trust the button.
        // map.locate(); // Commented out to prevent auto-move on edit if not desired, 
        // but user asked for "selected location on map", so click is key.
        // The original code had map.locate() inside useEffect.
    }, [map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

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
        isDefault: false,
        lat: 26.9124, // Default Jaipur
        lng: 75.7873
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
                isDefault: address.isDefault || false,
                lat: address.lat || 26.9124,
                lng: address.lng || 75.7873
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
                isDefault: false,
                lat: 26.9124,
                lng: 75.7873
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

    // ✅ Get Live Location (Browser API)
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                setFormData(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude
                }));

                // alert(`Location fetched: ${latitude}, ${longitude}. Please confirm on map.`);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Failed to get location. Please allow location access.");
            }
        );
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
            // Ensure numbers for coordinates
            lat: parseFloat(formData.lat) || 0,
            lng: parseFloat(formData.lng) || 0,
            googlePlaceId: formData.googlePlaceId || "",
            formattedAddress: fullAddress,
            isDefault: formData.isDefault || false // ensure boolean
        };

        console.log("📤 Submitting Address Payload:", payload);

        try {
            if (editAddress?._id) {
                await dispatch(
                    userUpdateAddress({ addressId: editAddress._id, payload })
                ).unwrap();
            } else {
                await dispatch(userAddAddress(payload)).unwrap();
            }
            // Is it necessary to get profile again? 
            // The slice add/update already calls fetchFullProfile internally now in my previous fix?
            // Let's check ProfileSlice. Yes it does.
            // But doing it here for safety doesn't hurt, though redundant.
            // I'll keep it to be safe, or relies on slice. 
            // Actually, slice logic I wrote: "Re-fetch complete profile to sync everything".
            // So I can remove it here to save a call, OR keep it. 
            // Let's keep duplicate check or just let slice handle it.
            // ProfileSlice updates state.data. So we just close modal.

            // await dispatch(userGetProfile()); // Removed as slice handles it now for efficiency

            setIsModalOpen(false);
            setFormData(prev => ({ ...prev, name: "", phone: "", street: "", city: "", state: "", zipCode: "", landmark: "" })); // Reset form
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
                    DELIVERY ADDRESS
                </h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="text-white underline text-sm hover:text-gray-100"
                >
                    + Add New Address
                </button>
            </div>

            {/* Address List */}
            <div className="p-5 space-y-4 max-h-60 overflow-y-auto">
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
                                        {addr?.street}, {addr?.city}, {addr?.state} - {addr?.zipCode}
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
                <div className="fixed inset-0 bg-[#00000075] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {editAddress ? "Edit Address" : "Add New Address"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Side: Map */}
                                <div className="h-64 md:h-full min-h-[300px] rounded-lg overflow-hidden border">
                                    <MapContainer
                                        center={[formData.lat, formData.lng]}
                                        zoom={13}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker setFormData={setFormData} />
                                    </MapContainer>
                                    <p className="text-xs text-gray-500 mt-1 text-center">Click on map to set location</p>
                                </div>

                                {/* Right Side: Inputs */}
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium w-full justify-center border border-blue-200 rounded py-2 bg-blue-50"
                                    >
                                        📍 Use My Current Location
                                    </button>

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

                                    <div className="flex justify-end space-x-3 mt-5 pt-4 border-t">
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
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressModal;
