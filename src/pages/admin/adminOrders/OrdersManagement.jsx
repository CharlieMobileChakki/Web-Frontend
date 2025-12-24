import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllOrders } from "../../../store/slices/adminSlice/AdminOrderSlice";
import SidebarTitle from "../../../components/admin/SidebarTitle";
import OrderTable from "./OrderTable";

export const OrdersManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(adminGetAllOrders());
  }, [dispatch]);

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <SidebarTitle />
        <div className="text-sm sm:text-base text-gray-600">
          Total Orders: <span className="font-bold text-[#DA352D]">{orders?.length || 0}</span>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading orders...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <OrderTable orders={orders} />
      )}
    </div>
  );
};

export default OrdersManagement;
