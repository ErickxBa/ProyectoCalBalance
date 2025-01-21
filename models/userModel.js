const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre_completo: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    edad: { type: Number, required: true },
    genero: { type: String, required: true },
    altura: { type: Number, required: true },
    nivel_actividad: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('usuarios', userSchema);

exports.createUser = async ({ nombre_completo, correo, edad, genero, altura, nivel_actividad, password }) => {
    const newUser = new User({
        nombre_completo,
        correo,
        edad,
        genero,
        altura,
        nivel_actividad,
        password
    });
    return await newUser.save();
};

exports.getUserByEmailAndPassword = async (correo, password) => {
    return await User.findOne({ correo, password });
};