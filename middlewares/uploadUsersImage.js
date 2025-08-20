const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

// --- Storage configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Use user ID + timestamp + original file extension as filename
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// --- File filter ---
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // accept image files
    } else {
        cb(new AppError('Error', 400, 'Images only')); // reject non-image files
    }
};

// --- Multer upload instance ---
const upload = multer({ storage, fileFilter });

module.exports = upload;