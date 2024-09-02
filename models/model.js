const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    modelYear: { type: Number, required: true },
    engine: { type: String, required: true },
    bodyStyle: { type: String, required: true },
    drive: { type: String, required: true },
    transmission: { type: String, required: true },
});

module.exports = mongoose.model('Model', modelSchema);
