// controllers/photo.controller.js
const db = require('../config/db');
const { getFeedDB } = require('../models/photo.model');

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

module.exports = getFeed