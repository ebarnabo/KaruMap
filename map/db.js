const mysql = require('mysql');
const connection = mysql.createPool({
    host: process.env.DB_HOST, // Remplacez 'localhost' par une variable d'environnement
    user: process.env.DB_USER, // Remplacez 'map' par une variable d'environnement
    password: process.env.DB_PASS, // Remplacez 'map' par une variable d'environnement
    database: process.env.DB_NAME // Remplacez 'WBS' par une variable d'environnement
});
module.exports = connection;
