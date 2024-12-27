const db = require('../config/db');

exports.createUser = ({ nombre_completo, correo, edad, genero, altura, nivel_actividad, password }, callback) => {
    const sql = `INSERT INTO usuarios (nombre_completo, correo, edad, genero, altura, nivel_actividad, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [nombre_completo, correo, edad, genero, altura, nivel_actividad, password], callback);
};

exports.getUserByEmailAndPassword = (correo, password, callback) => {
    const sql = `SELECT * FROM usuarios WHERE correo = ? AND password = ?`;
    db.query(sql, [correo, password], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};
