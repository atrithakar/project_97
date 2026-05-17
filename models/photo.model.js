const pool = require("../config/db");

async function insertPhotoInDB(photo_obj) {
    const query = `INSERT INTO photos(id, owner_id, photo_name, thumbnail_name, title, coord_x, coord_y, coord_z, game_time, clicked_at, radio_station) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const values = [
        photo_obj['id'],
        photo_obj['owner_id'],
        photo_obj['photo_name'],
        photo_obj['thumbnail_name'],
        photo_obj['title'],
        photo_obj['coord_x'],
        photo_obj['coord_y'],
        photo_obj['coord_z'],
        photo_obj['game_time'],
        photo_obj['clicked_at'],
        photo_obj['radio_station'],
    ]

    const [queryResult] = await pool.execute(query, values);
    return queryResult
}

async function getFeedDB(offset, limit, seed) {

    let orderBy = 'ORDER BY uploaded_at DESC'; // Default to newest first

    if (seed) {
        // MySQL RAND(N) produces a repeatable sequence based on the seed
        orderBy = `ORDER BY RAND(${seed})`;
    }

    const query = `
            SELECT p.id, u.username, p.thumbnail_name, p.photo_name, p.title, p.coord_x, p.coord_y 
            FROM photos p
            INNER JOIN users u
            ON p.owner_id = u.id
            ${orderBy} 
            LIMIT ? OFFSET ?
        `;

    // Execute the query (assuming mysql2 promise wrapper)
    const [queryResult] = await pool.query(query, [limit, offset]);
    return queryResult
}

module.exports = { insertPhotoInDB, getFeedDB }