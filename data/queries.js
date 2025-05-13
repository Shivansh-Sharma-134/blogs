const pool = require("./pool");

async function getAllBlogs() {
    const {rows} = await pool.query("SELECT * FROM blogs ORDER BY id ASC")
    return rows;
}

async function getAllUsers() {
    const {rows} = await pool.query("SELECT * FROM users ORDER BY id ASC")
    return rows;
}

async function addUser(firstname,lastname,username,email,password,age) {
    await pool.query("INSERT INTO users (firstname,lastname,username,email,password,age) VALUES ($1,$2,$3,$4,$5,$6)",[firstname,lastname,username,email,password,age])
}

async function getUser(username) {
    const {rows} = await pool.query("SELECT * FROM users WHERE username = $1",[username]);
    return rows[0];
}

async function getUserById(id) {
    const {rows} = await pool.query("SELECT * FROM users WHERE id = $1",[id]);
    return rows[0];
}



module.exports ={
    getAllBlogs,
    addUser,
    getUser,
    getUserById,
    getAllUsers,
}