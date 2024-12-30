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

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes',  // Folder in Cloudinary
    format: 'pdf',  // Explicitly set the format to PDF
    resource_type: 'raw',
    public_id: (req, file) => Date.now() + '-' + file.originalname.replace('.pdf', ''),  // Remove .pdf from the original file name to prevent duplication
  },
});

// Create Multer instance
const upload = multer({ storage });

module.exports = upload;

