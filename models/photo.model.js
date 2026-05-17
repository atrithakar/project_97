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

module.exports = { insertPhotoInDB }