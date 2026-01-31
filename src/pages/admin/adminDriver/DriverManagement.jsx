import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AdminGetAllDrivers,
  AdminDeleteDriver,
} from "../../../services/NetworkServices";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, drivers]);

  const fetchDrivers = async () => {
    try {
      const response = await AdminGetAllDrivers();
      if (response.data.success) {
        setDrivers(response.data.data);
        setFilteredDrivers(response.data.data);
      } else {
        toast.error("Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Error fetching drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = drivers.filter(
      (driver) =>
        driver.driverName.toLowerCase().includes(term) ||
        driver.mobileNumber.includes(term)
    );
    setFilteredDrivers(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        const response = await AdminDeleteDriver(id);
        if (response.data.success) {
          toast.success("Driver deleted successfully");
          fetchDrivers();
        } else {
          toast.error("Failed to delete driver");
        }
      } catch (error) {
        console.error("Error deleting driver:", error);
        toast.error("Error deleting driver");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1> */}
        <Link
          to="/drivermanagement/create"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all duration-300 font-medium shadow-md hover:shadow-lg"
        >
          <FaPlus /> Add Driver
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name or Mobile Number..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver, index) => (
                  <tr key={driver._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {driver.driverName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {driver.mobileNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${driver.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {driver.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({driver.isAvailable ? "Online" : "Offline"})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(driver.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/drivermanagement/view/${driver._id}`)}
                        className="text-blue-600 hover:text-blue-900 mx-2"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => navigate(`/drivermanagement/edit/${driver._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(driver._id)}
                        className="text-red-600 hover:text-red-900 mx-2"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
