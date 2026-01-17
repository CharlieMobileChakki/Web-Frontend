
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    userGetProfile,
    userUpdateProfile,
} from "../../../store/slices/ProfileSlice";
import { updateUser } from "../../../store/slices/AuthSlice";
import { toast } from "react-toastify";
import { User, Phone, Mail, Calendar, Save, Edit2 } from "lucide-react";
import BackButton from "../../../components/common/BackButton"; // Import BackButton

const MyProfile = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.profile);

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: "",
        mobile: "",
    });

    useEffect(() => {
        dispatch(userGetProfile());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                mobile: data.mobile || "",
            });
        }
    }, [data]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only send name field to avoid accidentally sending addresses or other fields
            const payload = { name: form.name };
            const res = await dispatch(userUpdateProfile(payload)).unwrap();
            const updatedUser = res?.data || res;
            dispatch(updateUser(updatedUser));
            toast.success("✅ Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error(err?.message || "❌ Failed to update profile.");
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    if (error)
        return (
            <div className="max-w-3xl mx-auto p-6 mt-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );

    return (
        <div className="  bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <BackButton />
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    {/* Header Gradient */}
                    <div className="h-32 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <User size={48} className="text-orange-500" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 px-8 pb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{data?.name || "User"}</h1>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span>{data?.mobile || "N/A"}</span>
                                    </div>
                                    {data?.createdAt && (
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>Member since {new Date(data.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all"
                            >
                                <Edit2 size={18} />
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                <div className="text-sm text-blue-600 font-semibold mb-1">Total Addresses</div>
                                <div className="text-2xl font-bold text-blue-700">{data?.addresses?.length || 0}</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                <div className="text-sm text-green-600 font-semibold mb-1">Total Reviews</div>
                                <div className="text-2xl font-bold text-green-700">{data?.reviews?.length || 0}</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                <div className="text-sm text-purple-600 font-semibold mb-1">Account Status</div>
                                <div className="text-2xl font-bold text-purple-700 capitalize">{data?.role || "User"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Form */}
                {isEditing && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Edit2 className="text-orange-500" />
                            Edit Profile Information
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Mobile Input (Read-only) */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            name="mobile"
                                            value={form.mobile || ""}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Save size={20} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}


            </div>
        </div>
    );
};

export default MyProfile;
