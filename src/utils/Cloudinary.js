import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //   Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //   file has been successfuly uploaded
    console.log("File is uploaded on cloudinary", "Url: ", response.url);
    console.log(response);
    return response;
  } catch (error) {
    // remove the locally saved temporary file as the upload
    // operation get failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};
export { uploadOnCloudinary };
