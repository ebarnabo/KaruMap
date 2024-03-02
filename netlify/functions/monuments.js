const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const apiMonuments = process.env.API_MONUMENTS_URL;
        const response = await axios.get(apiMonuments);
        const monuments = response.data.results.map(monument => ({
            // votre logique de transformation ici
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(monuments)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur lors de l'appel de l'API Monuments" })
        };
    }
};
