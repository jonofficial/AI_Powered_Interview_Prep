const multer = require('multer');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // specify the uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // create a unique filename
    },
});

// file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // accept file
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG and GIF are allowed!'), false); // reject file
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
