const express = require('express');
const router = express.Router();
const Vehicle = require('../../models/vehicle/vehicle');


router.delete('/api/vehicles/deleteVehicle/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
