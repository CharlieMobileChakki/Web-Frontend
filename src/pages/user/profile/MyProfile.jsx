import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    userGetProfile,
    userUpdateProfile,
} from "../../../store/slices/ProfileSlice";
import { updateUser } from "../../../store/slices/AuthSlice";
import { getAllAddresses } from "../../../store/slices/AddressSlice";
import { toast } from "react-toastify";
import { User, Phone, Calendar, Save, Edit2 } from "lucide-react";
import BackButton from "../../../components/common/BackButton";

const MyProfile = () => {
    const dispatch = useDispatch();

    /* -------------------- Redux State -------------------- */
    const {
        data,
        loading: profileLoading,
        error,
    } = useSelector((state) => state.profile);

    const {
        list = [],
        loading: addressLoading,
    } = useSelector((state) => state.address);

    /* -------------------- Local State -------------------- */
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: "",
        mobile: "",
    });

    /* -------------------- Effects -------------------- */
    useEffect(() => {
        dispatch(userGetProfile());
        dispatch(getAllAddresses());
    }, [dispatch]);


    console.log(list, "jhgfdjgdjf");
    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                mobile: data.mobile || "",
            });
        }
    }, [data]);

    /* -------------------- Handlers -------------------- */
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: form.name };
            const res = await dispatch(userUpdateProfile(payload)).unwrap();
            const updatedUser = res?.data || res;
            dispatch(updateUser(updatedUser));
            toast.success("✅ Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            toast.error(err?.message || "❌ Failed to update profile.");
        }
    };

    /* -------------------- Loading / Error -------------------- */
    if (profileLoading || addressLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6 mt-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    /* -------------------- UI -------------------- */
    return (
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <BackButton />

                {/* ================= Profile Card ================= */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <User size={48} className="text-orange-500" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {data?.name || "User"}
                                </h1>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span>{data?.mobile || "N/A"}</span>
                                    </div>
                                    {data?.createdAt && (
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>
                                                Member since{" "}
                                                {new Date(data.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                            >
                                <Edit2 size={18} />
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-xl p-4 border">
                                <div className="text-sm text-blue-600 font-semibold">
                                    Total Addresses
                                </div>
                                <div className="text-2xl font-bold text-blue-700">
                                    {list.length || 0}
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-4 border">
                                <div className="text-sm text-green-600 font-semibold">
                                    Total Reviews
                                </div>
                                <div className="text-2xl font-bold text-green-700">
                                    {data?.reviews?.length || 0}
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-4 border">
                                <div className="text-sm text-purple-600 font-semibold">
                                    Account Status
                                </div>
                                <div className="text-2xl font-bold text-purple-700 capitalize">
                                    {data?.role || "User"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= Edit Profile ================= */}
                {isEditing && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Edit2 className="text-orange-500" />
                            Edit Profile
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Mobile
                                    </label>
                                    <input
                                        value={form.mobile}
                                        readOnly
                                        className="w-full px-4 py-3 border-2 rounded-lg bg-gray-100"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ================= Addresses ================= */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>

                    {list.length === 0 ? (
                        <p className="text-gray-500">No addresses found</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {list.map((addr) => (
                                <div
                                    key={addr._id}
                                    className="border rounded-xl p-5 hover:shadow-md"
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs bg-orange-100 px-3 py-1 rounded-full">
                                            {addr.label}
                                        </span>
                                        {addr.isDefault && (
                                            <span className="text-xs text-green-600 font-semibold">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <p className="font-semibold">{addr.name}</p>
                                    <p className="text-sm">{addr.phone}</p>

                                    <p className="text-sm mt-2">
                                        {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
