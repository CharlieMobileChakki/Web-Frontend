
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
import { toast } from "react-toastify";
import {
    getTempAddresses,
    saveTempAddress,
    updateTempAddress,
    deleteTempAddress,
    isTempAddress
} from "../../utils/tempAddressHelper";

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
{/* <LocationMarker formData={formData} setFormData={setFormData} /> */ }

const LocationMarker = ({ formData, setFormData }) => {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setFormData(prev => ({
                ...prev,
                lat,
                lng
            }));
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    if (!formData.lat || !formData.lng) return null;

    return <Marker position={[formData.lat, formData.lng]} />;
};

const AddressModal = ({ onSelect }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.profile?.data);
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = !!loggedInUser;

    const [tempAddresses, setTempAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddress, setEditAddress] = useState(null);

    // Combine saved addresses and temporary addresses
    const savedAddresses = user?.addresses || [];
    const allAddresses = [...savedAddresses, ...tempAddresses];

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "Rajasthan",
        zipCode: "",
        country: "India", // Default
        label: "Home",
        landmark: "",
        isDefault: false,
        lat: 26.9124, // Default Jaipur
        lng: 75.7873
    });

    useEffect(() => {
        const migrateTemporaryAddresses = async () => {
            if (isLoggedIn) {
                // Get temporary addresses from localStorage
                const tempAddrs = getTempAddresses();

                if (tempAddrs.length > 0) {
                    // Migrate each temporary address to user profile
                    for (const addr of tempAddrs) {
                        try {
                            const payload = {
                                label: addr.label,
                                name: addr.name,
                                phone: addr.phone,
                                street: addr.street,
                                city: addr.city,
                                state: addr.state,
                                zipCode: addr.zipCode,
                                country: addr.country,
                                landmark: addr.landmark || "",
                                isDefault: Boolean(addr.isDefault),
                                lat: Number(addr.lat),
                                lng: Number(addr.lng),
                                formattedAddress: addr.formattedAddress || `${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}, ${addr.country}`,
                            };

                            await dispatch(userAddAddress(payload)).unwrap();
                        } catch (err) {
                            console.error("Failed to migrate address:", err);
                        }
                    }

                    // Clear temporary addresses after migration
                    localStorage.removeItem('tempAddresses');
                    setTempAddresses([]);

                    toast.success(`✅ ${tempAddrs.length} temporary address(es) saved to your profile!`);
                }

                // Fetch updated profile
                dispatch(userGetProfile());
            } else {
                // Load temporary addresses from localStorage for guest users
                setTempAddresses(getTempAddresses());
            }
        };

        migrateTemporaryAddresses();
    }, [dispatch, isLoggedIn]);

    // open modal
    const handleOpenModal = (address = null) => {
        if (address) {
            setEditAddress(address);
            setFormData({
                name: address.name || user?.name || "",
                phone: address.phone || user?.phone || "",
                street: address.street || "",
                city: address.city || "",
                state: address.state || "Rajasthan",
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
                state: "Rajasthan",
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

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported by your browser");
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        toast.info("📍 Fetching your location...", { autoClose: 2000 });

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude, longitude } = coords;

                // 1. Set Coordinates immediately
                setFormData(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude
                }));

                // Center map
                // Note: The map component will need to listed to lat/lng changes or use a re-center component. 
                // In this current code, passing new props might not auto-fly unless we have a component observing it.
                // However, the map click handler updates state, so state updates should re-render markers.

                // 2. Reverse Geocode with proper headers
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                        {
                            headers: {
                                "User-Agent": "ATPL_MobileChakki_Web/1.0",
                                "Accept-Language": "en-US,en;q=0.9"
                            }
                        }
                    );

                    if (!res.ok) throw new Error("Geocoding service unavailable");

                    const data = await res.json();

                    if (data?.address) {
                        const a = data.address;

                        // Construct address fields
                        const newAddress = {
                            street: a.road || a.pedestrian || a.suburb || "",
                            city: a.city || a.town || a.village || a.county || "",
                            state: a.state || "",
                            zipCode: a.postcode || "",
                            country: a.country || "India",
                            landmark: a.neighbourhood || a.suburb || ""
                        };

                        setFormData(prev => ({
                            ...prev,
                            ...newAddress
                        }));

                        toast.success("Location fetched successfully! 🌍");
                    } else {
                        toast.warn("Location found, but address details unavailable. Please fill manually.");
                    }
                } catch (err) {
                    console.error("Reverse geocode failed", err);
                    toast.error("Could not fetch address details. Please fill manually.");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                let msg = "Location permission denied";
                if (error.code === 2) msg = "Location unavailable";
                if (error.code === 3) msg = "Location request timed out";
                alert(msg);
            },
            options
        );
    };


    // add/update address
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct formatted address if not provided or valid
        const generatedFormattedAddress = `${formData.street}, ${formData.landmark ? formData.landmark + ", " : ""}${formData.city}, ${formData.state} - ${formData.zipCode}, ${formData.country}`;

        // Prepare base payload with required fields
        const payload = {
            label: formData.label,
            name: formData.name,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            landmark: formData.landmark || "",
            isDefault: Boolean(formData.isDefault),

            // ✅ REQUIRED
            lat: Number(formData.lat),
            lng: Number(formData.lng),
            formattedAddress: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipCode}, ${formData.country}`,
        };


        // Conditionally add optional fields
        if (formData.landmark?.trim()) payload.landmark = formData.landmark;
        if (formData.googlePlaceId?.trim()) payload.googlePlaceId = formData.googlePlaceId;

        // Use provided formatted address or generated one
        payload.formattedAddress = formData.formattedAddress || generatedFormattedAddress;

        // Handle coordinates - only send if valid numbers
        const lat = parseFloat(formData.lat);
        const lng = parseFloat(formData.lng);
        if (!isNaN(lat) && lat !== 0) payload.lat = lat;
        if (!isNaN(lng) && lng !== 0) payload.lng = lng;

        console.log("📤 Submitting Address Payload:", payload);

        try {
            // Check if user is logged in
            if (!isLoggedIn) {
                // Guest user - save to localStorage
                if (editAddress && isTempAddress(editAddress)) {
                    // Update existing temporary address
                    const updated = updateTempAddress(editAddress._id, payload);
                    setTempAddresses(getTempAddresses());
                    toast.success("✅ Address updated temporarily! Please login to save permanently.");
                } else {
                    // Save new temporary address
                    const saved = saveTempAddress(payload);
                    setTempAddresses(getTempAddresses());
                    toast.success("✅ Address saved temporarily! Please login to save permanently.");
                }
            } else {
                // Logged-in user - save to API
                if (editAddress?._id && !isTempAddress(editAddress)) {
                    await dispatch(
                        userUpdateAddress({ addressId: editAddress._id, payload })
                    ).unwrap();
                    toast.success("✅ Address updated successfully!");
                } else {
                    await dispatch(userAddAddress(payload)).unwrap();
                    toast.success("✅ Address saved successfully!");
                }
            }

            setIsModalOpen(false);
            // Reset form with reasonable defaults but keep lat/lng if user wants to add another nearby
            setFormData({
                name: user?.name || loggedInUser?.name || "",
                phone: user?.phone || loggedInUser?.phone || "",
                street: "",
                city: "",
                state: "Rajasthan",
                zipCode: "",
                country: "India",
                label: "Home",
                landmark: "",
                isDefault: false,
                lat: 26.9124,
                lng: 75.7873
            });
        } catch (err) {
            console.error("Save address error:", err);
            toast.error(`Failed to save address: ${err?.message || "Unknown error"}`);
        }
    };

    // delete address
    const handleDelete = async (id) => {
        try {
            // Check if it's a temporary address
            if (id.startsWith('temp_')) {
                deleteTempAddress(id);
                setTempAddresses(getTempAddresses());
                toast.success("Temporary address deleted");
            } else {
                // Delete from API
                await dispatch(userDeleteAddress(id)).unwrap();
                await dispatch(userGetProfile());
                toast.success("Address deleted successfully");
            }

            if (selectedAddress?._id === id) {
                setSelectedAddress(null);
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete address");
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
                    className="text-white underline text-sm hover:text-gray-100 cursor-pointer"
                >
                    + Add New Address
                </button>
            </div>

            {/* Address List */}
            <div className="p-5 space-y-4 max-h-60 overflow-y-auto">
                {allAddresses.length > 0 ? (
                    allAddresses.map((addr, idx) => (
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
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold text-gray-800">{addr?.name}</span>
                                        <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase">{addr?.label}</span>
                                        {isTempAddress(addr) && (
                                            <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-medium">
                                                Temporary
                                            </span>
                                        )}
                                        <span className="text-sm text-gray-800 ml-2">{addr?.phone}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {addr?.street}, {addr?.city}, {addr?.state} - {addr?.zipCode}
                                    </p>
                                    {isTempAddress(addr) && (
                                        <p className="text-xs text-orange-600 mt-1">
                                            ⚠️ Login to save this address permanently
                                        </p>
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
                                        <LocationMarker formData={formData} setFormData={setFormData} />
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

                                    {/* <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    /> */}

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


