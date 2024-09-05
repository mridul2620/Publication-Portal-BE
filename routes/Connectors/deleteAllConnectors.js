const express = require('express');
const router = express.Router();
const Connectors = require('../../models/connector');


router.delete('/api/deleteConnector', async (req, res) => {
    try {
        const result = await Connectors.deleteMany({});

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