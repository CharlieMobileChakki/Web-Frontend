import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    userAddAddress,
    userUpdateAddress,
    userDeleteAddress,
    userGetProfile,
} from "../../../store/slices/ProfileSlice";
import { useFormik } from "formik";
import { addressSchema } from "../../../utils/validations/ValidationSchemas";
import { MapPin, Home, Edit2, Trash2, Plus, X, Check, Building2, Navigation } from "lucide-react";
import { toast } from "react-toastify";

const AddressSection = () => {
    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.profile.data?.addresses || []);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const formik = useFormik({
        initialValues: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
            isDefault: false,
        },
        validationSchema: addressSchema,

        onSubmit: async (values, { resetForm }) => {
            try {
                if (editId) {
                    await dispatch(userUpdateAddress({ addressId: editId, payload: values })).unwrap();
                    toast.success("✅ Address updated successfully!");
                    setEditId(null);
                } else {
                    await dispatch(userAddAddress(values)).unwrap();
                    toast.success("✅ Address added successfully!");
                }
                dispatch(userGetProfile());
                resetForm();
                setShowForm(false);
            } catch (error) {
                toast.error(error?.message || "❌ Failed to save address");
            }
        },
    });

    const handleEdit = (addr) => {
        formik.setValues({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country || "India",
            isDefault: addr.isDefault || false,
        });
        setEditId(addr._id);
        setShowForm(true);
    };

    const handleDelete = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await dispatch(userDeleteAddress(addressId)).unwrap();
                toast.success("✅ Address deleted successfully!");
                dispatch(userGetProfile());
            } catch (error) {
                toast.error(error?.message || "❌ Failed to delete address");
            }
        }
    };

    const handleCancel = () => {
        formik.resetForm();
        setEditId(null);
        setShowForm(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="text-orange-500" size={28} />
                    Saved Addresses
                </h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
                    >
                        <Plus size={20} />
                        Add New Address
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 mb-6 border-2 border-orange-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            {editId ? "Edit Address" : "Add New Address"}
                        </h3>
                        <button
                            onClick={handleCancel}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Street */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Street Address
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    name="street"
                                    value={formik.values.street}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="House number, street name"
                                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${formik.touched.street && formik.errors.street
                                            ? "border-red-400 focus:border-red-500"
                                            : "border-gray-200 focus:border-orange-400"
                                        }`}
                                />
                            </div>
                            {formik.touched.street && formik.errors.street && (
                                <p className="text-sm text-red-500 mt-1">{formik.errors.street}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* City */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        name="city"
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter city"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${formik.touched.city && formik.errors.city
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-gray-200 focus:border-orange-400"
                                            }`}
                                    />
                                </div>
                                {formik.touched.city && formik.errors.city && (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.city}</p>
                                )}
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    State
                                </label>
                                <div className="relative">
                                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        name="state"
                                        value={formik.values.state}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter state"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${formik.touched.state && formik.errors.state
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-gray-200 focus:border-orange-400"
                                            }`}
                                    />
                                </div>
                                {formik.touched.state && formik.errors.state && (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.state}</p>
                                )}
                            </div>

                            {/* Zip Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Zip Code
                                </label>
                                <input
                                    name="zipCode"
                                    value={formik.values.zipCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter zip code"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${formik.touched.zipCode && formik.errors.zipCode
                                            ? "border-red-400 focus:border-red-500"
                                            : "border-gray-200 focus:border-orange-400"
                                        }`}
                                />
                                {formik.touched.zipCode && formik.errors.zipCode && (
                                    <p className="text-sm text-red-500 mt-1">{formik.errors.zipCode}</p>
                                )}
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    name="country"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    placeholder="Country"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Set as Default */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formik.values.isDefault}
                                onChange={formik.handleChange}
                                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                Set as default address
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
                            >
                                <Check size={20} />
                                {editId ? "Update Address" : "Save Address"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address List */}
            {Array.isArray(addresses) && addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses
                        .filter((addr) => addr && typeof addr === "object")
                        .map((addr) => (
                            <div
                                key={addr._id}
                                className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-lg ${addr.isDefault
                                        ? "border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                            >
                                {/* Default Badge */}
                                {addr.isDefault && (
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                                            <Check size={12} />
                                            Default
                                        </span>
                                    </div>
                                )}

                                {/* Address Icon */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`p-3 rounded-lg ${addr.isDefault ? "bg-orange-200" : "bg-gray-100"}`}>
                                        <MapPin className={addr.isDefault ? "text-orange-600" : "text-gray-600"} size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 text-lg mb-1">
                                            {addr.street}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {addr.city}, {addr.state} - {addr.zipCode}
                                        </p>
                                        <p className="text-gray-500 text-sm">{addr.country}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleEdit(addr)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-all"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr._id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">No addresses added yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Click "Add New Address" to get started</p>
                </div>
            )}
        </div>
    );
};

export default AddressSection;
