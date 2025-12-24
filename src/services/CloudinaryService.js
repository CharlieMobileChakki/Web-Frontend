
import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "dlboyeiyr";
// ⚠️ IMPORTANT: Replace "YOUR_UNSIGNED_PRESET" with your actual unsigned upload preset name from your Cloudinary settings.
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UNSIGNED_PRESET";

/**
 * Uploads a file to Cloudinary.
 * @param {File} file The file to upload.
 * @returns {Promise<string>} The secure URL of the uploaded file.
 */
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Image upload failed. Please try again.");
  }
};
