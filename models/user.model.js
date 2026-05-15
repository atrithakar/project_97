const pool = require("../config/db");

async function insertUserInDB(user_obj) {
    const query = `INSERT INTO users(id, first_name, last_name, username, email, user_password_hash) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [
        user_obj['id'],
        user_obj['first_name'],
        user_obj['last_name'],
        user_obj['username'],
        user_obj['email'],
        user_obj['user_password_hash']
    ]

    const [queryResult] = await pool.execute(query, values);
    return queryResult
}

async function fetchPasswordHash(email) {
    const query = `SELECT user_password_hash FROM users WHERE email = ?`;
    const values = [email]
    const [queryResult] = await pool.execute(query, values);
    return queryResult
}

module.exports = {insertUserInDB, fetchPasswordHash}