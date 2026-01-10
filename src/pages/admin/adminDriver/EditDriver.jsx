import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    AdminGetDriverById,
    AdminUpdateDriver,
} from "../../../services/NetworkServices";
import UploadToCloudinary from "../../../components/admin/UploadToCloudinary";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDriver = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        driverName: "",
        driverDob: "",
        mobileNumber: "",
    });
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchDriverDetails();
    }, [id]);

    const fetchDriverDetails = async () => {
        try {
            const response = await AdminGetDriverById(id);
            if (response.data.success) {
                const driver = response.data.data;
                setFormData({
                    driverName: driver.driverName || "",
                    driverDob: driver.driverDob ? driver.driverDob.split("T")[0] : "",
                    mobileNumber: driver.mobileNumber || "",
                });
            } else {
                toast.error("Failed to fetch driver details");
            }
        } catch (error) {
            console.error("Error fetching driver details:", error);
            toast.error("Error fetching driver details");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            // 1. Upload new files to Cloudinary
            const uploadedUrls = {};
            const fileKeys = Object.keys(files);

            for (const key of fileKeys) {
                if (files[key]) {
                    const url = await UploadToCloudinary(files[key]);
                    if (url) {
                        uploadedUrls[key] = url;
                    } else {
                        toast.error(`Failed to upload ${key.replace(/([A-Z])/g, ' $1').trim()}`);
                        setUpdating(false);
                        return;
                    }
                }
            }

            // 2. Prepare JSON payload
            // Note: We only include uploadedUrls if specific files were changed.
            // Existing file URLs are already on the backend, so we don't need to send them unless we want to overwrite.
            const submissionData = {
                ...formData,
                ...uploadedUrls,
            };

            // 3. Send JSON to backend
            const response = await AdminUpdateDriver(id, submissionData);

            if (response.data.success) {
                toast.success("Driver updated successfully");
                setTimeout(() => navigate("/drivermanagement"), 2000);
            } else {
                toast.error(response.data.message || "Failed to update driver");
            }
        } catch (error) {
            console.error("Error updating driver:", error);
            toast.error("Error updating driver");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Driver</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name *</label>
                            <input
                                type="text"
                                name="driverName"
                                value={formData.driverName}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                            <input
                                type="date"
                                name="driverDob"
                                value={formData.driverDob}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                            <input
                                type="tel"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                required
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit mobile number"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Update Documents (Optional)</h3>
                        <p className="text-sm text-gray-500 mb-4">Upload new files only if you want to replace existing ones.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card</label>
                                <input
                                    type="file"
                                    name="driverAdharUpload"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
                                <input
                                    type="file"
                                    name="driverPanUpload"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Driving License</label>
                                <input
                                    type="file"
                                    name="driverLicenseUpload"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Certificate</label>
                                <input
                                    type="file"
                                    name="employmentCertificateUpload"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Official Documents</label>
                                <input
                                    type="file"
                                    name="employmentOfficialDocsUpload"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/drivermanagement")}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${updating ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {updating ? "Updating..." : "Update Driver"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDriver;
