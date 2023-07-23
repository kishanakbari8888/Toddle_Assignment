require("dotenv").config()
const mysql = require('mysql')

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to DATABASE');
        return;
    }
    console.log('Connection established');
});

exports.connection = connection;



