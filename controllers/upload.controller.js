// controllers/upload.controller.js

async function processUpload(req, res) {
    try {
        // 1. Verify files actually exist in this specific request's memory tray
        if (!req.files || req.files.length === 0) {
            return res.status(400).send("No files uploaded.");
        }

        // 2. Loop through the array to address each file object
        for (const file of req.files) {
            
            // This is how you address the metadata Multer generated:
            console.log(`Processing file: ${file.originalname}`); // e.g., "PGTA5382910"
            console.log(`MimeType: ${file.mimetype}`);             // e.g., "application/octet-stream"
            console.log(`Size in RAM: ${file.size} bytes`);        // e.g., 345210 bytes

            // This is how you address the RAW BYTES sitting in memory:
            const rawBinaryBuffer = file.buffer; 

            // Example of addressing specific bits using standard array indexing:
            const byteOne = rawBinaryBuffer[0]; 
            const byteTwo = rawBinaryBuffer[1];
            
            console.log(`First two bytes in hex: ${byteOne.toString(16)}, ${byteTwo.toString(16)}`);
            
            // ==========================================
            // YOUR UPCOMING EXTRACTION LOGIC GOES HERE:
            // ==========================================
            // e.g., const jsonMetadata = extractJson(rawBinaryBuffer);
            // e.g., const cleanJpeg = extractJpeg(rawBinaryBuffer);
        }

        res.status(200).send("All files processed from memory successfully.");

    } catch (err) {
        console.error("Upload controller crashed:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = processUpload