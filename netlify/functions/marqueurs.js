const axios = require('axios');
// Simulez la fonction de connexion à la base de données, ajustez selon votre mise en œuvre
const queryDatabase = async (query, params) => {
    return []; // Retourne un tableau vide pour cet exemple
};

exports.handler = async function(event, context) {
    try {
        // Logique pour récupérer les marqueurs de la base de données
        const jardins = await queryDatabase('SELECT * FROM Jardins');
        const monuments = await queryDatabase('SELECT * FROM Monuments');
        const marqueurs = [...jardins, ...monuments];

        return {
            statusCode: 200,
            body: JSON.stringify(marqueurs)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur lors de la récupération des marqueurs" })
        };
    }
};
