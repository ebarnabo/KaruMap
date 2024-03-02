const process = require('process');
const db = require('./db');

function coordonnes_correct(latitude, longitude) {
    return (
        latitude !== null && longitude !== null &&
        !isNaN(latitude) && !isNaN(longitude) &&
        latitude >= -90 && latitude <= 90 &&
        longitude >= -180 && longitude <= 180
    );
}