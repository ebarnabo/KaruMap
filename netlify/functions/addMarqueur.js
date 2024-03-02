const queryDatabase = async (query, params) => {
    // Simulation de l'ajout d'un marqueur dans la base de données
};

exports.handler = async function(event, context) {
    const { type, nom, latitude, longitude, code_postal, commune } = JSON.parse(event.body);

    try {
        // Logique pour ajouter un nouveau marqueur dans la base de données
        await queryDatabase('INSERT INTO Marqueurs (type, nom, latitude, longitude, code_postal, commune) VALUES (?, ?, ?, ?, ?, ?)', [type, nom, latitude, longitude, code_postal, commune]);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Marqueur ajouté" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur lors de l'ajout du marqueur" })
        };
    }
};
