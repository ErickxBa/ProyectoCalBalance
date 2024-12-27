const userModel = require('../models/userModel');

// Registro de usuario
exports.registerUser = (req, res) => {
    const { nombre_completo, correo, edad, genero, altura, nivel_actividad, password } = req.body;

    userModel.createUser({ nombre_completo, correo, edad, genero, altura, nivel_actividad, password }, (err, result) => {
        if (err) {
            console.error('Detalles del error:', err);
            return res.status(500).json({ error: 'Error al registrar usuario' });
        }

        req.session.user = {
            id: result.insertId,
            nombre_completo,
            correo
        };

        res.json({ success: true });
    });
};


// Inicio de sesión
exports.loginUser = (req, res) => {
    const { correo, password } = req.body;
    userModel.getUserByEmailAndPassword(correo, password, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        if (user) {
            req.session.user = {
                id: user.usuario_id,
                nombre_completo: user.nombre_completo,
                correo: user.correo
            };
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }
    });
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
