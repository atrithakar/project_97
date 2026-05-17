// controllers/upload.controller.js

const { insertPhotoInDB } = require("../models/photo.model");
const { processSnapmatic } = require("../utils/extractImg.util");
const { v4: uuidv4 } = require('uuid');

async function processUpload(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send("No files uploaded.");
        }

        const owner_id = req.user.id;
        const failedUploads = []; // Array to trap bad files so the server doesn't crash

        // Loop through the batch
        for (const file of req.files) {

            // 1. Extract the data
            const photo_obj = await processSnapmatic(file.buffer, file.originalname, owner_id);

            // 2. GUARDRAIL: Did the extraction fail?
            if (!photo_obj.success) {
                console.error(`[EXTRACTION FAILED] ${file.originalname}: ${photo_obj.error}`);
                failedUploads.push(file.originalname);
                continue; // Skip DB insertion and move straight to the next file
            }

            // 3. Prep for Database
            photo_obj['owner_id'] = owner_id;
            photo_obj['id'] = uuidv4(); // Safe UUID for the row PK

            // 4. Insert into MySQL
            const photoInsRes = await insertPhotoInDB(photo_obj);

            if (photoInsRes.affectedRows !== 1) {
                console.error(`[DB INSERT FAILED] ${photo_obj.photo_name}`);
                failedUploads.push(file.originalname);
                // Do NOT send a res.status() here, just trap the error and keep looping
            }
        }

        // 5. Final Response Execution
        if (failedUploads.length > 0) {
            console.warn(`[UPLOAD BATCH COMPLETED] with ${failedUploads.length} errors:`, failedUploads);
            // Optional: You can redirect to an error page here if you want strict failure UX
            return res.status(500).render('err', { err: `Failed to process: ${failedUploads.join(', ')}` });
        }

        // Only one response is sent, safely outside the loop
        res.redirect('/home');

    } catch (err) {
        console.error("Upload controller crashed:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = processUpload