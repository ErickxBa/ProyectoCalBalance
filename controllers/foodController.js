const foodModel = require('../models/foodModel');
const userModel = require('../models/userModel');

// Registro de consumo de alimentos
exports.registerFoodConsumption = async (req, res) => {
    const registerFood = async (req, res) => {
        try {
            const { usuario_id, alimento, cantidad, calorias } = req.body;
    
            const nuevaEntrada = new FoodModel({
                usuario_id,
                alimento_id: alimento,
                cantidad,
                calorias_consumidas: calorias,
                fecha: new Date()  // Guarda la fecha con la hora exacta
            });
    
            await nuevaEntrada.save();
            res.json({ success: true, message: 'Alimento registrado con éxito' });
    
        } catch (error) {
            console.error('Error al registrar el alimento:', error);
            res.status(500).json({ success: false, message: 'Error al registrar el alimento' });
        }
    };
    
};

// Obtener historial de consumo de alimentos
exports.getConsumptionHistory = async (req, res) => {
    const userId = req.params.userId;

    if (req.session.user.id !== userId) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }

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

// Obtener objetivos nutricionales
exports.getNutritionalGoals = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userModel.getUserById(userId);
        const goals = user.objetivos_nutricionales;

        if (!goals) {
            return res.status(404).json({ error: 'No se encontraron objetivos nutricionales para este usuario.' });
        }

        res.status(200).json(goals);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los objetivos nutricionales' });
    }
};

// Obtener calorías restantes
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
            remainingCalories: result.remainingCalories
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las calorías restantes' });
    }
};

const getFoodHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await FoodModel.find({ usuario_id: userId })
            .populate('alimento_id', 'nombre calorias_por_porcion tipo') // Solo traer nombre y calorías
            .sort({ fecha: -1 }); // Ordenar por fecha descendente

        res.json(history);
    } catch (error) {
        console.error('Error al obtener el historial de alimentos:', error);
        res.status(500).json({ message: 'Error al obtener el historial' });
    }
};

