import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllContacts } from "../../../store/slices/adminSlice/AdminContactSlice";
import SidebarTitle from "../../../components/admin/SidebarTitle";
import ContactTable from "./ContactTable";

export const ContactManagement = () => {
    const dispatch = useDispatch();
    const { contacts, loading, error, count } = useSelector((state) => state.adminContact);

    useEffect(() => {
        dispatch(adminGetAllContacts());
    }, [dispatch]);

    return (
        <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <SidebarTitle />
                <div className="text-sm sm:text-base text-gray-600">
                    Total Contacts: <span className="font-bold text-[#DA352D]">{count}</span>
                </div>
            </div>

            {loading && <p className="text-center text-gray-500">Loading contacts...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            {!loading && !error && (
                <ContactTable contacts={contacts} />
            )}
        </div>
    );
};

export default ContactManagement;
