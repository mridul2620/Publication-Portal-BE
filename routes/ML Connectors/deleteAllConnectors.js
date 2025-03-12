const express = require('express');
const router = express.Router();
const MLConnectors = require('../../models/mlconnector');


router.delete('/api/ml/deleteConnector', async (req, res) => {
    try {
        const result = await MLConnectors.deleteMany({});

        if (result.deletedCount > 0) {
            res.status(200).json({
                success: true,
                message: `Successfully deleted ${result.deletedCount} connector/s.`,
                deletedCount: result.deletedCount
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No connector found to delete.',
                deletedCount: 0
            });
        }
    } catch (error) {
        console.error('Error deleting connectors:', error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while deleting connectors.',
            error: error.message
        });
    }
});

module.exports = router;