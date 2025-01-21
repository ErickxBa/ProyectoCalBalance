const userModel = require('../models/userModel');

// Registro de usuario
exports.registerUser = async (req, res) => {
    const { nombre_completo, correo, edad, genero, altura, nivel_actividad, password } = req.body;

    try {
        const user = await userModel.createUser({ nombre_completo, correo, edad, genero, altura, nivel_actividad, password });

        req.session.user = {
            id: user._id,
            nombre_completo: user.nombre_completo,
            correo: user.correo
        };

        res.json({ success: true });
    } catch (err) {
        console.error('Detalles del error:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Inicio de sesión
exports.loginUser = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const user = await userModel.getUserByEmailAndPassword(correo, password);

        if (user) {
            req.session.user = {
                id: user._id,
                nombre_completo: user.nombre_completo,
                correo: user.correo
            };
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Verificación de sesión para obtener el perfil del usuario
exports.getProfile = (req, res) => {
    if (req.session.user) {
        res.json({ message: `Bienvenido ${req.session.user.nombre_completo}`, user: req.session.user });
    } else {
        res.status(401).json({ error: 'No has iniciado sesión' });
    }
};

// Cierre de sesión
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar la sesión' });
        }
        res.json({ success: true, message: 'Sesión cerrada correctamente' });
    });
};