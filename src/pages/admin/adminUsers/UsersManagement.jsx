import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllUsers, adminGetAllAddresses } from "../../../store/slices/adminSlice/AdminUserSlice";
import SidebarTitle from "../../../components/admin/SidebarTitle";
import UserTable from "./UserTable";
import { FaUser, FaMapMarkerAlt, FaStar, FaTimes, FaPhone } from "react-icons/fa";

export const UsersManagement = () => {
  const dispatch = useDispatch();
  const { users, addresses, loading, error, count } = useSelector((state) => state.adminUser);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <SidebarTitle />
        <div className="text-sm sm:text-base text-gray-600">
          Total Users: <span className="font-bold text-[#DA352D]">{count}</span>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading users...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <UserTable users={users} allAddresses={addresses} onView={handleViewDetails} />
      )}

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00000080] bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaUser /> User Details
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Personal Info</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-bold">Name:</span> {selectedUser.name}</p>
                    <p><span className="font-bold">Mobile:</span> {selectedUser.mobile}</p>
                    <p><span className="font-bold">Role:</span> <span className="capitalize bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{selectedUser.role}</span></p>
                    <p><span className="font-bold">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-bold">User ID:</span> {selectedUser._id}</p>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Account Activity</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-bold">Total Reviews:</span> {selectedUser.reviews?.length || 0}</p>
                    <p><span className="font-bold">Saved Addresses:</span> {selectedUser.addresses?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Addresses Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
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
                  <p className="text-gray-500 italic">No addresses saved.</p>
                )}
              </div>

              {/* Reviews Section (Optional) */}
              {selectedUser.reviews && selectedUser.reviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Recent Reviews
                  </h3>
                  <div className="space-y-3">
                    {selectedUser.reviews.map((review, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-md">
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

            <div className="p-4 bg-gray-100 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
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
