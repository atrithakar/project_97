const db = require('../config/db')

async function checkFavourite(user_id, photo_id) {
    const query = 'SELECT 1 FROM favourites WHERE user_id = ? AND photo_id = ?;';
    const values = [user_id, photo_id];
    const [queryResult] = await db.execute(query, values);
    return queryResult
}

async function removeFromFavourites(user_id, photo_id) {
    const query = 'DELETE FROM favourites WHERE user_id = ? AND photo_id = ?;';
    const values = [user_id, photo_id];
    const [queryResult] = await db.execute(query, values);
    return queryResult
}

async function addToFavourites(user_id, photo_id) {
    const query = 'INSERT INTO favourites (user_id, photo_id) VALUES (?, ?);';
    const values = [user_id, photo_id];
    const [queryResult] = await db.execute(query, values);
    return queryResult
}

module.exports = {checkFavourite, removeFromFavourites, addToFavourites}