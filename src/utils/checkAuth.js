export const checkAuth = (navigate) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/signin");
        return false; // block action
    }
    return true; // allow action
};
