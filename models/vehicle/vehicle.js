const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
    modelYear: { type: Number, required: true },
    engine: { type: String, required: true },
    bodyStyle: { type: String, required: true },
    drive: { type: String, required: true },
    transmission: { type: String, required: true },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
