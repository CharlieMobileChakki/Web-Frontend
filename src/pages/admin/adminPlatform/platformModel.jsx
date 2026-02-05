import React, { useState, useEffect } from "react";
import UploadToCloudinary from "../../../components/admin/UploadToCloudinary";
import { platformSchema } from "../../../utils/validations/ValidationSchemas";

const PlatformModal = ({ isOpen, onClose, onSave, editData }) => {
    const [formData, setFormData] = useState({
        name: "",
        logo: "",
    });
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                logo: editData.logo || "",
            });
            setPreview(editData.logo || null);
        } else {
            setFormData({ name: "", logo: "" });
            setPreview(null);
        }
    }, [editData]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);
        setIsUploading(true);

        try {
            const url = await UploadToCloudinary(file);
            if (url) {
                setFormData(prev => ({ ...prev, logo: url }));
                setPreview(url); // Replace with real Cloudinary URL
            }
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (isUploading) return;

        try {
            await platformSchema.validate(formData, {
                abortEarly: false,
            });

            onSave({
                name: formData.name,
                logo: formData.logo,
            });

        } catch (validationError) {
            const newErrors = {};

            validationError.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });

            setErrors(newErrors);
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-[#1e293b] p-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">{editData ? "Update Platform" : "Create Platform"}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-gray-300">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. FLIPKART"
                        />
                        {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Logo</label>

                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors relative">
                            <div className="space-y-1 text-center">
                                {preview ? (
                                    <div className="relative inline-block">
                                        <img src={preview} alt="Preview" className="mx-auto h-24 w-24 object-contain rounded-lg" />
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                        <span>{preview ? "Change Logo" : "Upload Logo"}</span>
                                        <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                {errors.logo && <p className="text-red-500 mt-1">{errors.logo}</p>}
                            </div>
                        </div>


                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading || !formData.logo}
                            className={`px-6 py-2 rounded-lg text-white text-sm font-bold shadow-lg transition-all ${isUploading || !formData.logo ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#DA352D] hover:bg-[#C6363E] shadow-red-200'
                                }`}
                        >
                            {isUploading ? "Uploading..." : editData ? "Update Platform" : "Create Platform"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlatformModal;