import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminGetDriverById } from "../../../services/NetworkServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriverDetails = () => {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseURL = import.meta.env.VITE_BASE_URL || "";

    useEffect(() => {
        fetchDriverDetails();
    }, [id]);

    const fetchDriverDetails = async () => {
        try {
            const response = await AdminGetDriverById(id);
            if (response.data.success) {
                setDriver(response.data.data);
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

    const InfoRow = ({ label, value }) => (
        <div className="py-2 border-b border-gray-100 last:border-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-900 col-span-2 sm:mt-0">{value || "N/A"}</dd>
        </div>
    );

    const DocumentPreview = ({ label, url }) => {
        const getFullUrl = (path) => {
            if (!path) return "";
            if (path.startsWith("http") || path.startsWith("https")) {
                return path;
            }
            return `${baseURL}/${path}`;
        };

        return (
            <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50 hover:shadow-md transition">
                <span className="text-sm font-medium text-gray-700 mb-2">{label}</span>
                {url ? (
                    <a
                        href={getFullUrl(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline break-all text-center"
                    >
                        View Document
                    </a>
                ) : (
                    <span className="text-sm text-gray-400 italic">Not Uploaded</span>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Driver not found.
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">Driver Profile</h1>
                    <Link
                        to="/drivermanagement"
                        className="text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg text-sm transition"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
                            <dl className="space-y-1">
                                <InfoRow label="Full Name" value={driver.driverName} />
                                <InfoRow label="Mobile Number" value={driver.mobileNumber} />
                                <InfoRow label="Date of Birth" value={driver.driverDob ? new Date(driver.driverDob).toLocaleDateString() : ""} />
                                <InfoRow label="Account Created" value={new Date(driver.createdAt).toLocaleDateString()} />
                                <InfoRow
                                    label="Status"
                                    value={
                                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${driver.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {driver.isActive ? "Active" : "Inactive"}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Availability"
                                    value={
                                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${driver.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {driver.isAvailable ? "Online" : "Offline"}
                                        </span>
                                    }
                                />
                            </dl>
                        </div>

                        {/* Performance Stats (Placeholder for now) */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Statistics</h3>
                            <dl className="space-y-1">
                                <InfoRow label="Rating" value={`${driver.rating || 0} / 5`} />
                                <InfoRow label="Total Trips" value={driver.totalTrips || 0} />
                                <InfoRow label="Total Distance" value={`${driver.totalTripDistance || 0} km`} />
                            </dl>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Uploaded Documents</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <DocumentPreview label="Aadhar Card" url={driver.driverAdharUpload} />
                            <DocumentPreview label="PAN Card" url={driver.driverPanUpload} />
                            <DocumentPreview label="Driving License" url={driver.driverLicenseUpload} />
                            <DocumentPreview label="Employ. Cert." url={driver.employmentCertificateUpload} />
                            <DocumentPreview label="Official Docs" url={driver.employmentOfficialDocsUpload} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetails;
