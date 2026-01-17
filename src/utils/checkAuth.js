import { toast } from "react-toastify";

export const checkAuth = (navigate) => {
    const token = localStorage.getItem("token");

    if (!token) {
        toast.error("Please sign up or login to continue with this action", {
            position: "top-center",
            autoClose: 3000,
        });
        setTimeout(() => {
            navigate("/signup");
        }, 500);
        return false; // block action
    }
    return true; // allow action
};
