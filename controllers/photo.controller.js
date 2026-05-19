// controllers/photo.controller.js
const db = require('../config/db');
const { getFeedDB, getPhotoDB, getPhotoInfoDB } = require('../models/photo.model');
const radioStations = require('../utils/radioMap.utils');
const path = require('path')

async function getFeed(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 40;
        const offset = (page - 1) * limit;
        const seed = parseInt(req.query.seed);

        // Harvest all optional filters from the URL
        const filters = {
            search: req.query.search || null,
            time: req.query.time || null,
            radio: req.query.radio || null,
            mapX: req.query.map_x ? parseFloat(req.query.map_x) : null,
            mapY: req.query.map_y ? parseFloat(req.query.map_y) : null,
            mapRadius: req.query.map_radius ? parseFloat(req.query.map_radius) : null
        };

        // Pass the single filters object to the DB
        const rows = await getFeedDB(offset, limit, seed, filters);

        res.status(200).json({
            success: true,
            data: rows,
            hasMore: rows.length === limit
        });

    } catch (error) {
        console.error("Feed API Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch feed" });
    }
};

async function getPhotoInfo(req, res) {
    try {
        const photo_id = req.params.id;

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(photo_id)) {
            return res.status(400).render('error', {
                message: "Invalid photo ID format."
            });
        }

        if (!photo_id) {
            throw new Error("no photo id received")
        }

        const rows = await getPhotoInfoDB(photo_id)

        if (!rows || rows.length === 0) {
            // Send a 404 status, but render a user-friendly HTML page
            return res.status(404).render('error', {
                message: "This Snapmatic capture does not exist or has been removed."
            });
        }

        rows[0]['radio_station'] = radioStations[rows[0]['radio_station']]

        res.render('photo', { photo: rows[0] })

    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, error: "Failed to fetch info for the photo" })
    }
}

async function downloadPhotoFile(req, res) {
    try {
        const photo_id = req.params.id;

        // 1. Fetch the photo details from your MySQL database
        const rows = await getPhotoInfoDB(photo_id); 
        
        if (!rows || rows.length === 0) {
            return res.status(404).send("File not found.");
        }

        const photo = rows[0];
        
        // 2. Construct the absolute path to the physical image on disk
        const filePath = path.join(__dirname, '../uploads/originals', photo.photo_name);

        // 3. Create a clean, user-friendly download name 
        // Sanitizes the user title so it doesn't break OS file naming rules
        const sanitizedTitle = photo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const downloadName = `${sanitizedTitle}_snapmatic.jpg`;

        // 4. Force the OS download dialog
        // Express will automatically read the stream, set headers, and prompt the browser
        return res.download(filePath, downloadName, (err) => {
            if (err) {
                console.error("Error during file transmission:", err);
                // If headers are already sent, we can't send a 500 status code
                if (!res.headersSent) {
                    return res.status(500).send("Could not transmit file.");
                }
            }
        });

    } catch (err) {
        console.error("[Download Router Error]:", err);
        return res.status(500).send("Internal server error during download execution.");
    }
}

module.exports = { getFeed, getPhotoInfo, downloadPhotoFile }