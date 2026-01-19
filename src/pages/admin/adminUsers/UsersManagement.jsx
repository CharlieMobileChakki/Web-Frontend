import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllUsers, adminGetAllAddresses } from "../../../store/slices/adminSlice/AdminUserSlice";
import SidebarTitle from "../../../components/admin/SidebarTitle";
import Pagination from "../../../components/admin/Pagination";
import UserTable from "./UserTable";
import { FaUser, FaMapMarkerAlt, FaStar, FaTimes, FaPhone } from "react-icons/fa";

export const UsersManagement = () => {
  const dispatch = useDispatch();
  const { users, addresses, loading, error, count } = useSelector((state) => state.adminUser);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((users?.length || 0) / itemsPerPage);

  useEffect(() => {
    dispatch(adminGetAllUsers());
    dispatch(adminGetAllAddresses());
  }, [dispatch]);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor user accounts</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm text-gray-600">Total Users: </span>
          <span className="font-bold text-blue-600">{count}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search users by name or mobile..."
          />
        </div>
      </div>

      {/* Content Area */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          <UserTable users={currentUsers} allAddresses={addresses} onView={handleViewDetails} />
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#00000080] backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#2c3e50] p-4 sm:p-6 flex justify-between items-center text-white">
              <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold">
                <FaUser /> User Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-300 hover:text-white transition text-3xl font-light leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Personal Info</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-bold">Name:</span> {selectedUser.name}</p>
                    <p className="flex items-center gap-2"><FaPhone size={12} /> <span className="font-bold">Mobile:</span> {selectedUser.mobile}</p>
                    <p><span className="font-bold">Role:</span> <span className="capitalize bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{selectedUser.role}</span></p>
                    <p><span className="font-bold">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500 truncate"><span className="font-bold">User ID:</span> {selectedUser._id}</p>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Account Activity</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-bold">Total Reviews:</span> {selectedUser.reviews?.length || 0}</p>
                    <p><span className="font-bold">Saved Addresses:</span> {selectedUser.addresses?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Addresses Section */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" /> Saved Addresses
                </h3>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser.addresses.map((addr, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition bg-white relative">
                        {addr.isDefault && (
                          <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                        )}
                        <p className="font-bold text-gray-800 mb-1">{addr.label || "Address " + (index + 1)}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {addr.formattedAddress ||
                            `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`.replace(/^, /, '')
                          }
                        </p>
                        {addr.location && (
                          <p className="text-xs text-gray-400 mt-2">
                            Coords: {addr.location.coordinates?.[1]}, {addr.location.coordinates?.[0]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No addresses saved.</p>
                )}
              </div>

              {/* Reviews Section (Optional) */}
              {selectedUser.reviews && selectedUser.reviews.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Recent Reviews
                  </h3>
                  <div className="space-y-3">
                    {selectedUser.reviews.map((review, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-600">"{review.comment || "No comment"}"</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`text-xs ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] font-medium transition shadow-sm text-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UsersManagement;
