require('dotenv').config(); // Carga las variables de entorno
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');

const app = express();

// Configuración del middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/api', foodRoutes); // Asocia todas las rutas de foodRoutes al prefijo /api

// Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET, // Se obtiene de las variables de entorno
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));

// Configuración de la conexión a la base de datos MySQL
const db = require('./config/db'); // Se importa la conexión a la base de datos

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
