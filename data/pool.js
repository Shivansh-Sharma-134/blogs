/*require("dotenv").config();
const {Pool} = require("pg");
module.exports = new Pool({
    host: "localhost", 
    user: process.env.DB_USER,
    database: "blogsapp",
    password: process.env.DB_PASSWORD,
    port: 5432 
  });*/



require("dotenv").config();
const {Pool} = require("pg");
module.exports = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{

      rejectUnauthorized: false
    },
  });
