// controllers/photoController.js

const { checkFavourite, removeFromFavourites, addToFavourites } = require("../models/favourites.model");

// 1. Toggle Favourite (Add / Remove)
async function toggleFavourite(req, res) {
    try {
        const photo_id = req.params.id;
        const user_id = req.user?.id; // Grab authenticated user from session/JWT

        if (!user_id) {
            return res.status(401).json({ success: false, error: "Authentication required." });
        }

        // 1. CRITICAL FIX: You MUST await the asynchronous database call
        const existing = await checkFavourite(user_id, photo_id);

        if (existing && existing.length > 0) {
            // Already favourited -> Remove it (Unfavourite)
            const unfavRes = await removeFromFavourites(user_id, photo_id);
            
            // 2. VERIFY EXPLICIT WRITES: Ensure a row was actually deleted from MySQL
            if (!unfavRes || unfavRes.affectedRows === 0) {
                return res.status(500).json({ success: false, error: "Failed to remove from favourites. State mismatch." });
            }
            
            return res.json({ success: true, isFavourite: false });
        } else {
            // Not favourited yet -> Insert it
            const favRes = await addToFavourites(user_id, photo_id);
            
            // 3. VERIFY EXPLICIT WRITES: Ensure a row was actually inserted into MySQL
            if (!favRes || favRes.affectedRows === 0) {
                return res.status(500).json({ success: false, error: "Failed to add to favourites." });
            }
            
            return res.json({ success: true, isFavourite: true });
        }

    } catch (err) {
        // If MySQL throws a duplicate key error due to spamming, it lands safely here
        console.error("[Favourite Toggle Error]:", err);
        return res.status(500).json({ success: false, error: "Database transaction aborted." });
    }
}

// 2. Check Initial Status on Page Load
async function checkFavouriteStatus(req, res) {
    try {
        const photo_id = req.params.id;
        const user_id = req.user?.id;

        if (!user_id) {
            return res.json({ isFavourite: false }); // Unauthenticated users see default state
        }

        const isFav = await checkFavourite(user_id, photo_id)
        return res.json({ isFavourite: isFav.length > 0 });

    } catch (err) {
        console.error("[Favourite Status Error]:", err);
        return res.status(500).json({ isFavourite: false });
    }
}

module.exports = {toggleFavourite, checkFavouriteStatus}