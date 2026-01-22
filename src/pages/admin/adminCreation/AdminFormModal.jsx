import React, { useState, useEffect } from "react";

const AdminFormModal = ({ isOpen, onClose, onSave, editData }) => {
    const [formData, setFormData] = useState({
        name: "",
        // email: "",
        mobile: "",
        // role: "admin",
        password: "",
        // status: "active",
    });

    const [errors, setErrors] = useState({});

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || editData.fullName || "",
                // email: editData.email || "",
                mobile: editData.mobile || editData.mobile || "",
                // role: editData.role || "admin",
                password: "", // Don't show existing password
                // status: editData.status || (editData.isActive ? "active" : "inactive"),
            });
        } else {
            setFormData({
                name: "",
                // email: "",
                mobile: "",
                // role: "admin",
                password: "",
                // status: "active",
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (editData) {
            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "Email is invalid";
            }
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = "mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
            newErrors.mobile = "mobile number must be 10 digits";
        }

        if (!editData && !formData.password) {
            newErrors.password = "Password is required for new admin";
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Prepare data for submission
        const submitData = {
            name: formData.name,
            mobile: formData.mobile,
        };

        // Only include password if it's provided
        if (formData.password) {
            submitData.password = formData.password;
        }

        onSave(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {editData ? "Edit Admin" : "Add Admin"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded ${errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Enter full name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>


                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded ${errors.mobile ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Mobile Number"
                        />
                        {errors.mobile && (
                            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                        )}
                    </div>



                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Password {!editData && <span className="text-red-500">*</span>}
                            {editData && (
                                <span className="text-sm text-gray-500">
                                    {" "}
                                    (leave blank to keep current)
                                </span>
                            )}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded ${errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder={editData ? "Enter new password" : "Enter password"}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>



                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-700 text-white cursor-pointer rounded hover:bg-green-800"
                        >
                            {editData ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminFormModal;
