require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Conectado a la base de datos MongoDB Atlas.');
    })
    .catch((err) => {
        console.error('Error al conectar a MongoDB Atlas:', err.message);
    });

module.exports = mongoose;
