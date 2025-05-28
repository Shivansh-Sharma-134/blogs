#! /usr/bin/env node

const {Client} = require ("pg");

const SQL =`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
firstname VARCHAR(255) NOT NULL,
lastname VARCHAR(255) ,
username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(300) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
age INT,
membership BOOLEAN DEFAULT FALSE,
admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS blogs (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(255) NOT NULL,
text VARCHAR(500) NOT NULL,
userid INT,
created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (userid) REFERENCES users(id)
);

INSERT INTO users (firstname,lastname,username,email,password,age,membership,admin)
VALUES
    ('Shiv','Sharma','shiv134','shiv@email.com','shiv134',24,true,true),
    ('Jake','Smith','jake123','jake@email.com','master',26,true,false);


INSERT INTO blogs (title,text,userid)
VALUES
    ('First blog for the webapp','this is first blog as a test',1);
`;


async function main() {
    console.log("seeding")
    const client= new Client({
         connectionString: process.env.DATABASE_URL,
         ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })

    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done')
}

main()