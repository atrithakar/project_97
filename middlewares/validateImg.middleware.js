function validateSnapmaticContents(req, res, next) {
    // If no files passed Multer parsed layout, move on (or handle rejection)
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("Bad Request: No files uploaded.");
    }

    // Loop through every parsed memory buffer
    for (const file of req.files) {
        const buffer = file.buffer;

        // A. Verify file size meets minimum threshold to even hold an image header
        if (buffer.length < 4) {
            return res.status(400).send(`Bad Request: File "${file.originalname}" is completely empty or corrupt.`);
        }

        // B. Check for standard JPEG Magic Bytes (FF D8 FF) at index 0, 1, and 2
        if (buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
            console.error(`[VALIDATION BLOCKED] ${file.originalname} failed JPEG verification headers.`);
            return res.status(400).send(`Bad Request: File "${file.originalname}" does not contain a valid JPEG structure.`);
        }

        // C. Check if the file ends with the Rockstar 'JEND' marker string
        // We look inside the last 100 bytes of the file boundary
        const tailOffset = Math.max(0, buffer.length - 100);
        const fileStringTail = buffer.toString('utf8', tailOffset);
        
        if (!fileStringTail.includes('JEND')) {
            console.error(`[VALIDATION BLOCKED] ${file.originalname} missing 'JEND' tail termination signature.`);
            return res.status(400).send(`Bad Request: File "${file.originalname}" is not a valid or complete Snapmatic file.`);
        }
    }

    // If all files pass the loop completely unscathed, proceed natively to your controller
    next();
};

module.exports = validateSnapmaticContents