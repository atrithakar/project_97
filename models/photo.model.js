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

async function getFeedDB(offset, limit, seed, filters) {
    // 1. Base Query: JOIN the photos table with the users table to extract the username
    let query = `
        SELECT photos.*, users.username 
        FROM photos 
        JOIN users ON photos.owner_id = users.id 
        WHERE 1=1
    `;
    const queryParams = [];

    // 2. Text Search (Matches photo title OR the joined username)
    if (filters.search) {
        // We must specify photos.title and users.username to prevent ambiguity
        query += ` AND (photos.title LIKE ? OR users.username LIKE ?)`;
        queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // 3. Radio Filter
    if (filters.radio) {
        query += ` AND photos.radio_station = ?`;
        queryParams.push(filters.radio);
    }

    // 4. Time Filter (Strips the date and compares only the time)
    if (filters.time) {
        const [startTime, endTime] = filters.time.split('-');
        query += ` AND TIME(photos.game_time) BETWEEN ? AND ?`;
        // Appending seconds so you don't miss the 59th second of the minute
        queryParams.push(`${startTime}:00`, `${endTime}:59`);
    }

    // 5. The Map Radius Filter (Euclidean Math)
    if (filters.mapX !== null && filters.mapY !== null && filters.mapRadius !== null) {
        query += ` AND (POW(photos.coord_x - ?, 2) + POW(photos.coord_y - ?, 2)) <= POW(?, 2)`;
        queryParams.push(filters.mapX, filters.mapY, filters.mapRadius);
    }

    // 6. Consistent Randomization using the Seed
    if (seed) {
        query += ` ORDER BY RAND(?)`;
        queryParams.push(seed);
    } else {
        // Explicitly defining photos.id so MySQL doesn't confuse it with users.id
        query += ` ORDER BY photos.id DESC`; 
    }

    // 7. Pagination
    query += ` LIMIT ? OFFSET ?`;
    // Ensure these are passed as numbers, MySQL gets cranky if limits are strings
    queryParams.push(Number(limit), Number(offset)); 

    // Execute the query
    const [rows] = await pool.query(query, queryParams);
    return rows;
}

async function getPhotoInfoDB(photo_id) {
    const query = `SELECT p.id, p.owner_id, p.photo_name, p.title, p.coord_x, p.coord_y, p.game_time, p.clicked_at, p.uploaded_at, p.radio_station, u.username FROM photos p INNER JOIN users u ON p.owner_id = u.id WHERE p.id = ?;`;
    const values = [photo_id]
    const [queryResult] = await pool.execute(query, values)
    return queryResult
}

module.exports = { insertPhotoInDB, getFeedDB, getPhotoInfoDB }