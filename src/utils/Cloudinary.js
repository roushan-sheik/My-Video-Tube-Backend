import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export async function uploadOnCloud(filePath) {
  if (!filePath) return null;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
  });

  // Upload an image
  const response = await cloudinary.uploader
    .upload(filePath, {
      resource_type: "auto",
    })
    .catch((error) => {
      console.log(error);
      fs.unlinkSync(filePath);
    });

  return response.url;
}
