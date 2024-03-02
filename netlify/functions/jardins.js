const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const apiJardins = process.env.API_JARDINS_URL;
        const response = await axios.get(apiJardins);
        const jardins = response.data.results.map(jardin => ({
            nom_du_jardin: jardin.nom_du_jardin,
            code_postal: jardin.code_postal,
            adresse_complete: jardin.adresse_complete,
            commune: jardin.commune,
            type: 'jardins',
            latitude: jardin.latitude,
            longitude: jardin.longitude
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(jardins)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur lors de l'appel de l'API Jardins" })
        };
    }
};
