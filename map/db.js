// db.js
// const mysql = require('mysql');
// const connection = mysql.createPool({
//     host     : 'localhost',  // Votre hôte
//     user     : 'map',       // Votre utilisateur de base de données
//     password : 'map',   // Votre mot de passe
//     database : 'u781247865_karumap'         // Le nom de la base de données
// });
// module.exports = connection;


const mysql = require('mysql');

// Créez un pool de connexion en utilisant les variables d'environnement
const connection = mysql.createPool({
    host: process.env.DB_HOST,     // Variable d'environnement pour l'hôte
    user: process.env.DB_USER,     // Variable d'environnement pour l'utilisateur
    password: process.env.DB_PASS, // Variable d'environnement pour le mot de passe
    database: process.env.DB_NAME  // Variable d'environnement pour le nom de la base
});

module.exports = connection;
