const express = require('express');
const router = express.Router();
const Vehicle = require('../../models/vehicle/vehicle');

router.delete('/api/vehicles/deleteAll', async (req, res) => {
    try {
        const result = await Vehicle.deleteMany({});

        if (result.deletedCount > 0) {
            res.status(200).json({
                success: true,
                message: `Successfully deleted ${result.deletedCount} vehicles.`,
                deletedCount: result.deletedCount
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No vehicles found to delete.',
                deletedCount: 0
            });
        }
    } catch (error) {
        console.error('Error deleting vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while deleting vehicles.',
            error: error.message
        });
    }
});

module.exports = router;