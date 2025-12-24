const UploadToCloudinary = async (file) => {
    try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "unsigned_preset"); // ✔ correct preset

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dweah6let/image/upload",
            {
                method: "POST",
                body: data,
            }
        );

        const uploadRes = await res.json();

        // Upload Failed?
        if (!uploadRes.secure_url) {
            console.error("Cloudinary Upload Error:", uploadRes);
            return null;
        }

        return uploadRes.secure_url; // REAL image url
    } catch (error) {
        console.error("Upload Error:", error);
        return null;
    }
};

export default UploadToCloudinary;
