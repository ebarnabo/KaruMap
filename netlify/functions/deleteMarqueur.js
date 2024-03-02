const queryDatabase = async (query, params) => {
    // Simulation de la suppression d'un marqueur de la base de données
};

exports.handler = async function(event, context) {
    const { nom } = JSON.parse(event.body);

    try {
        // Logique pour supprimer le marqueur de la base de données
        await queryDatabase('DELETE FROM Marqueurs WHERE nom = ?', [nom]);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Marqueur supprimé" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur lors de la suppression du marqueur" })
        };
    }
};
