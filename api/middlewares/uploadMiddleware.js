
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes', // Folder name in Cloudinary
    format: async (req, file) => 'pdf', // Force files to be stored as PDF
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique file name
  },
});

const upload = multer({ storage });

module.exports = upload;

