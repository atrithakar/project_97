const db = require('../config/db'); // Adjust this to point to your MySQL pool

// Render the main profile shell
async function getProfileView(req, res) {
    try {
        const targetUsername = req.params.username;
        const loggedInUserId = req.user?.id; // Assumes your auth middleware populates req.user
        
        const [users] = await db.execute(
            'SELECT id, first_name, last_name, username, profile_bio, joined_at FROM users WHERE username = ?',
            [targetUsername]
        );

        if (users.length === 0) {
            return res.status(404).render('error', { message: "User profile context does not exist." });
        }

        const profileUser = users[0];
        
        // Contextual Ownership Flag
        const isOwner = loggedInUserId === profileUser.id;

        return res.render('profile', { 
            profileUser: profileUser,
            isOwner: isOwner 
        });
    } catch (err) {
        console.error("[Profile Route Error]:", err);
        return res.status(500).render('error', { message: "Internal failure loading user context." });
    }
};

// JSON API: Uploaded Photos
async function getUserUploadsJSON(req, res) {
    try {
        const username = req.params.username;
        const [photos] = await db.execute(`
            SELECT p.id, p.thumbnail_name, p.title, u.username 
            FROM photos p
            JOIN users u ON p.owner_id = u.id
            WHERE u.username = ?
            ORDER BY p.uploaded_at DESC`, 
            [username]
        );
        return res.json({ photos });
    } catch (err) {
        return res.status(500).json({ error: "Failed to query uploads." });
    }
};

// JSON API: Favourited Photos
async function getUserFavouritesJSON(req, res) {
    try {
        const username = req.params.username;
        const [photos] = await db.execute(`
            SELECT p.id, p.thumbnail_name, p.title, owner.username 
            FROM favourites f
            JOIN users u ON f.user_id = u.id
            JOIN photos p ON f.photo_id = p.id
            JOIN users owner ON p.owner_id = owner.id
            WHERE u.username = ?
            ORDER BY f.created_at DESC`, 
            [username]
        );
        return res.json({ photos });
    } catch (err) {
        return res.status(500).json({ error: "Failed to query favourites." });
    }
};

module.exports = {getProfileView, getUserUploadsJSON, getUserFavouritesJSON}