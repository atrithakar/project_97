const multer = require('multer');

// Store files as temporary memory buffers to avoid cluttering disk storage
const storage = multer.memoryStorage();

// Define limits and filters for incoming files
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB max limit per individual file
    }
});

// Configure the middleware to handle multiple files from an input named 'snapmatic'
// Caps the batch upload at a maximum of 20 files at once to prevent memory exhaustion
const snapmaticUpload = upload.array('snapmatic', 20);

module.exports = snapmaticUpload;