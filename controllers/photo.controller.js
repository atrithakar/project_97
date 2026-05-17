// controllers/photo.controller.js
const db = require('../config/db');
const { getFeedDB } = require('../models/photo.model');

async function getFeed(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 40;
        const offset = (page - 1) * limit;
        
        // The seed guarantees consistent randomization across paginated requests
        const seed = parseInt(req.query.seed); 

        const rows = await getFeedDB(offset, limit, seed)

        // console.log(rows)

        res.status(200).json({ 
            success: true, 
            data: rows,
            hasMore: rows.length === limit // If we got 40 back, there's probably a page 2
        });

    } catch (error) {
        console.error("Feed API Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch feed" });
    }
};

module.exports = getFeed