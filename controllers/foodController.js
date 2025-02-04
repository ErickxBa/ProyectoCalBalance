const mongoose = require('mongoose');
const FoodModel = require('../models/foodModel');
const UserModel = require('../models/userModel');

// ✅ REGISTRO DE CONSUMO DE ALIMENTOS (Corrección)
exports.registerFoodConsumption = async (req, res) => {
    try {
        const { usuario_id, alimento_id, cantidad, calorias_consumidas } = req.body;

        // Validar IDs
        if (!mongoose.Types.ObjectId.isValid(usuario_id) || !mongoose.Types.ObjectId.isValid(alimento_id)) {
            return res.status(400).json({ success: false, message: "ID de usuario o alimento inválido." });
        }

        // Crear nueva entrada de consumo de alimentos
        const nuevaEntrada = new FoodModel({
            usuario_id: mongoose.Types.ObjectId(usuario_id),
            alimento_id: mongoose.Types.ObjectId(alimento_id),
            cantidad,
            calorias_consumidas,
            fecha: new Date()
        });

        await nuevaEntrada.save();
        res.json({ success: true, message: 'Alimento registrado con éxito' });

    } catch (error) {
        console.error('Error al registrar el alimento:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el alimento' });
    }
};

// ✅ OBTENER HISTORIAL DE CONSUMO DE ALIMENTOS (Corrección)
exports.getConsumptionHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await FoodModel.find({ usuario_id: userId })
            .populate('alimento_id', 'nombre calorias_por_porcion tipo') // Trae detalles del alimento
            .sort({ fecha: -1 });

        res.json(history);
    } catch (error) {
        console.error('Error al obtener el historial de alimentos:', error);
        res.status(500).json({ message: 'Error al obtener el historial' });
    }
};

// ✅ OBTENER LISTA DE ALIMENTOS
exports.getFoodList = async (req, res) => {
    try {
        const foods = await FoodModel.find(); // Cambiado para devolver alimentos de la base de datos
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la lista de alimentos' });
    }
};

// ✅ OBTENER OBJETIVOS NUTRICIONALES
exports.getNutritionalGoals = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await UserModel.findById(userId);
        if (!user || !user.objetivos_nutricionales) {
            return res.status(404).json({ error: 'No se encontraron objetivos nutricionales para este usuario.' });
        }

        res.status(200).json(user.objetivos_nutricionales);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los objetivos nutricionales' });
    }
};

// ✅ OBTENER CALORÍAS RESTANTES
exports.getRemainingCalories = async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await FoodModel.getRemainingCalories(userId);

        if (!result || !result.dailyGoal) {
            return res.status(404).json({ error: 'No se encontró un objetivo de calorías para este usuario.' });
        }

        res.status(200).json({
            dailyGoal: result.dailyGoal,
            caloriesConsumed: result.caloriesConsumed,
            remainingCalories: result.hasExceeded ? 0 : result.remainingCalories,
            message: result.hasExceeded ? 'Has excedido tu límite diario de calorías.' : undefined
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las calorías restantes' });
    }
};
