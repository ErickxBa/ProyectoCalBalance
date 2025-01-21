const foodModel = require('../models/foodModel');

// Registro de consumo de alimentos
exports.registerFoodConsumption = async (req, res) => {
    const { usuario_id, alimento_id, porcion, calorias } = req.body;

    try {
        await foodModel.addFoodConsumption(usuario_id, alimento_id, porcion, calorias);
        res.status(201).json({ message: 'Consumo de alimento registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar alimento' });
    }
};

// Obtener historial de consumo de alimentos
exports.getConsumptionHistory = (req, res) => {
    const userId = req.params.userId;

    if (req.session.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    foodModel.getHistoryByUserId(userId, (err, history) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener historial de consumo' });
        }
        res.status(200).json(history);
    });
};


// Obtener lista de alimentos
exports.getFoodList = async (req, res) => {
    try {
        const foods = await foodModel.getAllFoods();
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la lista de alimentos' });
    }
};


exports.getRemainingCalories = async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await foodModel.getRemainingCalories(userId);

        if (!result.dailyGoal) {
            return res.status(404).json({
                error: 'No se encontró un objetivo de calorías para este usuario.'
            });
        }

        if (result.hasExceeded) {
            return res.status(200).json({
                dailyGoal: result.dailyGoal,
                caloriesConsumed: result.caloriesConsumed,
                remainingCalories: 0,
                message: 'Has excedido tu límite diario de calorías.'
            });
        }

        res.status(200).json({
            dailyGoal: result.dailyGoal,
            caloriesConsumed: result.caloriesConsumed,
            remainingCalories: result.remainingCalories,
            message: 'Estás dentro de tu objetivo diario de calorías.'
        });
    } catch (err) {
        console.error('Error en getRemainingCalories:', err);
        res.status(500).json({ error: 'Error al calcular las calorías restantes' });
    }
};


