import React from "react";
import { useLocation } from "react-router-dom";

const SidebarTitle = () => {
    const location = useLocation();

    // Sidebar ka menu list → yahi mapping ke liye use karenge
    const menuItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Admin Creation", href: "/admincreation" },
        { name: "Category Management", href: "/categorymanagement" },
        { name: "Orders Management", href: "/ordersmanagement" },
        { name: "Products Management", href: "/productmanagement" },
        { name: "Users Management", href: "/usersmanagement" },
        { name: "Blog Management", href: "/blogmanagement" },
        { name: "Banner Management", href: "/bannermanagement" },
        { name: "Stock Management", href: "/stockmanagement" },
        { name: "Booking Management", href: "/bookingmanagement" },
        { name: "Driver Management", href: "/drivermanagement" },
        { name: "Contact Management", href: "/contactmanagement" },
        { name: "Logout", href: "/logout" },
    ];

    // Current route ka matching name nikalna
    const activeItem = menuItems.find(
        (item) => item.href === location.pathname
    );

    const title = activeItem?.name || "Admin Panel";

    return <h1 className="text-[1rem] md:text-[2rem] font-semibold">{title}</h1>;
};

export default SidebarTitle;
