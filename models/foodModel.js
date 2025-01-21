const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    nombre: String,
    calorias_por_porcion: Number,
    tipo: String
}, { collection: 'alimentos' }); // Especifica el nombre de la colección

const foodConsumptionSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    alimento_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    cantidad: Number,
    calorias_consumidas: Number,
    fecha: { type: Date, default: Date.now }
}, { collection: 'consumo_alimentos' }); // Especifica el nombre de la colección

const Food = mongoose.model('Food', foodSchema);
const FoodConsumption = mongoose.model('FoodConsumption', foodConsumptionSchema);

exports.addFoodConsumption = async (usuario_id, alimento_id, cantidad, calorias_consumidas) => {
    const newConsumption = new FoodConsumption({
        usuario_id,
        alimento_id,
        cantidad,
        calorias_consumidas
    });

    return await newConsumption.save();
};

exports.getHistoryByUserId = async (userId) => {
    return await FoodConsumption.find({ usuario_id: userId })
        .populate('alimento_id', 'nombre')
        .sort({ fecha: -1 })
        .exec();
};

exports.getAllFoods = async () => {
    return await Food.find().sort('nombre').exec();
};