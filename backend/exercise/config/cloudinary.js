require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

async function deleteFromCloudinary(publicId) {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}

module.exports = { upload, deleteFromCloudinary };
