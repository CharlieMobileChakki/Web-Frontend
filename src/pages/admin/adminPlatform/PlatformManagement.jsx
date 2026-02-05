
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaLayerGroup } from "react-icons/fa";
import { getAllPlatforms, createPlatform, updatePlatform, deletePlatform } from "../../../store/slices/adminSlice/PlatformSlice";
import PlatformModal from "./platformModel";
import Pagination from "../../../components/admin/Pagination";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const PlatformManagement = () => {
    const dispatch = useDispatch();
    const { platform, loading } = useSelector((state) => state.adminPlatform);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        dispatch(getAllPlatforms());
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredPlatforms = platform?.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Pagination logic
    const totalPages = Math.ceil(filteredPlatforms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPlatforms = filteredPlatforms.slice(startIndex, startIndex + itemsPerPage);

    const handleOpenModal = (p = null) => {
        setEditingPlatform(p);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlatform(null);
    };

    const handleSavePlatform = (formData) => {
        if (editingPlatform) {
            dispatch(updatePlatform({ id: editingPlatform._id, data: { name: formData.name, logo: formData.logo } }))
                .unwrap()
                .then(() => {
                    toast.success("Platform updated successfully ✅");
                    handleCloseModal();
                })
                .catch((err) => {
                    toast.error("Error!", err.message || "Something went wrong", "error");
                });
        } else {
            dispatch(createPlatform({ name: formData.name, logo: formData.logo }))
                .unwrap()
                .then(() => {
                    toast.success("Platform created successfully ✅");
                    handleCloseModal();
                })
                .catch((err) => {
                    toast.error("Error!", err.message || "Something went wrong", "error");
                });
        }
    };

    const handleDeletePlatform = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deletePlatform(id))
                    .unwrap()
                    .then(() => Swal.fire("Deleted!", "Platform has been deleted.", "success"))
                    .catch((err) => Swal.fire("Error!", err.message || "Something went wrong", "error"));
            }
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaLayerGroup className="text-[#DA352D]" /> Platform Management
                    </h1>
                    <p className="text-gray-500 text-sm">Manage e-commerce platforms like Flipkart, Amazon, etc.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#DA352D] text-white px-5 py-2.5 rounded-lg hover:bg-[#C6363E] transition shadow-lg shadow-red-200"
                >
                    <FaPlus /> Add Platform
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Filters/Search */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search platforms..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SR No.</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">Loading platforms...</td>
                                </tr>
                            ) : currentPlatforms.length > 0 ? (
                                currentPlatforms.map((p, index) => (
                                    <tr key={p._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{startIndex + index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                                <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{p.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(p)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePlatform(p._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">No platforms found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredPlatforms.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            <PlatformModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePlatform}
                editData={editingPlatform}
            />
        </div>
    );
};

export default PlatformManagement;