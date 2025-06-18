const { use } = require("passport");
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

async function getUserByUsername(username) {
    const {rows} = await pool.query("SELECT * FROM users WHERE username = $1",[username]);
    return rows[0];
}

async function getBlogsByUser(id) {
    const {rows} = await pool.query("SELECT * FROM blogs WHERE userid = $1 ORDER BY id ASC",[id]);
    return rows;
}

async function changeMembership(id) {
    await pool.query("UPDATE users SET membership = true WHERE id = $1",[id])
}

async function addNewBlog(title,text,userid) {
    await pool.query("INSERT INTO blogs (title,text,userid) VALUES ($1,$2,$3)",[title,text,userid]);
}

async function deleteBlog(id) {
    await pool.query("DELETE FROM blogs WHERE id = $1",[id]);
}

async function getAllLikes() {
    const {rows} = await pool.query("SELECT * FROM likes ORDER BY id ASC")
    return rows;
}

async function addLike(userid,blogid) {
    await pool.query("INSERT INTO likes (userid, blogid) VALUES ($1, $2)", [userid, blogid]);
    await pool.query("UPDATE blogs SET likes = likes + 1 WHERE id = $1", [blogid]);

}

async function removeLike(userid,blogid) {
    await pool.query("DELETE FROM likes WHERE userid = $1 AND blogid = $2",[userid,blogid]);
    await pool.query("UPDATE blogs SET likes = likes - 1 WHERE id = $1", [blogid]);
}

async function deleteProfile(userid) {
    const client = await pool.connect();
    try {
    await client.query("BEGIN");

    await client.query("DELETE FROM likes WHERE userid = $1", [userid]);
    await client.query("DELETE FROM blogs WHERE userid = $1", [userid]);
    await client.query("DELETE FROM users WHERE id = $1", [userid]);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed to delete profile:", err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports ={
    getAllBlogs,
    addUser,
    getUser,
    getUserById,
    getAllUsers,
    getBlogsByUser,
    changeMembership,
    addNewBlog,
    deleteBlog,
    addLike,
    getAllLikes,
    removeLike,
    deleteProfile,
    getUserByUsername,
}