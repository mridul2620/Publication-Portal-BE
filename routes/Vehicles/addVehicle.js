const express = require('express');
const router = express.Router();
const Vehicle = require('../../models/vehicle/vehicle');
const Brand = require('../../models/vehicle/brand');
const Model = require('../../models/vehicle/model');

router.post('/api/vehicles/addVehicle', async (req, res) => {
    const {
        brandName,
        modelName,
        year,
        engine,
        bodyStyle,
        drive,
        transmission,
    } = req.body;

    if (!brandName || !modelName || !year || !engine || !bodyStyle || !drive || !transmission) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    try {
        let brand = await Brand.findOne({ name: brandName });
        if (!brand) {
            brand = await Brand.create({ name: brandName });
        }

        let model = await Model.findOne({ name: modelName, brand: brand._id });
        if (!model) {
            model = await Model.create({ 
                name: modelName, 
                brand: brand._id,
            });
        }

        const existingVehicle = await Vehicle.findOne({
            brand: brand._id,
            model: model._id,
            modelYear: year,
            engine,
            bodyStyle,
            drive,
            transmission,
        });

        if (existingVehicle) {
            return res.status(400).json({
                success: false,
                message: "A vehicle with the same details already exists.",
            });
        }

        const newVehicle = await Vehicle.create({
            brand: brand._id,
            model: model._id,
            modelYear: year,
            engine,
            bodyStyle,
            drive,
            transmission,
        });

        res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            vehicle: newVehicle,
        });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(400).json({
            success: false,
            message: error.message || "Error adding vehicle",
        });
    }
});

module.exports = router;