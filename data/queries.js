const pool = require("./pool");

async function getAllBlogs() {
    const {rows} = await pool.query("SELECT * FROM blogs ORDER BY id ASC")
    return rows;
}

async function addUser(firstname,lastname,username,email,password,age) {
    await pool.query("INSERT INTO users (firstname,lastname,username,email,password,age) VALUES ($1,$2,$3,$4,$5,$6)",[firstname,lastname,username,email,password,age])
}

module.exports ={
    getAllBlogs,
    addUser,
}