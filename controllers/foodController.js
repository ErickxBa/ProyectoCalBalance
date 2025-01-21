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
exports.getConsumptionHistory = async (req, res) => {
    const userId = req.params.userId;

    try {
        const history = await foodModel.getHistoryByUserId(userId);
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener historial de consumo' });
    }
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

// Calcular calorías restantes
exports.getRemainingCalories = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Obtener el objetivo diario de calorías del usuario
        const dailyGoal = await foodModel.getUserDailyGoal(userId);

        // Obtener calorías consumidas en el día actual
        const caloriesConsumed = await foodModel.getCaloriesConsumedToday(userId);

        // Calcular calorías restantes
        const remainingCalories = dailyGoal - caloriesConsumed;

        // Verificar si el usuario ha excedido el límite diario
        if (remainingCalories < 0) {
            return res.status(200).json({
                remainingCalories: 0,
                message: 'Has excedido tu límite diario de calorías.'
            });
        }

        res.status(200).json({
            remainingCalories,
            message: 'Estás dentro de tu objetivo diario de calorías.'
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al calcular las calorías restantes' });
    }
};
