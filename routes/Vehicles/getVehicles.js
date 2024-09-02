const express = require('express');
const router = express.Router();
const Vehicle = require('../../models/vehicle');

router.get('/api/vehicles/getVehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.aggregate([
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brandData'
                }
            },
            {
                $unwind: '$brandData'
            },
            {
                $lookup: {
                    from: 'models',
                    localField: 'model',
                    foreignField: '_id',
                    as: 'modelData'
                }
            },
            {
                $unwind: '$modelData'
            },
            {
                $project: {
                    _id: 1,
                    brand: '$brandData.name',
                    model: {
                        name: '$modelData.name',
                        year: '$modelYear',
                        engine: '$engine',
                        bodyStyle: '$bodyStyle',
                        drive: '$drive',
                        transmission: '$transmission'
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vehicles',
            error: error.message
        });
    }
});

module.exports = router;