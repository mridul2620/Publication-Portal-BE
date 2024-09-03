const express = require('express');
const router = express.Router();
const Vehicle = require('../../models/vehicle/vehicle');
const Model = require('../../models/vehicle/model');

router.put('/api/vehicles/:id', async (req, res) => {
    const { modelId, modelYear, engine, bodyStyle, drive, transmission } = req.body;

    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        if (modelId) {
            const model = await Model.findById(modelId);
            if (!model) {
                return res.status(400).json({ success: false, message: 'Invalid model' });
            }

            vehicle.model = modelId;

            if (modelYear && !model.modelYears.includes(modelYear)) {
                return res.status(400).json({ success: false, message: 'Invalid model year' });
            }

            if (engine && !model.engines.includes(engine)) {
                return res.status(400).json({ success: false, message: 'Invalid engine type' });
            }

            if (bodyStyle && !model.bodyStyles.includes(bodyStyle)) {
                return res.status(400).json({ success: false, message: 'Invalid body style' });
            }

            if (drive && !model.drives.includes(drive)) {
                return res.status(400).json({ success: false, message: 'Invalid drive type' });
            }

            if (transmission && !model.transmissions.includes(transmission)) {
                return res.status(400).json({ success: false, message: 'Invalid transmission type' });
            }
        }

        vehicle.modelYear = modelYear || vehicle.modelYear;
        vehicle.engine = engine || vehicle.engine;
        vehicle.bodyStyle = bodyStyle || vehicle.bodyStyle;
        vehicle.drive = drive || vehicle.drive;
        vehicle.transmission = transmission || vehicle.transmission;

        await vehicle.save();
        res.status(200).json({ success: true, message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
