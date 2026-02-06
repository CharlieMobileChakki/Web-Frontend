import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";
import { MapPin, Phone, User, Home, Plus, Edit2, Trash2, X, Check, Navigation, Loader2 } from "lucide-react";
import {
    getAllBookingAddresses,
    createBookingAddress,
    updateBookingAddress,
    deleteBookingAddress
} from "../../../store/slices/BookingAddressSlice";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
};

const LocationMarker = ({ lat, lng, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return lat && lng ? <Marker position={[lat, lng]} /> : null;
};

const BookingAddressModal = ({ onSelect }) => {
    const dispatch = useDispatch();
    const { addresses, loading } = useSelector((state) => state.bookingAddress);
    const user = JSON.parse(localStorage.getItem("user"));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || user?.mobile || "",
        street: "",
        landmark: "",
        latitude: 26.9124, // Default Jaipur
        longitude: 75.7873
    });

    useEffect(() => {
        dispatch(getAllBookingAddresses());
    }, [dispatch]);

    const fetchAddressFromCoords = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
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

                // Construct a better street address
                const parts = [
                    a.house_number,
                    a.road,
                    a.pedestrian,
                    a.suburb,
                    a.neighbourhood,
                    a.town,
                    a.city_district,
                    a.city
                ].filter(Boolean);

                const streetAddr = parts.slice(0, 3).join(", ") || parts[0] || "";
                const area = parts.slice(3, 6).join(", ") || parts[1] || "";
                const landmarkAddr = a.suburb || a.neighbourhood || a.amenity || "";

                setFormData(prev => ({
                    ...prev,
                    street: streetAddr ? `${streetAddr}${area ? ", " + area : ""}` : area,
                    landmark: landmarkAddr
                }));
                toast.success("Location identified! 🌍");
            }
        } catch (err) {
            console.error("Reverse geocode failed", err);
        }
    };

    const handlePositionChange = (lat, lng) => {
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
        fetchAddressFromCoords(lat, lng);
    };

    const handleOpenForm = (addr = null) => {
        if (addr) {
            setEditId(addr._id);
            setFormData({
                name: addr.name,
                phone: addr.phone,
                street: addr.street,
                landmark: addr.landmark || "",
                latitude: addr.location?.coordinates[1] || addr.latitude,
                longitude: addr.location?.coordinates[0] || addr.longitude,
            });
        } else {
            setEditId(null);
            setFormData({
                name: user?.name || "",
                phone: user?.phone || user?.mobile || "",
                street: "",
                landmark: "",
                latitude: 26.9124,
                longitude: 75.7873
            });
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await dispatch(updateBookingAddress({ id: editId, data: formData })).unwrap();
                toast.success("✅ Address updated!");
            } else {
                await dispatch(createBookingAddress(formData)).unwrap();
                toast.success("✅ Address saved!");
            }
            setShowForm(false);
        } catch (err) {
            toast.error(err?.message || "Failed to save address");
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Delete this address?")) {
            try {
                await dispatch(deleteBookingAddress(id)).unwrap();
                toast.success("Address deleted");
                if (selectedId === id) setSelectedId(null);
            } catch (err) {
                toast.error("Failed to delete");
            }
        }
    };

    const handleSelect = (addr) => {
        setSelectedId(addr._id);
        onSelect && onSelect(addr);
        setIsModalOpen(false);
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            toast.info("📍 Fetching location...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setFormData(prev => ({ ...prev, latitude, longitude }));
                    fetchAddressFromCoords(latitude, longitude);
                    toast.success("Location updated!");
                },
                () => toast.error("Failed to get location")
            );
        }
    };

    return (
        <div className="w-full">
            {/* Selection Trigger */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-xl text-red-600">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">
                            {selectedId ? addresses.find(a => a._id === selectedId)?.street : "Select Delivery Address"}
                        </p>
                        <p className="text-sm text-gray-500">
                            {selectedId ? addresses.find(a => a._id === selectedId)?.name : "Choose a saved location for delivery"}
                        </p>
                    </div>
                </div>
                <button className="text-red-600 font-bold text-sm underline">Change</button>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-amber-500 p-6 flex justify-between items-center text-white">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <MapPin size={24} />
                                    Delivery Addresses
                                </h2>
                                <p className="text-red-100 text-sm">Select where you'd like the service</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {showForm ? (
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="h-64 rounded-2xl overflow-hidden border-2 border-gray-100 relative group">
                                            <MapContainer
                                                center={[formData.latitude, formData.longitude]}
                                                zoom={13}
                                                className="w-full h-full"
                                            >
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <RecenterMap lat={formData.latitude} lng={formData.longitude} />
                                                <LocationMarker
                                                    lat={formData.latitude}
                                                    lng={formData.longitude}
                                                    setPosition={handlePositionChange}
                                                />
                                            </MapContainer>
                                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur shadow-lg p-2 rounded-xl text-[10px] text-gray-600 text-center pointer-events-none">
                                                Click on map to pin exact location
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleUseCurrentLocation}
                                            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                                        >
                                            <Navigation size={16} />
                                            Use My Current Location
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Address Details</h3>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Receiver Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-400 outline-none transition-all"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-400 outline-none transition-all"
                                                placeholder="10-digit mobile"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.street}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-400 outline-none transition-all"
                                                placeholder="House No, Area, Road"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Landmark (Optional)</label>
                                            <input
                                                type="text"
                                                value={formData.landmark}
                                                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-400 outline-none transition-all"
                                                placeholder="Near template, park, etc."
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                                {editId ? "Update" : "Save Address"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg">Saved Locations</h3>
                                        <button
                                            onClick={() => handleOpenForm()}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition-all"
                                        >
                                            <Plus size={18} />
                                            Add New
                                        </button>
                                    </div>

                                    {addresses.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => handleSelect(addr)}
                                                    className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedId === addr._id ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-100 hover:border-red-200 hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-xl ${selectedId === addr._id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-red-100 group-hover:text-red-500'}`}>
                                                            <Home size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-bold text-gray-800">{addr.name}</h4>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleOpenForm(addr); }}
                                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                                    >
                                                                        <Edit2 size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleDelete(addr._id, e)}
                                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-500 text-xs mt-0.5 font-medium">{addr.phone}</p>
                                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{addr.street}</p>
                                                        </div>
                                                    </div>
                                                    {selectedId === addr._id && (
                                                        <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-lg">
                                                            <Check size={12} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                            <MapPin className="mx-auto text-gray-300 mb-4" size={48} strokeWidth={1} />
                                            <p className="text-gray-500 font-medium">No saved addresses for bookings.</p>
                                            <button
                                                onClick={() => handleOpenForm()}
                                                className="mt-4 text-red-600 font-bold hover:underline"
                                            >
                                                Create your first one
                                            </button>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t flex justify-end">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingAddressModal;
